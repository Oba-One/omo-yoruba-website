/**
 * Draft mode for the Presentation tool (ADR 0017, ADR 0021, ADR 0044): /api/preview/enable validates the
 * Studio's secret and sets two cookies, the perspective cookie naming what the Studio asked for and
 * the httpOnly session cookie proving the route set it (`draft-session.ts`); the loaders read drafts
 * only with both, and /api/preview/disable clears both. Pattern and perspective cookie name from
 * docs/research/phase-2-sanity-studio-v6-and-astro.md.
 */
import { perspectiveCookieName } from '@sanity/preview-url-secret/constants';

export const PERSPECTIVE_COOKIE: string = perspectiveCookieName;

/** The httpOnly cookie that proves the enable route switched draft mode on. */
export const DRAFT_SESSION_COOKIE = 'oy-draft-session';

/** How long draft mode lasts after the Presentation tool switched it on: a working day. */
export const DRAFT_SESSION_SECONDS = 12 * 60 * 60;

export interface PreviewCookieOptions {
  httpOnly: false;
  sameSite: 'none';
  secure: true;
  path: '/';
  partitioned?: true;
}

/** Readable by the overlay script, sent cross-site, and partitioned when the site sits in the Studio's iframe. */
export function previewCookieOptions(request: Request): PreviewCookieOptions {
  const iframe = request.headers.get('sec-fetch-dest') === 'iframe';
  const crossSite = request.headers.get('sec-fetch-site') === 'cross-site';
  return {
    httpOnly: false,
    sameSite: 'none',
    secure: true,
    path: '/',
    ...(iframe && crossSite ? { partitioned: true as const } : {}),
  };
}

export interface SessionCookieOptions extends Omit<PreviewCookieOptions, 'httpOnly'> {
  httpOnly: true;
  maxAge: number;
}

/** The session cookie: the perspective cookie's reach, but hidden from scripts and expiring. */
export function sessionCookieOptions(request: Request): SessionCookieOptions {
  return { ...previewCookieOptions(request), httpOnly: true, maxAge: DRAFT_SESSION_SECONDS };
}

export type PreviewPerspective = 'published' | 'drafts' | string[];

const RELEASE_NAME = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

/**
 * The perspective the cookie names: published without a cookie, else what the Studio asked for
 * (`drafts`, `published`, or a comma-joined release stack). The cookie is readable by anyone,
 * so a value that is not a perspective name falls back to published, and the loaders honour the
 * rest only beside a verified session (`previewPerspective` in `draft-session.ts`, ADR 0044).
 */
export function perspectiveFromCookie(value: string | undefined): PreviewPerspective {
  if (!value) return 'published';
  if (value === 'drafts' || value === 'published') return value;
  const stack = value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  if (stack.length === 0 || !stack.every((part) => RELEASE_NAME.test(part))) return 'published';
  return stack;
}

/**
 * Whether a request must be treated as draft mode by the cache guard: either cookie is enough, verified
 * or not, so no response to a request that asked for drafts is ever stored.
 */
export function isDraftRequest(cookies: { perspective?: string; session?: string }): boolean {
  return perspectiveFromCookie(cookies.perspective) !== 'published' || Boolean(cookies.session);
}

/** Four expiring Set-Cookie values: each cookie plain and partitioned, so every variant clears. */
export function disableCookieHeaders(): string[] {
  return [PERSPECTIVE_COOKIE, DRAFT_SESSION_COOKIE].flatMap((name) => {
    const base = `${name}=; Path=/; Max-Age=0; SameSite=None; Secure`;
    return [base, `${base}; Partitioned`];
  });
}
