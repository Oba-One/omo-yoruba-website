/**
 * The one Content Security Policy allow-list for the site.
 *
 * Sent by src/middleware.ts as Content-Security-Policy in a production build, and as
 * Content-Security-Policy-Report-Only under `astro dev`, for drafts and on the preview
 * host (`cspHeaderName`), with violations posted to /api/csp-report (ADR 0011,
 * ADR 0062, docs/runbook.md). Inline scripts run by hash: each is a
 * component's `<script is:inline>`, hashed from its source into csp-hashes.ts.
 * Inline styles are allowed outright: the view transitions write a style element
 * per animated element, named per render. Third parties allowed: Sanity, Zeffy,
 * PostHog, and YouTube's no-cookie player as a frame an album's video swaps in
 * once a visitor presses play (ADR 0051). Eventbrite is a link, not an embed.
 * Fonts are self-hosted.
 */
import { YOUTUBE_EMBED_ORIGIN } from '@oy/content/videos';
import { ZEFFY_ORIGIN } from '@oy/ui/forms/ZeffyDialog/zeffy.ts';
import { INLINE_SCRIPT_HASHES } from './csp-hashes';
import { STUDIO_BASE_PATH } from './paths';

export const CSP_REPORT_PATH = '/api/csp-report';

/**
 * Sent with every answer the site's function gives (ADR 0062): no type sniffing, the origin alone as the
 * referrer to another site, and no camera, microphone, location or ad-topics API for the page or its frames.
 * Payment and fullscreen stay as browsers set them, for Zeffy's form and YouTube's player.
 */
export const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
};
export const CSP_REPORT_GROUP = 'csp-endpoint';

export const cspDirectives: Readonly<Record<string, readonly string[]>> = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    ...INLINE_SCRIPT_HASHES.map((hash) => `'${hash}'`),
    'https://us-assets.i.posthog.com',
  ],
  'style-src': ["'self'", "'unsafe-inline'"],
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

/**
 * Whether the policy blocks on the public site (ADR 0062): switched on 22 November 2026, after the live site
 * reported no violation of this policy on any page, dialog, album or video. The middleware enforces it in a
 * production build only, so `astro dev` and its toolbar stay report-only.
 */
export const CSP_ENFORCED = true;

/**
 * The header the policy goes out under. A draft request and the preview host always report only: the Visual
 * Editing overlay hydrates through Astro's own inline island script, and the Studio frames the preview host
 * from another origin, which `frame-ancestors 'self'` would refuse.
 */
export function cspHeaderName({
  draft,
  previewHost,
  enforced = CSP_ENFORCED,
}: {
  draft: boolean;
  previewHost: boolean;
  enforced?: boolean;
}): 'Content-Security-Policy' | 'Content-Security-Policy-Report-Only' {
  return enforced && !draft && !previewHost
    ? 'Content-Security-Policy'
    : 'Content-Security-Policy-Report-Only';
}

/**
 * A short, stable name for a policy (FNV-1a over its text and whether it is enforced), which every page carries
 * in a meta tag so the router can tell a page served under another policy (src/lib/csp-swap.ts), switching
 * enforcement off included. Not a security measure.
 */
export function cspFingerprint(
  policy: string = `${CSP_ENFORCED ? 'enforce' : 'report'} ${buildCsp()}`,
): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < policy.length; index += 1) {
    hash ^= policy.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

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
