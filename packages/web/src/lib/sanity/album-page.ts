/**
 * An album page's view: what `/gallery/[album]` hands the library parts, built from the one album query and the
 * page's `?photo=` (`18 Photo Gallery.dc.html`'s album and viewer states, spec Q1, Q9 to Q12 and Q16 of Phase 8,
 * ADR 0037, ADR 0039). Pure, so a test drives it with a fixture: whether the album exists, the slim header with the
 * gallery's kicker, the album's title and its facts (its year, or the year's chip, and the count), the links to the
 * gallery and the edition's page, the credit with its chip and the consent note, the photographs as tiles linking
 * to their photo addresses, the Lightbox's photographs with each one's credit and the photograph served open, the
 * credit and permissions section, and the `data-sanity` attributes in draft mode. Keys, the slug and the `?photo=`
 * value are cleaned of stega before they become an address or a comparison.
 */
import { albumLine, albumYear } from '@oy/content/albums';
import { withLayoutDefaults } from '@oy/content/layout';
import {
  ALBUM_CREDIT_PENDING,
  ALBUM_YEAR_PENDING,
  PHOTO_CREDIT_PENDING,
  pendingWhat,
} from '@oy/content/pending';
import type { albumPageQuery } from '@oy/content/queries';
import { EVENT_PAGE_NAMES, editionRoute } from '@oy/content/routes';
import type { ClientReturn } from '@sanity/client';
import { galleryCredits } from './gallery-credits';
import type { GalleryLayout } from './gallery-page';
import { type BuildOptions, cleanText, editAttributes, present, resolveImage } from './view';

export type AlbumPageData = NonNullable<ClientReturn<typeof albumPageQuery, unknown>>;

/** The page's name when no album could be read. */
const PAGE_TITLE = 'Photographs';

/** The gallery's kicker when the singleton holds none. */
const GALLERY_KICKER = { yo: 'Àwòrán', en: 'Photographs' };

/** The one Lightbox on an album page, which the photographs' links name. */
export const ALBUM_LIGHTBOX_ID = 'album-lightbox';

/** The page an album's edition has, with its name: the festival, the Gala, the Collective. */
const EDITION_PAGE_NAMES: Readonly<Record<string, string>> = {
  festival: EVENT_PAGE_NAMES.festival,
  gala: EVENT_PAGE_NAMES.gala,
  collective: 'Yoruba Cultural Collective',
};

export function buildAlbumPage(
  data: AlbumPageData | null,
  options: BuildOptions,
  photoParam: string | null | undefined,
) {
  const album = data?.album ?? null;
  const edit = editAttributes(options, album?._id ?? 'album');
  const galleryEdit = editAttributes(options, 'galleryPage');
  const { captions } = withLayoutDefaults<GalleryLayout>('galleryPage', data?.page?.layout);

  const slug = cleanText(album?.slug) ?? '';
  const title = cleanText(album?.title);
  const photos = (album?.photos ?? []).filter(present).flatMap((photo) => {
    const key = cleanText(photo._key);
    return key ? [{ key, photo }] : [];
  });
  const line = albumLine({
    title: title ?? '',
    year: albumYear({ date: album?.date, edition: album?.edition?.edition }),
    count: photos.length,
  });
  const wanted = cleanText(photoParam ?? undefined);
  const openKey = wanted && photos.some(({ key }) => key === wanted) ? wanted : undefined;
  const kind = cleanText(album?.edition?.kind);
  const editionPage = editionRoute(kind);
  const editionName = kind ? EDITION_PAGE_NAMES[kind] : undefined;
  const albumConfirmed = album?.creditConfirmed === true;

  return {
    found: album !== null,
    title: title ?? PAGE_TITLE,
    description: title ? `${title}: ${line.count}.` : undefined,
    root: { captions },
    header: {
      variant: 'slim' as const,
      kicker: data?.page?.header?.kicker ?? GALLERY_KICKER,
      title: album?.title ?? PAGE_TITLE,
      facts: album
        ? [
            ...(line.year
              ? [{ text: line.year }]
              : line.yearOwed
                ? [{ pending: ALBUM_YEAR_PENDING }]
                : []),
            { text: line.count },
          ]
        : [],
    },
    links: {
      gallery: { label: 'All albums', href: '/gallery' },
      edition:
        editionPage && editionName
          ? { label: editionName, href: editionPage as string }
          : undefined,
    },
    credit: {
      credit: album?.credit ?? undefined,
      confirmed: albumConfirmed,
      pending: ALBUM_CREDIT_PENDING,
      edit: album ? edit('credit') : undefined,
    },
    consentNote: cleanText(album?.consentNote) ? (album?.consentNote ?? undefined) : undefined,
    consentEdit: album ? edit('consentNote') : undefined,
    photos: {
      tiles: photos.map(({ key, photo }) => {
        const image = resolveImage(options.imageSet, photo, { width: 360 });
        // A caption that says what the alt says: the tile's image stays silent, so a reader hears it once.
        const same = cleanText(photo.caption) === cleanText(photo.alt);
        return {
          key,
          href: `?photo=${encodeURIComponent(key)}`,
          image: image ? { ...image, alt: same ? '' : image.alt } : undefined,
          caption: photo.caption ?? undefined,
          edit: edit(`photos[_key=="${key}"]`),
        };
      }),
      captions,
      // Served open, the Lightbox covers the grid: its photograph loads first and alone.
      eager: openKey ? 0 : 3,
      pending: pendingWhat('album', 'photos[]') ?? 'the photographs',
      edit: galleryEdit('layout.captions'),
    },
    lightbox: {
      id: ALBUM_LIGHTBOX_ID,
      label: title ?? PAGE_TITLE,
      albumHref: `/gallery/${slug}`,
      album: slug,
      openKey,
      photos: photos.map(({ key, photo }) => {
        const own = cleanText(photo.credit);
        return {
          key,
          image: resolveImage(options.imageSet, photo, { width: 1024 }),
          alt: photo.alt ?? '',
          caption: photo.caption ?? undefined,
          credit: own ? photo.credit : (album?.credit ?? undefined),
          confirmed: own ? photo.creditConfirmed === true : albumConfirmed,
          creditPending: own ? PHOTO_CREDIT_PENDING : ALBUM_CREDIT_PENDING,
        };
      }),
    },
    credits: galleryCredits(data?.page?.creditsAndConsent, data?.settings?.generalEmail),
  };
}

export type AlbumPageView = ReturnType<typeof buildAlbumPage>;
