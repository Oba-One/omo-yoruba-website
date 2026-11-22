import { describe, expect, it } from 'vitest';
import { isDeploymentHost, isPreviewHost, isUnlistedHost, uncacheableReason } from './cache-policy';

describe('uncacheableReason', () => {
  const base = { method: 'GET', draft: false, origin: 'https://omoyorubasocal.org' };

  it('lets a public GET follow the page rule', () => {
    expect(uncacheableReason(base)).toBeUndefined();
    expect(
      uncacheableReason({ ...base, previewOrigin: 'https://preview.omoyorubasocal.org' }),
    ).toBeUndefined();
  });

  it('never caches a POST, a draft-mode request or the preview host', () => {
    expect(uncacheableReason({ ...base, method: 'POST' })).toBe('method');
    expect(uncacheableReason({ ...base, draft: true })).toBe('draft');
    expect(
      uncacheableReason({
        ...base,
        origin: 'https://preview.omoyorubasocal.org',
        previewOrigin: 'https://preview.omoyorubasocal.org',
      }),
    ).toBe('preview-host');
  });

  it('never caches a vercel.app host, which serves the public pages under another name (ADR 0060)', () => {
    expect(uncacheableReason({ ...base, origin: 'https://omo-yoruba-khaki.vercel.app' })).toBe(
      'deployment-host',
    );
    expect(
      uncacheableReason({ ...base, origin: 'https://www.omoyorubasocal.org' }),
    ).toBeUndefined();
  });

  it('keeps search engines off the preview host and every vercel.app host, never the public one', () => {
    const preview = 'https://preview.omoyorubasocal.org';
    expect(isDeploymentHost('https://omo-yoruba-khaki.vercel.app')).toBe(true);
    expect(isDeploymentHost('https://omo-yoruba-git-main-team.vercel.app/x')).toBe(true);
    expect(isDeploymentHost('https://www.omoyorubasocal.org')).toBe(false);
    expect(isDeploymentHost('https://vercel.app.example.org')).toBe(false);
    expect(isDeploymentHost('not a url')).toBe(false);
    expect(isUnlistedHost('https://omo-yoruba-khaki.vercel.app', undefined)).toBe(true);
    expect(isUnlistedHost(preview, preview)).toBe(true);
    expect(isUnlistedHost('https://www.omoyorubasocal.org', preview)).toBe(false);
    expect(isUnlistedHost('https://omoyorubasocal.org', undefined)).toBe(false);
  });

  it('matches the preview host by host name and ignores a malformed value', () => {
    expect(isPreviewHost('https://preview.example.org/x', 'https://preview.example.org')).toBe(
      true,
    );
    expect(isPreviewHost('https://example.org', 'https://preview.example.org')).toBe(false);
    expect(isPreviewHost('https://example.org', 'not a url')).toBe(false);
    expect(isPreviewHost('https://example.org', undefined)).toBe(false);
  });
});
