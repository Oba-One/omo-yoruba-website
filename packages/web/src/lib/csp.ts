/**
 * The one Content Security Policy allow-list for the site.
 *
 * Phase 0 to 8: sent as Content-Security-Policy-Report-Only by src/middleware.ts,
 * with violations posted to /api/csp-report. Phase 9 flips it to enforcement
 * (docs/adr/0011, docs/runbook.md). Third parties allowed: Sanity, Zeffy,
 * PostHog, and YouTube's no-cookie player as a frame an album's video swaps in
 * once a visitor presses play (ADR 0051). Eventbrite is a link, not an embed.
 * Fonts are self-hosted.
 */
import { YOUTUBE_EMBED_ORIGIN } from '@oy/content/videos';
import { ZEFFY_ORIGIN } from '@oy/ui/forms/ZeffyDialog/zeffy.ts';
import { STUDIO_BASE_PATH } from './paths';

export const CSP_REPORT_PATH = '/api/csp-report';
export const CSP_REPORT_GROUP = 'csp-endpoint';

export const cspDirectives: Readonly<Record<string, readonly string[]>> = {
  'default-src': ["'self'"],
  'script-src': ["'self'", 'https://us-assets.i.posthog.com'],
  'style-src': ["'self'"],
  'img-src': ["'self'", 'data:', 'https://cdn.sanity.io'],
  'font-src': ["'self'"],
  'connect-src': [
    "'self'",
    'https://us.i.posthog.com',
    'https://us-assets.i.posthog.com',
    'https://*.api.sanity.io',
    'https://*.apicdn.sanity.io',
  ],
  'frame-src': [ZEFFY_ORIGIN, YOUTUBE_EMBED_ORIGIN],
  'frame-ancestors': ["'self'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
};

export function buildCsp(
  directives: Readonly<Record<string, readonly string[]>> = cspDirectives,
  reportPath: string = CSP_REPORT_PATH,
): string {
  const parts = Object.entries(directives).map(([name, values]) => `${name} ${values.join(' ')}`);
  parts.push(`report-to ${CSP_REPORT_GROUP}`, `report-uri ${reportPath}`);
  return parts.join('; ');
}

export function reportingEndpointsHeader(reportPath: string = CSP_REPORT_PATH): string {
  return `${CSP_REPORT_GROUP}="${reportPath}"`;
}

/**
 * A Zeffy form's address from a Studio URL, fit for an iframe: https, on Zeffy's origin and no other. It
 * serves both of the site's Zeffy forms, the donation form in the Give Dialog and the membership form in
 * the Join Dialog (ADR 0050). The schema's rules run only in the Studio, so a value written through the
 * API is checked again where it becomes a frame, as `safeHref` does for links; anything else (a
 * `javascript:` URL, another host) answers undefined and the caller shows no frame. The answer is the
 * parsed address, never the raw text: a browser resolves `https:www.zeffy.com/...` against the page,
 * where the parser here would not. The check names Zeffy rather than reading `frame-src`: the policy
 * also frames YouTube's player for an album's videos (ADR 0051), and an address on that origin must
 * never become either Zeffy form.
 */
export function framableSrc(value: string | null | undefined): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && url.origin === ZEFFY_ORIGIN ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/** The Studio ships its own inline styles and scripts; the report endpoint has no page. */
export function cspExempt(pathname: string): boolean {
  return (
    pathname === STUDIO_BASE_PATH ||
    pathname.startsWith(`${STUDIO_BASE_PATH}/`) ||
    pathname === CSP_REPORT_PATH
  );
}
