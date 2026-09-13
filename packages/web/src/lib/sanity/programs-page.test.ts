import { createImageSet } from '@oy/content/images';
import { describe, expect, it } from 'vitest';
import { buildProgramsPage, type ProgramsPageData } from './programs-page';

const imageSet = createImageSet({ projectId: 'abc123', dataset: 'development' });
const image = (alt: string) => ({
  _type: 'oyImage' as const,
  alt,
  caption: null,
  hotspot: null,
  crop: null,
  asset: { _ref: 'image-0a1b2c3d-1100x728-jpg', _type: 'reference' as const },
});
const options = { imageSet, draft: false, studioUrl: '/admin' };

const url = (label: string, href: string) => ({
  label,
  kind: 'url',
  enquiryKind: null,
  href,
  newTab: null,
});

// The development dataset as the seed leaves it on 13 September 2026.
const seeded = {
  header: {
    kicker: { yo: 'Ohun tí a ń ṣe', en: 'What we do' },
    title: 'Our programs',
    line: 'What runs through the year, for children, teenagers, and adults, across Los Angeles. Two programs have their own page. The rest are described in full below.',
  },
  primaryAction: {
    label: 'Enrol a learner',
    kind: 'enquiry',
    enquiryKind: 'enrol',
    href: null,
    newTab: null,
  },
  secondaryActions: null,
  takePart: [
    {
      _key: 'way-1',
      way: 'enrol',
      chip: null,
      title: 'Start Yoruba lessons',
      line: 'Online lessons for children and adults, scheduled with the teacher. Write to her to start.',
      label: 'Enrol a learner',
    },
    {
      _key: 'way-2',
      way: 'volunteer',
      chip: 'Volunteer',
      title: 'Help with a program',
      line: 'One form, and we place you.',
      label: 'Volunteer',
    },
    {
      _key: 'way-3',
      way: 'give',
      chip: null,
      title: 'Give toward the programs',
      line: "Gifts hold up the language lessons, the children's programs, and the festival.",
      label: 'Donate',
    },
  ],
  programs: [
    {
      _id: 'program-yoruba-lessons',
      name: 'Yoruba Language Lessons',
      slug: 'yoruba-lessons',
      blurb: 'Speaking, reading, and tone marks, taught over video call by our teacher.',
      image: image('Two women in gèlè listen to the Yoruba lesson'),
      cadence: 'Online, by arrangement',
      ages: null,
      page: 'lessons',
      action: url('Enrol a learner', '/programs/yoruba-lessons'),
    },
    {
      _id: 'program-cultural-collective',
      name: 'Yoruba Cultural Collective',
      slug: 'cultural-collective',
      blurb: 'Members who put culture to work: the Solar Hub, Green Goods, and a circle.',
      image: image('A man in a purple and teal print shirt smiles'),
      cadence: null,
      ages: null,
      page: 'collective',
      action: url('Meet the Collective', '/programs/cultural-collective'),
    },
    {
      _id: 'program-kids-stem',
      name: 'Kids & STEM',
      slug: 'kids-stem',
      blurb: "Àgbàlá Ọmọde, the children's compound, and the STEM Hub.",
      image: image('Children at the craft tables'),
      cadence: null,
      ages: null,
      page: null,
      action: url('See youth programs', '/programs#kids'),
    },
    {
      _id: 'program-cultural-exchange',
      name: 'Cultural Exchange',
      slug: 'cultural-exchange',
      blurb: null,
      image: null,
      cadence: null,
      ages: null,
      page: null,
      action: null,
    },
  ],
  kidsStem: {
    title: 'Kids & STEM',
    blurb: 'Kids & STEM is two things under one name.',
    subprograms: [
      {
        _key: 'sub-1',
        name: 'Àgbàlá Ọmọde',
        blurb: "The children's compound.",
        image: image('A mother and her two children play ayo'),
        facts: [{ _key: 'fact-1', label: 'Ages', value: null, note: null }],
        action: url('See it at Odunde', '/odunde'),
      },
      {
        _key: 'sub-2',
        name: 'STEM Hub',
        blurb: "The technical half of the children's program.",
        image: image('Children build with craft sticks'),
        facts: [
          { _key: 'fact-1', label: 'Ages', value: null, note: null },
          { _key: 'fact-2', label: 'What they build', value: null, note: null },
        ],
        action: {
          label: 'Ask about joining',
          kind: 'enquiry',
          enquiryKind: 'contact',
          href: null,
          newTab: null,
        },
      },
    ],
  },
  culturalExchange: {
    title: 'Cultural Exchange',
    blurb: null,
    cadence: null,
    eligibility: null,
    howToJoin: null,
    image: null,
  },
  yearStrip: [
    {
      _key: 'row-1',
      when: null,
      kind: null,
      note: 'Online, scheduled with the teacher',
      program: 'Yoruba Language Lessons',
    },
    { _key: 'row-2', when: 'June', kind: 'festival', note: 'Leimert Park', program: null },
    { _key: 'row-3', when: 'Nov or Dec', kind: 'gala', note: null, program: null },
    {
      _key: 'row-4',
      when: null,
      kind: null,
      note: 'Àgbàlá Ọmọde runs at the festival',
      program: 'Kids & STEM',
    },
    {
      _key: 'row-5',
      when: null,
      kind: null,
      note: 'Solar Hub, Green Goods',
      program: 'Yoruba Cultural Collective',
    },
  ],
  layout: { cards: 'four', inline: 'expanded', yearstrip: 'shown' },
  seo: null,
} as unknown as ProgramsPageData;

