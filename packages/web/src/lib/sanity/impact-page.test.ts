import { createImageSet } from '@oy/content/images';
import {
  GOVERNANCE_NOTE_PENDING,
  IMPACT_SIX_PENDING,
  OUTCOME_PENDING,
  PARTNERSHIPS_RESPONDS_PENDING,
} from '@oy/content/pending';
import { describe, expect, it } from 'vitest';
import { buildImpactPage, type ImpactPageData } from './impact-page';

const imageSet = createImageSet({ projectId: 'abc123', dataset: 'development' });
const now = new Date('2026-09-13T12:00:00Z');
const options = { imageSet, draft: false, studioUrl: '/admin', now };
const image = (alt: string, caption: string | null = null) => ({
  _type: 'oyImage' as const,
  alt,
  caption,
  hotspot: null,
  crop: null,
  asset: { _ref: 'image-0a1b2c3d-1024x683-jpg', _type: 'reference' as const },
});
const stat = (id: string, value: string, label: string) => ({
  _id: id,
  value,
  label,
  source: null,
});
const PROGRAMS = [
  {
    _id: 'program-yoruba-lessons',
    name: 'Yoruba Language Lessons',
    page: 'lessons',
    slug: 'yoruba-lessons',
  },
  {
    _id: 'program-cultural-collective',
    name: 'Yoruba Cultural Collective',
    page: 'collective',
    slug: 'cultural-collective',
  },
  { _id: 'program-kids-stem', name: 'Kids & STEM', page: null, slug: 'kids-stem' },
  {
    _id: 'program-cultural-exchange',
    name: 'Cultural Exchange',
    page: null,
    slug: 'cultural-exchange',
  },
];

// The development dataset as the Phase 7 seed leaves it: the four confirmed figures, no outcome, voice,
// governance document, partner or person, and every routing contact empty.
const seeded = {
  header: {
    kicker: { yo: 'Iṣẹ́ wa', en: 'Our work' },
    title: 'What we have built since 1997',
    line: 'A 501(c)(3) serving the Yoruba community of Southern California.',
  },
  primaryAction: {
    label: 'Sponsor or partner',
    kind: 'enquiry',
    enquiryKind: 'sponsor',
    href: null,
    newTab: null,
  },
  secondaryActions: [
    {
      _key: 'action-1',
      label: 'Talk to us',
      kind: 'enquiry',
      enquiryKind: 'contact',
      href: null,
      newTab: null,
    },
  ],
  stats: [
    stat('stat-years', '29', 'years serving Southern California'),
    stat('stat-community', '3,000+', 'Yoruba community in Southern California'),
    stat('stat-zones', '4', 'festival zones at Odunde'),
    stat('stat-associations', '9', 'hometown associations'),
  ],
  howWeWork: null,
  howWeWorkImage: image(
    'Elders in aṣọ òkè and lace rest at a round table under the Ọjà Balógun sign',
    'Àjọṣe • Partners and friends at the table',
  ),
  outcomes: null,
  programs: PROGRAMS,
  civicInfra: [
    {
      _type: 'block',
      _key: 'block-1',
      style: 'normal',
      markDefs: [],
      children: [
        { _type: 'span', _key: 'span-1', text: 'Odunde is a public cultural day.', marks: [] },
      ],
    },
  ],
  festivals: [
    {
      _id: 'event-odunde-2027',
      kind: 'festival',
      edition: 2027,
      start: null,
      end: null,
      cost: null,
      attendance: null,
      vendorsHosted: null,
      album: null,
    },
    {
      _id: 'event-odunde-2026',
      kind: 'festival',
      edition: 2026,
      start: null,
      end: null,
      cost: null,
      attendance: null,
      vendorsHosted: null,
      album: { _id: 'album-odunde-2026', photos: 43 },
    },
  ],
  festivalPartners: 0,
  voices: null,
  photos: [
    {
      _key: 'photo-1',
      ...image('Members in white and green gather on Degnan Boulevard', 'Odunde • 2026'),
    },
  ],
  governance: { form990: null, annualReport: null, audit: null },
  boardCount: 0,
  partners: [],
  fundersIntro: 'Everyone who has supported the work.',
  nextYear: { title: 'Fund the next year' },
  settings: { ein: null, address: null, partnerships: { name: null, email: null, responds: null } },
  layout: { stats: 'four', outcomes: 'cards', sources: 'shown', funders: 'shown' },
  seo: null,
} as unknown as ImpactPageData;

const withData = (patch: Record<string, unknown>) => ({ ...seeded, ...patch }) as ImpactPageData;

