#!/usr/bin/env node
// Refuses a Sanity dataset whose ACL is not private. Enquiries and subscribers are stored in the
// dataset the site reads, so a public one would publish them. The Vercel build (vercel.json's
// buildCommand) and the setup wizard's stage 3 both run this before anything uses the dataset.
//
// Reads PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET and SANITY_API_READ_TOKEN from the
// environment. Exits 0 when the dataset is private and 1 otherwise, failing closed when a value
// is missing or the API cannot be read. It never prints the token.

const API_VERSION = 'v2021-06-07';

/**
 * @param {unknown} datasets the datasets API's answer
 * @param {string} name the dataset to judge
 * @returns {{ ok: boolean, reason: string }}
 */
function datasetVerdict(datasets, name) {
  if (!Array.isArray(datasets)) {
    return { ok: false, reason: 'the datasets API did not return a list' };
  }
  const found = datasets.find((dataset) => dataset?.name === name);
  if (!found) return { ok: false, reason: `the project has no dataset named "${name}"` };
  if (found.aclMode !== 'private') {
    return {
      ok: false,
      reason: `dataset "${name}" has ACL mode "${found.aclMode}"; make it private in sanity.io/manage (Datasets, Edit, Visibility)`,
    };
  }
  return { ok: true, reason: `dataset "${name}" is private` };
}

/**
 * @param {{ projectId?: string, dataset?: string, token?: string, fetch?: typeof fetch }} options
 * @returns {Promise<{ ok: boolean, reason: string }>}
 */
async function checkDatasetPrivate({ projectId, dataset, token, fetch: get = fetch }) {
  const missing = [
    ['PUBLIC_SANITY_PROJECT_ID', projectId],
    ['PUBLIC_SANITY_DATASET', dataset],
    ['SANITY_API_READ_TOKEN', token],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length) return { ok: false, reason: `${missing.join(', ')} not set` };
  if (!/^[a-z0-9]+$/.test(projectId)) {
    return { ok: false, reason: 'PUBLIC_SANITY_PROJECT_ID is not a Sanity project ID' };
  }

  let response;
  try {
    response = await get(`https://${projectId}.api.sanity.io/${API_VERSION}/datasets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    return { ok: false, reason: `the datasets API could not be reached (${error.message})` };
  }
  if (!response.ok) {
    return { ok: false, reason: `the datasets API answered HTTP ${response.status}` };
  }
  let body;
  try {
    body = await response.json();
  } catch {
    return { ok: false, reason: 'the datasets API answered with something other than JSON' };
  }
  return datasetVerdict(body, dataset);
}

// Nothing imports this file: it always runs, so no launcher that rewrites argv can skip it.
const verdict = await checkDatasetPrivate({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_READ_TOKEN,
});
if (verdict.ok) {
  console.log(`Dataset check passed: ${verdict.reason}.`);
} else {
  console.error(`Dataset check refused: ${verdict.reason}.`);
  process.exitCode = 1;
}
