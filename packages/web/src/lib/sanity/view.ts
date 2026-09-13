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
