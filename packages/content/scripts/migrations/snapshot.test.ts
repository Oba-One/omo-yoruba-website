import { describe, expect, it } from 'vitest';
import { applyMutations, type StoredDocument } from './core';
import { readSnapshot, restorePlan, snapshotEntries, withAfter } from './snapshot';

// A restore puts back only what an apply wrote, on the dataset it ran on, and only while nobody has
// changed it since (ADR 0042).

const header = {
  dataset: 'development',
  migration: 'inline-lists',
  takenAt: '2026-09-27T10:00:00Z',
};
const page: StoredDocument = {
  _id: 'collectivePage',
  _type: 'collectivePage',
  _rev: 'p1',
  _updatedAt: '2026-09-26T00:00:00Z',
  initiatives: [{ _key: 'initiative-1', _type: 'reference', _ref: 'initiative-solar-hub' }],
};
const solar: StoredDocument = {
  _id: 'initiative-solar-hub',
  _type: 'initiative',
  _rev: 's1',
  name: 'Solar Hub',
};

describe('a migration snapshot', () => {
  const mutations = [
    { patch: { id: 'collectivePage', set: { initiatives: [] } } },
    { delete: { id: 'initiative-solar-hub' } },
    { create: { _id: 'stat-new', _type: 'stat' } },
  ];
  const entries = snapshotEntries([page, solar], mutations);

  it('keeps every document the plan writes as it was, and none it creates', () => {
    expect(entries).toEqual([
      { id: 'collectivePage', before: page },
      { id: 'initiative-solar-hub', before: solar },
      { id: 'stat-new', before: null },
    ]);
  });

  it('puts back the documents after the apply, on the same dataset, when nothing changed since', () => {
    const applied = withAfter(
      entries,
      new Map([
        ['collectivePage', 'p2'],
        ['stat-new', 'n1'],
      ]),
    );
    expect(applied.map(({ after }) => after)).toEqual(['p2', null, 'n1']);
    const now = new Map([
      ['collectivePage', 'p2'],
      ['stat-new', 'n1'],
    ]);
    const plan = restorePlan(header, applied, 'development', now);
    expect(plan.conflicts).toEqual([]);
    const afterApply: StoredDocument[] = [
      { _id: 'collectivePage', _type: 'collectivePage', _rev: 'p2', initiatives: [] },
      { _id: 'stat-new', _type: 'stat', _rev: 'n1' },
    ];
    const restored = applyMutations(afterApply, plan.mutations);
    const { _rev: _pageRev, _updatedAt, ...pageBack } = page;
    const { _rev: _solarRev, ...solarBack } = solar;
    expect(restored).toEqual([pageBack, solarBack]);
  });

  it('refuses another dataset, an apply that never finished, and anything changed since', () => {
    const applied = withAfter(
      entries,
      new Map([
        ['collectivePage', 'p2'],
        ['stat-new', 'n1'],
      ]),
    );
    expect(
      restorePlan(header, applied, 'production', new Map([['collectivePage', 'p2']])).conflicts,
    ).toContain('the snapshot is of development, not production.');
    expect(restorePlan(header, entries, 'development', new Map()).conflicts).toHaveLength(3);
    const edited = restorePlan(
      header,
      applied,
      'development',
      new Map([
        ['collectivePage', 'p3'],
        ['initiative-solar-hub', 's9'],
      ]),
    ).conflicts;
    expect(edited).toEqual([
      'collectivePage changed since the migration (or is gone): put it back by hand.',
      'initiative-solar-hub exists again since the migration deleted it.',
      'stat-new changed since the migration (or is gone): put it back by hand.',
    ]);
  });

  it('reads only a file that names its dataset', () => {
    expect(readSnapshot([{ snapshot: header }, ...entries]).header).toEqual(header);
    expect(() => readSnapshot([{ id: 'collectivePage', before: page }])).toThrow(
      'not a migration snapshot',
    );
  });
});
