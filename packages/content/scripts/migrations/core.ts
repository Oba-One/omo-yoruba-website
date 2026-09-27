/**
 * The migration runner's pure half (ADR 0042): a migration reads the documents its filter names and
 * plans the mutations that move them. Nothing here talks to a dataset, so each plan is tested on the
 * seed and rehearsed on an export (`applyMutations`) before it touches one.
 */

export interface StoredDocument {
  _id: string;
  _type: string;
  _rev?: string;
  [field: string]: unknown;
}

export interface Patch {
  id: string;
  /** The revision the plan read: the dataset refuses the patch if the document changed since. */
  ifRevisionID?: string;
  /** Paths as the seed writes them: `field`, `a.b`, `list[_key=="k"].field`. */
  set?: Record<string, unknown>;
  unset?: string[];
}

export type Mutation =
  | { create: StoredDocument }
  | { createOrReplace: StoredDocument }
  | { delete: { id: string } }
  | { patch: Patch };

export interface MigrationPlan {
  mutations: Mutation[];
  /** What stops the plan: stored content it cannot move without the owner's word. */
  conflicts: string[];
  /** What the owner should know and nothing stops: a change the site makes that the owner decided. */
  notes?: string[];
}

export interface Migration {
  name: string;
  /** One sentence for the dry run's header. */
  description: string;
  /** The documents it reads, as a GROQ filter. The runner reads drafts too, and a draft blocks. */
  filter: string;
  /** The published documents the filter finds; the same documents after the plan give an empty plan. */
  plan(documents: readonly StoredDocument[]): MigrationPlan;
}

/** Not published: a draft, or a version in a release. A migration writes neither, and either blocks it. */
export const isDraft = (id: string) => id.startsWith('drafts.') || id.startsWith('versions.');

/** The published document a draft or a release version stands for. */
export function publishedIdOf(id: string): string {
  if (id.startsWith('drafts.')) return id.slice('drafts.'.length);
  if (id.startsWith('versions.')) return id.split('.').slice(2).join('.');
  return id;
}

/** The field a revision guard unsets: no document holds it, so the guard changes nothing. */
export const REVISION_GUARD = 'revisionGuard';

/**
 * A patch that changes nothing but fails if the document changed since the plan read it: set before a
 * delete or a replacement, which carry no revision of their own.
 */
export const revisionGuard = ({ _id, _rev }: { _id: string; _rev?: string }): Mutation => ({
  patch: { id: _id, ifRevisionID: _rev, unset: [REVISION_GUARD] },
});

/** The document a mutation writes. */
export function mutationId(mutation: Mutation): string {
  if ('create' in mutation) return mutation.create._id;
  if ('createOrReplace' in mutation) return mutation.createOrReplace._id;
  if ('delete' in mutation) return mutation.delete.id;
  return mutation.patch.id;
}

/**
 * What a plan must wait for: every draft or release version it reads that still holds what the migration
 * moves (planned alone, as the document it stands for, it gives work), and any of a document the plan
 * writes, which its filter may not read. A draft the migration would leave alone, such as next year's
 * edition prepared for its announce day, waits for nothing. `candidates` are the dataset's drafts and
 * versions, or the whole export.
 */
export function unpublished(
  migration: Migration,
  read: readonly StoredDocument[],
  candidates: readonly StoredDocument[],
  plan: MigrationPlan,
): StoredDocument[] {
  const written = new Set(plan.mutations.map(mutationId));
  const found = new Map<string, StoredDocument>();
  for (const document of read) {
    if (!isDraft(document._id)) continue;
    const alone = migration.plan([{ ...document, _id: publishedIdOf(document._id) }]);
    if (alone.mutations.length > 0 || alone.conflicts.length > 0) {
      found.set(document._id, document);
    }
  }
  for (const document of candidates) {
    if (isDraft(document._id) && written.has(publishedIdOf(document._id))) {
      found.set(document._id, document);
    }
  }
  return [...found.values()];
}

/**
 * What stops a plan from being applied: its conflicts, and any draft or release version it waits for,
 * since publishing one later would carry the old shape back. Publish or discard those first.
 */
export function blockers(plan: MigrationPlan, drafts: readonly StoredDocument[]): string[] {
  return [
    ...plan.conflicts,
    ...drafts.map(({ _id }) => `${_id} is an unpublished draft: publish or discard it first.`),
  ];
}

