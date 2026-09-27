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

export type Mutation = { create: StoredDocument } | { delete: { id: string } } | { patch: Patch };

export interface MigrationPlan {
  mutations: Mutation[];
  /** What stops the plan: stored content it cannot move without the owner's word. */
  conflicts: string[];
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

export const isDraft = (id: string) => id.startsWith('drafts.');

/** The document a mutation writes. */
export function mutationId(mutation: Mutation): string {
  if ('create' in mutation) return mutation.create._id;
  if ('delete' in mutation) return mutation.delete.id;
  return mutation.patch.id;
}

/**
 * What stops a plan from being applied: its conflicts, and any draft among the documents it reads,
 * since a draft published later would carry the old shape back. Publish or discard those first.
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
  if ('delete' in mutation) return `delete ${mutation.delete.id}`;
  const { id, set, unset } = mutation.patch;
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
