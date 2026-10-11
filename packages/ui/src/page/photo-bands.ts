import type { PhotoBand } from '../media/image';

/**
 * The bands a photograph fills, and how tall the tokens' interaction layer makes each
 * (`oy-components.css`): the homepage hero (`.v2-hero`) and the photo page header
 * (`.oy-phead--photo`). A photograph's `sizes` follows from its band's height (`photoBandSizes`) and
 * cannot read a stylesheet, so the heights are repeated here; `photo-bands.test.ts` reads the
 * stylesheet and fails when the two part.
 */
export const HERO_BAND: PhotoBand = {
  minHeight: 660,
  narrow: { maxWidth: 760, minHeight: 640 },
};

export const PHOTO_HEADER_BAND: PhotoBand = {
  minHeight: 470,
  narrow: { maxWidth: 760, minHeight: 430 },
};
