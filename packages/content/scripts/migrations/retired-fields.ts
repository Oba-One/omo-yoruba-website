import { movedFields, RETIRED_FIELDS, retiredFields } from '../seed-data';
import type { Migration } from './core';

/**
 * Unsets the fields a schema change retired (`RETIRED_FIELDS`) wherever a document still holds one:
 * the seed does so for its own documents, this for every document, the members' included. A field
 * another migration moves first (`MOVED_FIELDS`) blocks it until that migration has run.
 */
export const retiredFieldsMigration: Migration = {
  name: 'retired-fields',
  description:
    'Unset the fields the schema retired (RETIRED_FIELDS) wherever a document holds one.',
  filter: `_type in ${JSON.stringify(Object.keys(RETIRED_FIELDS).sort())}`,
  plan: (documents) => ({
    mutations: documents.flatMap((document) => {
      const unset = retiredFields(document._type, document);
      return unset.length > 0
        ? [{ patch: { id: document._id, ifRevisionID: document._rev, unset } }]
        : [];
    }),
    conflicts: documents.flatMap((document) =>
      movedFields(document._type, document).map(
        ({ path, migration }) => `${document._id} still holds ${path}: run ${migration} first.`,
      ),
    ),
  }),
};
