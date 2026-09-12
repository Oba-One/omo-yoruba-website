import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

/**
 * Every image on the site is a Sanity CDN URL built here from the asset reference, the hotspot and
 * the crop (QUALITY section 3: width, height, AVIF or WebP through `auto=format`). The reference
 * id carries the natural size (`image-<id>-<w>x<h>-<format>`), so a page never reads a URL or a
 * dimension from the response, which is also what keeps stega out of a `src`. The result is the
 * shape a `@oy/ui` component takes as its image: `src`, `srcset`, `width`, `height`, and the
 * hotspot as a CSS `object-position`, so a photo cropped by `object-fit: cover` keeps the framing
 * the editor chose (and the prototype's framing, which the seed writes as hotspots).
 */
export interface SanityImageLike {
  asset?: { _ref?: string | null } | null;
  hotspot?: { x?: number; y?: number; width?: number; height?: number } | null;
  crop?: { top?: number; bottom?: number; left?: number; right?: number } | null;
}

export interface ImageSetOptions {
  /** The rendered width in CSS pixels at the widest layout. */
  width: number;
  /** Locks the aspect ratio (width divided by height) and crops around the hotspot. */
  aspect?: number;
  quality?: number;
}

export interface ImageSet {
  src: string;
  srcset: string;
  width: number;
  height: number;
  /**
   * "60% 35%": the hotspot within the cropped image. Undefined without a hotspot, and when
   * `aspect` asked the CDN to crop around it, since that image is already framed.
   */
  position?: string;
}

export interface ImageSetConfig {
  projectId: string;
  dataset: string;
}

const REF = /^image-[^-]+-(\d+)x(\d+)-[a-z0-9]+$/i;

/**
 * The hotspot centre as a CSS `object-position`, measured within the cropped image (the URL
 * builder serves the crop, so the percentages must be of what is served), clamped to the image.
 */
export function hotspotPosition(
  hotspot: SanityImageLike['hotspot'],
  crop: SanityImageLike['crop'],
): string | undefined {
  if (typeof hotspot?.x !== 'number' || typeof hotspot?.y !== 'number') return undefined;
  const left = crop?.left ?? 0;
  const top = crop?.top ?? 0;
  const width = 1 - left - (crop?.right ?? 0);
  const height = 1 - top - (crop?.bottom ?? 0);
  if (width <= 0 || height <= 0) return undefined;
  const percent = (value: number) => `${Math.round(Math.min(1, Math.max(0, value)) * 1000) / 10}%`;
  return `${percent((hotspot.x - left) / width)} ${percent((hotspot.y - top) / height)}`;
}

/** The natural size encoded in an asset reference id, or undefined for anything else. */
export function assetDimensions(
  ref: string | null | undefined,
): { width: number; height: number } | undefined {
  const match = ref ? REF.exec(ref) : null;
  if (!match) return undefined;
  return { width: Number(match[1]), height: Number(match[2]) };
}

export type ImageSetBuilder = (
  image: SanityImageLike | null | undefined,
  options: ImageSetOptions,
) => ImageSet | undefined;

export function createImageSet({ projectId, dataset }: ImageSetConfig): ImageSetBuilder {
  const builder = createImageUrlBuilder({ projectId, dataset });
  return (image, { width, aspect, quality = 80 }) => {
    const ref = image?.asset?._ref;
    const natural = assetDimensions(ref);
    if (!ref || !natural || !image) return undefined;
    const crop = image.crop ?? {};
    const cropped = {
      width: Math.round(natural.width * (1 - (crop.left ?? 0) - (crop.right ?? 0))),
      height: Math.round(natural.height * (1 - (crop.top ?? 0) - (crop.bottom ?? 0))),
    };
    const ratio = aspect ?? cropped.width / cropped.height;
    // Half, the width, one and a half and double: the widths a 1x to 2x screen asks for.
    const candidates = [
      ...new Set(
        [Math.round(width / 2), width, Math.round(width * 1.5), width * 2].filter(
          (w) => w > 0 && w <= cropped.width,
        ),
      ),
    ].sort((a, b) => a - b);
    if (candidates.length === 0) candidates.push(cropped.width);
    const urlFor = (w: number) => {
      let url = builder
        .image(image as SanityImageSource)
        .width(w)
        .auto('format')
        .quality(quality);
      if (aspect) url = url.height(Math.round(w / ratio)).fit('crop');
      return url.url();
    };
    const chosen = candidates.filter((w) => w <= width).at(-1) ?? (candidates[0] as number);
    const position = aspect ? undefined : hotspotPosition(image.hotspot, image.crop);
    return {
      src: urlFor(chosen),
      srcset: candidates.map((w) => `${urlFor(w)} ${w}w`).join(', '),
      width: chosen,
      height: Math.round(chosen / ratio),
      ...(position ? { position } : {}),
    };
  };
}
