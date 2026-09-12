/**
 * content-lint (ADR 0010, ADR 0014): on `create` or `update` of a content document (the filter in
 * sanity.blueprint.ts names the types), walk its strings with the repo's own checks and write one
 * lintReport, empty when the document is clean, so the Pending view can list what needs a fix.
 * Locally (`sanity functions test`) the report is printed, not written.
 */
import { createClient } from '@sanity/client';
import { documentEventHandler } from '@sanity/functions';
import { buildReport, type LintedDocument, lintDocument } from './lint';

const API_VERSION = '2026-09-11';

export const handler = documentEventHandler<LintedDocument>(async ({ context, event }) => {
  const doc = event.data;
  const report = buildReport(doc, lintDocument(doc), new Date().toISOString());
  if (context.local) {
    console.log('content-lint (local, not written):', JSON.stringify(report, null, 2));
    return;
  }
  const client = createClient({ ...context.clientOptions, apiVersion: API_VERSION, useCdn: false });
  await client.createOrReplace(report);
  console.log(`content-lint: ${report.findings.length} finding(s) for ${doc._type} ${doc._id}`);
});
