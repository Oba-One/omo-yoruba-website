import { type Mutation, mutationId, revisionGuard, type StoredDocument } from './core';

/**
 * What an apply saves before it writes (ADR 0042): the dataset it ran on and every document it writes,
 * as it was. Once applied, each entry also keeps the revision the apply left (null where it deleted the
 * document), so a restore puts back only what nobody has changed since, on the dataset it came from.
 */
export interface SnapshotHeader {
  snapshot: { dataset: string; migration: string; takenAt: string };
}

export interface SnapshotEntry {
  id: string;
  /** The document as it was, or null where the migration created it. */
  before: StoredDocument | null;
  /** The revision the apply left, or null where it deleted the document; absent until applied. */
  after?: string | null;
}

/** The documents a plan writes, as they are before it. */
export function snapshotEntries(
  published: readonly StoredDocument[],
  mutations: readonly Mutation[],
): SnapshotEntry[] {
  const byId = new Map(published.map((document) => [document._id, document]));
  return [...new Set(mutations.map(mutationId))].map((id) => ({
    id,
    before: byId.get(id) ?? null,
  }));
}

/** The entries with the revision each document has after the apply, null where it is gone. */
export function withAfter(
  entries: readonly SnapshotEntry[],
  current: ReadonlyMap<string, string>,
): SnapshotEntry[] {
  return entries.map((entry) => ({ ...entry, after: current.get(entry.id) ?? null }));
}

/** A snapshot file's header and entries; anything else is refused. */
export function readSnapshot(lines: readonly unknown[]): {
  header: SnapshotHeader['snapshot'];
  entries: SnapshotEntry[];
} {
  const [first, ...rest] = lines as [Partial<SnapshotHeader> | undefined, ...SnapshotEntry[]];
  const header = first?.snapshot;
  if (!header?.dataset || !header.migration) {
    throw new Error('this is not a migration snapshot: its first line names no dataset.');
  }
  return { header, entries: rest };
}

/** A document as a restore writes it: the revision and the update time are the dataset's own. */
function asStored(document: StoredDocument): StoredDocument {
  const { _rev, _updatedAt, ...rest } = document;
  return rest as StoredDocument;
}

/**
 * The mutations that put a snapshot back, and what stops them: another dataset, an apply that never
 * finished, or a document changed, recreated or deleted since the apply.
 */
export function restorePlan(
  header: SnapshotHeader['snapshot'],
  entries: readonly SnapshotEntry[],
  dataset: string,
  current: ReadonlyMap<string, string>,
): { mutations: Mutation[]; conflicts: string[] } {
  const conflicts: string[] = [];
  if (header.dataset !== dataset) {
    conflicts.push(`the snapshot is of ${header.dataset}, not ${dataset}.`);
  }
  const mutations: Mutation[] = [];
  for (const { id, before, after } of entries) {
    const now = current.get(id);
    if (after === undefined) {
      conflicts.push(`${id}: the apply never finished, so there is nothing to put back.`);
    } else if (after === null) {
      if (now) conflicts.push(`${id} exists again since the migration deleted it.`);
      else if (before) mutations.push({ create: asStored(before) });
    } else if (now !== after) {
      conflicts.push(`${id} changed since the migration (or is gone): put it back by hand.`);
    } else if (before) {
      mutations.push(revisionGuard({ _id: id, _rev: after }), {
        createOrReplace: asStored(before),
      });
    } else {
      mutations.push(revisionGuard({ _id: id, _rev: after }), { delete: { id } });
    }
  }
  return { mutations, conflicts };
}
