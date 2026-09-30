import { RETIRED_TYPES } from '../seed-data';
import { type Migration, type Mutation, revisionGuard } from './core';

/**
 * Deletes every document of a type the schema retired (`RETIRED_TYPES`), and the content-lint function's
 * report on it, which would otherwise stay in the wording to check. A delete carries no revision, so a
 * guard goes first: a document changed since the plan read it stops the transaction.
 */
export const retiredTypesMigration: Migration = {
  name: 'retired-types',
  description: 'Delete the documents of the types the schema retired (RETIRED_TYPES).',
  filter: `_type in ${JSON.stringify(RETIRED_TYPES)} || (_type == "lintReport" && documentType in ${JSON.stringify(RETIRED_TYPES)})`,
  plan: (documents) => {
    const retired = documents.filter((document) => RETIRED_TYPES.includes(document._type));
    const mutations: Mutation[] = retired.flatMap((document) => {
      const report = documents.find(
        (candidate) => candidate._type === 'lintReport' && candidate.documentId === document._id,
      );
      return [
        revisionGuard(document),
        { delete: { id: document._id } },
        ...(report ? [{ delete: { id: report._id } }] : []),
      ];
    });
    return {
      mutations,
      conflicts: [],
      notes: retired.length > 0 ? [`Deletes ${retired.map(({ _id }) => _id).join(', ')}.`] : [],
    };
  },
};