const withLayout = (layout: Record<string, string>) =>
  ({ ...seeded, layout }) as unknown as ProgramsPageData;

describe('buildProgramsPage', () => {
  it('fills the layout defaults and puts every option on the body', () => {
    const view = buildProgramsPage(withLayout({ cards: 'pairs' }), options);
    expect(view.layout).toEqual({ cards: 'pairs', inline: 'expanded', yearstrip: 'shown' });
    expect(view.root).toEqual(view.layout);
    expect(buildProgramsPage(null, options).layout.cards).toBe('four');
  });

  it("draws the slim header from the Studio, its actions and the registry's heading chip", () => {
    const view = buildProgramsPage(seeded, options);
    expect(view.header).toMatchObject({
      variant: 'slim',
      title: 'Our programs',
      titlePending: 'the page heading',
    });
    expect(view.header.actions.map((action) => action.label)).toEqual(['Enrol a learner']);
    expect(view.title).toBe('Our programs');
    expect(view.description).toContain('What runs through the year');
    expect(buildProgramsPage(null, options).title).toBe('Our programs');
  });

  it('shows every program in order, four across or in pairs, and the first three under three', () => {
    const four = buildProgramsPage(seeded, options).cards;
    expect(four.columns).toBe(4);
    expect(four.items.map((card) => card.program._id)).toEqual([
      'program-yoruba-lessons',
      'program-cultural-collective',
      'program-kids-stem',
      'program-cultural-exchange',
    ]);
    const pairs = buildProgramsPage(withLayout({ cards: 'pairs' }), options).cards;
    expect(pairs.columns).toBe(2);
    expect(pairs.items).toHaveLength(4);
    const three = buildProgramsPage(withLayout({ cards: 'three' }), options).cards;
    expect(three.columns).toBe(3);
    expect(three.items.map((card) => card.program._id)).not.toContain('program-cultural-exchange');
    // The prototype's photographs: 160px on four and pairs, 200px on three.
    expect([four.mediaHeight, pairs.mediaHeight, three.mediaHeight]).toEqual([160, 160, 200]);
  });

  it('links a program with a page to it, and an inline program to its section on this page', () => {
    const items = buildProgramsPage(seeded, options).cards.items;
    expect(items.map((card) => card.program.action)).toEqual([
      expect.objectContaining({ label: 'Enrol a learner', href: '/programs/yoruba-lessons' }),
      expect.objectContaining({
        label: 'Meet the Collective',
        href: '/programs/cultural-collective',
      }),
      { label: 'On this page', kind: 'anchor', href: '#kids' },
      { label: 'On this page', kind: 'anchor', href: '#exchange' },
    ]);
  });

  it('resolves the card photographs with their alt, and leaves the missing one to the placeholder', () => {
    const items = buildProgramsPage(seeded, options).cards.items;
    expect(items[0]?.program.image?.src).toContain('cdn.sanity.io');
    expect(items[0]?.program.image?.alt).toBe('Two women in gèlè listen to the Yoruba lesson');
    expect(items[3]?.program.image).toBeUndefined();
    expect(items[0]?.program.cadence).toBe('Online, by arrangement');
    expect(items[0]?.program.ages).toBeNull();
  });

  it('carries the take-part rows with the intro that counts them', () => {
    const view = buildProgramsPage(seeded, options);
    expect(view.takePart.rows.map((row) => row.way)).toEqual(['enrol', 'volunteer', 'give']);
    expect(view.takePart).toMatchObject({
      intro: 'Three ways to be part of the programs.',
      labels: 'column',
      pending: 'the ways in',
      rowPending: 'a way in, its title or its button label',
    });
    const one = buildProgramsPage(
      { ...seeded, takePart: seeded.takePart?.slice(0, 1) } as ProgramsPageData,
      options,
    );
    expect(one.takePart.intro).toBe('One way to be part of the programs.');
    expect(buildProgramsPage(null, options).takePart.intro).toBeUndefined();
  });

  it('carries Kids & STEM: its prose and both halves with their photographs, facts and chips', () => {
    const kids = buildProgramsPage(seeded, options).kids;
    expect(kids).toMatchObject({
      shown: true,
      open: true,
      title: 'Kids & STEM',
      blurb: 'Kids & STEM is two things under one name.',
    });
    expect(kids.subprograms.map((sub) => sub.name)).toEqual(['Àgbàlá Ọmọde', 'STEM Hub']);
    expect(kids.subprograms[0]?.image?.alt).toBe('A mother and her two children play ayo');
    expect(kids.subprograms[1]?.facts).toEqual([
      { _key: 'fact-1', label: 'Ages', value: null, pending: 'ages and what they build' },
      {
        _key: 'fact-2',
        label: 'What they build',
        value: null,
        pending: 'ages and what they build',
      },
    ]);
    expect(kids.subprograms[1]?.action?.enquiryKind).toBe('contact');
    const collapsed = buildProgramsPage(withLayout({ inline: 'collapsed' }), options);
    expect(collapsed.kids.open).toBe(false);
    expect(collapsed.exchange.open).toBe(false);
  });

  it("carries Cultural Exchange's facts, each its own chip while owed, and the photograph's", () => {
    const exchange = buildProgramsPage(seeded, options).exchange;
    expect(exchange).toMatchObject({
      shown: true,
      open: true,
      title: 'Cultural Exchange',
      blurb: undefined,
      blurbPending: 'what the exchange is',
      image: undefined,
      imagePending: 'a photograph of the exchange',
    });
    expect(exchange.facts).toEqual([
      { label: 'Who it is for', value: undefined, pending: 'who it is for' },
      { label: 'Cadence', value: undefined, pending: 'the cadence' },
      { label: 'How to join', value: undefined, pending: 'how to join' },
    ]);
    const written = buildProgramsPage(
      {
        ...seeded,
        culturalExchange: { ...seeded.culturalExchange, cadence: '[ Cadence ]' },
      } as ProgramsPageData,
      options,
    );
    expect(written.exchange.facts[1]?.value).toBe('[ Cadence ]');
  });

  it('hides the section of the program the three cards leave out, and keeps both without programs', () => {
    const three = buildProgramsPage(withLayout({ cards: 'three' }), options);
    expect(three.kids.shown).toBe(true);
    expect(three.exchange.shown).toBe(false);
    const reordered = buildProgramsPage(
      {
        ...seeded,
        layout: { cards: 'three' },
        programs: [seeded.programs[3], seeded.programs[0], seeded.programs[1], seeded.programs[2]],
      } as unknown as ProgramsPageData,
      options,
    );
    expect([reordered.kids.shown, reordered.exchange.shown]).toEqual([false, true]);
    const none = buildProgramsPage(null, options);
    expect([none.kids.shown, none.exchange.shown]).toEqual([true, true]);
    expect(none.kids.subprograms).toEqual([]);
  });

  it("names each year strip row by its program or its event's page, its when or the chip", () => {
    const year = buildProgramsPage(seeded, options).year;
    expect(year).toMatchObject({
      shown: true,
      whenPending: 'when it runs',
      pending: 'when each program runs',
    });
    expect(year.rows.map((row) => [row.when, row.name, row.note])).toEqual([
      [null, 'Yoruba Language Lessons', 'Online, scheduled with the teacher'],
      ['June', 'Odunde Festival', 'Leimert Park'],
      ['Nov or Dec', 'End-of-Year Gala', null],
      [null, 'Kids & STEM', 'Àgbàlá Ọmọde runs at the festival'],
      [null, 'Yoruba Cultural Collective', 'Solar Hub, Green Goods'],
    ]);
    expect(buildProgramsPage(withLayout({ yearstrip: 'hidden' }), options).year.shown).toBe(false);
    expect(buildProgramsPage(null, options).year.rows).toEqual([]);
  });

  it('writes edit attributes only in draft mode', () => {
    expect(buildProgramsPage(seeded, options).edit.cards).toBeUndefined();
    const draft = buildProgramsPage(seeded, { ...options, draft: true });
    expect(draft.edit.cards).toContain('path=layout.cards');
    expect(draft.cards.items[0]?.imageEdit).toContain('id=program-yoruba-lessons;type=program');
    expect(draft.takePart.rows[1]?.edit).toContain('path=takePart:way-2');
    expect(draft.kids.subprograms[0]?.imageEdit).toContain('path=kidsStem.subprograms:sub-1.image');
    expect(draft.exchange.imageEdit).toContain('path=culturalExchange.image');
    expect(draft.edit.inline).toContain('path=layout.inline');
    expect(draft.year.edit).toContain('path=yearStrip');
  });

  it("heads the inline programs with the programs' own names while the Studio holds no title", () => {
    const view = buildProgramsPage(null, options);
    expect(view.kids.title).toBe('Kids & STEM');
    expect(view.exchange.title).toBe('Cultural Exchange');
  });
});
