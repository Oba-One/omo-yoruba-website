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
import { albumHref, editionPage } from '@oy/content/routes';
import type { ClientReturn } from '@sanity/client';
import { galleryCredits } from './gallery-credits';
import { GALLERY_TITLE, type GalleryLayout } from './gallery-page';
import {
  type BuildOptions,
  cleanText,
  editAttributes,
  present,
  resolveImage,
  studioText,
} from './view';

export type AlbumPageData = NonNullable<ClientReturn<typeof albumPageQuery, unknown>>;

/** A photograph tile's shape on the album page's grid, about 340 by 200 pixels at its widest columns. */
const TILE_ASPECT = 16 / 9;

/** The one Lightbox on an album page, which the photographs' links name. */
export const ALBUM_LIGHTBOX_ID = 'album-lightbox';

export function buildAlbumPage(
  data: AlbumPageData | null,
  options: BuildOptions,
  photoParam: string | null | undefined,
) {
  const album = data?.album ?? null;
  const edit = editAttributes(options, 'galleryPage');
  // The album's own fields open the album document, named by its id and its type.
  const albumEdit = (path: string) => (album ? edit(path, album._id, 'album') : undefined);
  const { captions } = withLayoutDefaults<GalleryLayout>('galleryPage', data?.page?.layout);

  const slug = cleanText(album?.slug) ?? '';
  const title = cleanText(album?.title);
  const photos = (album?.photos ?? []).filter(present).flatMap((photo) => {
    const key = cleanText(photo._key);
    return key ? [{ key, photo, edit: albumEdit(`photos[_key=="${key}"]`) }] : [];
  });
  const line = albumLine({
    title: title ?? '',
    year: albumYear({ date: album?.date, editionYear: album?.edition?.year }),
    count: photos.length,
  });
  const wanted = cleanText(photoParam ?? undefined);
  const openKey = wanted && photos.some(({ key }) => key === wanted) ? wanted : undefined;
  const edition = editionPage(cleanText(album?.edition?.kind));
  const albumConfirmed = album?.creditConfirmed === true;

  return {
    found: album !== null,
    title: title ?? GALLERY_TITLE,
    description: title ? `${title}: ${line.photographs}.` : undefined,
    root: { captions },
    header: {
      variant: 'slim' as const,
      kicker: data?.page?.header?.kicker ?? undefined,
      title: album?.title ?? GALLERY_TITLE,
      facts: album
        ? [
            ...(line.year
              ? [{ text: line.year }]
              : line.yearOwed
                ? [{ pending: ALBUM_YEAR_PENDING }]
                : []),
            { text: line.photographs },
          ]
        : [],
    },
    links: {
      gallery: { label: 'All albums', href: '/gallery' },
      edition: edition ? { label: edition.name, href: edition.route as string } : undefined,
    },
    credit: {
      credit: album?.credit ?? undefined,
      confirmed: albumConfirmed,
      pending: ALBUM_CREDIT_PENDING,
      edit: albumEdit('credit'),
    },
    consentNote: studioText(album?.consentNote),
    consentEdit: albumEdit('consentNote'),
    photos: {
      tiles: photos.map(({ key, photo, edit: photoEdit }) => {
        // The tile is a 200px band about 340px wide: cropped to its shape at the CDN around the hotspot, each
        // photograph carries a quarter fewer pixels than the whole frame would.
        const image = resolveImage(options.imageSet, photo, { width: 360, aspect: TILE_ASPECT });
        // A caption that says what the alt says: the tile's image stays silent, so a reader hears it once.
        const same = cleanText(photo.caption) === cleanText(photo.alt);
        return {
          key,
          href: albumHref(slug, key),
          image: image ? { ...image, alt: same ? '' : image.alt } : undefined,
          caption: photo.caption ?? undefined,
          edit: photoEdit,
        };
      }),
      captions,
      // The first photograph is the page's largest paint; served open, the Lightbox's photograph is instead.
      priority: !openKey,
      pending: pendingWhat('album', 'photos[]') ?? 'the photographs',
      edit: edit('layout.captions'),
    },
    lightbox: {
      id: ALBUM_LIGHTBOX_ID,
      label: title ?? GALLERY_TITLE,
      albumHref: albumHref(slug),
      album: slug,
      openKey,
      photos: photos.map(({ key, photo, edit: photoEdit }) => {
        const own = cleanText(photo.credit);
        return {
          key,
          image: resolveImage(options.imageSet, photo, { width: 1024 }),
          alt: photo.alt ?? '',
          caption: photo.caption ?? undefined,
          credit: own ? photo.credit : (album?.credit ?? undefined),
          confirmed: own ? photo.creditConfirmed === true : albumConfirmed,
          creditPending: own ? PHOTO_CREDIT_PENDING : ALBUM_CREDIT_PENDING,
          edit: photoEdit,
        };
      }),
    },
    credits: galleryCredits(data?.page?.creditsAndConsent, data?.settings?.generalEmail),
  };
}

export type AlbumPageView = ReturnType<typeof buildAlbumPage>;
