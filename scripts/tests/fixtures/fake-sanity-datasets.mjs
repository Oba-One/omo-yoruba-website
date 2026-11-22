// Loaded with node --import: answers the Sanity datasets API from FAKE_SANITY_DATASETS (JSON) with
// FAKE_SANITY_STATUS (default 200), so the dataset guard runs without the network.
globalThis.fetch = async (url) => {
  if (!String(url).endsWith('.api.sanity.io/v2021-06-07/datasets')) {
    throw new Error(`unexpected request to ${url}`);
  }
  return new Response(process.env.FAKE_SANITY_DATASETS ?? '[]', {
    status: Number(process.env.FAKE_SANITY_STATUS ?? 200),
    headers: { 'content-type': 'application/json' },
  });
};
