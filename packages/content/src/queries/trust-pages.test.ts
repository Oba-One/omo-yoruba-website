import { evaluate, parse } from 'groq-js';
import { describe, expect, it } from 'vitest';
import { PRESENCE, presenceFilter } from '../pending';
import { festivalPageQuery } from './event-pages';
import { impactPageQuery } from './trust-pages';

const pages = [
  { _id: 'impactPage', _type: 'impactPage' },
  { _id: 'festivalPage', _type: 'festivalPage' },
];

const partners = [
  { _id: 'wefa', _type: 'partner', name: 'WEFA', scope: ['gala', 'odunde'] },
  { _id: 'unscoped', _type: 'partner', name: '[ Unassigned sponsor ]', kind: 'funder' },
  { _id: 'red-carpet', _type: 'partner', name: 'Red Carpet Films', scope: ['odunde'] },
  { _id: 'stemnetics', _type: 'partner', name: 'STEMnetics', scope: ['odunde'] },
  { _id: 'moremi', _type: 'partner', name: 'Association of Moremi Women', scope: ['odunde'] },
  { _id: 'empty-scope', _type: 'partner', name: '[ Unselected partner ]', scope: [] },
  { _id: 'gala-only', _type: 'partner', name: '[ Gala partner ]', scope: ['gala'] },
  { _id: 'other-type', _type: 'hometownAssociation', name: '[ Association ]', scope: ['odunde'] },
];

async function partnerIds(query: string, documents = partners) {
  const result = (await (
    await evaluate(parse(query), { dataset: [...pages, ...documents] })
  ).get()) as { partners: { _id: string }[] };
  return result.partners.map((partner) => partner._id);
}

describe('the Impact and Odunde partner selection', () => {
  it('reads the same four selected partners in name order, excluding unassigned and other scopes', async () => {
    for (const query of [impactPageQuery, festivalPageQuery]) {
      expect(await partnerIds(query)).toEqual(['moremi', 'red-carpet', 'stemnetics', 'wefa']);
    }
  });

  it('follows a scope change on both pages without hard-coding partner ids', async () => {
    const changed = partners.map((partner) =>
      partner._id === 'red-carpet' ? { ...partner, scope: [] } : partner,
    );
    for (const query of [impactPageQuery, festivalPageQuery]) {
      expect(await partnerIds(query, changed)).toEqual(['moremi', 'stemnetics', 'wefa']);
    }
  });

  it('returns an empty list on both pages when no partner is selected', async () => {
    const unselected = partners.map((partner) => ({ ...partner, scope: [] }));
    for (const query of [impactPageQuery, festivalPageQuery]) {
      expect(await partnerIds(query, unselected)).toEqual([]);
    }
  });

  it('counts the displayed selection for the Studio missing-content row', async () => {
    const entry = PRESENCE.find((row) => row.type === 'partner');
    if (!entry) throw new Error('The partner presence entry is missing');
    const countQuery = parse(`count(*[${presenceFilter(entry)}])`);
    for (const documents of [partners, partners.map((partner) => ({ ...partner, scope: [] }))]) {
      const count = await (await evaluate(countQuery, { dataset: documents })).get();
      expect(count).toBe((await partnerIds(impactPageQuery, documents)).length);
    }
  });
});
