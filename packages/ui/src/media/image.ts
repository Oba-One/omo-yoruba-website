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

/** The alt text carried by a resolved image, else the fallback. */
export function altOf(input: ImageInput | null | undefined, fallback = ''): string {
  if (input && typeof input === 'object' && 'alt' in input && typeof input.alt === 'string') {
    return input.alt;
  }
  return fallback;
}
