/**
 * The gallery view: what `/gallery` hands the library parts, built from the one gallery query (`18 Photo
 * Gallery.dc.html`, spec Q4 to Q8 and Q13 to Q16 of Phase 8, ADR 0039). Pure, so a test drives it with a
 * fixture: the layout with the schema defaults, the slim header, the albums in the mosaic's order (newest year
 * first, an album's year from its own date or its edition) with each tile's line and link (its first
 * photograph's address under `open: viewer`, its page under `grid`) and its cover framed by the hotspot, the
 * soon sentence under `state: soon`, the credit and permissions section, and the `data-sanity` attributes in
 * draft mode. Titles, slugs and keys are cleaned of stega before they become a comparison, an order or an
 * address; the tile's title keeps its stega for click-to-edit.
 */
import { albumLine, albumYear, byNewestAlbum } from '@oy/content/albums';
import { withLayoutDefaults } from '@oy/content/layout';
import { ALBUM_YEAR_PENDING, presenceWhat } from '@oy/content/pending';
import type { galleryPageQuery } from '@oy/content/queries';
import { albumHref, editionPage } from '@oy/content/routes';
import type { ClientReturn } from '@sanity/client';
import { galleryCredits } from './gallery-credits';
import { pageSkeleton } from './page-skeleton';
import { type BuildOptions, cleanText, present, resolveImage } from './view';

export type GalleryPageData = NonNullable<ClientReturn<typeof galleryPageQuery, unknown>>;

export interface GalleryLayout extends Record<string, string> {
  open: 'viewer' | 'grid';
  captions: 'always' | 'hover';
  state: 'built' | 'soon';
}

/** The gallery's name, and an album page's when no album could be read. */
export const GALLERY_TITLE = 'Photographs';

/** Under `state: soon`: nothing unconfirmed, and where the photographs are meanwhile (spec Q14). */
const SOON_TEXT =
  'The albums are being prepared. Until then, the Odunde and Gala pages carry their own photographs.';

/**
 * Whether the gallery's Coming soon switch holds the albums (ADR 0043): while it does, no photograph
 * reaches a page through an album, whether the gallery, an album page, a photo address or an event
 * page's past years. A photograph a page's own field shows (a header, the homepage's, a door) is
 * outside the switch, even when an album holds it too.
 */
export function albumsHeld(
  layout: Partial<Record<string, string | null | undefined>> | null | undefined,
): boolean {
  return withLayoutDefaults<GalleryLayout>('galleryPage', layout).state === 'soon';
}

/** What stands in for the photographs while the albums are held: one sentence and the two event pages. */
export function soonNotice() {
  return {
    text: SOON_TEXT,
    links: ['festival', 'gala'].flatMap((kind) => {
      const page = editionPage(kind);
      return page ? [{ label: page.name, href: page.route as string }] : [];
    }),
  };
}

export function buildGalleryPage(data: GalleryPageData | null, options: BuildOptions) {
  const page = pageSkeleton<GalleryLayout>('galleryPage', data, options, GALLERY_TITLE);
  const { edit, layout } = page;
  // While held no tile is built, so no cover and no photo address leave the builder.
  const held = albumsHeld(layout);

  const albums = (held ? [] : (data?.albums ?? [])).filter(present).flatMap((album) => {
    const slug = cleanText(album.slug);
    if (!slug) return [];
    const title = cleanText(album.title) ?? '';
    const year = albumYear({ date: album.date, editionYear: album.editionYear });
    const line = albumLine({ title, year, count: album.count ?? 0 });
    const first = cleanText(album.firstPhoto?._key);
    return [
      {
        order: { title, year },
        tile: {
          title: album.title ?? '',
          href: albumHref(slug, layout.open === 'viewer' ? first : undefined),
          image: resolveImage(options.imageSet, album.cover ?? album.firstPhoto, { width: 720 }),
          year: line.year,
          count: line.photographs,
          yearPending: line.yearOwed ? ALBUM_YEAR_PENDING : undefined,
          edit: edit(album.cover ? 'cover' : `photos[_key=="${first ?? ''}"]`, album._id, 'album'),
        },
      },
    ];
  });
  albums.sort((a, b) => byNewestAlbum(a.order, b.order));

  return {
    title: page.title,
    description: page.description,
    layout,
    root: { ...layout },
    header: { variant: 'slim' as const, ...page.header },
    albums: {
      tiles: albums.map((album) => album.tile),
      captions: layout.captions,
      pending: presenceWhat('album')?.what ?? 'the photo albums',
    },
    soon: held ? soonNotice() : undefined,
    credits: galleryCredits(data?.creditsAndConsent, data?.settings?.generalEmail),
    edit: page.layoutEdit,
  };
}

export type GalleryPageView = ReturnType<typeof buildGalleryPage>;
