import { describe, expect, it } from 'vitest';
import { altOf, imgAttributes, type PhotoBand, photoBandSizes, positionOf } from './image';

describe('imgAttributes', () => {
  it('takes a URL string', () => {
    expect(imgAttributes('/photo.jpg')).toEqual({ src: '/photo.jpg' });
    expect(imgAttributes('  ')).toBeUndefined();
    expect(imgAttributes(undefined)).toBeUndefined();
  });

  it('takes image metadata with its size', () => {
    expect(imgAttributes({ src: '/a.jpg', width: 800, height: 600, format: 'jpg' })).toEqual({
      src: '/a.jpg',
      width: 800,
      height: 600,
    });
  });

  it('takes a resolved Sanity image with its srcset and the sizes the component asks for', () => {
    const resolved = { src: 'a', srcset: 'a 1w, b 2w', width: 1, height: 1, alt: 'Alt' };
    expect(imgAttributes(resolved, '(min-width: 1100px) 1100px, 100vw')).toEqual({
      src: 'a',
      srcset: 'a 1w, b 2w',
      sizes: '(min-width: 1100px) 1100px, 100vw',
      width: 1,
      height: 1,
    });
    expect(altOf(resolved)).toBe('Alt');
    expect(altOf('a', 'fallback')).toBe('fallback');
  });
});

describe('positionOf', () => {
  it('reads the hotspot framing of a resolved image and nothing else', () => {
    expect(positionOf({ src: '/a.jpg', position: '60% 35%' })).toBe('60% 35%');
    expect(positionOf({ src: '/a.jpg' })).toBeUndefined();
    expect(positionOf('/a.jpg')).toBeUndefined();
    expect(positionOf(undefined)).toBeUndefined();
    // The position never becomes an attribute of the img.
    expect(imgAttributes({ src: '/a.jpg', position: '60% 35%' })).toEqual({ src: '/a.jpg' });
  });
});

describe('photoBandSizes', () => {
  // The homepage hero's and the photo page header's bands, as the tokens set them.
  const hero: PhotoBand = { minHeight: 660, narrow: { maxWidth: 760, minHeight: 640 } };
  const header: PhotoBand = { minHeight: 470, narrow: { maxWidth: 760, minHeight: 430 } };
  const photo = (width: number, height: number) => ({ src: '/a.jpg', width, height });

  /** What a browser makes of a `sizes` list at a viewport width: the first entry that holds. */
  const slotAt = (sizes: string, viewport: number): number => {
    for (const entry of sizes.split(', ')) {
      const match = /^(?:\(max-width: (\d+)px\) )?(?:(\d+)px|100vw)$/.exec(entry);
      if (!match) throw new Error(`not a size this test reads: ${entry}`);
      if (match[1] && viewport > Number(match[1])) continue;
      return match[2] ? Number(match[2]) : viewport;
    }
    throw new Error(`no entry holds at ${viewport}: ${sizes}`);
  };

  it('gives a photograph wider than the band its drawn width, on each side of the breakpoint', () => {
    // 640px tall at 760 and under, 660px above: a 1440 by 816 photograph is 1129px, then 1165px.
    expect(photoBandSizes(photo(1440, 816), hero)).toBe(
      '(max-width: 760px) 1129px, (max-width: 1165px) 1165px, 100vw',
    );
  });

  it('stops at the screen that is as wide as the photograph is drawn', () => {
    // 430px by 3:2 is 645px, and past 760 the 470px band is never narrower than its 705px.
    expect(photoBandSizes(photo(1440, 960), header)).toBe('(max-width: 645px) 645px, 100vw');
  });

  it('keeps the screens between the photograph and the breakpoint at their own width', () => {
    // 731px under the breakpoint, 799px above it: from 732 to 760 wide the band is the wider.
    expect(photoBandSizes(photo(1700, 1000), header)).toBe(
      '(max-width: 731px) 731px, (max-width: 760px) 100vw, (max-width: 799px) 799px, 100vw',
    );
  });

  it('is the width of the screen when the size of the photograph is not known', () => {
    expect(photoBandSizes('/photo.jpg', hero)).toBe('100vw');
    expect(photoBandSizes({ src: '/a.jpg', width: 1440 }, hero)).toBe('100vw');
    expect(photoBandSizes(undefined, hero)).toBe('100vw');
  });

  it('states at every width what the band draws: the wider of the screen and the height times the aspect', () => {
    const shapes = [
      photo(1440, 816),
      photo(1440, 960),
      photo(1700, 1000),
      photo(1000, 1000),
      photo(683, 1024),
    ];
    for (const band of [hero, header]) {
      for (const shape of shapes) {
        const sizes = photoBandSizes(shape, band);
        for (let viewport = 280; viewport <= 1600; viewport += 1) {
          const height = viewport <= band.narrow.maxWidth ? band.narrow.minHeight : band.minHeight;
          const drawn = Math.max(viewport, Math.round((height * shape.width) / shape.height));
          expect(slotAt(sizes, viewport), `${sizes} at ${viewport}`).toBe(drawn);
        }
      }
    }
  });
});
