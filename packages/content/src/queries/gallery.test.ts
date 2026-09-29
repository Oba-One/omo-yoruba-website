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
