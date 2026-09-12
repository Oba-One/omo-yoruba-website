import { createImageSet } from '@oy/content/images';
import { HOMEPAGE_VOICE_SLOTS } from '@oy/content/pending';
import { describe, expect, it } from 'vitest';
import { buildHomepage, type HomepageData, newsHref } from './homepage';

const imageSet = createImageSet({ projectId: 'abc123', dataset: 'development' });
const image = (alt: string) => ({
  _type: 'oyImage' as const,
  alt,
  caption: null,
  hotspot: null,
  crop: null,
  asset: { _ref: 'image-0a1b2c3d-1100x728-jpg', _type: 'reference' as const },
});
const now = new Date('2026-09-12T12:00:00Z');

const data = {
  hero: {
    kicker: { yo: 'Ẹ káàbọ̀', en: 'Welcome' },
    title: 'Yoruba culture, alive in Southern California',
    emphasis: 'alive',
    sub: 'Language, festival, family. Since 1997.',
    blessing: { yo: 'Oòdúà á gbè wá o!', en: 'May Odùduwà bless us' },
    image: image('A woman laughs'),
    primaryAction: {
      label: 'See the Odunde Festival',
      kind: 'url',
      enquiryKind: null,
      href: '/odunde',
      newTab: null,
    },
    secondaryActions: [],
  },
  leadEvent: null,
  events: [
    {
      _id: 'odunde-2027',
      kind: 'festival',
      title: 'Odunde Festival 2027',
      edition: 2027,
      start: null,
      end: null,
      venueName: 'Leimert Park',
      summary: null,
    },
    {
      _id: 'gala-2026',
      kind: 'gala',
      title: 'End-of-Year Gala 2026',
      edition: 2026,
      start: null,
      end: null,
      venueName: null,
      summary: null,
    },
  ],
  stats: [
    {
      _id: 's',
      value: '29',
      label: 'years serving Southern California',
      shortLabel: 'years serving SoCal',
      source: null,
      asOf: null,
    },
    { _id: 't', value: '9', label: 'hometown associations', shortLabel: null, source: null },
  ],
  programsIntro: null,
  programs: [
    {
      _id: 'program-lessons',
      name: 'Lessons',
      slug: 'yoruba-lessons',
      kicker: null,
      blurb: null,
      image: image('Lesson'),
      cadence: null,
      ages: null,
      page: 'lessons',
      action: null,
    },
  ],
  voices: null,
  voicesIntro: null,
  voicesProverb: null,
  newsIntro: null,
  news: [
    {
      _id: 'gala',
      title: 'End-of-Year Gala',
      slug: 'gala',
      date: '2026-11-01',
      summary: null,
      image: null,
      tags: [{ _type: 'event', kind: 'gala', page: null }],
    },
    {
      _id: 'recap',
      title: 'Odunde 2026: the recap',
      slug: 'recap',
      date: '2026-07-01',
      summary: null,
      image: null,
      tags: [{ _type: 'event', kind: 'festival', page: null }],
    },
    {
      _id: 'fall',
      title: 'Language Lessons fall term',
      slug: 'fall',
      date: '2026-08-01',
      summary: null,
      image: null,
      tags: null,
    },
  ],
  yearInLife: [
    {
      _key: 'tile-1',
      _type: 'oyImage',
      alt: 'Dance',
      caption: 'Ọdúndé • Festival day',
      hotspot: null,
      crop: null,
      asset: { _ref: 'image-0a1b2c3d-1100x728-jpg', _type: 'reference' },
    },
  ],
  raiseYourHand: {
    title: 'Raise your hand',
    blurb: null,
    doors: [
      {
        _id: 'door-member',
        key: 'member',
        title: 'Become a member',
        blurb: null,
        bullets: null,
        action: null,
        image: null,
      },
    ],
  },
  layout: {
    season: null,
    highlight: 'school',
    gallery: '3',
    involved: null,
    newsletter: 'band',
    pattern: null,
    motion: 'off',
  },
  seo: null,
} as unknown as HomepageData;

describe('newsHref', () => {
  it('opens the page of the first tag that has one', () => {
    expect(newsHref([{ _type: 'event', kind: 'festival' }])).toBe('/odunde');
    expect(newsHref([{ _type: 'event', kind: 'gala' }])).toBe('/gala');
    expect(newsHref([{ _type: 'program', page: 'lessons' }])).toBe('/programs/yoruba-lessons');
    expect(newsHref([{ _type: 'program', page: null }])).toBe('/programs');
    expect(
      newsHref([{ _type: 'event', kind: 'other' }, null, { _type: 'event', kind: 'gala' }]),
    ).toBe('/gala');
    expect(newsHref(null)).toBeUndefined();
    expect(newsHref([{ _type: 'event', kind: 'other' }])).toBeUndefined();
  });
});

