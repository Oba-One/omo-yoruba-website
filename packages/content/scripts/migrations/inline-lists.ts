import { type Migration, type Mutation, revisionGuard, type StoredDocument } from './core';

/** The documents that become items of the one page that shows them (ticket 10, S14, ADR 0042). */
export const PAGE_LISTS = [
  { page: 'collectivePage', field: 'initiatives', type: 'initiative' },
  { page: 'impactPage', field: 'outcomes', type: 'outcome' },
  { page: 'storyPage', field: 'timeline', type: 'timelineEntry' },
  { page: 'donatePage', field: 'whatYourGiftDoes', type: 'givingLevel' },
] as const;

/** What stays behind: the system's fields, the order the list now keeps, and a field no page reads. */
const LEFT_BEHIND = new Set([
  '_id',
  '_type',
  '_rev',
  '_createdAt',
  '_updatedAt',
  '_originalId',
  '_system',
  'order',
  'proceedsReturn',
]);

type Item = { _key?: string; _type?: string; _ref?: string; [field: string]: unknown };

/** A document as an item of its page's list: its own fields, under the list item's key (else its id). */
function asItem(document: StoredDocument, key: string | undefined, type: string): Item {
  const fields = Object.fromEntries(
    Object.entries(document).filter(([field]) => !LEFT_BEHIND.has(field)),
  );
  return { ...fields, _key: key ?? document._id, _type: type };
}

/**
 * Moves each listed document into its page's list, in place and under the same key, then deletes the
 * document. A listed document that is missing, or a document no page lists, waits for the owner.
 */
export const inlineListsMigration: Migration = {
  name: 'inline-lists',
  description:
    'Move initiatives, outcomes, timeline entries and giving levels into the lists of the page that shows them.',
  // Pages by type, not id: a singleton's type is its id, and its draft is read too.
  filter: `_type in ${JSON.stringify(PAGE_LISTS.map(({ page }) => page))} || _type in ${JSON.stringify(
    PAGE_LISTS.map(({ type }) => type),
  )} || (_type == "lintReport" && documentType in ${JSON.stringify(PAGE_LISTS.map(({ type }) => type))})`,
  plan: (documents) => {
    const byId = new Map(documents.map((document) => [document._id, document]));
    const mutations: Mutation[] = [];
    const deletes: Mutation[] = [];
    const conflicts: string[] = [];
    for (const { page, field, type } of PAGE_LISTS) {
      const holder = byId.get(page);
      const items = Array.isArray(holder?.[field]) ? (holder?.[field] as Item[]) : [];
      const listed = new Set<string>();
      let moved = false;
      const missing: string[] = [];
      const next = items.map((item) => {
        if (item._type !== 'reference' || !item._ref) return item;
        const document = byId.get(item._ref);
        if (!document || document._type !== type) {
          missing.push(item._ref);
          return item;
        }
        listed.add(item._ref);
        moved = true;
        return asItem(document, item._key, type);
      });
      for (const id of missing) {
        conflicts.push(
          `${page} lists ${id}, which is not a published ${type}: publish it, or take it off the list.`,
        );
      }
      for (const document of documents) {
        if (document._type !== type || listed.has(document._id)) continue;
        conflicts.push(`${document._id} is on no page: add it to the ${page} list, or delete it.`);
      }
      if (!holder || !moved || missing.length > 0) continue;
      mutations.push({
        patch: { id: page, ifRevisionID: holder._rev, set: { [field]: next } },
      });
      for (const id of listed) {
        const document = byId.get(id) as StoredDocument;
        // A delete carries no revision, so a guard first: a document changed since it was read stops it.
        deletes.push(revisionGuard(document), { delete: { id } });
        // The content-lint function's report on it would otherwise stay in the wording to check.
        const report = documents.find(
          (candidate) => candidate._type === 'lintReport' && candidate.documentId === id,
        );
        if (report) deletes.push({ delete: { id: report._id } });
      }
    }
    // The pages stop naming the documents before the documents go, in the same transaction.
    return { mutations: [...mutations, ...deletes], conflicts };
  },
};
