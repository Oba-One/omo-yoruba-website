/**
 * Moves stored content from one shape to another (ADR 0042), one reviewed migration at a time
 * (`scripts/migrations/`). A dry run by default; nothing is written without `--apply`.
 *
 *   bun run migrate -- list                            the migrations
 *   bun run migrate -- <name>                          dry run on development: what it would write
 *   bun run migrate -- <name> --from <export.ndjson>   rehearse on an export (`bun run export`), in memory
 *   bun run migrate -- <name> --apply                  snapshot, apply, then check nothing is left
 *   bun run migrate -- restore <snapshot.ndjson>       put back what the apply wrote, if unchanged since
 *   ... --dataset name                                 another dataset
 *
 * Applying refuses while the plan has a conflict, or while a document it reads or writes has an
 * unpublished draft or a version in a release. It first saves the documents it will write
 * (`OY_EXPORT_DIR`, else `~/omo-yoruba-exports`), writes everything in one transaction that fails if a
 * document changed since it was read, records the revisions it left, then plans again: a migration
 * that leaves anything to do is reported as a failure. A failed transaction wrote nothing, and its
 * snapshot is removed.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
  unpublished,
} from './migrations/core';
import { MIGRATIONS, migrationNamed } from './migrations/index';
import {
  readSnapshot,
  restorePlan,
  type SnapshotHeader,
  snapshotEntries,
  withAfter,
} from './migrations/snapshot';

const TOOL = 'migrate';

function option(argv: readonly string[], name: string): string | undefined {
  const index = argv.indexOf(`--${name}`);
  return index === -1 ? undefined : argv[index + 1];
}

function report(migration: Migration, plan: MigrationPlan, waiting: readonly StoredDocument[]) {
  console.log(`${TOOL}: ${migration.name}: ${migration.description}`);
  for (const mutation of plan.mutations) console.log(`  ${describeMutation(mutation)}`);
  console.log(`${TOOL}: ${plan.mutations.length} mutations`);
  for (const note of plan.notes ?? []) console.log(`  note: ${note}`);
  for (const blocker of blockers(plan, waiting)) console.log(`  blocked: ${blocker}`);
}

/** The documents the migration reads, drafts and release versions included, and its plan. */
async function planLive(client: SanityClient, migration: Migration) {
  const read = await client.fetch<StoredDocument[]>(`*[${migration.filter}]`, {});
  const published = read.filter(({ _id }) => !isDraft(_id));
  const plan = migration.plan(published);
  const written = [...new Set(plan.mutations.map(mutationId))];
  const candidates = await client.fetch<StoredDocument[]>(
    '*[_id in $drafts || _id in path("versions.**")]{_id, _type}',
    { drafts: written.map((id) => `drafts.${id}`) },
  );
  return { published, plan, waiting: unpublished(migration, read, candidates, plan) };
}

/** The rehearsal: the plan on an export, applied in memory, then planned again. */
async function rehearse(migration: Migration, file: string): Promise<void> {
  const dataset = readNdjson<StoredDocument>(readFileSync(file, 'utf8'));
  const read = (await (
    await evaluate(parse(`*[${migration.filter}]`), { dataset })
  ).get()) as StoredDocument[];
  const published = read.filter(({ _id }) => !isDraft(_id));
  const plan = migration.plan(published);
  const waiting = unpublished(migration, read, dataset, plan);
  report(migration, plan, waiting);
  const after = applyMutations(published, plan.mutations);
  const left = migration.plan(after).mutations;
  if (left.length > 0) {
    for (const mutation of left) console.log(`  still to do: ${describeMutation(mutation)}`);
    fail(TOOL, `rehearsal: ${left.length} mutations are left after applying; fix the migration.`);
  }
  console.log(`${TOOL}: rehearsal on ${file}: applying leaves nothing to do.`);
  if (blockers(plan, waiting).length > 0) {
    fail(TOOL, 'rehearsal: the apply would be blocked; resolve what blocks it first.');
  }
}

async function revisions(client: SanityClient, ids: readonly string[]) {
  const found = await client.fetch<{ _id: string; _rev: string }[]>('*[_id in $ids]{_id, _rev}', {
    ids,
  });
  return new Map(found.map(({ _id, _rev }) => [_id, _rev]));
}

