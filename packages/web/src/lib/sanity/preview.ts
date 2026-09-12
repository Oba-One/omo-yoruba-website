/**
 * Draft mode for the Presentation tool (ADR 0017): /api/preview/enable validates the Studio's
 * secret and sets the perspective cookie the loaders read; /api/preview/disable clears it.
 * Pattern and cookie name from docs/research/phase-2-sanity-studio-v6-and-astro.md.
 */
import { perspectiveCookieName } from '@sanity/preview-url-secret/constants';

export const PERSPECTIVE_COOKIE: string = perspectiveCookieName;

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

export type PreviewPerspective = 'published' | 'drafts' | string[];

const RELEASE_NAME = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

/**
 * The perspective the loaders use: published without a cookie, else what the Studio asked for
 * (`drafts`, `published`, or a comma-joined release stack). The cookie is readable by anyone,
 * so a value that is not a perspective name falls back to published.
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

/** Whether a request comes from draft mode: the perspective cookie the enable route sets. */
export function isDraftRequest(cookieValue: string | undefined): boolean {
  return perspectiveFromCookie(cookieValue) !== 'published';
}

/** Two expiring Set-Cookie values: the plain one and the partitioned one. */
export function disableCookieHeaders(): string[] {
  const base = `${PERSPECTIVE_COOKIE}=; Path=/; Max-Age=0; SameSite=None; Secure`;
  return [base, `${base}; Partitioned`];
}
