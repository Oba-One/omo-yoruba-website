import { describe, expect, it } from 'vitest';
import { isPreviewHost, uncacheableReason } from './cache-policy';

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

  it('matches the preview host by host name and ignores a malformed value', () => {
    expect(isPreviewHost('https://preview.example.org/x', 'https://preview.example.org')).toBe(
      true,
    );
    expect(isPreviewHost('https://example.org', 'https://preview.example.org')).toBe(false);
    expect(isPreviewHost('https://example.org', 'not a url')).toBe(false);
    expect(isPreviewHost('https://example.org', undefined)).toBe(false);
  });
});
