import { describe, expect, it } from 'vitest';
import { buildSeed, RETIRED_FIELDS, type SeedAssets } from '../seed-data';
import { albumLinkMigration } from './album-link';
import { applyMutations, isDraft, type StoredDocument } from './core';
import { MIGRATIONS } from './index';
import { retiredFieldsMigration } from './retired-fields';
import { teacherGroupMigration } from './teacher-group';

// Every migration (ADR 0042): its plan on the seed, applied, leaves nothing to do, and the names are
// unique. Each migration's own cases follow.

const assets: SeedAssets = new Map(
  ['odunde-2026-ayo-game.jpg', 'gala-2025-group-photo.jpg'].map((file) => [
    file,
    {
      assetId: `image-${file.replace(/\W/g, '')}-10x10-jpg`,
      caption: `Caption for ${file}`,
      album: file.startsWith('gala') ? 'gala-2025' : 'odunde-2026',
      photographer: 'red-carpet-media',
    },
  ]),
);
const SEED = buildSeed(assets).map((document) => ({
  ...document,
  _rev: 'seed',
})) as StoredDocument[];

describe('every migration', () => {
  it('has a name of its own', () => {
    const names = MIGRATIONS.map(({ name }) => name);
    expect(new Set(names).size).toBe(names.length);
  });

  it.each(MIGRATIONS.map((migration) => [migration.name, migration] as const))(
    '%s leaves nothing to do once applied to the seed',
    (_, migration) => {
      const plan = migration.plan(SEED);
      expect(plan.conflicts).toEqual([]);
      const after = applyMutations(SEED, plan.mutations);
      expect(migration.plan(after).mutations).toEqual([]);
      expect(after.some(({ _id }) => isDraft(_id))).toBe(false);
    },
  );
});

describe('retired-fields', () => {
  it('unsets every retired field a document holds, lists included, guarded by its revision', () => {
    const programs = {
      _id: 'programsPage',
      _type: 'programsPage',
      _rev: 'r7',
      kidsStem: { image: { _type: 'oyImage' }, subprograms: [{ _key: 'a', ages: '8 to 12' }] },
      yearStrip: [{ _key: 'y', event: { _ref: 'event-odunde-2026' } }],
    };
    const plan = retiredFieldsMigration.plan([programs]);
    expect(plan.mutations).toEqual([
      {
        patch: {
          id: 'programsPage',
          ifRevisionID: 'r7',
          unset: [
            'kidsStem.image',
            'kidsStem.subprograms[_key=="a"].ages',
            'yearStrip[_key=="y"].event',
          ],
        },
      },
    ]);
    const after = applyMutations([programs], plan.mutations);
    expect(retiredFieldsMigration.plan(after).mutations).toEqual([]);
  });

  it('reads every type with a retired field', () => {
    for (const type of Object.keys(RETIRED_FIELDS)) {
      expect(retiredFieldsMigration.filter).toContain(`"${type}"`);
    }
  });
});

describe('teacher-group', () => {
  const lessons = { _id: 'lessonsPage', _type: 'lessonsPage', teacher: { _ref: 'person-ada' } };
  const ada = { _id: 'person-ada', _type: 'person', _rev: 'r2', name: 'Ada', group: 'teacher' };
  const bisi = { _id: 'person-bisi', _type: 'person', _rev: 'r3', name: 'Bisi', group: 'teacher' };

  it('takes the teacher the Lessons page picks out of the groups', () => {
    const plan = teacherGroupMigration.plan([lessons, ada]);
    expect(plan).toEqual({
      mutations: [{ patch: { id: 'person-ada', ifRevisionID: 'r2', unset: ['group'] } }],
      conflicts: [],
    });
    const after = applyMutations([lessons, ada], plan.mutations);
    expect(teacherGroupMigration.plan(after).mutations).toEqual([]);
  });

  it('leaves a teacher the page does not pick to the owner', () => {
    const plan = teacherGroupMigration.plan([lessons, ada, bisi]);
    expect(plan.mutations).toHaveLength(1);
    expect(plan.conflicts).toEqual([
      'person-bisi (Bisi) is in the teacher group, but the Lessons page does not pick her: pick her there, or give her a group Our Story lists.',
    ]);
  });
});

describe('album-link', () => {
  const ref = (id: string) => ({ _type: 'reference', _ref: id });
  const odunde = {
    _id: 'event-odunde-2026',
    _type: 'event',
    _rev: 'e1',
    album: ref('album-odunde'),
  };
  const gala = { _id: 'event-gala-2025', _type: 'event', _rev: 'e2', album: ref('album-gala') };

  it("drops the edition's link where the album already names it, and moves it where the album names none", () => {
    const named = { _id: 'album-odunde', _type: 'album', _rev: 'a1', event: ref(odunde._id) };
    const unnamed = { _id: 'album-gala', _type: 'album', _rev: 'a2' };
    const documents = [odunde, gala, named, unnamed];
    const plan = albumLinkMigration.plan(documents);
    expect(plan).toEqual({
      mutations: [
        { patch: { id: odunde._id, ifRevisionID: 'e1', unset: ['album'] } },
        { patch: { id: 'album-gala', ifRevisionID: 'a2', set: { event: ref(gala._id) } } },
        { patch: { id: gala._id, ifRevisionID: 'e2', unset: ['album'] } },
      ],
      conflicts: [],
    });
    const after = applyMutations(documents, plan.mutations);
    expect(after.find(({ _id }) => _id === 'album-gala')?.event).toEqual(ref(gala._id));
    expect(albumLinkMigration.plan(after).mutations).toEqual([]);
  });

  it('leaves an album naming another edition, or named by two, to the owner', () => {
    const elsewhere = { _id: 'album-odunde', _type: 'album', event: ref('event-odunde-2025') };
    expect(albumLinkMigration.plan([odunde, elsewhere])).toEqual({
      mutations: [],
      conflicts: [
        'album-odunde names event-odunde-2025, but event-odunde-2026 names album-odunde: settle which.',
      ],
    });
    const twice = { ...gala, album: ref('album-odunde') };
    const shared = { _id: 'album-odunde', _type: 'album' };
    expect(albumLinkMigration.plan([odunde, twice, shared]).conflicts).toHaveLength(2);
  });

  it('keeps retired-fields off the link until album-link has moved it', () => {
    const plan = retiredFieldsMigration.plan([odunde]);
    expect(plan.mutations).toEqual([]);
    expect(plan.conflicts).toEqual(['event-odunde-2026 still holds album: run album-link first.']);
  });
});