describe('buildHomepage', () => {
  it('fills the layout defaults and drives the body attributes from them', () => {
    const view = buildHomepage(data, { imageSet, draft: false, studioUrl: '/admin', now });
    expect(view.layout).toEqual({
      season: 'auto',
      highlight: 'school',
      gallery: '3',
      involved: 'doors',
      newsletter: 'band',
      pattern: 'rich',
      motion: 'off',
    });
    expect(view.root).toEqual({
      highlight: 'school',
      pattern: 'rich',
      motion: 'false',
      season: 'auto',
      involved: 'doors',
      newsletter: 'band',
      gallery: '3',
    });
    expect(view.hero.motion).toBe(false);
  });

  it('picks the lead edition with the season rule: the Gala in September when nothing is dated', () => {
    const view = buildHomepage(data, { imageSet, draft: false, studioUrl: '/admin', now });
    expect(view.lead.event?._id).toBe('gala-2026');
    expect(view.lead.kind).toBe('gala');
    const february = buildHomepage(data, {
      imageSet,
      draft: false,
      studioUrl: '/admin',
      now: new Date('2027-02-01'),
    });
    expect(february.lead.kind).toBe('festival');
  });

  it('resolves every image to a CDN set carrying its alt, uncropped, with the hotspot framing', () => {
    const view = buildHomepage(data, { imageSet, draft: false, studioUrl: '/admin', now });
    expect(view.hero.image?.src).toContain('cdn.sanity.io');
    expect(view.hero.image?.alt).toBe('A woman laughs');
    // The card crops with object-fit, so the CDN keeps the photo's own ratio (1100 by 728).
    expect(view.programs[0]?.program.image).toMatchObject({ width: 360, height: 238 });
    expect(view.programs[0]?.program.image?.src).not.toContain('fit=crop');
    expect(view.tiles[0]?.image?.srcset).toContain('w');
    expect(view.raiseYourHand.doors[0]?.door.image).toBeUndefined();
    const framed = {
      ...data,
      hero: { ...data.hero, image: { ...image('Framed'), hotspot: { x: 0.35, y: 0.35 } } },
    } as HomepageData;
    expect(
      buildHomepage(framed, { imageSet, draft: false, studioUrl: '/admin', now }).hero.image
        ?.position,
    ).toBe('35% 35%');
  });

  it('sets the gold words and swaps the gold button for the highlighted program action', () => {
    const view = buildHomepage(data, { imageSet, draft: false, studioUrl: '/admin', now });
    expect(view.hero.emphasis).toBe('alive');
    // The Lessons card has no action yet, so the hero keeps its own.
    expect(view.hero.primary?.label).toBe('See the Odunde Festival');
    const enrol = { label: 'Enrol a learner', kind: 'url', href: '/programs/yoruba-lessons' };
    const withAction = {
      ...data,
      programs: data.programs?.map((program) => ({ ...program, action: enrol })),
    } as HomepageData;
    const school = buildHomepage(withAction, { imageSet, draft: false, studioUrl: '/admin', now });
    expect(school.hero.primary?.label).toBe('Enrol a learner');
    const festival = buildHomepage(
      { ...withAction, layout: { ...data.layout, highlight: 'festival' } } as HomepageData,
      { imageSet, draft: false, studioUrl: '/admin', now },
    );
    expect(festival.hero.primary?.label).toBe('See the Odunde Festival');
    // A half-filled action (an enquiry with no form chosen yet) never removes the gold button.
    const half = {
      ...data,
      programs: data.programs?.map((program) => ({
        ...program,
        action: { label: 'Enrol a learner', kind: 'enquiry', enquiryKind: null },
      })),
    } as HomepageData;
    expect(
      buildHomepage(half, { imageSet, draft: false, studioUrl: '/admin', now }).hero.primary?.label,
    ).toBe('See the Odunde Festival');
  });

  it('shows the first three programs and lets the highlight reach any of them', () => {
    const program = (order: number, page: string | null) => ({
      _id: `program-${order}`,
      name: `Program ${order}`,
      slug: `program-${order}`,
      kicker: null,
      blurb: null,
      image: null,
      cadence: null,
      ages: null,
      page,
      action: { label: `Action ${order}`, kind: 'url', href: `/p/${order}` },
    });
    const four = {
      ...data,
      programs: [
        program(1, null),
        program(2, null),
        program(3, 'collective'),
        program(4, 'lessons'),
      ],
    } as HomepageData;
    const view = buildHomepage(four, { imageSet, draft: false, studioUrl: '/admin', now });
    expect(view.programs.map(({ program }) => program._id)).toEqual([
      'program-1',
      'program-2',
      'program-3',
    ]);
    // Lessons is fourth, off the grid, and the highlight still puts its action in the hero.
    expect(view.hero.primary?.label).toBe('Action 4');
  });

  it('reads the short label into the strip where one is held', () => {
    const view = buildHomepage(data, { imageSet, draft: false, studioUrl: '/admin', now });
    expect(view.stats.map((stat) => stat.label)).toEqual([
      'years serving SoCal',
      'hometown associations',
    ]);
  });

  it('lists the news oldest first with Read more on the page each post is tagged to', () => {
    const view = buildHomepage(data, { imageSet, draft: false, studioUrl: '/admin', now });
    expect(view.news.map(({ post, href }) => [post._id, href])).toEqual([
      ['recap', '/odunde'],
      ['fall', undefined],
      ['gala', '/gala'],
    ]);
  });

  it('pads the voices to the three placeholder slots while fewer exist', () => {
    const view = buildHomepage(data, { imageSet, draft: false, studioUrl: '/admin', now });
    expect(view.voices).toEqual(HOMEPAGE_VOICE_SLOTS.map((placeholder) => ({ placeholder })));
    const withVoice = (context: string | null) =>
      buildHomepage(
        {
          ...data,
          voices: [
            { _id: 'v', quote: 'q', name: null, relation: null, permissionToName: false, context },
          ],
        } as HomepageData,
        { imageSet, draft: false, studioUrl: '/admin', now },
      ).voices;
    const roles = (voices: ReturnType<typeof withVoice>) =>
      voices.map((voice) => voice.testimonial?._id ?? voice.placeholder?.role);
    // A voice from a context no slot names leaves the first two slots open.
    expect(roles(withVoice(null))).toEqual(['v', 'Parent, Language Lessons', 'Elder, Ẹgbẹ́ Ìbílẹ̀']);
    // A vendor's voice fills the vendor's slot, so the page never asks for it again.
    expect(roles(withVoice('festival'))).toEqual([
      'v',
      'Parent, Language Lessons',
      'Elder, Ẹgbẹ́ Ìbílẹ̀',
    ]);
    expect(roles(withVoice('lessons'))).toEqual(['v', 'Elder, Ẹgbẹ́ Ìbílẹ̀', 'Vendor, Ọjà Balógun']);
  });

  it('keeps stega out of the head', () => {
    const stega = 'Yoruba culture\u200B\u200C\u200D\uFEFF\u200B\u200B\u200C\u200D';
    const view = buildHomepage(
      {
        ...data,
        hero: { ...data.hero, title: stega, sub: `Line${'\u200B\u200C'.repeat(4)}` },
      } as HomepageData,
      { imageSet, draft: true, studioUrl: '/admin', now },
    );
    expect(view.title).toBe('Yoruba culture');
    expect(view.description).toBe('Line');
    expect(view.hero.edit).toBe('id=homepage;type=homepage;path=layout.motion;base=%2Fadmin');
  });

  it('renders the edit attributes only in draft mode', () => {
    const published = buildHomepage(data, { imageSet, draft: false, studioUrl: '/admin', now });
    expect(published.hero.imageEdit).toBeUndefined();
    expect(published.edit.season).toBeUndefined();
    const draft = buildHomepage(data, { imageSet, draft: true, studioUrl: '/admin', now });
    expect(draft.hero.imageEdit).toBe('id=homepage;type=homepage;path=hero.image;base=%2Fadmin');
    expect(draft.tiles[0]?.edit).toBe(
      'id=homepage;type=homepage;path=yearInLife:tile-1;base=%2Fadmin',
    );
    expect(draft.programs[0]?.imageEdit).toBe(
      'id=program-lessons;type=program;path=image;base=%2Fadmin',
    );
    expect(draft.edit.gallery).toBe('id=homepage;type=homepage;path=layout.gallery;base=%2Fadmin');
  });

  it('titles the page from the seo field, then the hero, then the organisation', () => {
    expect(buildHomepage(data, { imageSet, draft: false, studioUrl: '/admin', now }).title).toBe(
      'Yoruba culture, alive in Southern California',
    );
    expect(buildHomepage(null, { imageSet, draft: false, studioUrl: '/admin', now }).title).toBe(
      'Omo Yorùbá of Southern California',
    );
    expect(
      buildHomepage(null, { imageSet, draft: false, studioUrl: '/admin', now }).lead.event,
    ).toBeUndefined();
  });
});
