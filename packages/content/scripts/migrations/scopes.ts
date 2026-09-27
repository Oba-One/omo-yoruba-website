import { PARTNER_SCOPES, SPONSOR_SCOPES } from '../../src/scopes';
import type { Migration, Mutation } from './core';

const kept = new Set<unknown>(PARTNER_SCOPES);

/**
 * The scopes no page shows go (ticket 14, S12, ADR 0042). A partner keeps only the scopes a page reads,
 * and one left with none loses the field; Impact lists every partner either way. A sponsor level scoped
 * to Odunde shows on no page, so it waits for the owner: a Gala or organization level, or deleted.
 */
export const scopesMigration: Migration = {
  name: 'scopes',
  description:
    'Remove the scopes no page shows: the Odunde sponsor scope, and the partner scopes other than Odunde.',
  filter: '_type in ["sponsorLevel", "partner"]',
  plan: (documents) => {
    const mutations: Mutation[] = [];
    const conflicts: string[] = [];
    for (const { _id: id, _rev, _type, scope, name } of documents) {
      if (
        _type === 'sponsorLevel' &&
        typeof scope === 'string' &&
        !(SPONSOR_SCOPES as readonly string[]).includes(scope)
      ) {
        conflicts.push(
          `${id} (${String(name ?? 'no name')}) is scoped to ${scope}, which no page shows: make it a Gala or organization level, or delete it.`,
        );
      }
      if (_type === 'partner' && Array.isArray(scope) && scope.some((value) => !kept.has(value))) {
        const left = scope.filter((value) => kept.has(value));
        mutations.push({
          patch:
            left.length > 0
              ? { id, ifRevisionID: _rev, set: { scope: left } }
              : { id, ifRevisionID: _rev, unset: ['scope'] },
        });
      }
    }
    return { mutations, conflicts };
  },
};
