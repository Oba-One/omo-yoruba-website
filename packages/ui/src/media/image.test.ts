import { describe, expect, it } from 'vitest';
import { altOf, imgAttributes, positionOf } from './image';

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
