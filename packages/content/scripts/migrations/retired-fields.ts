import { RETIRED_FIELDS, retiredFields } from '../seed-data';
import type { Migration } from './core';

/** Retired fields another migration moves before they go: this one leaves them to it. */
const MOVED_BY: Readonly<Record<string, string>> = { 'event.album': 'album-link' };

/**
 * Unsets the fields a schema change retired (`RETIRED_FIELDS`) wherever a document still holds one:
 * the seed does so for its own documents, this for every document, the members' included. A field
 * another migration moves first (`MOVED_BY`) blocks it until that migration has run.
 */
export const retiredFieldsMigration: Migration = {
  name: 'retired-fields',
  description:
    'Unset the fields the schema retired (RETIRED_FIELDS) wherever a document holds one.',
  filter: `_type in ${JSON.stringify(Object.keys(RETIRED_FIELDS).sort())}`,
  plan: (documents) => {
    const conflicts: string[] = [];
    const mutations = documents.flatMap((document) => {
      const unset = retiredFields(document._type, document).filter((path) => {
        const mover = MOVED_BY[`${document._type}.${path}`];
        if (mover) conflicts.push(`${document._id} still holds ${path}: run ${mover} first.`);
        return !mover;
      });
      return unset.length > 0
        ? [{ patch: { id: document._id, ifRevisionID: document._rev, unset } }]
        : [];
    });
    return { mutations, conflicts };
  },
};
