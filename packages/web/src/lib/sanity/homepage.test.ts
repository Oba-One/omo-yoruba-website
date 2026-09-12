import { createImageSet } from '@oy/content/images';
import { describe, expect, it } from 'vitest';
import { buildHomepage, type HomepageData } from './homepage';

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
  stats: [{ _id: 's', value: '29', label: 'years', source: null, asOf: null }],
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
  news: [],
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

describe('buildHomepage', () => {
  it('fills the layout defaults and drives the body attributes from them', () => {
    const view = buildHomepage(data, { imageSet, preview: false, studioUrl: '/admin', now });
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
    const view = buildHomepage(data, { imageSet, preview: false, studioUrl: '/admin', now });
    expect(view.lead.event?._id).toBe('gala-2026');
    expect(view.lead.kind).toBe('gala');
    const february = buildHomepage(data, {
      imageSet,
      preview: false,
      studioUrl: '/admin',
      now: new Date('2027-02-01'),
    });
    expect(february.lead.kind).toBe('festival');
  });

  it('resolves every image to a CDN set carrying its alt', () => {
    const view = buildHomepage(data, { imageSet, preview: false, studioUrl: '/admin', now });
    expect(view.hero.image?.src).toContain('cdn.sanity.io');
    expect(view.hero.image?.alt).toBe('A woman laughs');
    expect(view.programs[0]?.program.image?.height).toBe(170);
    expect(view.tiles[0]?.image?.srcset).toContain('w');
    expect(view.raiseYourHand.doors[0]?.door.image).toBeUndefined();
  });

  it('pads the voices to three Pending cards while none exist', () => {
    const view = buildHomepage(data, { imageSet, preview: false, studioUrl: '/admin', now });
    expect(view.voices).toEqual([undefined, undefined, undefined]);
  });

  it('renders the edit attributes only in draft mode', () => {
    const published = buildHomepage(data, { imageSet, preview: false, studioUrl: '/admin', now });
    expect(published.hero.imageEdit).toBeUndefined();
    expect(published.edit.season).toBeUndefined();
    const draft = buildHomepage(data, { imageSet, preview: true, studioUrl: '/admin', now });
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
    expect(buildHomepage(data, { imageSet, preview: false, studioUrl: '/admin', now }).title).toBe(
      'Yoruba culture, alive in Southern California',
    );
    expect(buildHomepage(null, { imageSet, preview: false, studioUrl: '/admin', now }).title).toBe(
      'Omo Yorùbá of Southern California',
    );
    expect(
      buildHomepage(null, { imageSet, preview: false, studioUrl: '/admin', now }).lead.event,
    ).toBeUndefined();
  });
});
