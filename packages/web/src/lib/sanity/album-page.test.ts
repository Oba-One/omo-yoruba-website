import { createImageSet } from '@oy/content/images';
import { describe, expect, it } from 'vitest';
import { type AlbumPageData, buildAlbumPage } from './album-page';
import { soonNotice } from './gallery-page';

const imageSet = createImageSet({ projectId: 'abc123', dataset: 'development' });
const options = { imageSet, draft: false, studioUrl: '/admin' };
const draft = { ...options, draft: true };

const photo = (key: string, description: string, extra: Record<string, unknown> = {}) => ({
  _key: key,
  _type: 'oyImage' as const,
  alt: description,
  caption: description,
  hotspot: null,
  crop: null,
  asset: { _ref: `image-${key.replace(/-/g, '')}-1100x825-jpg`, _type: 'reference' },
  creditConfirmed: null,
  credit: null,
  ...extra,
});

// End-of-Year Gala 2025 as the seed wrote it: six photographs whose captions are the register's descriptions, the
// credit unconfirmed, no date, the 2025 gala edition.
const seeded = {
  album: {
    _id: 'album-gala-2025',
    title: 'End-of-Year Gala 2025',
    slug: 'gala-2025',
    date: null,
    consentNote: null,
    creditConfirmed: false,
    credit: 'Members and volunteers',
    edition: { year: 2025, kind: 'gala' },
    photos: [
      photo(
        'gala-2025-attendees-group-photo',
        'Three women in gold, green and copper gèlè and lace stand together in the hall',
      ),
      photo(
        'gala-2025-three-friends-selfie',
        'Three women take a selfie in front of the red, silver and green balloon arch',
      ),
      photo(
        'gala-2025-attendees-smiling',
        'Two women and a man in dark aṣọ òkè smile at their table',
      ),
    ],
  },
  page: {
    header: { kicker: { yo: 'Àwòrán', en: 'Photographs' } },
    creditsAndConsent: null,
    layout: { captions: 'always' },
  },
  settings: { generalEmail: null },
} as unknown as AlbumPageData;

const withAlbum = (patch: Record<string, unknown>) =>
  ({ ...seeded, album: { ...seeded.album, ...patch } }) as AlbumPageData;

