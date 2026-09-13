import { createImageSet } from '@oy/content/images';
import { describe, expect, it } from 'vitest';
import { buildGalleryPage, type GalleryPageData } from './gallery-page';

const imageSet = createImageSet({ projectId: 'abc123', dataset: 'development' });
const options = { imageSet, draft: false, studioUrl: '/admin' };
const draft = { ...options, draft: true };

const image = (ref: string, alt: string) => ({
  _type: 'oyImage' as const,
  alt,
  caption: alt,
  hotspot: null,
  crop: null,
  asset: { _ref: ref, _type: 'reference' },
});

const album = (
  id: string,
  title: string,
  slug: string,
  edition: number | null,
  count: number,
  first: string,
  extra: Record<string, unknown> = {},
) => ({
  _id: `album-${id}`,
  title,
  slug,
  date: null,
  edition,
  cover: image(`image-${id.replace(/-/g, '')}cover-1024x683-jpg`, `The cover of ${title}`),
  first: {
    _key: first,
    ...image(`image-${id.replace(/-/g, '')}first-1024x683-jpg`, `The first photograph of ${title}`),
  },
  count,
  ...extra,
});

// The development dataset as the Phase 8 seed leaves it, in the order the query may answer: the summer camp
// without a year first, the two editions' albums with their years from the editions.
const seeded = {
  header: {
    kicker: { yo: 'Àwòrán', en: 'Photographs' },
    title: 'Photographs',
    line: 'Odunde, the Gala and the summer camp. Open an album and start looking.',
  },
  primaryAction: null,
  secondaryActions: null,
  creditsAndConsent: null,
  albums: [
    album('summer-camp', 'Summer camp', 'summer-camp', null, 19, 'community-dance'),
    album(
      'gala-2025',
      'End-of-Year Gala 2025',
      'gala-2025',
      2025,
      6,
      'gala-2025-attendees-group-photo',
    ),
    album(
      'odunde-2026',
      'Odunde 2026',
      'odunde-2026',
      2026,
      43,
      'odunde-2026-kid-playing-with-elder',
    ),
  ],
  settings: { generalEmail: null },
  layout: { open: 'viewer', captions: 'always', state: 'built' },
  seo: null,
} as unknown as GalleryPageData;

const withData = (patch: Record<string, unknown>) => ({ ...seeded, ...patch }) as GalleryPageData;
const withLayout = (layout: Record<string, string>) =>
  withData({ layout: { ...seeded.layout, ...layout } });

