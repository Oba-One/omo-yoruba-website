import { describe, expect, it } from 'vitest';
import {
  DRAFT_SESSION_COOKIE,
  DRAFT_SESSION_SECONDS,
  disableCookieHeaders,
  isDraftRequest,
  PERSPECTIVE_COOKIE,
  perspectiveFromCookie,
  previewCookieOptions,
  sessionCookieOptions,
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

describe('sessionCookieOptions', () => {
  it('keeps the session from scripts, expires it after the session length and partitions it like the perspective cookie', () => {
    expect(sessionCookieOptions(request({}))).toEqual({
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
      maxAge: DRAFT_SESSION_SECONDS,
    });
    expect(
      sessionCookieOptions(request({ 'sec-fetch-dest': 'iframe', 'sec-fetch-site': 'cross-site' }))
        .partitioned,
    ).toBe(true);
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

  it('treats either cookie as a draft request for the cache guard, verified or not', () => {
    expect(isDraftRequest({})).toBe(false);
    expect(isDraftRequest({ perspective: 'published' })).toBe(false);
    expect(isDraftRequest({ perspective: 'drafts' })).toBe(true);
    expect(isDraftRequest({ perspective: 'rABC,drafts' })).toBe(true);
    expect(isDraftRequest({ session: 'anything' })).toBe(true);
  });
});

describe('disableCookieHeaders', () => {
  it('expires each cookie twice, once partitioned, so every variant clears', () => {
    const headers = disableCookieHeaders();
    expect(headers).toHaveLength(4);
    for (const name of [PERSPECTIVE_COOKIE, DRAFT_SESSION_COOKIE]) {
      const mine = headers.filter((header) => header.startsWith(`${name}=;`));
      expect(mine).toHaveLength(2);
      for (const header of mine) {
        expect(header).toContain('Max-Age=0');
        expect(header).toContain('SameSite=None');
      }
      expect(mine.filter((h) => h.includes('Partitioned'))).toHaveLength(1);
    }
  });
});