describe('buildAlbumPage', () => {
  it("heads the page with the gallery's kicker, the album's title and its count, the year from the title", () => {
    const page = buildAlbumPage(seeded, options, null);
    expect(page.found).toBe(true);
    expect(page.title).toBe('End-of-Year Gala 2025');
    expect(page.description).toBe('End-of-Year Gala 2025: 3 photographs.');
    expect(page.header).toMatchObject({
      variant: 'slim',
      kicker: { yo: 'Àwòrán', en: 'Photographs' },
      title: 'End-of-Year Gala 2025',
      facts: [{ text: '3 photographs' }],
    });
  });

  it("puts the edition's year, or the year's chip, before the count", () => {
    const dated = buildAlbumPage(withAlbum({ title: 'End-of-Year Gala' }), options, null);
    expect(dated.header.facts).toEqual([{ text: '2025' }, { text: '3 photographs' }]);
    const camp = buildAlbumPage(withAlbum({ title: 'Summer camp', edition: null }), options, null);
    expect(camp.header.facts).toEqual([
      { pending: 'the year of the album' },
      { text: '3 photographs' },
    ]);
  });

  it("links back to the gallery and to the edition's page", () => {
    expect(buildAlbumPage(seeded, options, null).links).toEqual({
      gallery: { label: 'All albums', href: '/gallery' },
      edition: { label: 'End-of-Year Gala', href: '/gala' },
    });
    const festival = buildAlbumPage(
      withAlbum({ edition: { year: 2026, kind: 'festival' } }),
      options,
      null,
    );
    expect(festival.links.edition).toEqual({ label: 'Odunde Festival', href: '/odunde' });
    expect(
      buildAlbumPage(withAlbum({ edition: null }), options, null).links.edition,
    ).toBeUndefined();
  });

  it('names the credit with its chip until confirmed, and shows a consent note only when written', () => {
    const page = buildAlbumPage(seeded, options, null);
    expect(page.credit).toMatchObject({
      credit: 'Members and volunteers',
      confirmed: false,
      pending: 'photographer credit to confirm',
    });
    expect(page.consentNote).toBeUndefined();
    const noted = buildAlbumPage(
      withAlbum({ consentNote: 'Faces of children are blurred.' }),
      options,
      null,
    );
    expect(noted.consentNote).toBe('Faces of children are blurred.');
  });

  it('links every photograph to its address, leaving the tile alt empty beside a caption that says the same', () => {
    const { photos } = buildAlbumPage(seeded, options, null);
    expect(photos.tiles.map((tile) => tile.href)).toEqual([
      '/gallery/gala-2025?photo=gala-2025-attendees-group-photo',
      '/gallery/gala-2025?photo=gala-2025-three-friends-selfie',
      '/gallery/gala-2025?photo=gala-2025-attendees-smiling',
    ]);
    expect(photos.tiles[0]?.image?.alt).toBe('');
    expect(photos.tiles[0]?.caption).toBe(
      'Three women in gold, green and copper gèlè and lace stand together in the hall',
    );
    const described = buildAlbumPage(
      withAlbum({
        photos: [
          photo('gala-2025-group-photo', 'Six guests stand arm in arm', {
            caption: 'Friends and members • Gala 2025',
          }),
        ],
      }),
      options,
      null,
    );
    expect(described.photos.tiles[0]?.image?.alt).toBe('Six guests stand arm in arm');
    // Cropped to the tile's band at the CDN around the hotspot, so no tile carries the whole frame's pixels.
    expect(photos.tiles[0]?.image).toMatchObject({ width: 360, height: 203 });
    expect(photos.tiles[0]?.image?.src).toContain('fit=crop');
    // The first photograph is the page's largest paint, fetched at once and first.
    expect(photos.priority).toBe(true);
    expect(photos.pending).toBe('the photographs');
  });

  it("gives the Lightbox every photograph at its width with its alt, caption and the album's credit", () => {
    const { lightbox } = buildAlbumPage(seeded, options, null);
    expect(lightbox).toMatchObject({
      id: 'album-lightbox',
      label: 'End-of-Year Gala 2025',
      albumHref: '/gallery/gala-2025',
      album: 'gala-2025',
      openKey: undefined,
    });
    expect(lightbox.photos[0]).toMatchObject({
      key: 'gala-2025-attendees-group-photo',
      alt: 'Three women in gold, green and copper gèlè and lace stand together in the hall',
      credit: 'Members and volunteers',
      confirmed: false,
      creditPending: 'photographer credit to confirm',
    });
    expect(lightbox.photos[0]?.image?.src).toContain('w=1024');
  });

  it("names a photograph's own credit apart, with its own chip", () => {
    const page = buildAlbumPage(
      withAlbum({
        creditConfirmed: true,
        photos: [
          photo('gala-2025-group-photo', 'Six guests', {
            credit: 'A guest',
            creditConfirmed: null,
          }),
        ],
      }),
      options,
      null,
    );
    expect(page.lightbox.photos[0]).toMatchObject({
      credit: 'A guest',
      confirmed: false,
      creditPending: "a photograph's own credit to confirm",
    });
    expect(page.credit.confirmed).toBe(true);
  });

  it("links a credit to its photographer's page, a photograph's own only through its own (ADR 0046)", () => {
    const channel = 'https://www.youtube.com/@redcarpetfilmshollywood';
    const page = buildAlbumPage(
      withAlbum({
        creditUrl: channel,
        photos: [
          photo('gala-2025-attendees-group-photo', 'Three women'),
          photo('gala-2025-group-photo', 'Six guests', { credit: 'A guest', creditUrl: null }),
          photo('gala-2025-attendees-smiling', 'Two women and a man', {
            credit: 'Another photographer',
            creditUrl: 'https://example.org/another-photographer',
          }),
        ],
      }),
      options,
      null,
    );
    expect(page.credit.creditHref).toBe(channel);
    expect(page.lightbox.photos.map((each) => each.creditHref)).toEqual([
      channel,
      undefined,
      'https://example.org/another-photographer',
    ]);
    expect(buildAlbumPage(seeded, options, null).credit.creditHref).toBeUndefined();
  });

  it('serves the Lightbox open on a photo address the album holds, and nothing open for any other', () => {
    const open = buildAlbumPage(seeded, options, 'gala-2025-three-friends-selfie');
    expect(open.lightbox.openKey).toBe('gala-2025-three-friends-selfie');
    // Nothing behind the Lightbox loads before the photograph on screen.
    expect(open.photos.priority).toBe(false);
    expect(
      buildAlbumPage(seeded, options, 'a-removed-photograph').lightbox.openKey,
    ).toBeUndefined();
    expect(buildAlbumPage(seeded, options, '').lightbox.openKey).toBeUndefined();
  });

  it('keeps every photograph off the page while the gallery holds the albums, a photo address included (R01)', () => {
    const held = {
      ...seeded,
      page: { ...seeded.page, layout: { captions: 'always', state: 'soon' } },
    } as AlbumPageData;
    const page = buildAlbumPage(held, options, 'gala-2025-three-friends-selfie');
    expect(page.found).toBe(true);
    expect(page.photos.tiles).toEqual([]);
    expect(page.lightbox.photos).toEqual([]);
    expect(page.lightbox.openKey).toBeUndefined();
    // The title and the year stay; no count of photographs the page does not show.
    expect(page.header.title).toBe('End-of-Year Gala 2025');
    expect(page.header.facts).toEqual([]);
    const untitled = {
      ...held,
      album: { ...held.album, title: 'End-of-Year Gala' },
    } as AlbumPageData;
    expect(buildAlbumPage(untitled, options, null).header.facts).toEqual([{ text: '2025' }]);
    // Still described, so the page keeps its meta description, without the count.
    expect(page.description).toBe(`End-of-Year Gala 2025. ${soonNotice().text}`);
    expect(page.soon).toMatchObject(soonNotice());
    expect(buildAlbumPage(held, draft, null).soon?.edit).toContain(
      'id=galleryPage;type=galleryPage;path=layout.state',
    );
    expect(buildAlbumPage(seeded, options, null).soon).toBeUndefined();
  });

  it('keeps stega out of keys, addresses and comparisons', () => {
    const tail = '\u200B\u200C\u200D\uFEFF';
    const page = buildAlbumPage(
      withAlbum({
        title: `End-of-Year Gala 2025${tail}`,
        slug: `gala-2025${tail}`,
        photos: [
          photo(`gala-2025-group-photo${tail}`, 'Six guests', { caption: `Six guests${tail}` }),
        ],
      }),
      options,
      'gala-2025-group-photo',
    );
    expect(page.lightbox.albumHref).toBe('/gallery/gala-2025');
    expect(page.lightbox.openKey).toBe('gala-2025-group-photo');
    expect(page.photos.tiles[0]?.href).toBe('/gallery/gala-2025?photo=gala-2025-group-photo');
    expect(page.photos.tiles[0]?.image?.alt).toBe('');
    expect(page.title).toBe('End-of-Year Gala 2025');
    expect(page.header.facts).toEqual([{ text: '1 photograph' }]);
  });

  it("reads the gallery's captions option and the credits section, owed while empty", () => {
    const page = buildAlbumPage(
      { ...seeded, page: { ...seeded.page, layout: { captions: 'hover' } } } as AlbumPageData,
      options,
      null,
    );
    expect(page.root).toEqual({ captions: 'hover' });
    expect(page.photos.captions).toBe('hover');
    expect(page.credits.rows.map((row) => row.label)).toEqual([
      'Credits',
      'Consent policy',
      'Removal requests',
    ]);
  });

  it('answers not found for no album, and the Pending page for a failed read', () => {
    const missing = buildAlbumPage({ ...seeded, album: null } as AlbumPageData, options, null);
    expect(missing.found).toBe(false);
    const failed = buildAlbumPage(null, options, null);
    expect(failed.found).toBe(false);
    expect(failed.title).toBe('Photographs');
    // The page's words never stand in for the Studio's: no kicker read, none shown, as on the gallery.
    expect(failed.header.kicker).toBeUndefined();
    expect(failed.photos.tiles).toEqual([]);
    expect(failed.lightbox.photos).toEqual([]);
  });

  it('reaches every photograph, the credit and the captions option from click-to-edit in draft mode', () => {
    const page = buildAlbumPage(seeded, draft, null);
    const photograph = 'id=album-gala-2025;type=album;path=photos:gala-2025-attendees-group-photo;';
    expect(page.photos.tiles[0]?.edit).toContain(photograph);
    // The Lightbox's photograph opens the same field, since a photo address covers the tiles.
    expect(page.lightbox.photos[0]?.edit).toContain(photograph);
    expect(page.credit.edit).toContain('id=album-gala-2025;type=album;path=credit');
    expect(page.consentEdit).toContain('id=album-gala-2025;type=album;path=consentNote');
    expect(page.photos.edit).toContain('id=galleryPage;type=galleryPage;path=layout.captions');
    const published = buildAlbumPage(seeded, options, null);
    expect(published.photos.tiles[0]?.edit).toBeUndefined();
    expect(published.lightbox.photos[0]?.edit).toBeUndefined();
    expect(published.credit.edit).toBeUndefined();
    expect(buildAlbumPage(null, draft, null).credit.edit).toBeUndefined();
  });
});