describe('buildGalleryPage', () => {
  it('orders the albums newest year first, the album without a year last', () => {
    const page = buildGalleryPage(seeded, options);
    expect(page.albums.tiles.map((tile) => tile.title)).toEqual([
      'Odunde 2026',
      'End-of-Year Gala 2025',
      'Summer camp',
    ]);
  });

  it("reads each tile's line: the count where the title names the year, the year's chip where there is none", () => {
    const [odunde, gala, camp] = buildGalleryPage(seeded, options).albums.tiles;
    expect(odunde).toMatchObject({
      count: '43 photographs',
      year: undefined,
      yearPending: undefined,
    });
    expect(gala).toMatchObject({ count: '6 photographs', year: undefined });
    expect(camp).toMatchObject({
      count: '19 photographs',
      year: undefined,
      yearPending: 'the year of the album',
    });
  });

  it('dates an album by its own date first, and shows a year its title does not carry', () => {
    const page = buildGalleryPage(
      withData({
        albums: [
          album('summer-camp', 'Summer camp', 'summer-camp', null, 19, 'community-dance', {
            date: '2019-07-28',
          }),
          ...(seeded.albums ?? []).slice(1),
        ],
      }),
      options,
    );
    const camp = page.albums.tiles.find((tile) => tile.href.includes('summer-camp'));
    expect(camp).toMatchObject({ year: '2019', count: '19 photographs', yearPending: undefined });
    // A dated album sorts among the dated ones.
    expect(page.albums.tiles.map((tile) => tile.title)).toEqual([
      'Odunde 2026',
      'End-of-Year Gala 2025',
      'Summer camp',
    ]);
  });

  it('links each tile to its first photograph under open: viewer, and to its page under open: grid', () => {
    const viewer = buildGalleryPage(seeded, options).albums.tiles.map((tile) => tile.href);
    expect(viewer).toEqual([
      '/gallery/odunde-2026?photo=odunde-2026-kid-playing-with-elder',
      '/gallery/gala-2025?photo=gala-2025-attendees-group-photo',
      '/gallery/summer-camp?photo=community-dance',
    ]);
    const grid = buildGalleryPage(withLayout({ open: 'grid' }), options).albums.tiles.map(
      (tile) => tile.href,
    );
    expect(grid).toEqual(['/gallery/odunde-2026', '/gallery/gala-2025', '/gallery/summer-camp']);
  });

  it('keeps stega out of every comparison, sort and address', () => {
    const tail = '\u200B\u200C\u200D\uFEFF\u200B\u200C';
    const page = buildGalleryPage(
      withData({
        albums: [
          album(
            'odunde-2026',
            `Odunde 2026${tail}`,
            `odunde-2026${tail}`,
            2026,
            43,
            `odunde-2026-kid-playing-with-elder${tail}`,
          ),
        ],
      }),
      options,
    );
    const [tile] = page.albums.tiles;
    expect(tile?.href).toBe('/gallery/odunde-2026?photo=odunde-2026-kid-playing-with-elder');
    expect(tile?.year).toBeUndefined();
    // The title keeps its stega for click-to-edit.
    expect(tile?.title).toBe(`Odunde 2026${tail}`);
  });

  it('frames the cover, else the first photograph, at the mosaic width', () => {
    const [odunde] = buildGalleryPage(seeded, options).albums.tiles;
    expect(odunde?.image?.src).toContain('odunde2026cover');
    const withoutCover = buildGalleryPage(
      withData({
        albums: [{ ...(seeded.albums?.[2] as object), cover: null }],
      }),
      options,
    );
    expect(withoutCover.albums.tiles[0]?.image?.src).toContain('odunde2026first');
    expect(odunde?.image?.srcset).toBeTruthy();
  });

  it('leaves out an album without a slug, and names the albums owed when none remains', () => {
    const page = buildGalleryPage(
      withData({ albums: [{ ...(seeded.albums?.[0] as object), slug: null }] }),
      options,
    );
    expect(page.albums.tiles).toEqual([]);
    expect(page.albums.pending).toBe('the photo albums');
  });

  it('carries the layout options on the page root and shows the albums under built', () => {
    const page = buildGalleryPage(withLayout({ captions: 'hover' }), options);
    expect(page.root).toEqual({ open: 'viewer', captions: 'hover', state: 'built' });
    expect(page.albums.captions).toBe('hover');
    expect(page.soon).toBeUndefined();
  });

  it('replaces the albums under soon with a sentence claiming nothing unconfirmed and both event pages', () => {
    const page = buildGalleryPage(withLayout({ state: 'soon' }), options);
    expect(page.soon).toEqual({
      text: 'The albums are being prepared. Until then, the Odunde and Gala pages carry their own photographs.',
      links: [
        { label: 'Odunde Festival', href: '/odunde' },
        { label: 'End-of-Year Gala', href: '/gala' },
      ],
    });
  });

  it("closes with photography credit and permissions: the Credits line, the owner's policy and the inbox, each owed while empty", () => {
    const owed = buildGalleryPage(seeded, options).credits;
    expect(owed.title).toBe('Photography credit and permissions');
    expect(owed.lead).toBe(
      'These photographs show real people, including children. Here is how we credit them, how we ask permission, and how to ask for a photograph to be removed.',
    );
    expect(owed.rows).toEqual([
      { label: 'Credits', value: 'Given with each album, and with a photograph where it differs.' },
      {
        label: 'Consent policy',
        value: undefined,
        pending: 'your photo consent and removal policy',
      },
      {
        label: 'Removal requests',
        value: undefined,
        href: undefined,
        pending: 'the general inbox',
      },
    ]);
    expect(owed.action).toEqual({
      label: 'Send a message',
      kind: 'enquiry',
      enquiryKind: 'contact',
    });
    const held = buildGalleryPage(
      withData({
        creditsAndConsent: 'Your policy, in your words.',
        settings: { generalEmail: 'info@omoyorubasocal.org' },
      }),
      options,
    ).credits;
    expect(held.rows[1]).toMatchObject({ value: 'Your policy, in your words.' });
    expect(held.rows[2]).toMatchObject({
      value: 'info@omoyorubasocal.org',
      href: 'mailto:info@omoyorubasocal.org',
    });
  });

  it('renders the Pending page from a failed read: the defaults, no albums and every chip', () => {
    const page = buildGalleryPage(null, options);
    expect(page.title).toBe('Photographs');
    expect(page.layout).toEqual({ open: 'viewer', captions: 'always', state: 'built' });
    expect(page.albums.tiles).toEqual([]);
    expect(page.header.titlePending).toBeTruthy();
    expect(page.credits.rows[2]).toMatchObject({ pending: 'the general inbox' });
  });

  it('reaches every option and cover from click-to-edit in draft mode, and nothing outside it', () => {
    const page = buildGalleryPage(seeded, draft);
    expect(page.edit.open).toContain('layout.open');
    expect(page.edit.captions).toContain('layout.captions');
    expect(page.edit.state).toContain('layout.state');
    expect(page.albums.tiles[0]?.edit).toContain('album-odunde-2026');
    expect(page.albums.tiles[0]?.edit).toContain('cover');
    const published = buildGalleryPage(seeded, options);
    expect(published.edit.open).toBeUndefined();
    expect(published.albums.tiles[0]?.edit).toBeUndefined();
  });
});
