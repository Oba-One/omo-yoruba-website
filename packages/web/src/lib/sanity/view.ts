/**
 * What every page view builder shares: the options it takes, an image resolved to a CDN set that
 * carries its alt text (ADR 0022), head text cleaned of stega (the overlay would otherwise read a
 * title as editable), the `data-sanity` attribute factory that answers only in draft mode, and the
 * past album both event pages show (spec Q8).
 */
import type { ImageSetBuilder } from '@oy/content/images';
import { PENDING, presenceWhat } from '@oy/content/pending';
import type { ResolvedImage } from '@oy/ui/media/image.ts';
import { stegaClean } from '@sanity/client/stega';
import { dataAttribute } from './data-attribute';

export interface BuildOptions {
  imageSet: ImageSetBuilder;
  /** Draft mode: the `data-sanity` attributes are rendered. */
  draft: boolean;
  /** The Studio's base path for the edit attributes. */
  studioUrl: string;
  now?: Date;
}

type ImageLike = Parameters<ImageSetBuilder>[0] & { alt?: string | null };

export function resolveImage(
  imageSet: ImageSetBuilder,
  image: ImageLike | null | undefined,
  options: Parameters<ImageSetBuilder>[1],
): ResolvedImage | undefined {
  const set = imageSet(image, options);
  return set ? { ...set, alt: image?.alt ?? '' } : undefined;
}

/** The text with any stega removed and trimmed, or undefined when nothing is left. */
export function cleanText(value: string | null | undefined): string | undefined {
  return value ? stegaClean(value).trim() || undefined : undefined;
}

/**
 * The edit attribute for a path, on the page's own document unless another is named; undefined
 * outside draft mode, so a public page never carries one.
 */
export function editAttributes(options: Pick<BuildOptions, 'draft' | 'studioUrl'>, id: string) {
  return (path: string, docId = id, docType = id) =>
    options.draft
      ? dataAttribute({ id: docId, type: docType, path, baseUrl: options.studioUrl })
      : undefined;
}

export type EditAttribute = ReturnType<typeof editAttributes>;

interface AlbumLike {
  _id: string;
  creditConfirmed: boolean | null;
  credit: string | null;
  photos: ({ _key: string; alt: string | null; caption: string | null } & ImageLike)[] | null;
}

/** Whether an edition's album has photographs to show: the rule `pastEdition` picks by. */
export const hasPhotos = (event: { album?: AlbumLike | null }) =>
  (event.album?.photos?.length ?? 0) > 0;

/** The album row is a condition ("creditConfirmed != true"), so it is found by its field. */
const CREDIT_PENDING =
  PENDING.find((row) => row.type === 'album' && row.condition?.includes('creditConfirmed'))?.what ??
  'photographer credit to confirm';

/**
 * A past edition's album as the carousel and the credit line take it: each photograph resolved at the
 * stage's width with its alt and caption, the registry's wording for no album, and the credit with its
 * confirmation and the edit attribute on the album.
 */
export function pastAlbumView(
  imageSet: ImageSetBuilder,
  edit: EditAttribute,
  album: AlbumLike | null | undefined,
) {
  return {
    slides: (album?.photos ?? [])
      .filter((photo) => photo !== null)
      .map((photo) => ({
        _key: photo._key,
        image: resolveImage(imageSet, photo, { width: 1022 }),
        alt: photo.alt ?? '',
        caption: photo.caption,
      })),
    pending: presenceWhat('album')?.what ?? 'the photo albums',
    album: album
      ? {
          credit: album.credit ?? undefined,
          confirmed: album.creditConfirmed === true,
          pending: CREDIT_PENDING,
          edit: edit('photos', album._id, 'album'),
        }
      : undefined,
  };
}
