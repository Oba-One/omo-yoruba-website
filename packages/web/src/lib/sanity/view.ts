/**
 * What every page view builder shares: the options it takes, an image resolved to a CDN set that
 * carries its alt text (ADR 0022), head text cleaned of stega (the overlay would otherwise read a
 * title as editable), and the `data-sanity` attribute factory that answers only in draft mode. The
 * parts a page singleton's view repeats (the header, the take-part rows, past years) are in
 * `page-skeleton.ts`.
 */
import type { ImageSetBuilder } from '@oy/content/images';
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

/** The Studio's text when it holds any, its stega kept for click-to-edit; else the page's own words. */
export function textOr(value: string | null | undefined, fallback: string): string {
  return cleanText(value) ? (value ?? fallback) : fallback;
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
