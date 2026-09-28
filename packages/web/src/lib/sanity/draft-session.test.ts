import { describe, expect, it } from 'vitest';
import {
  draftModeCookies,
  draftSessionValue,
  isDraftSession,
  previewPerspective,
} from './draft-session';
import { DRAFT_SESSION_COOKIE, DRAFT_SESSION_SECONDS, PERSPECTIVE_COOKIE } from './preview';

const KEY = 'a-viewer-token-for-tests';
const NOW = Date.UTC(2026, 8, 27, 12, 0, 0);
const SECOND = 1000;

describe('the draft session', () => {
  it('verifies a value it signed until the session length has passed', () => {
    const value = draftSessionValue(KEY, NOW);
    expect(isDraftSession(KEY, value, NOW)).toBe(true);
    expect(isDraftSession(KEY, value, NOW + (DRAFT_SESSION_SECONDS - 1) * SECOND)).toBe(true);
    expect(isDraftSession(KEY, value, NOW + DRAFT_SESSION_SECONDS * SECOND)).toBe(false);
  });

  it('refuses another key, a changed expiry, a changed signature and anything not in its shape', () => {
    const value = draftSessionValue(KEY, NOW);
    const [expires, signature] = value.split('.') as [string, string];
    expect(isDraftSession('another-token', value, NOW)).toBe(false);
    expect(isDraftSession(KEY, `${Number(expires) + 60}.${signature}`, NOW)).toBe(false);
    // Inside the window, so only the signature can refuse it: the HMAC binds the expiry.
    expect(isDraftSession(KEY, `${Number(expires) - 60}.${signature}`, NOW)).toBe(false);
    const flipped = `${signature.slice(0, -1)}${signature.endsWith('A') ? 'B' : 'A'}`;
    expect(isDraftSession(KEY, `${expires}.${flipped}`, NOW)).toBe(false);
    for (const junk of [
      '',
      'drafts',
      '1',
      `${expires}.`,
      `${expires}.${signature}x`,
      `-1.${signature}`,
    ]) {
      expect(isDraftSession(KEY, junk, NOW), junk).toBe(false);
    }
  });

  it('is never a session without a key or a value', () => {
    expect(isDraftSession(undefined, draftSessionValue(KEY, NOW), NOW)).toBe(false);
    expect(isDraftSession('', draftSessionValue(KEY, NOW), NOW)).toBe(false);
    expect(isDraftSession(KEY, undefined, NOW)).toBe(false);
  });

  it('refuses a session that would outlive the session length from now', () => {
    // Signed with a clock a day ahead: a value no enable route could have set now.
    const ahead = draftSessionValue(KEY, NOW + 24 * 60 * 60 * SECOND);
    expect(isDraftSession(KEY, ahead, NOW)).toBe(false);
  });
});

describe('previewPerspective', () => {
  const session = draftSessionValue(KEY, NOW);

  it('reads a hand-set perspective cookie as published without the session (R03)', () => {
    expect(previewPerspective({ perspective: 'drafts' }, KEY, NOW)).toBe('published');
    expect(previewPerspective({ perspective: 'rABC,drafts' }, KEY, NOW)).toBe('published');
    expect(previewPerspective({ perspective: 'drafts', session: 'forged' }, KEY, NOW)).toBe(
      'published',
    );
  });

  it('reads what the perspective cookie names while the session verifies', () => {
    expect(previewPerspective({ perspective: 'drafts', session }, KEY, NOW)).toBe('drafts');
    expect(previewPerspective({ perspective: 'rABC,drafts', session }, KEY, NOW)).toEqual([
      'rABC',
      'drafts',
    ]);
    expect(previewPerspective({ perspective: 'published', session }, KEY, NOW)).toBe('published');
    expect(previewPerspective({ session }, KEY, NOW)).toBe('published');
  });

  it('reads published once the session expires, and without the token', () => {
    const later = NOW + DRAFT_SESSION_SECONDS * SECOND;
    expect(previewPerspective({ perspective: 'drafts', session }, KEY, later)).toBe('published');
    expect(previewPerspective({ perspective: 'drafts', session }, undefined, NOW)).toBe(
      'published',
    );
  });
});

describe('draftModeCookies', () => {
  const request = new Request('https://example.org/api/preview/enable');
  const set = new Map(
    draftModeCookies(request, KEY, 'drafts', NOW).map((cookie) => [cookie.name, cookie]),
  );

  it('sets the perspective the Studio asked for and a session the loaders accept (R03)', () => {
    expect([...set.keys()]).toEqual([PERSPECTIVE_COOKIE, DRAFT_SESSION_COOKIE]);
    const perspective = set.get(PERSPECTIVE_COOKIE)?.value;
    const session = set.get(DRAFT_SESSION_COOKIE)?.value;
    expect(perspective).toBe('drafts');
    expect(previewPerspective({ perspective, session }, KEY, NOW)).toBe('drafts');
  });

  it('keeps the session from scripts and lets it expire, while the perspective stays readable', () => {
    expect(set.get(PERSPECTIVE_COOKIE)?.options.httpOnly).toBe(false);
    expect(set.get(DRAFT_SESSION_COOKIE)?.options).toMatchObject({
      httpOnly: true,
      maxAge: DRAFT_SESSION_SECONDS,
    });
  });
});
