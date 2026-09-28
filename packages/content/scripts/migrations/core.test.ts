import { describe, expect, it } from 'vitest';
import {
  applyMutations,
  blockers,
  describeMutation,
  isDraft,
  type MigrationPlan,
  mutationId,
  publishedIdOf,
  revisionGuard,
  type StoredDocument,
  unpublished,
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

describe('what a plan waits for', () => {
  const plan: MigrationPlan = {
    mutations: [{ patch: { id: 'collectivePage', set: { initiatives: [] } } }],
    conflicts: [],
  };

  it('counts drafts and release versions as unpublished, each standing for its published document', () => {
    expect(isDraft('drafts.collectivePage')).toBe(true);
    expect(isDraft('versions.rAbc.collectivePage')).toBe(true);
    expect(isDraft('collectivePage')).toBe(false);
    expect(publishedIdOf('drafts.collectivePage')).toBe('collectivePage');
    expect(publishedIdOf('versions.rAbc.initiative-solar-hub')).toBe('initiative-solar-hub');
  });

  // A stand-in migration: it unsets `old` wherever a document holds it.
  const migration = {
    name: 'unset-old',
    description: 'Unset old.',
    filter: 'defined(old)',
    plan: (documents: readonly StoredDocument[]): MigrationPlan => ({
      mutations: documents
        .filter((document) => document.old !== undefined)
        .map((document) => ({ patch: { id: document._id, unset: ['old'] } })),
      conflicts: [],
    }),
  };

  it('waits for a draft of a document it writes, though its filter reads the page by id', () => {
    const read = [{ _id: 'collectivePage', _type: 'collectivePage' }];
    const candidates = [
      { _id: 'drafts.collectivePage', _type: 'collectivePage' },
      { _id: 'versions.rAbc.collectivePage', _type: 'collectivePage' },
      { _id: 'drafts.sanity-preview-url-secret', _type: 'sanity.previewUrlSecret' },
      { _id: 'drafts.homepage', _type: 'homepage' },
    ];
    expect(unpublished(migration, read, candidates, plan).map(({ _id }) => _id)).toEqual([
      'drafts.collectivePage',
      'versions.rAbc.collectivePage',
    ]);
  });

  it('waits for a draft it reads only while the draft still holds what the migration moves', () => {
    const read = [
      { _id: 'drafts.event-odunde-2027', _type: 'event', old: 'yes' },
      { _id: 'drafts.event-gala-2027', _type: 'event' },
    ];
    const none: MigrationPlan = { mutations: [], conflicts: [] };
    expect(unpublished(migration, read, [], none).map(({ _id }) => _id)).toEqual([
      'drafts.event-odunde-2027',
    ]);
  });

  it('guards a delete with the revision it read, changing nothing', () => {
    const guard = revisionGuard({ _id: 'initiative-x', _rev: 'r4' });
    expect(describeMutation(guard)).toBe('check initiative-x has not changed since it was read');
    const [after] = applyMutations(
      [{ _id: 'initiative-x', _type: 'initiative', name: 'X' }],
      [guard],
    );
    expect(after).toEqual({ _id: 'initiative-x', _type: 'initiative', name: 'X' });
  });
});
