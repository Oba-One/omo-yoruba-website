import { createImageSet } from '@oy/content/images';
import { describe, expect, it } from 'vitest';
import { type AlbumPageData, buildAlbumPage } from './album-page';

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

// End-of-Year Gala 2025 as the development dataset holds it: six photographs whose captions are the register's
// descriptions, the credit unconfirmed, no date, the 2025 gala edition.
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
