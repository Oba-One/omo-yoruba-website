import { createImageSet } from '@oy/content/images';
import { SITE_ORIGIN } from '@oy/content/routes';
import { describe, expect, it } from 'vitest';
import { shareImage } from './sanity/view';
import { canonicalUrl, DEFAULT_SHARE_IMAGE, sitemapXml } from './seo';

// Search and sharing (ADR 0060).

describe('canonicalUrl', () => {
  it('names the page on the public host, whatever host answered', () => {
    expect(SITE_ORIGIN).toBe('https://www.omoyorubasocal.org');
    expect(canonicalUrl('/')).toBe('https://www.omoyorubasocal.org/');
    expect(canonicalUrl('/odunde')).toBe('https://www.omoyorubasocal.org/odunde');
    const deployment = new URL('https://omo-yoruba-khaki.vercel.app/impact');
    expect(canonicalUrl(deployment.pathname)).toBe('https://www.omoyorubasocal.org/impact');
  });

  it('names a photo address by its album page, the query left behind', () => {
    const photo = new URL(
      'https://www.omoyorubasocal.org/gallery/gala-2025?photo=gala-2025-the-hall',
    );
    expect(canonicalUrl(photo.pathname)).toBe('https://www.omoyorubasocal.org/gallery/gala-2025');
  });
});

describe('sitemapXml', () => {
  it('lists each path on the public host in the order given', () => {
    const xml = sitemapXml(['/', '/gallery/gala-2025']);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])).toEqual([
      'https://www.omoyorubasocal.org/',
      'https://www.omoyorubasocal.org/gallery/gala-2025',
    ]);
  });

  it('escapes what XML reserves', () => {
    expect(sitemapXml(['/a&b'])).toContain('<loc>https://www.omoyorubasocal.org/a&amp;b</loc>');
  });
});

describe('shareImage', () => {
  const imageSet = createImageSet({ projectId: 'abc123', dataset: 'development' });
  const photograph = {
    _type: 'oyImage' as const,
    alt: 'Dancers in the plaza',
    hotspot: { x: 0.3, y: 0.2, width: 0.3, height: 0.3 },
    crop: null,
    asset: { _ref: 'image-abc123-4000x2667-jpg', _type: 'reference' as const },
  };

  it('crops a photograph to the preview size as a JPEG, with its alt text', () => {
    const share = shareImage(imageSet, photograph);
    expect(share).toMatchObject({ width: 1200, height: 630, alt: 'Dancers in the plaza' });
    expect(share?.url).toMatch(/^https:\/\/cdn\.sanity\.io\//);
    expect(share?.url).toContain('w=1200');
    expect(share?.url).toContain('h=630');
    expect(share?.url).toContain('fm=jpg');
    expect(share?.url).not.toContain('auto=format');
  });

  it('answers nothing without a photograph, so the layout shares the default', () => {
    expect(shareImage(imageSet, null)).toBeUndefined();
    expect(DEFAULT_SHARE_IMAGE).toMatchObject({
      url: 'https://www.omoyorubasocal.org/share.jpg',
      width: 1200,
      height: 630,
    });
    expect(DEFAULT_SHARE_IMAGE.alt).not.toBe('');
  });
});
