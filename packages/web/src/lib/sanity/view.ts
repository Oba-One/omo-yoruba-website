/**
 * What every page view builder shares: the options it takes, an image resolved to a CDN set that
 * carries its alt text (ADR 0022), head text cleaned of stega (the overlay would otherwise read a
 * title as editable), and the `data-sanity` attribute factory that answers only in draft mode. The
 * parts a page singleton's view repeats (the header, the take-part rows, past years) are in
 * `page-skeleton.ts`.
 */
import type { ImageSetBuilder, ImageSetOptions } from '@oy/content/images';
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

export type ImageLike = Parameters<ImageSetBuilder>[0] & { alt?: string | null };

/**
 * How the photograph behind a band of copy is built (the homepage hero, an event page's header):
 * the four widths of a 1440px set, 720 to 2880px, at quality 50 where the builder's own is 80. A
 * phone draws the photograph about three screens wide and so asks for the 2880px file
 * (`photoBandSizes` in `@oy/ui`). Behind the scrim, at two to three image pixels to the CSS pixel,
 * the lighter file is hard to tell from the heavier at two fifths of the bytes, which takes back
 * most of what the wider file costs the page's largest paint (ADR 0055).
 */
export const BAND_PHOTOGRAPH = { width: 1440, quality: 50 } as const satisfies ImageSetOptions;

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

/** The Studio's text when it holds any, its stega kept for click-to-edit; else undefined. */
export function studioText(value: string | null | undefined): string | undefined {
  return cleanText(value) ? (value ?? undefined) : undefined;
}

/** The Studio's text when it holds any, its stega kept for click-to-edit; else the page's own words. */
export function textOr(value: string | null | undefined, fallback: string): string {
  return studioText(value) ?? fallback;
}

/** A multi-line value (the mailing address) on one line, its lines joined by commas, or undefined. */
export function oneLine(value: string | null | undefined): string | undefined {
  const lines = (cleanText(value) ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines.join(', ') : undefined;
}

/** Whether a list item is there: the filter every builder runs over a list the query may answer with nulls. */
export const present = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

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
