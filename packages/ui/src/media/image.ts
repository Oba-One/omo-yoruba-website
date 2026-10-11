import type { ImageMetadata } from 'astro';

/**
 * What a component takes as its image: a URL string (the fixtures import the register's
 * photographs as `?url` assets), Astro's `ImageMetadata` from an import inside a component, or a
 * resolved Sanity image the site built with `createImageSet` from `@oy/content/images` (`src`,
 * `srcset`, `width`, `height`). Components render a plain `<img>` for all three, with `width` and
 * `height` whenever they are known so nothing shifts while a photo loads.
 */
export interface ResolvedImage {
  src: string;
  srcset?: string;
  sizes?: string;
  width?: number;
  height?: number;
  alt?: string;
  /** CSS `object-position` from the Studio hotspot ("60% 35%"): the framing a cover crop keeps. */
  position?: string;
}

export type ImageInput = string | ImageMetadata | ResolvedImage;

export interface ImgAttributes {
  src: string;
  srcset?: string;
  sizes?: string;
  width?: number;
  height?: number;
}

/** The `<img>` attributes for an input, or undefined when there is no image to show. */
export function imgAttributes(
  input: ImageInput | null | undefined,
  sizes?: string,
): ImgAttributes | undefined {
  if (!input) return undefined;
  if (typeof input === 'string') return input.trim() ? { src: input } : undefined;
  if (!input.src) return undefined;
  const srcset = 'srcset' in input ? input.srcset : undefined;
  return {
    src: input.src,
    ...(srcset ? { srcset } : {}),
    ...(srcset && (sizes ?? ('sizes' in input ? input.sizes : undefined))
      ? { sizes: sizes ?? ('sizes' in input ? input.sizes : undefined) }
      : {}),
    ...(input.width ? { width: input.width } : {}),
    ...(input.height ? { height: input.height } : {}),
  };
}

/**
 * A band as wide as the viewport with a photograph filling it behind the copy: the band's
 * `min-height` in CSS pixels, and the one it takes at a `max-width` breakpoint and under. The
 * site's two are in `page/photo-bands.ts`.
 */
export interface PhotoBand {
  minHeight: number;
  narrow: { maxWidth: number; minHeight: number };
}

/**
 * The `sizes` of a photograph that fills a band as wide as the viewport under `object-fit: cover`.
 * That scales the photograph until it fills the band both ways, so wherever the band is narrower
 * than its height times the photograph's aspect ratio the photograph is drawn that wide, however
 * narrow the screen: about three screens wide on a phone, where `100vw` would ask for a file a
 * third as wide as the photograph is drawn. The band's `min-height` is the least it is tall (its
 * copy can make it taller), so this is the least the photograph is drawn at. The list is plain
 * lengths under `max-width` conditions, the first that holds winning. Without a known width and
 * height it is `100vw`.
 */
export function photoBandSizes(input: ImageInput | null | undefined, band: PhotoBand): string {
  if (!input || typeof input === 'string' || !input.width || !input.height) return '100vw';
  const aspect = input.width / input.height;
  const drawn = (minHeight: number) => Math.round(minHeight * aspect);
  const { maxWidth } = band.narrow;
  const narrow = drawn(band.narrow.minHeight);
  const wide = drawn(band.minHeight);
  const sizes = [`(max-width: ${Math.min(narrow, maxWidth)}px) ${narrow}px`];
  // Past the breakpoint the photograph is wider than the screen only if it is wider than the breakpoint.
  if (wide > maxWidth) {
    // A screen under the breakpoint but wider than the photograph there is filled edge to edge.
    if (narrow < maxWidth) sizes.push(`(max-width: ${maxWidth}px) 100vw`);
    sizes.push(`(max-width: ${wide}px) ${wide}px`);
  }
  return [...sizes, '100vw'].join(', ');
}

/** The `object-position` a resolved image carries from its hotspot, or undefined. */
export function positionOf(input: ImageInput | null | undefined): string | undefined {
  if (input && typeof input === 'object' && 'position' in input) {
    return typeof input.position === 'string' && input.position ? input.position : undefined;
  }
  return undefined;
}

/** The alt text carried by a resolved image, else the fallback. */
export function altOf(input: ImageInput | null | undefined, fallback = ''): string {
  if (input && typeof input === 'object' && 'alt' in input && typeof input.alt === 'string') {
    return input.alt;
  }
  return fallback;
}
