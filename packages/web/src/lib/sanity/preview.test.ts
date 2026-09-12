import { describe, expect, it } from 'vitest';
import {
  disableCookieHeaders,
  isDraftRequest,
  PERSPECTIVE_COOKIE,
  perspectiveFromCookie,
  previewCookieOptions,
} from './preview';

const request = (headers: Record<string, string>) =>
  new Request('https://example.org/api/preview/enable', { headers });

describe('previewCookieOptions', () => {
  it('is readable by the overlay, cross-site and secure', () => {
    const options = previewCookieOptions(request({}));
    expect(options).toMatchObject({ httpOnly: false, sameSite: 'none', secure: true, path: '/' });
    expect(options.partitioned).toBeUndefined();
  });

  it('partitions the cookie when the Studio loads the site in a cross-site iframe', () => {
    const options = previewCookieOptions(
      request({ 'sec-fetch-dest': 'iframe', 'sec-fetch-site': 'cross-site' }),
    );
    expect(options.partitioned).toBe(true);
    expect(
      previewCookieOptions(request({ 'sec-fetch-dest': 'iframe', 'sec-fetch-site': 'same-origin' }))
        .partitioned,
    ).toBeUndefined();
  });
});

describe('perspectiveFromCookie', () => {
  it('reads drafts, published or a release stack, and treats absence as published', () => {
    expect(perspectiveFromCookie(undefined)).toBe('published');
    expect(perspectiveFromCookie('drafts')).toBe('drafts');
    expect(perspectiveFromCookie('published')).toBe('published');
    expect(perspectiveFromCookie('rABC123,drafts')).toEqual(['rABC123', 'drafts']);
  });

  it('falls back to published for a value that is not a perspective name', () => {
    expect(perspectiveFromCookie('drafts;evil')).toBe('published');
    expect(perspectiveFromCookie(' , ')).toBe('published');
    expect(perspectiveFromCookie('r1 2')).toBe('published');
  });

  it('knows a draft request from the cookie alone', () => {
    expect(isDraftRequest(undefined)).toBe(false);
    expect(isDraftRequest('published')).toBe(false);
    expect(isDraftRequest('drafts')).toBe(true);
    expect(isDraftRequest('rABC,drafts')).toBe(true);
  });
});

describe('disableCookieHeaders', () => {
  it('expires the cookie twice, once partitioned, so both variants clear', () => {
    const headers = disableCookieHeaders();
    expect(headers).toHaveLength(2);
    for (const header of headers) {
      expect(header.startsWith(`${PERSPECTIVE_COOKIE}=;`)).toBe(true);
      expect(header).toContain('Max-Age=0');
      expect(header).toContain('SameSite=None');
    }
    expect(headers.filter((h) => h.includes('Partitioned'))).toHaveLength(1);
  });
});
