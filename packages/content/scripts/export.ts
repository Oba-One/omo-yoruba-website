/**
 * Exports a dataset's documents, drafts included, as NDJSON outside the repository: the first step
 * of a migration day (docs/runbook.md, Migrations), and what `bun run migrate -- <name> --from` rehearses on.
 *
 *   bun run export                     the development dataset
 *   bun run export -- --dataset name   another dataset
 *
 * The file lands in `OY_EXPORT_DIR`, else `~/omo-yoruba-exports` (`exports.ts`). It holds every
 * enquiry, subscriber and the preview secret, so it stays out of the repository and is deleted once
 * the migration day is over. Assets are not copied: no migration changes them.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { datasetArgument, fail, writeClient } from './dataset';
import { exportDirectory, readNdjson, stamp } from './exports';

async function main(): Promise<void> {
  const dataset = datasetArgument(process.argv.slice(2));
  const directory = exportDirectory();
  const client = await writeClient('export', dataset);
  const { token } = client.config();
  const response = await fetch(client.getUrl(`/data/export/${dataset}`), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) fail('export', `the export answered ${response.status}; nothing was saved.`);
  const text = await response.text();
  const documents = readNdjson<{
    _id: string;
    _type: string;
    error?: unknown;
    statusCode?: number;
  }>(text);
  // The export can answer 200 and then report a failure as its last line: never save a partial file.
  const failure = documents.find((line) => line.error !== undefined && line._id === undefined);
  if (failure)
    fail(
      'export',
      `the export stopped partway (${JSON.stringify(failure.error)}); nothing was saved.`,
    );
  // Sanity keeps some of its own documents under draft ids (the preview secret); they are not content.
  const drafts = documents.filter(
    ({ _id, _type }) => _id.startsWith('drafts.') && !_type.startsWith('sanity.'),
  ).length;
  mkdirSync(directory, { recursive: true });
  const file = join(directory, `${dataset}-${stamp()}.ndjson`);
  writeFileSync(file, text.endsWith('\n') ? text : `${text}\n`);
  console.log(
    `export: ${documents.length} documents (${drafts} unpublished drafts) saved to ${file}`,
  );
}

main().catch((cause: unknown) => {
  console.error('export: failed', cause instanceof Error ? cause.message : cause);
  process.exit(1);
});