/** A plan's mutations in words, one line each, for the dry run. */
export function describeMutation(mutation: Mutation): string {
  if ('create' in mutation) return `create ${mutation.create._type} ${mutation.create._id}`;
  if ('createOrReplace' in mutation) {
    return `put back ${mutation.createOrReplace._type} ${mutation.createOrReplace._id}`;
  }
  if ('delete' in mutation) return `delete ${mutation.delete.id}`;
  const { id, set, unset } = mutation.patch;
  if (!set && unset?.length === 1 && unset[0] === REVISION_GUARD) {
    return `check ${id} has not changed since it was read`;
  }
  const parts = [
    ...Object.entries(set ?? {}).map(([path, value]) => `set ${path} = ${JSON.stringify(value)}`),
    ...(unset ?? []).map((path) => `unset ${path}`),
  ];
  return `patch ${id}: ${parts.join('; ')}`;
}

type Step = { field: string; key?: string };

/** `a.b`, `list[_key=="k"].field` as steps; a dot inside a key stays in the key. */
function steps(path: string): Step[] {
  const found: Step[] = [];
  const pattern = /([^.[\]]+)(?:\[_key=="([^"]*)"\])?/g;
  for (const match of path.matchAll(pattern)) {
    found.push({ field: match[1] as string, key: match[2] });
  }
  return found;
}

type Container = Record<string, unknown>;
const isRecord = (value: unknown): value is Container =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** The object a path's last step lives in, creating plain objects on the way when asked to. */
function parentOf(document: Container, path: Step[], create: boolean): Container | undefined {
  let current: Container | undefined = document;
  for (const step of path.slice(0, -1)) {
    if (!current) return undefined;
    let next: unknown = current[step.field];
    if (step.key !== undefined) {
      next = Array.isArray(next)
        ? next.find((item) => isRecord(item) && item._key === step.key)
        : undefined;
    } else if (next === undefined && create) {
      next = {};
      current[step.field] = next;
    }
    current = isRecord(next) ? next : undefined;
  }
  return current;
}

function setAt(document: Container, path: string, value: unknown) {
  const route = steps(path);
  const last = route.at(-1);
  const parent = parentOf(document, route, true);
  if (!last || !parent) return;
  if (last.key === undefined) {
    parent[last.field] = structuredClone(value);
    return;
  }
  const list = parent[last.field];
  if (!Array.isArray(list)) return;
  const index = list.findIndex((item) => isRecord(item) && item._key === last.key);
  if (index >= 0) list[index] = structuredClone(value);
}

function unsetAt(document: Container, path: string) {
  const route = steps(path);
  const last = route.at(-1);
  const parent = parentOf(document, route, false);
  if (!last || !parent) return;
  if (last.key === undefined) {
    delete parent[last.field];
    return;
  }
  const list = parent[last.field];
  if (Array.isArray(list)) {
    parent[last.field] = list.filter((item) => !(isRecord(item) && item._key === last.key));
  }
}

/**
 * The documents after the mutations, as the dataset would leave them: for the rehearsal on an export
 * and for the tests' empty re-plan. A patch on a missing document fails, as it does in a dataset.
 */
export function applyMutations(
  documents: readonly StoredDocument[],
  mutations: readonly Mutation[],
): StoredDocument[] {
  const byId = new Map(documents.map((document) => [document._id, structuredClone(document)]));
  for (const mutation of mutations) {
    if ('create' in mutation) {
      if (byId.has(mutation.create._id)) {
        throw new Error(`create ${mutation.create._id}: the document already exists`);
      }
      byId.set(mutation.create._id, structuredClone(mutation.create));
    } else if ('createOrReplace' in mutation) {
      byId.set(mutation.createOrReplace._id, structuredClone(mutation.createOrReplace));
    } else if ('delete' in mutation) {
      byId.delete(mutation.delete.id);
    } else {
      const { id, set, unset } = mutation.patch;
      const document = byId.get(id);
      if (!document) throw new Error(`patch ${id}: no such document`);
      for (const [path, value] of Object.entries(set ?? {})) setAt(document, path, value);
      for (const path of unset ?? []) unsetAt(document, path);
    }
  }
  return [...byId.values()];
}
