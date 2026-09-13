import { createImageSet } from '@oy/content/images';
import { GENERAL_CONTACT_PENDING } from '@oy/content/pending';
import { describe, expect, it } from 'vitest';
import { buildStoryPage, type StoryPageData } from './story-page';

const imageSet = createImageSet({ projectId: 'abc123', dataset: 'development' });
const options = { imageSet, draft: false, studioUrl: '/admin' };
const image = (alt: string) => ({
  _type: 'oyImage' as const,
  alt,
  caption: null,
  hotspot: null,
  crop: null,
  asset: { _ref: 'image-0a1b2c3d-1024x683-jpg', _type: 'reference' as const },
});
const block = (text: string) => [
  {
    _type: 'block',
    _key: 'b1',
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: 's1', text, marks: [] }],
  },
];

// The development dataset as the Phase 7 seed leaves it: the founding facts' labels, no story, no timeline
// entry, no person, the two take-part rows and no header action.
const seeded = {
  header: {
    kicker: { yo: 'Àwọn ènìyàn wa', en: 'Our people' },
    title: 'People and history',
    line: 'Who carries this work, and how it started in 1997.',
  },
  primaryAction: null,
  secondaryActions: null,
  founding: null,
  foundingFacts: [
    { _key: 'fact-1', label: 'Founded', value: '1997, Los Angeles', note: null },
    { _key: 'fact-2', label: 'Founders', value: null, note: null },
    { _key: 'fact-3', label: 'Status', value: '501(c)(3) nonprofit', note: null },
    { _key: 'fact-4', label: 'First year', value: null, note: null },
  ],
  foundingImage: null,
  timeline: null,
  boardIntro: null,
  staffIntro: 'The people who run the programs, and the volunteers who have been here longest.',
  board: [],
  staff: [],
  reachUs: {
    title: 'Reach us',
    blurb: 'For anything not covered on Get Involved. Write, call, or send a message.',
  },
  takePart: [
    {
      _key: 'way-1',
      way: 'member',
      chip: null,
      title: 'Become a member',
      line: null,
      label: 'Become a member',
    },
    {
      _key: 'way-2',
      way: 'volunteer',
      chip: null,
      title: 'Raise your hand',
      line: 'One form. We place you where you are needed.',
      label: 'Volunteer',
    },
  ],
  settings: { generalEmail: null, phone: null, address: null, general: { name: null } },
  layout: { timeline: 'hidden', bios: 'short', portraits: 'shown' },
  seo: null,
} as unknown as StoryPageData;

const withData = (patch: Record<string, unknown>) => ({ ...seeded, ...patch }) as StoryPageData;

// Test values only: the Studio holds no person yet.
const member = (id: string, extra: Record<string, unknown> = {}) => ({
  _id: id,
  name: '[ Name ]',
  role: '[ Role ]',
  bioShort: null,
  bioFull: null,
  portrait: null,
  ...extra,
});

