import { LESSON_FACTS, nameFacts, PAYMENT_FACTS } from '../../src/known-facts';
import type { Migration, Mutation } from './core';

/** Preserve values and notes; the runner guards revisions and refuses affected drafts. */
export const namedFactsMigration: Migration = {
  name: 'named-facts',
  description:
    'Move the Lessons and Donate fact rows into named inputs, preserving unknown values.',
  filter: '_type in ["lessonsPage", "donatePage"]',
  plan(documents) {
    const mutations: Mutation[] = [];
    const conflicts: string[] = [];
    for (const document of documents) {
      if (!['lessonsPage', 'donatePage'].includes(document._type)) continue;
      const lessons = document._type === 'lessonsPage';
      const oldPath = lessons ? 'glance' : 'giveNow.facts';
      const newPath = lessons ? 'lessonDetails' : 'paymentDetails';
      const rows = lessons
        ? document.glance
        : (document.giveNow as { facts?: unknown } | undefined)?.facts;
      if (rows === undefined) continue;
      try {
        if (document[newPath] !== undefined)
          throw new Error(`Both ${oldPath} and ${newPath} exist; reconcile them before migrating.`);
        const facts = nameFacts(rows, lessons ? LESSON_FACTS : PAYMENT_FACTS);
        mutations.push({
          patch: {
            id: document._id,
            ifRevisionID: document._rev,
            set: { [newPath]: facts },
            unset: [oldPath],
          },
        });
      } catch (error) {
        conflicts.push(
          `${document._id}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
    return { mutations, conflicts };
  },
};