// The album's videos (ADR 0050) play from YouTube once a visitor presses play. Two ids made up for the fixtures.
describe('buildAlbumPage, the videos', () => {
  const channel = 'https://www.youtube.com/@redcarpetfilmshollywood';
  const video = (key: string, id: string, extra: Record<string, unknown> = {}) => ({
    _key: key,
    title: `Odunde 2026 ${key}`,
    url: `https://youtu.be/${id}`,
    still: null,
    credit: null,
    creditUrl: null,
    ...extra,
  });
  /** A video's own still: a plain image, with neither alt text nor caption. */
  const still = (name: string) => ({
    _type: 'image' as const,
    hotspot: null,
    crop: null,
    asset: { _ref: `image-${name}-1100x825-jpg`, _type: 'reference' as const },
  });
  const highlights = video('highlights', 'AbC_dEf-123', {
    credit: 'Red Carpet Films',
    creditUrl: channel,
  });
  const teaser = video('teaser', 'ZyX_wVu-987', { still: still('teaserstill') });
  const withVideos = (patch: Record<string, unknown> = {}) =>
    withAlbum({ videos: [highlights, teaser], ...patch });

  it('hands the page every video, in order, each with the addresses made from its id', () => {
    const { items } = buildAlbumPage(withVideos(), options, null).videos;
    expect(items.map((each) => each.key)).toEqual(['highlights', 'teaser']);
    expect(items[0]).toMatchObject({
      title: 'Odunde 2026 highlights',
      watchHref: 'https://www.youtube.com/watch?v=AbC_dEf-123',
      embedSrc: 'https://www.youtube-nocookie.com/embed/AbC_dEf-123?autoplay=1&rel=0',
      credit: 'Red Carpet Films',
      creditHref: channel,
    });
    expect(items[1]?.credit).toBeUndefined();
  });

  it("shows each video's own still, else the album's cover, else its first photograph, framed 16:9", () => {
    const cover = photo('cover', 'The procession');
    const [first, second] = buildAlbumPage(withVideos({ cover }), options, null).videos.items;
    expect(first?.still?.src).toContain('/cover-1100x825.jpg');
    expect(second?.still?.src).toContain('/teaserstill-1100x825.jpg');
    expect(first?.still).toMatchObject({ width: 720, height: 405 });
    expect(first?.still?.src).toContain('fit=crop');
    // No cover: the first photograph of the album.
    const [uncovered] = buildAlbumPage(withVideos({ cover: null }), options, null).videos.items;
    expect(uncovered?.still?.src).toContain('/gala2025attendeesgroupphoto-1100x825.jpg');
  });

  it('has no video for an album that holds none, and leaves out one that names no YouTube video', () => {
    expect(buildAlbumPage(seeded, options, null).videos.items).toEqual([]);
    expect(buildAlbumPage(withVideos({ videos: null }), options, null).videos.items).toEqual([]);
    const page = buildAlbumPage(
      withVideos({
        videos: [
          highlights,
          video('channel', 'AbC_dEf-123', { url: channel }),
          { ...teaser, title: null },
        ],
      }),
      options,
      null,
    );
    expect(page.videos.items.map((each) => each.key)).toEqual(['highlights']);
    expect(buildAlbumPage(null, options, null).videos.items).toEqual([]);
  });

  it('keeps every video off the page while the gallery holds the albums (R01)', () => {
    const held = {
      ...withVideos(),
      page: { ...seeded.page, layout: { captions: 'always', state: 'soon' } },
    } as AlbumPageData;
    expect(buildAlbumPage(held, options, null).videos).toEqual({ items: [], priority: false });
    expect(buildAlbumPage(withVideos(), options, null).videos.items).toHaveLength(2);
  });

  it('keeps stega out of the keys and the addresses', () => {
    const tail = '\u200B\u200C\u200D\uFEFF';
    const { items } = buildAlbumPage(
      withVideos({
        videos: [
          video(`highlights${tail}`, 'AbC_dEf-123', { url: `https://youtu.be/AbC_dEf-123${tail}` }),
        ],
      }),
      draft,
      null,
    ).videos;
    expect(items[0]?.key).toBe('highlights');
    expect(items[0]?.watchHref).toBe('https://www.youtube.com/watch?v=AbC_dEf-123');
    expect(items[0]?.edit).toContain('path=videos:highlights;');
  });

  it('reaches every video from click-to-edit in draft mode, and carries no attribute otherwise', () => {
    const { items } = buildAlbumPage(withVideos(), draft, null).videos;
    expect(items[0]?.edit).toContain('id=album-gala-2025;type=album;path=videos:highlights;');
    expect(items[1]?.edit).toContain('id=album-gala-2025;type=album;path=videos:teaser;');
    const published = buildAlbumPage(withVideos(), options, null);
    expect(published.videos.items.map((each) => each.edit)).toEqual([undefined, undefined]);
  });

  // Only one image on the page asks to be fetched at once and first: the first video's still, which sits above the
  // photographs, else the first photograph, and neither while a photograph is served open over the page.
  it("asks for the first video's still at once and first, and leaves the photographs to load lazily", () => {
    const page = buildAlbumPage(withVideos(), options, null);
    expect(page.videos.priority).toBe(true);
    expect(page.photos.priority).toBe(false);
  });

  it('asks for the first photograph instead when no video shows, or none has a still', () => {
    const bare = buildAlbumPage(seeded, options, null);
    expect(bare.videos).toEqual({ items: [], priority: false });
    expect(bare.photos.priority).toBe(true);
    // A video whose album holds no cover and no photograph has no image to fetch: nothing above the grid asks.
    const stillless = buildAlbumPage(
      withVideos({ cover: null, photos: [], videos: [highlights] }),
      options,
      null,
    );
    expect(stillless.videos.items).toHaveLength(1);
    expect(stillless.videos.items[0]?.still).toBeUndefined();
    expect(stillless.videos.priority).toBe(false);
  });

  it('asks for neither while a photograph is served open: the Lightbox holds the largest paint', () => {
    const open = buildAlbumPage(withVideos(), options, 'gala-2025-three-friends-selfie');
    expect(open.lightbox.openKey).toBe('gala-2025-three-friends-selfie');
    expect(open.videos.priority).toBe(false);
    expect(open.photos.priority).toBe(false);
  });
});
