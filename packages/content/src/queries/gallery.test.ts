import { evaluate, parse } from 'groq-js';
import { describe, expect, it } from 'vitest';
import type { AlbumPageQueryResult } from '../sanity.types';
import { festivalPageQuery, galaPageQuery } from './event-pages';
import { albumPageQuery } from './gallery';

// The consent hold (ADR 0043) is decided from the gallery's `state`, so every query behind a page that shows
// photographs through an album must read it; a builder given no `state` shows the albums.
describe('the queries the consent hold reads', () => {
  it("reads the gallery's state on an album page", () => {
    const page = albumPageQuery.slice(albumPageQuery.indexOf('"page": *[_type == "galleryPage"'));
    expect(page).toContain('layout{captions, state}');
  });

  it("reads the gallery's state on both event pages, whose past years show an album", () => {
    for (const query of [festivalPageQuery, galaPageQuery]) {
      expect(query).toContain(
        '"galleryLayout": *[_type == "galleryPage" && _id == "galleryPage"][0].layout{state}',
      );
    }
  });
});

// The credit's name links to the photographer's page (ADR 0046): the album's through the photographer it names, a
// photograph's own only when that credit names a photographer, and a written credit never.
describe("the credit's link", () => {
  const channel = 'https://www.youtube.com/@redcarpetfilmshollywood';
  const own = 'https://example.org/a-guest';
  const reference = (id: string) => ({ _type: 'reference', _ref: id });
  const dataset = [
    {
      _id: 'photographer-red-carpet',
      _type: 'photographer',
      name: 'Red Carpet Films',
      defaultCredit: 'Red Carpet Films',
      url: channel,
    },
    { _id: 'photographer-guest', _type: 'photographer', name: 'A guest', url: own },
    { _id: 'photographer-unnamed', _type: 'photographer', url: 'https://example.org/unnamed' },
    {
      _id: 'album-odunde-2026',
      _type: 'album',
      title: 'Odunde 2026',
      slug: { _type: 'slug', current: 'odunde-2026' },
      credit: reference('photographer-red-carpet'),
      photos: [
        { _key: 'album-credit', _type: 'oyImage' },
        { _key: 'own-photographer', _type: 'oyImage', credit: reference('photographer-guest') },
        { _key: 'own-words', _type: 'oyImage', creditNote: 'A member' },
        // A photographer written through the API without a name: the note shows, and it links nowhere.
        {
          _key: 'unnamed-photographer',
          _type: 'oyImage',
          credit: reference('photographer-unnamed'),
          creditNote: 'A member',
        },
      ],
    },
  ];

  it("reads the album's link and a photograph's own photographer's, never one for written words", async () => {
    const result = (await (
      await evaluate(parse(albumPageQuery), { dataset, params: { slug: 'odunde-2026' } })
    ).get()) as AlbumPageQueryResult;
    expect(result.album).toMatchObject({ credit: 'Red Carpet Films', creditUrl: channel });
    expect(result.album?.photos?.map(({ credit, creditUrl }) => ({ credit, creditUrl }))).toEqual([
      { credit: null, creditUrl: null },
      { credit: 'A guest', creditUrl: own },
      { credit: 'A member', creditUrl: null },
      { credit: 'A member', creditUrl: null },
    ]);
  });
});

// An album's videos (ADR 0050) come with the cover their stills fall back to, on the album page and in the past
// years of both event pages alike. The query hands over the stored address: the site reads the id from it.
describe("an album's videos", () => {
  const channel = 'https://www.youtube.com/@redcarpetfilmshollywood';
  const reference = (id: string) => ({ _type: 'reference', _ref: id });
  const asset = { _type: 'reference', _ref: 'image-0a1b2c3d4e5f-1600x900-jpg' };
  const highlights = {
    _key: 'highlights',
    _type: 'video',
    title: 'Highlights',
    url: 'https://youtu.be/AbC_dEf-123',
    still: { _type: 'image', asset },
    credit: reference('photographer-red-carpet'),
  };
  const teaser = {
    _key: 'teaser',
    _type: 'video',
    title: 'Teaser',
    url: 'https://www.youtube.com/watch?v=ZyX_wVu-987',
  };
  const album = {
    _id: 'album-odunde-2026',
    _type: 'album',
    _createdAt: '2026-10-01T00:00:00Z',
    title: 'Odunde 2026',
    slug: { _type: 'slug', current: 'odunde-2026' },
    event: reference('event-odunde-2026'),
    cover: { _type: 'oyImage', alt: 'The procession', asset },
    photos: [{ _key: 'first', _type: 'oyImage', alt: 'A dancer', asset }],
    videos: [highlights, teaser],
  };
  const dataset = [
    {
      _id: 'photographer-red-carpet',
      _type: 'photographer',
      name: 'Red Carpet Films',
      defaultCredit: 'Red Carpet Films',
      url: channel,
    },
    { _id: 'event-odunde-2026', _type: 'event', kind: 'festival', edition: 2026 },
    { _id: 'event-gala-2025', _type: 'event', kind: 'gala', edition: 2025 },
    { _id: 'festivalPage', _type: 'festivalPage' },
    { _id: 'galaPage', _type: 'galaPage' },
    album,
    {
      ...album,
      _id: 'album-gala-2025',
      slug: { _type: 'slug', current: 'gala-2025' },
      event: reference('event-gala-2025'),
    },
  ];
  const videosRead = [
    {
      _key: 'highlights',
      title: 'Highlights',
      url: 'https://youtu.be/AbC_dEf-123',
      still: { _type: 'image', hotspot: null, crop: null, asset },
      credit: 'Red Carpet Films',
      creditUrl: channel,
    },
    {
      _key: 'teaser',
      title: 'Teaser',
      url: 'https://www.youtube.com/watch?v=ZyX_wVu-987',
      still: null,
      credit: null,
      creditUrl: null,
    },
  ];

  it("reads an album page's cover and its videos in order, with each still, maker and link", async () => {
    const result = (await (
      await evaluate(parse(albumPageQuery), { dataset, params: { slug: 'odunde-2026' } })
    ).get()) as AlbumPageQueryResult;
    expect(result.album?.videos).toEqual(videosRead);
    expect(result.album?.cover).toEqual({
      _type: 'oyImage',
      alt: 'The procession',
      caption: null,
      hotspot: null,
      crop: null,
      asset,
    });
  });

  it('answers no videos and no cover for an album that holds neither', async () => {
    const bare = dataset.map((doc) =>
      doc._id === 'album-odunde-2026' ? { ...doc, cover: undefined, videos: undefined } : doc,
    );
    const result = (await (
      await evaluate(parse(albumPageQuery), { dataset: bare, params: { slug: 'odunde-2026' } })
    ).get()) as AlbumPageQueryResult;
    expect(result.album?.videos).toBeNull();
    expect(result.album?.cover).toBeNull();
  });

  it("reads the same videos and cover from the album of an edition's past years, on both event pages", async () => {
    for (const [query, year] of [
      [festivalPageQuery, 2026],
      [galaPageQuery, 2025],
    ] as const) {
      const result = (await (await evaluate(parse(query), { dataset })).get()) as {
        editions: { edition: number; album: { videos: unknown; cover: { alt: string } } | null }[];
      };
      const edition = result.editions.find((each) => each.edition === year);
      expect(edition?.album?.videos, String(year)).toEqual(videosRead);
      expect(edition?.album?.cover.alt, String(year)).toBe('The procession');
    }
  });
});