async function apply(client: SanityClient, migration: Migration, dataset: string): Promise<void> {
  const { published, plan, waiting } = await planLive(client, migration);
  report(migration, plan, waiting);
  if (blockers(plan, waiting).length > 0) {
    fail(TOOL, 'nothing was written: resolve what blocks it first.');
  }
  if (plan.mutations.length === 0) {
    console.log(`${TOOL}: nothing to do.`);
    return;
  }
  const header: SnapshotHeader = {
    snapshot: { dataset, migration: migration.name, takenAt: new Date().toISOString() },
  };
  const entries = snapshotEntries(published, plan.mutations);
  const directory = exportDirectory();
  mkdirSync(directory, { recursive: true });
  const file = join(directory, `${dataset}-${migration.name}-${stamp()}.before.ndjson`);
  writeFileSync(file, toNdjson([header, ...entries]));
  try {
    await client.mutate(plan.mutations as never, { visibility: 'sync' });
  } catch (cause) {
    // One transaction: it failed whole, so nothing was written and the snapshot records nothing.
    rmSync(file, { force: true });
    fail(
      TOOL,
      `nothing was written (${cause instanceof Error ? cause.message : String(cause)}); a document may have changed since it was read, so plan again.`,
    );
  }
  const after = withAfter(
    entries,
    await revisions(
      client,
      entries.map(({ id }) => id),
    ),
  );
  writeFileSync(file, toNdjson([header, ...after]));
  console.log(`${TOOL}: the ${entries.length} documents it wrote, as they were: ${file}`);
  const again = (await planLive(client, migration)).plan;
  if (again.mutations.length > 0) {
    for (const mutation of again.mutations)
      console.log(`  still to do: ${describeMutation(mutation)}`);
    fail(TOOL, `applied, but ${again.mutations.length} mutations are left; restore from ${file}.`);
  }
  console.log(`${TOOL}: applied ${plan.mutations.length} mutations; nothing is left to do.`);
}

/** Puts back what an apply wrote, on the dataset it ran on, if nobody has changed it since. */
async function restore(argv: readonly string[], file: string): Promise<void> {
  const { header, entries } = readSnapshot(readNdjson(readFileSync(file, 'utf8')));
  const named = argv.some((arg) => arg.startsWith('--dataset'));
  const dataset = named ? datasetArgument(argv) : header.dataset;
  const client = await writeClient(TOOL, dataset, 'raw');
  const current = await revisions(
    client,
    entries.map(({ id }) => id),
  );
  const plan = restorePlan(header, entries, dataset, current);
  for (const mutation of plan.mutations) console.log(`  ${describeMutation(mutation)}`);
  for (const conflict of plan.conflicts) console.log(`  blocked: ${conflict}`);
  if (plan.conflicts.length > 0) fail(TOOL, 'nothing was restored.');
  await client.mutate(plan.mutations as never, { visibility: 'sync' });
  console.log(`${TOOL}: restored ${entries.length} documents on ${dataset} from ${file}`);
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const [command, argument] = argv;
  if (!command || command === 'list') {
    for (const migration of MIGRATIONS) console.log(`${migration.name}: ${migration.description}`);
    return;
  }
  if (command === 'restore') {
    if (!argument) fail(TOOL, 'restore needs the snapshot file.');
    await restore(argv, argument);
    return;
  }
  const migration = migrationNamed(command);
  if (!migration) fail(TOOL, `no migration named "${command}"; \`bun run migrate -- list\`.`);
  const from = option(argv, 'from');
  if (from) {
    await rehearse(migration, from);
    return;
  }
  const dataset = datasetArgument(argv);
  const client = await writeClient(TOOL, dataset, 'raw');
  if (argv.includes('--apply')) {
    await apply(client, migration, dataset);
    return;
  }
  const { plan, waiting } = await planLive(client, migration);
  report(migration, plan, waiting);
  console.log(`${TOOL}: dry run; nothing was written. Add --apply to write it.`);
}

main().catch((cause: unknown) => {
  console.error(`${TOOL}: failed`, cause instanceof Error ? cause.message : cause);
  process.exit(1);
});
