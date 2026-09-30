import { describe, expect, it } from 'vitest';
import { documentTypes } from '../../src/schema';
import { buildSeed, RETIRED_FIELDS, RETIRED_TYPES, type SeedAssets } from '../seed-data';
import { albumLinkMigration } from './album-link';
import { applyMutations, isDraft, type StoredDocument } from './core';
import { MIGRATIONS } from './index';
import { inlineListsMigration } from './inline-lists';
import { oneControlMigration } from './one-control';
import { retiredFieldsMigration } from './retired-fields';
import { retiredTypesMigration } from './retired-types';
import { scopesMigration } from './scopes';
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

describe('retired-types', () => {
  it('deletes each document of a retired type and its lint report, guarded by its revision', () => {
    const post = { _id: 'news-odunde-2026-recap', _type: 'newsPost', _rev: 'r3', title: 'Recap' };
    const report = { _id: 'lint-news', _type: 'lintReport', documentId: post._id };
    const kept = { _id: 'lint-album', _type: 'lintReport', documentId: 'album-gala-2025' };
    const plan = retiredTypesMigration.plan([post, report, kept]);
    expect(plan.mutations).toEqual([
      { patch: { id: post._id, ifRevisionID: 'r3', unset: ['revisionGuard'] } },
      { delete: { id: post._id } },
      { delete: { id: 'lint-news' } },
    ]);
    expect(plan.notes).toEqual(['Deletes news-odunde-2026-recap.']);
    expect(
      retiredTypesMigration.plan(applyMutations([post, report, kept], plan.mutations)).mutations,
    ).toEqual([]);
  });

  it('retires no type the schema still has, and the seed writes none', () => {
    const live = new Set(documentTypes.map(({ name }) => name));
    for (const type of RETIRED_TYPES) expect(live.has(type), type).toBe(false);
    expect(SEED.some(({ _type }) => RETIRED_TYPES.includes(_type))).toBe(false);
  });
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

  it('drops a link that names no album, which retired-fields would otherwise wait on forever', () => {
    const empty = { _id: 'event-x', _type: 'event', _rev: 'e9', album: {} };
    expect(albumLinkMigration.plan([empty]).mutations).toEqual([
      { patch: { id: 'event-x', ifRevisionID: 'e9', unset: ['album'] } },
    ]);
    const nothing = { _id: 'event-y', _type: 'event', album: null };
    expect(albumLinkMigration.plan([nothing]).mutations).toEqual([]);
    expect(retiredFieldsMigration.plan([nothing]).conflicts).toEqual([]);
  });

  it('keeps retired-fields off the link until album-link has moved it', () => {
    const plan = retiredFieldsMigration.plan([odunde]);
    expect(plan.mutations).toEqual([]);
    expect(plan.conflicts).toEqual(['event-odunde-2026 still holds album: run album-link first.']);
  });
});

