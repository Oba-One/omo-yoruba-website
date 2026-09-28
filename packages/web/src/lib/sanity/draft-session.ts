/**
 * The proof that the enable route switched draft mode on (ADR 0044, review R03). The perspective cookie
 * says which perspective the Studio asked for, and any visitor can set it by hand, so drafts are read
 * only beside a second cookie that no visitor can forge: httpOnly, holding an expiry and an HMAC of it.
 * The HMAC's key is the Viewer token, the credential that reads drafts at all, so the session is exactly
 * as secret as draft access itself and needs no secret of its own. Pure, with the key and the clock
 * passed in, so a test drives it; server only (`node:crypto`).
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import {
  DRAFT_SESSION_COOKIE,
  DRAFT_SESSION_SECONDS,
  PERSPECTIVE_COOKIE,
  type PreviewCookieOptions,
  type PreviewPerspective,
  perspectiveFromCookie,
  previewCookieOptions,
  type SessionCookieOptions,
  sessionCookieOptions,
} from './preview';

// Names what the HMAC signs, so the token signs nothing else by accident.
const LABEL = 'oy-draft-session.v1';
// An expiry in seconds, then the base64url of a SHA-256 HMAC (32 bytes, 43 characters).
const SHAPE = /^(\d{1,12})\.([A-Za-z0-9_-]{43})$/;

function sign(key: string, expires: number): string {
  return createHmac('sha256', key).update(`${LABEL}.${expires}`).digest('base64url');
}

/** The session cookie's value, valid for `DRAFT_SESSION_SECONDS` from `now` (milliseconds). */
export function draftSessionValue(key: string, now: number): string {
  const expires = Math.floor(now / 1000) + DRAFT_SESSION_SECONDS;
  return `${expires}.${sign(key, expires)}`;
}

/** Whether the value was signed with the key and has not expired; no key or no value is never a session. */
export function isDraftSession(
  key: string | undefined,
  value: string | undefined,
  now: number,
): boolean {
  const match = key && value ? SHAPE.exec(value) : null;
  if (!key || !match) return false;
  const expires = Number(match[1]);
  const seconds = Math.floor(now / 1000);
  if (expires <= seconds || expires > seconds + DRAFT_SESSION_SECONDS) return false;
  const expected = Buffer.from(sign(key, expires));
  const given = Buffer.from(match[2] ?? '');
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export interface DraftCookies {
  /** The perspective cookie's value. */
  perspective?: string;
  /** The session cookie's value. */
  session?: string;
}

/**
 * The perspective a read uses: what the perspective cookie names, but only while the session verifies;
 * published otherwise, whatever the perspective cookie says.
 */
export function previewPerspective(
  { perspective, session }: DraftCookies,
  key: string | undefined,
  now: number,
): PreviewPerspective {
  const wanted = perspectiveFromCookie(perspective);
  return wanted !== 'published' && isDraftSession(key, session, now) ? wanted : 'published';
}

export interface DraftModeCookie {
  name: string;
  value: string;
  options: PreviewCookieOptions | SessionCookieOptions;
}

/**
 * The two cookies `/api/preview/enable` sets once the Studio's secret is valid: the perspective the
 * Studio asked for, and the session signed with the key the loaders verify with.
 */
export function draftModeCookies(
  request: Request,
  key: string,
  perspective: string,
  now: number,
): DraftModeCookie[] {
  return [
    { name: PERSPECTIVE_COOKIE, value: perspective, options: previewCookieOptions(request) },
    {
      name: DRAFT_SESSION_COOKIE,
      value: draftSessionValue(key, now),
      options: sessionCookieOptions(request),
    },
  ];
}