describe('buildStoryPage', () => {
  it('fills the layout defaults, the timeline hidden, and the slim header with no action', () => {
    const view = buildStoryPage(seeded, options);
    expect(view.layout).toEqual({ timeline: 'hidden', bios: 'short', portraits: 'shown' });
    expect(view.root).toEqual(view.layout);
    expect(view.header).toMatchObject({
      variant: 'slim',
      title: 'People and history',
      actions: [],
    });
    expect(buildStoryPage(null, options).title).toBe('Our Story');
  });

  it('carries how it began: the story owed, the facts with their chips, the photograph owed', () => {
    const view = buildStoryPage(seeded, options).founding;
    expect(view.prose).toBeUndefined();
    expect(view.pending).toBe('the 1997 story, in your words');
    expect(view.facts.map((fact) => [fact.label, fact.value, fact.pending])).toEqual([
      ['Founded', '1997, Los Angeles', 'a founding fact'],
      ['Founders', undefined, 'a founding fact'],
      ['Status', '501(c)(3) nonprofit', 'a founding fact'],
      ['First year', undefined, 'a founding fact'],
    ]);
    expect(view.photo).toBeUndefined();
    expect(view.photoWhat).toBe(
      'the earliest photograph you have: an early gathering, or the founders',
    );
  });

  it('shows the timeline only by its option, each entry its year, line and milestone', () => {
    expect(buildStoryPage(seeded, options).timeline).toMatchObject({
      shown: false,
      entries: [],
      pending: 'the dated entries',
    });
    const timeline = [
      { _id: 'entry-1', year: '[ Year ]', blurb: '[ The founding ]', milestone: true },
      { _id: 'entry-2', year: '[ Year ]', blurb: '[ A later year ]', milestone: null },
    ];
    const shown = buildStoryPage(
      withData({ timeline, layout: { timeline: 'shown' } }),
      options,
    ).timeline;
    expect(shown.shown).toBe(true);
    expect(shown.entries).toEqual([
      { _id: 'entry-1', year: '[ Year ]', line: '[ The founding ]', milestone: true },
      { _id: 'entry-2', year: '[ Year ]', line: '[ A later year ]', milestone: false },
    ]);
  });

  it('names each group owed while no person is listed', () => {
    const view = buildStoryPage(seeded, options);
    expect(view.board).toMatchObject({
      people: [],
      pending: "the board's names, roles and bios",
      rolePending: 'the role',
      bioPending: 'a short bio',
      full: false,
    });
    expect(view.staff).toMatchObject({
      people: [],
      pending: 'the staff and volunteers to list',
      intro: 'The people who run the programs, and the volunteers who have been here longest.',
    });
  });

  it('draws the board with portraits by the option and the full bio by `bios`', () => {
    const board = [
      member('person-a', {
        bioShort: '[ A short bio ]',
        bioFull: block('[ The full bio ]'),
        portrait: image('[ Portrait ]'),
      }),
      member('person-b'),
    ];
    const view = buildStoryPage(withData({ board }), options).board;
    expect(view.people.map((person) => [person.variant, person.bio])).toEqual([
      ['portrait', '[ A short bio ]'],
      ['nophoto', undefined],
    ]);
    expect(view.people[0]?.image?.alt).toBe('[ Portrait ]');
    expect(view.people[0]?.bioFull).toHaveLength(1);
    const hidden = buildStoryPage(
      withData({ board, layout: { portraits: 'hidden', bios: 'full' } }),
      options,
    ).board;
    expect(hidden.people.every((person) => person.variant === 'nophoto' && !person.image)).toBe(
      true,
    );
    expect(hidden.full).toBe(true);
  });

  it('carries Reach us from the settings, the urgent line only with a phone', () => {
    const owed = buildStoryPage(seeded, options).reach;
    expect(owed).toMatchObject({
      title: 'Reach us',
      intro: 'For anything not covered on Get Involved. Write, call, or send a message.',
      settings: { generalEmail: undefined, phone: undefined, address: undefined },
      contact: { name: undefined },
      namePending: GENERAL_CONTACT_PENDING,
      urgent: false,
    });
    const held = buildStoryPage(
      withData({
        settings: {
          generalEmail: 'hello@example.org',
          phone: '[ Phone ]',
          address: '[ Street ]\n[ City ]',
          general: { name: '[ Name ]' },
        },
      }),
      options,
    ).reach;
    expect(held.urgent).toBe(true);
    expect(held.contact.name).toBe('[ Name ]');
  });

  it('closes with the two rows and the lead that counts them, and edit attributes in draft mode only', () => {
    const view = buildStoryPage(seeded, options);
    expect(view.takePart.rows.map((row) => row.way)).toEqual(['member', 'volunteer']);
    expect(view.takePart.intro).toBe('Two ways to join in.');
    expect(view.edit.timeline).toBeUndefined();
    const draft = buildStoryPage(withData({ board: [member('person-a')] }), {
      ...options,
      draft: true,
    });
    expect(draft.edit.bios).toContain('path=layout.bios');
    expect(draft.board.people[0]?.edit).toContain('id=person-a;type=person');
    expect(draft.founding.photoEdit).toContain('path=foundingImage');
  });
});