describe('inline-lists', () => {
  const reference = (key: string, id: string) => ({ _key: key, _type: 'reference', _ref: id });
  const collective = {
    _id: 'collectivePage',
    _type: 'collectivePage',
    _rev: 'c1',
    initiatives: [
      reference('initiative-1', 'initiative-solar-hub'),
      reference('initiative-2', 'initiative-green-goods'),
    ],
  };
  const solar = {
    _id: 'initiative-solar-hub',
    _type: 'initiative',
    _rev: 'i1',
    _createdAt: '2026-09-01T00:00:00Z',
    name: 'Solar Hub',
    memberLed: true,
    order: 1,
    proceedsReturn: true,
  };
  const green = {
    _id: 'initiative-green-goods',
    _type: 'initiative',
    _rev: 'i2',
    name: 'Green Goods',
    order: 2,
  };

  it('moves each listed document into its page list, in place and under the same key, then deletes it', () => {
    const plan = inlineListsMigration.plan([collective, solar, green]);
    expect(plan.conflicts).toEqual([]);
    expect(plan.mutations).toEqual([
      {
        patch: {
          id: 'collectivePage',
          ifRevisionID: 'c1',
          set: {
            initiatives: [
              { _key: 'initiative-1', _type: 'initiative', name: 'Solar Hub', memberLed: true },
              { _key: 'initiative-2', _type: 'initiative', name: 'Green Goods' },
            ],
          },
        },
      },
      { patch: { id: 'initiative-solar-hub', ifRevisionID: 'i1', unset: ['revisionGuard'] } },
      { delete: { id: 'initiative-solar-hub' } },
      { patch: { id: 'initiative-green-goods', ifRevisionID: 'i2', unset: ['revisionGuard'] } },
      { delete: { id: 'initiative-green-goods' } },
    ]);
    const after = applyMutations([collective, solar, green], plan.mutations);
    expect(after.map(({ _id }) => _id)).toEqual(['collectivePage']);
    // What only the system or the retired order held stays behind.
    expect(JSON.stringify(after)).not.toMatch(/_createdAt|"order"|proceedsReturn/);
    expect(inlineListsMigration.plan(after).mutations).toEqual([]);
  });

  it("removes the lint report of a document it moves, and keys an item that had no key by the document's id", () => {
    const report = {
      _id: 'lint-initiative-solar-hub',
      _type: 'lintReport',
      documentId: 'initiative-solar-hub',
    };
    const keyless = {
      ...collective,
      initiatives: [
        { _type: 'reference', _ref: 'initiative-solar-hub' },
        collective.initiatives[1],
      ],
    };
    const plan = inlineListsMigration.plan([keyless, solar, green, report]);
    expect(plan.mutations).toContainEqual({ delete: { id: 'lint-initiative-solar-hub' } });
    const [first] = plan.mutations;
    const set = (first && 'patch' in first ? first.patch.set?.initiatives : []) as {
      _key: string;
    }[];
    expect(set.map(({ _key }) => _key)).toEqual(['initiative-solar-hub', 'initiative-2']);
    expect(inlineListsMigration.filter).toContain('_type == "lintReport"');
  });

  it('leaves a document no page lists, or a listed one that is missing, to the owner', () => {
    const lonely = { _id: 'outcome-1', _type: 'outcome', figure: { value: '120' } };
    expect(inlineListsMigration.plan([collective, solar, green, lonely]).conflicts).toEqual([
      'outcome-1 is on no page: add it to the impactPage list, or delete it.',
    ]);
    const plan = inlineListsMigration.plan([collective, solar]);
    expect(plan.conflicts).toEqual([
      'collectivePage lists initiative-green-goods, which is not a published initiative: publish it, or take it off the list.',
    ]);
    expect(plan.mutations).toEqual([]);
  });

  it('reads the pages and every type that moves', () => {
    for (const name of ['collectivePage', 'impactPage', 'storyPage', 'donatePage']) {
      expect(inlineListsMigration.filter).toContain(`"${name}"`);
    }
    for (const type of ['initiative', 'outcome', 'timelineEntry', 'givingLevel']) {
      expect(inlineListsMigration.filter).toContain(`"${type}"`);
    }
  });
});

