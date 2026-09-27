/**
 * Moves stored content from one shape to another (ADR 0042), one reviewed migration at a time
 * (`scripts/migrations/`). A dry run by default; nothing is written without `--apply`.
 *
 *   bun run migrate -- list                            the migrations
 *   bun run migrate -- <name>                          dry run on development: what it would write
 *   bun run migrate -- <name> --from <export.ndjson>   rehearse on an export (`bun run export`), in memory
 *   bun run migrate -- <name> --apply                  snapshot, apply, then check nothing is left
 *   bun run migrate -- restore <snapshot.ndjson>       put the documents back as the snapshot holds them
 *   ... --dataset name                                 another dataset
 *
 * Applying refuses while the plan has a conflict or any document it reads has an unpublished draft.
 * It first saves the documents it will write (`OY_EXPORT_DIR`, else `~/omo-yoruba-exports`), writes
 * everything in one transaction that fails if a document changed since it was read, then plans again:
 * a migration that leaves anything to do is reported as a failure.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { SanityClient } from '@sanity/client';
import { evaluate, parse } from 'groq-js';
import { datasetArgument, fail, writeClient } from './dataset';
import { exportDirectory, readNdjson, stamp, toNdjson } from './exports';
import {
  applyMutations,
  blockers,
  describeMutation,
  isDraft,
  type Migration,
  type MigrationPlan,
  mutationId,
  type StoredDocument,
} from './migrations/core';
import { MIGRATIONS, migrationNamed } from './migrations/index';

const TOOL = 'migrate';

interface Snapshot {
  id: string;
  /** The document as it was, or null when the migration created it. */
  before: StoredDocument | null;
}

function option(argv: readonly string[], name: string): string | undefined {
  const index = argv.indexOf(`--${name}`);
  return index === -1 ? undefined : argv[index + 1];
}

/** The documents the migration reads, drafts included, split into published and drafts. */
function split(documents: readonly StoredDocument[]) {
  return {
    published: documents.filter(({ _id }) => !isDraft(_id)),
    drafts: documents.filter(({ _id }) => isDraft(_id)),
  };
}

function report(migration: Migration, plan: MigrationPlan, drafts: readonly StoredDocument[]) {
  console.log(`${TOOL}: ${migration.name}: ${migration.description}`);
  for (const mutation of plan.mutations) console.log(`  ${describeMutation(mutation)}`);
  console.log(`${TOOL}: ${plan.mutations.length} mutations`);
  for (const blocker of blockers(plan, drafts)) console.log(`  blocked: ${blocker}`);
}

async function read(client: SanityClient, migration: Migration): Promise<StoredDocument[]> {
  return client.fetch<StoredDocument[]>(`*[${migration.filter}]`, {}, { perspective: 'raw' });
}

/** The rehearsal: the plan on an export, applied in memory, then planned again. */
async function rehearse(migration: Migration, file: string): Promise<void> {
  const dataset = readNdjson<StoredDocument>(readFileSync(file, 'utf8'));
  const found = (await (
    await evaluate(parse(`*[${migration.filter}]`), { dataset })
  ).get()) as StoredDocument[];
  const { published, drafts } = split(found);
  const plan = migration.plan(published);
  report(migration, plan, drafts);
  const after = applyMutations(published, plan.mutations);
  const left = migration.plan(after).mutations;
  if (left.length > 0) {
    for (const mutation of left) console.log(`  still to do: ${describeMutation(mutation)}`);
    fail(TOOL, `rehearsal: ${left.length} mutations are left after applying; fix the migration.`);
  }
  console.log(`${TOOL}: rehearsal on ${file}: applying leaves nothing to do.`);
}

async function apply(client: SanityClient, migration: Migration, dataset: string): Promise<void> {
  const { published, drafts } = split(await read(client, migration));
  const plan = migration.plan(published);
  report(migration, plan, drafts);
  const blocked = blockers(plan, drafts);
  if (blocked.length > 0) fail(TOOL, 'nothing was written: resolve what blocks it first.');
  if (plan.mutations.length === 0) {
    console.log(`${TOOL}: nothing to do.`);
    return;
  }
  const byId = new Map(published.map((document) => [document._id, document]));
  const snapshot: Snapshot[] = [...new Set(plan.mutations.map(mutationId))].map((id) => ({
    id,
    before: byId.get(id) ?? null,
  }));
  const directory = exportDirectory();
  mkdirSync(directory, { recursive: true });
  const file = join(directory, `${dataset}-${migration.name}-${stamp()}.before.ndjson`);
  writeFileSync(file, toNdjson(snapshot));
  console.log(`${TOOL}: the ${snapshot.length} documents it writes, as they were: ${file}`);
  await client.mutate(plan.mutations as never, { visibility: 'sync' });
  const again = migration.plan(split(await read(client, migration)).published);
  if (again.mutations.length > 0) {
    for (const mutation of again.mutations)
      console.log(`  still to do: ${describeMutation(mutation)}`);
    fail(TOOL, `applied, but ${again.mutations.length} mutations are left; restore from ${file}.`);
  }
  console.log(`${TOOL}: applied ${plan.mutations.length} mutations; nothing is left to do.`);
}

/** Puts the documents back as a snapshot holds them: replaced where they were, deleted where created. */
async function restore(client: SanityClient, file: string): Promise<void> {
  const snapshot = readNdjson<Snapshot>(readFileSync(file, 'utf8'));
  const transaction = client.transaction();
  for (const { id, before } of snapshot) {
    if (before) {
      const { _rev, _updatedAt, ...document } = before;
      transaction.createOrReplace(document as StoredDocument);
    } else {
      transaction.delete(id);
    }
  }
  await transaction.commit({ visibility: 'sync' });
  console.log(`${TOOL}: restored ${snapshot.length} documents from ${file}`);
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const [command, argument] = argv;
  if (!command || command === 'list') {
    for (const migration of MIGRATIONS) console.log(`${migration.name}: ${migration.description}`);
    return;
  }
  const dataset = datasetArgument(argv);
  if (command === 'restore') {
    if (!argument) fail(TOOL, 'restore needs the snapshot file.');
    await restore(await writeClient(TOOL, dataset, 'raw'), argument);
    return;
  }
  const migration = migrationNamed(command);
  if (!migration) fail(TOOL, `no migration named "${command}"; \`bun run migrate -- list\`.`);
  const from = option(argv, 'from');
  if (from) {
    await rehearse(migration, from);
    return;
  }
  const client = await writeClient(TOOL, dataset, 'raw');
  if (argv.includes('--apply')) {
    await apply(client, migration, dataset);
    return;
  }
  const { published, drafts } = split(await read(client, migration));
  report(migration, migration.plan(published), drafts);
  console.log(`${TOOL}: dry run; nothing was written. Add --apply to write it.`);
}

main().catch((cause: unknown) => {
  console.error(`${TOOL}: failed`, cause instanceof Error ? cause.message : cause);
  process.exit(1);
});
