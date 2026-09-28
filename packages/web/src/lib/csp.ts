/**
 * The one Content Security Policy allow-list for the site.
 *
 * Phase 0 to 8: sent as Content-Security-Policy-Report-Only by src/middleware.ts,
 * with violations posted to /api/csp-report. Phase 9 flips it to enforcement
 * (docs/adr/0011, docs/runbook.md). Third parties allowed: Sanity, Zeffy,
 * PostHog. Eventbrite is a link, not an embed. Fonts are self-hosted.
 */
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
  'frame-src': ['https://www.zeffy.com'],
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
 * A Studio URL fit for an iframe: https, on an origin the policy frames (`frame-src`). The schema's
 * rules run only in the Studio, so a value written through the API is checked again where it becomes
 * a frame, as `safeHref` does for links; anything else (a `javascript:` URL, another host) answers
 * undefined and the caller shows no frame. The answer is the parsed address, never the raw text: a
 * browser resolves `https:www.zeffy.com/...` against the page, where the parser here would not.
 */
export function framableSrc(value: string | null | undefined): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    const framed = cspDirectives['frame-src'] ?? [];
    return url.protocol === 'https:' && framed.includes(url.origin) ? url.href : undefined;
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