describe('one-control', () => {
  const row = (way: string) => ({ _key: way, _type: 'takePartRow', way });
  const festival = (takepart: unknown) => ({
    _id: 'festivalPage',
    _type: 'festivalPage',
    _rev: 'f1',
    takePart: [row('vendor'), row('sponsor'), row('performer')],
    layout: { phead: 'photo', takepart },
  });

  it("moves the take-part lead's row to the top, as the band drew it, then drops the option", () => {
    const page = festival('sponsor');
    const plan = oneControlMigration.plan([page]);
    expect(plan).toEqual({
      mutations: [
        {
          patch: {
            id: 'festivalPage',
            ifRevisionID: 'f1',
            set: { takePart: [row('sponsor'), row('vendor'), row('performer')] },
            unset: ['layout.takepart'],
          },
        },
      ],
      conflicts: [],
      notes: [],
    });
    const [after] = applyMutations([page], plan.mutations);
    expect(after?.layout).toEqual({ phead: 'photo' });
    expect(oneControlMigration.plan(after ? [after] : []).mutations).toEqual([]);
  });

  it('only drops a lead the rows already follow', () => {
    expect(oneControlMigration.plan([festival('vendor')]).mutations).toEqual([
      { patch: { id: 'festivalPage', ifRevisionID: 'f1', unset: ['layout.takepart'] } },
    ]);
  });

  it('reads an empty or unknown lead as the site did, as vendor first', () => {
    for (const takepart of [null, '', 'performer']) {
      const page = { ...festival(takepart), takePart: [row('sponsor'), row('vendor')] };
      expect(oneControlMigration.plan([page]).mutations, String(takepart)).toEqual([
        {
          patch: {
            id: 'festivalPage',
            ifRevisionID: 'f1',
            set: { takePart: [row('vendor'), row('sponsor')] },
            unset: ['layout.takepart'],
          },
        },
      ]);
    }
    // A page holding no lead has been migrated already: its rows keep their order.
    const migrated = { ...festival('sponsor'), layout: { phead: 'photo' } };
    expect(oneControlMigration.plan([migrated]).mutations).toEqual([]);
  });

  const gala = (emphasis: string) => ({
    _id: 'galaPage',
    _type: 'galaPage',
    _rev: 'g1',
    layout: { tiers: 'columns', emphasis },
  });
  const tier = (id: string, variant: string, order?: number, edition = 'event-gala-2026') => ({
    _id: id,
    _type: 'ticketTier',
    variant,
    ...(order === undefined ? {} : { order }),
    event: { _type: 'reference', _ref: edition },
  });

  it("drops the Gala's emphasis where the tiers' order already shows what it did", () => {
    const drop = [{ patch: { id: 'galaPage', ifRevisionID: 'g1', unset: ['layout.emphasis'] } }];
    expect(oneControlMigration.plan([gala('seats'), tier('a', 'buyNow', 1)]).mutations).toEqual(
      drop,
    );
    const tablesFirst = [tier('t', 'enquiry', 1), tier('a', 'buyNow', 2), tier('b', 'buyNow', 3)];
    expect(oneControlMigration.plan([gala('tables'), ...tablesFirst])).toEqual({
      mutations: drop,
      conflicts: [],
      notes: [],
    });
  });

  it("leaves tables emphasised against the tiers' order to the owner", () => {
    for (const tiers of [
      [tier('a', 'buyNow', 1), tier('t', 'enquiry', 2)],
      [tier('t', 'enquiry', 1), tier('a', 'buyNow', 1)],
      [tier('t', 'enquiry'), tier('a', 'buyNow', 2)],
    ]) {
      const plan = oneControlMigration.plan([gala('tables'), ...tiers]);
      expect(plan.mutations).toEqual([]);
      expect(plan.conflicts).toEqual([
        'galaPage puts the table tiers first (emphasis: tables), but the tiers of event-gala-2026 do not come in that order: give the table tiers the lowest order, then run again.',
      ]);
    }
    // Another edition's tiers, each kind alone, reorder nothing.
    const apart = [tier('t', 'enquiry', 2, 'event-gala-2025'), tier('a', 'buyNow', 1)];
    expect(oneControlMigration.plan([gala('tables'), ...apart]).conflicts).toEqual([]);
  });

  it('drops an empty event pick and leaves a chosen one to the owner', () => {
    const home = (leadEvent: unknown) => ({
      _id: 'homepage',
      _type: 'homepage',
      _rev: 'h1',
      leadEvent,
    });
    expect(oneControlMigration.plan([home(null)]).mutations).toEqual([
      { patch: { id: 'homepage', ifRevisionID: 'h1', unset: ['leadEvent'] } },
    ]);
    const chosen = oneControlMigration.plan([
      home({ _type: 'reference', _ref: 'event-gala-2026' }),
    ]);
    expect(chosen.mutations).toEqual([]);
    expect(chosen.conflicts).toEqual([
      'homepage picks its event band by hand (event-gala-2026): choose the Leading event option instead, remove the pick, then run again.',
    ]);
  });

  it("notes that a highlight leaning on a program no longer takes the hero's gold button", () => {
    const home = (highlight: string) => ({
      _id: 'homepage',
      _type: 'homepage',
      layout: { highlight },
    });
    expect(oneControlMigration.plan([home('school')])).toEqual({
      mutations: [],
      conflicts: [],
      notes: [
        "homepage highlights Language Lessons: the hero shows its own gold button now, no longer that card's action (ADR 0042).",
      ],
    });
    expect(oneControlMigration.plan([home('festival')]).notes).toEqual([]);
  });

  it('keeps retired-fields off the three options until one-control has run', () => {
    const home = { _id: 'homepage', _type: 'homepage', leadEvent: { _ref: 'event-gala-2026' } };
    const plan = retiredFieldsMigration.plan([festival('vendor'), gala('seats'), home]);
    expect(plan.mutations).toEqual([]);
    expect(plan.conflicts).toEqual([
      'festivalPage still holds layout.takepart: run one-control first.',
      'galaPage still holds layout.emphasis: run one-control first.',
      'homepage still holds leadEvent: run one-control first.',
    ]);
  });

  it('turns a dataset seeded before this change into the seed of today, with retired-fields', () => {
    const before = SEED.map((document): StoredDocument => {
      const layout = document.layout as Record<string, unknown> | undefined;
      switch (document._type) {
        case 'festivalPage':
          return { ...document, layout: { ...layout, takepart: 'vendor' } };
        case 'galaPage':
          return { ...document, layout: { ...layout, emphasis: 'seats' } };
        case 'siteSettings':
          return { ...document, wordmarkLine2: 'of Southern California' };
        case 'collectivePage':
          return { ...document, keepsOwnList: false };
        case 'door':
          return { ...document, order: 1 };
        case 'event':
          return document._id === 'event-gala-2025'
            ? { ...document, heroImage: { _type: 'oyImage', alt: 'Guests at their tables' } }
            : document;
        default:
          return document;
      }
    });
    const blocked = retiredFieldsMigration.plan(before);
    expect(blocked.conflicts).toHaveLength(2);
    const controlled = oneControlMigration.plan(before);
    expect(controlled.conflicts).toEqual([]);
    const afterControl = applyMutations(before, controlled.mutations);
    const retired = retiredFieldsMigration.plan(afterControl);
    expect(retired.conflicts).toEqual([]);
    const after = applyMutations(afterControl, retired.mutations);
    expect(after).toEqual(SEED);
    for (const migration of MIGRATIONS) expect(migration.plan(after).mutations).toEqual([]);
  });
});