describe('buildImpactPage', () => {
  it('fills the layout defaults and the slim header with its two actions', () => {
    const view = buildImpactPage(seeded, options);
    expect(view.layout).toEqual({
      stats: 'four',
      outcomes: 'cards',
      sources: 'shown',
      funders: 'shown',
    });
    expect(view.header.actions.map((action) => action.label)).toEqual([
      'Sponsor or partner',
      'Talk to us',
    ]);
    expect(buildImpactPage(null, options).title).toBe('Impact');
  });

  it('carries the four figures with their sources, and the lead that promises them only while they show', () => {
    const view = buildImpactPage(seeded, options).numbers;
    expect(view.stats.map((figure) => figure.value)).toEqual(['29', '3,000+', '4', '9']);
    expect(view).toMatchObject({
      columns: 4,
      sources: true,
      padPending: undefined,
      pending: 'the headline figures',
    });
    expect(view.lead).toMatch(/^Every number carries a source line/);
    const six = buildImpactPage(withData({ layout: { stats: 'six' } }), options).numbers;
    expect(six).toMatchObject({ columns: 6, padPending: IMPACT_SIX_PENDING });
    const hidden = buildImpactPage(withData({ layout: { sources: 'hidden' } }), options);
    expect(hidden.numbers).toMatchObject({ sources: false, lead: undefined });
    expect(hidden.outcomes.sources).toBe(false);
  });

  it('keeps four outcome slots in the prototype order while the page references none', () => {
    const view = buildImpactPage(seeded, options).outcomes;
    expect(view.cards.map((card) => [card.title, card.pending])).toEqual([
      ['Yoruba Language Lessons', 'participation figures per program'],
      ['Odunde Festival', 'participation figures per program'],
      ['Kids & STEM', 'participation figures per program'],
      ['Yoruba Cultural Collective', 'participation figures per program'],
    ]);
    expect(view.links.map((link) => [link.name, link.href])).toEqual([
      ['Yoruba Language Lessons', '/programs/yoruba-lessons'],
      ['Odunde Festival', '/odunde'],
      ['Kids & STEM', '/programs#kids'],
      ['Yoruba Cultural Collective', '/programs/cultural-collective'],
    ]);
    expect(view.layout).toBe('card');
    expect(
      buildImpactPage(withData({ layout: { outcomes: 'rows' } }), options).outcomes.layout,
    ).toBe('row');
  });

  it('heads an outcome by its subject, a figure with its source or a statement, and fills the rest with slots', () => {
    const outcomes = [
      {
        _id: 'outcome-festival',
        kind: 'festival',
        plainStatement: null,
        figure: { value: '[ Figure ]', label: '[ What it counts ]', source: null },
        program: null,
      },
      {
        _id: 'outcome-gala',
        kind: 'gala',
        plainStatement: '[ What is being measured this year ]',
        figure: null,
        program: null,
      },
      { _id: 'outcome-bare', kind: null, plainStatement: null, figure: null, program: PROGRAMS[2] },
    ];
    const view = buildImpactPage(withData({ outcomes }), options).outcomes;
    expect(view.cards.map((card) => [card.title, card.figure, card.line, card.pending])).toEqual([
      ['Odunde Festival', '[ Figure ]', '[ What it counts ]', OUTCOME_PENDING],
      ['End-of-Year Gala', undefined, '[ What is being measured this year ]', OUTCOME_PENDING],
      ['Kids & STEM', undefined, undefined, OUTCOME_PENDING],
      // Three outcomes leave one slot: the first prototype subject none of them names.
      ['Yoruba Language Lessons', undefined, undefined, 'participation figures per program'],
    ]);
    expect(view.sourcePending).toBe('a source line under the figure');
    expect(view.links.map((link) => link.href)).toEqual([
      '/odunde',
      '/gala',
      '/programs#kids',
      '/programs/yoruba-lessons',
    ]);
  });

  it('reads the civic cells from the festival editions, each owed one as its chip', () => {
    const owed = buildImpactPage(seeded, options).civic;
    expect(owed.prose).toHaveLength(1);
    expect(owed.cells).toEqual([
      { label: 'Attendance', value: undefined, note: undefined, pending: 'the attendance figure' },
      {
        label: 'Vendors hosted',
        value: undefined,
        note: undefined,
        pending: 'the number of vendors hosted',
      },
      { label: 'Partners', value: undefined, pending: 'partner and funder names' },
      { label: 'Cost to attend', value: undefined, pending: 'the cost' },
    ]);
    const festivals = [
      { ...seeded.festivals[0], cost: '[ Cost ]' },
      {
        ...seeded.festivals[1],
        attendance: { value: '[ Attendance ]', label: '[ at the festival ]', source: '[ Source ]' },
        vendorsHosted: { value: '[ Vendors ]', label: '[ at the market ]', source: '[ Source ]' },
      },
    ];
    const held = buildImpactPage(withData({ festivals, festivalPartners: 3 }), options).civic.cells;
    expect(held.map((cell) => [cell.label, cell.value])).toEqual([
      ['Attendance', '[ Attendance ]'],
      ['Vendors hosted', '[ Vendors ]'],
      ['Partners', '3'],
      ['Cost to attend', '[ Cost ]'],
    ]);
  });

  it('waits for the three voices in their slots, and carries the six photographs', () => {
    const view = buildImpactPage(seeded, options);
    expect(view.voices.items.map((item) => item.placeholder?.context)).toEqual([
      'lessons',
      'general',
      'festival',
    ]);
    expect(view.voices.pending).toBe('voices with permission to name');
    expect(view.photos.tiles[0]).toMatchObject({ caption: 'Odunde • 2026' });
    expect(view.how.caption).toBe('Àjọṣe • Partners and friends at the table');
    expect(view.how.pending).toBe('your account of the organisation');
  });

  it('names every governance fact owed while the Studio holds no document, EIN, board or address', () => {
    const view = buildImpactPage(seeded, options).governance;
    expect(view.cells).toEqual([
      { label: 'Tax status', value: '501(c)(3)', note: 'Since 1997' },
      { label: 'EIN', value: undefined, pending: 'EIN' },
      { label: 'Board', value: undefined, pending: "the board's names, roles and bios" },
      { label: 'Financials', value: undefined, pending: 'the annual report position' },
    ]);
    expect(view.facts.map((fact) => [fact.label, fact.value, fact.pending])).toEqual([
      ['Mailing address', undefined, 'mailing address'],
      ['Form 990', undefined, 'the Form 990 position'],
      ['Annual report', undefined, 'the annual report position'],
      ['Audit', undefined, 'the audit position'],
    ]);
  });

  it('links a filed document with its note, shows a note alone, and asks for one with neither', () => {
    const governance = {
      form990: {
        _id: 'gov-990',
        year: '[ Year ]',
        note: '[ A note ]',
        file: {
          url: 'https://cdn.sanity.io/files/abc/development/990.pdf',
          originalFilename: '990.pdf',
          extension: 'pdf',
        },
      },
      annualReport: {
        _id: 'gov-report',
        year: null,
        note: '[ When the first report comes ]',
        file: null,
      },
      audit: { _id: 'gov-audit', year: null, note: null, file: null },
    };
    const view = buildImpactPage(withData({ governance, boardCount: 2 }), options).governance;
    expect(view.facts.slice(1)).toEqual([
      {
        label: 'Form 990',
        value: 'Form 990, [ Year ]',
        href: 'https://cdn.sanity.io/files/abc/development/990.pdf',
        note: '[ A note ]',
        pending: GOVERNANCE_NOTE_PENDING,
      },
      {
        label: 'Annual report',
        value: '[ When the first report comes ]',
        href: undefined,
        note: undefined,
        pending: GOVERNANCE_NOTE_PENDING,
      },
      {
        label: 'Audit',
        value: undefined,
        href: undefined,
        note: undefined,
        pending: GOVERNANCE_NOTE_PENDING,
      },
    ]);
    expect(view.cells[2]).toEqual({
      label: 'Board',
      value: 'Listed',
      note: 'Our Story',
      noteHref: '/our-story#board',
    });
    expect(view.cells[3]).toEqual({
      label: 'Financials',
      value: 'Not yet published',
      note: '[ When the first report comes ]',
      notePending: undefined,
    });
  });

  it('lists every partner, funders first, and hides the section by its option', () => {
    const partners = [
      { _id: 'p-a', name: '[ A sponsor ]', url: null, kind: 'sponsor', logo: null },
      {
        _id: 'p-b',
        name: '[ A partner ]',
        url: 'https://example.org',
        kind: 'partner',
        logo: null,
      },
      { _id: 'p-c', name: '[ A funder ]', url: null, kind: 'funder', logo: null },
    ];
    const view = buildImpactPage(withData({ partners }), options).partners;
    expect(view.items.map((partner) => partner.name)).toEqual([
      '[ A funder ]',
      '[ A partner ]',
      '[ A sponsor ]',
    ]);
    expect(view.intro).toBe('Everyone who has supported the work.');
    expect(
      buildImpactPage(withData({ layout: { funders: 'hidden' } }), options).partners.shown,
    ).toBe(false);
  });

  it("closes with the partnerships lead's sentence and actions, named once the settings hold them", () => {
    const owed = buildImpactPage(seeded, options).fund;
    expect(owed).toMatchObject({
      title: 'Fund the next year',
      line: 'Our partnerships lead answers',
      linePending: PARTNERSHIPS_RESPONDS_PENDING,
    });
    expect(owed.actions).toEqual([
      { label: 'Sponsor or partner', kind: 'enquiry', enquiryKind: 'sponsor' },
      { label: 'Talk to us', kind: 'enquiry', enquiryKind: 'contact' },
    ]);
    const named = buildImpactPage(
      withData({
        settings: {
          ein: null,
          address: null,
          partnerships: {
            name: '[ Name ]',
            email: 'partners@example.org',
            responds: 'within [ a day ]',
          },
        },
      }),
      options,
    ).fund;
    expect(named.line).toBe('[ Name ], our partnerships lead, answers within [ a day ].');
    expect(named.linePending).toBeUndefined();
    expect(named.actions[1]).toEqual({
      label: 'Write to [ Name ]',
      kind: 'url',
      href: 'mailto:partners@example.org',
    });
  });

  it('puts the edit attributes on the options in draft mode only', () => {
    expect(buildImpactPage(seeded, options).edit.stats).toBeUndefined();
    const draft = buildImpactPage(seeded, { ...options, draft: true });
    for (const option of ['stats', 'outcomes', 'sources', 'funders']) {
      expect(draft.edit[option], option).toContain(`path=layout.${option}`);
    }
    expect(draft.how.photoEdit).toContain('path=howWeWorkImage');
  });
});
