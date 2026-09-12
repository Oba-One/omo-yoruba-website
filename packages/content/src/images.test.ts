import { describe, expect, it } from 'vitest';
import { assetDimensions, createImageSet, hotspotPosition } from './images';

const imageSet = createImageSet({ projectId: 'abc123', dataset: 'development' });
const hero = {
  _type: 'oyImage',
  asset: { _ref: 'image-0a1b2c3d4e5f-2400x1600-jpg', _type: 'reference' },
};

describe('assetDimensions', () => {
  it('reads the natural size from the reference id', () => {
    expect(assetDimensions('image-0a1b2c3d4e5f-2400x1600-jpg')).toEqual({
      width: 2400,
      height: 1600,
    });
    expect(assetDimensions('image-x-notasize-jpg')).toBeUndefined();
    expect(assetDimensions(undefined)).toBeUndefined();
  });
});

describe('hotspotPosition', () => {
  it('measures the hotspot within the crop and clamps it to the image', () => {
    expect(hotspotPosition({ x: 0.5, y: 0.25 }, null)).toBe('50% 25%');
    // A quarter cropped from the left: the centre of the original sits a third into what is served.
    expect(hotspotPosition({ x: 0.5, y: 0.5 }, { left: 0.25, right: 0 })).toBe('33.3% 50%');
    expect(hotspotPosition({ x: 0.1, y: 0.5 }, { left: 0.25, right: 0 })).toBe('0% 50%');
    expect(hotspotPosition({ y: 0.5 }, null)).toBeUndefined();
    expect(hotspotPosition(null, null)).toBeUndefined();
  });
});

describe('createImageSet', () => {
  it('builds a CDN src and srcset from the reference, capped at the natural width', () => {
    const set = imageSet(hero, { width: 1440 });
    expect(set?.src).toMatch(
      /^https:\/\/cdn\.sanity\.io\/images\/abc123\/development\/0a1b2c3d4e5f-2400x1600\.jpg\?/,
    );
    expect(set?.src).toContain('w=1440');
    expect(set?.src).toContain('auto=format');
    expect(set?.srcset.split(', ').map((entry) => entry.split(' ')[1])).toEqual([
      '720w',
      '1440w',
      '2160w',
    ]);
    expect(set).toMatchObject({ width: 1440, height: 960 });
  });

  it('locks the aspect ratio and crops when one is asked for', () => {
    const set = imageSet(hero, { width: 600, aspect: 3 / 2 });
    expect(set?.src).toContain('h=400');
    expect(set?.src).toContain('fit=crop');
    expect(set).toMatchObject({ width: 600, height: 400 });
  });

  it('applies a stored crop to the natural size before choosing widths', () => {
    const cropped = { ...hero, crop: { top: 0, bottom: 0, left: 0.25, right: 0.25 } };
    const set = imageSet(cropped, { width: 1440 });
    expect(set?.srcset).not.toContain('2160w');
    expect(set?.src).toContain('rect=');
  });

  it('carries the hotspot as the object-position the cover crop keeps', () => {
    const framed = { ...hero, hotspot: { x: 0.6, y: 0.35, width: 0.4, height: 0.4 } };
    expect(imageSet(framed, { width: 360 })?.position).toBe('60% 35%');
    expect(imageSet(hero, { width: 360 })).not.toHaveProperty('position');
    // A CDN crop is already framed around the hotspot, so the cover crop needs no offset.
    expect(imageSet(framed, { width: 360, aspect: 360 / 170 })).not.toHaveProperty('position');
  });

  it('answers undefined without an asset, so the caller renders the placeholder', () => {
    expect(imageSet(undefined, { width: 100 })).toBeUndefined();
    expect(imageSet({ asset: null }, { width: 100 })).toBeUndefined();
  });
});