describe('scopes', () => {
  const partner = (scope: unknown) => ({ _id: 'partner-x', _type: 'partner', _rev: 'p1', scope });

  it("keeps a partner's Odunde scope and drops the ones no page shows", () => {
    const plan = scopesMigration.plan([partner(['odunde', 'gala', 'org'])]);
    expect(plan).toEqual({
      mutations: [{ patch: { id: 'partner-x', ifRevisionID: 'p1', set: { scope: ['odunde'] } } }],
      conflicts: [],
    });
    const after = applyMutations([partner(['odunde', 'gala', 'org'])], plan.mutations);
    expect(scopesMigration.plan(after).mutations).toEqual([]);
    expect(scopesMigration.plan([partner(['collective'])]).mutations).toEqual([
      { patch: { id: 'partner-x', ifRevisionID: 'p1', unset: ['scope'] } },
    ]);
    expect(scopesMigration.plan([partner(['odunde']), partner(undefined)]).mutations).toEqual([]);
  });

  it('leaves an Odunde sponsor level to the owner', () => {
    const level = (scope: string) => ({
      _id: `level-${scope}`,
      _type: 'sponsorLevel',
      name: 'Friend',
      scope,
    });
    const plan = scopesMigration.plan([level('odunde'), level('gala'), level('org')]);
    expect(plan.mutations).toEqual([]);
    expect(plan.conflicts).toEqual([
      'level-odunde (Friend) is scoped to odunde, which no page shows: make it a Gala or organization level, or delete it.',
    ]);
  });
});
