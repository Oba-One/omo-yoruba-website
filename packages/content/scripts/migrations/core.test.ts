import { describe, expect, it } from 'vitest';
import {
  applyMutations,
  blockers,
  describeMutation,
  type MigrationPlan,
  mutationId,
  type StoredDocument,
} from './core';

// The migration runner's pure half: the in-memory apply the rehearsal and the tests rely on, and what
// stops an apply (ADR 0042).

const page: StoredDocument = {
  _id: 'programsPage',
  _type: 'programsPage',
  _rev: 'r1',
  kidsStem: {
    image: { _type: 'oyImage' },
    subprograms: [
      { _key: 'a', name: 'Robots', ages: '8 to 12' },
      { _key: 'b.c', name: 'Paint', ages: '5 to 7' },
    ],
  },
};

describe('applying mutations in memory', () => {
  it('sets and unsets fields, objects and keyed list items as the dataset would', () => {
    const [after] = applyMutations(
      [page],
      [
        {
          patch: {
            id: 'programsPage',
            set: { 'kidsStem.blurb': 'Hands on', 'kidsStem.subprograms[_key=="a"].name': 'Rovers' },
            unset: ['kidsStem.image', 'kidsStem.subprograms[_key=="b.c"].ages'],
          },
        },
      ],
    );
    expect(after).toEqual({
      ...page,
      kidsStem: {
        blurb: 'Hands on',
        subprograms: [
          { _key: 'a', name: 'Rovers', ages: '8 to 12' },
          { _key: 'b.c', name: 'Paint' },
        ],
      },
    });
    expect(page.kidsStem).toHaveProperty('image');
  });

  it('removes a keyed list item, creates and deletes documents, and refuses the impossible', () => {
    const after = applyMutations(
      [page],
      [
        { patch: { id: 'programsPage', unset: ['kidsStem.subprograms[_key=="a"]'] } },
        { create: { _id: 'stat-1', _type: 'stat', value: '1997' } },
        { delete: { id: 'nothing-here' } },
      ],
    );
    const [programs, stat] = after;
    if (!programs) throw new Error('the page is gone');
    expect((programs.kidsStem as { subprograms: unknown[] }).subprograms).toHaveLength(1);
    expect(stat).toEqual({ _id: 'stat-1', _type: 'stat', value: '1997' });
    expect(() => applyMutations([page], [{ create: page }])).toThrow('already exists');
    expect(() => applyMutations([], [{ patch: { id: 'missing', set: { a: 1 } } }])).toThrow(
      'no such document',
    );
  });
});

describe('what stops an apply', () => {
  const plan: MigrationPlan = {
    mutations: [{ patch: { id: 'programsPage', unset: ['kidsStem.image'] } }],
    conflicts: ['album-1 names event-a, but event-b names album-1'],
  };

  it('lists the conflicts and every draft among the documents read', () => {
    const drafts = [{ _id: 'drafts.programsPage', _type: 'programsPage' }];
    expect(blockers(plan, drafts)).toEqual([
      'album-1 names event-a, but event-b names album-1',
      'drafts.programsPage is an unpublished draft: publish or discard it first.',
    ]);
    expect(blockers({ mutations: plan.mutations, conflicts: [] }, [])).toEqual([]);
  });

  it('names what each mutation writes', () => {
    const [patch] = plan.mutations;
    if (!patch) throw new Error('no mutation');
    expect(mutationId(patch)).toBe('programsPage');
    expect(describeMutation(patch)).toBe('patch programsPage: unset kidsStem.image');
    expect(describeMutation({ delete: { id: 'x' } })).toBe('delete x');
  });
});
