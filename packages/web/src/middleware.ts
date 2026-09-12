import { getActionContext } from 'astro:actions';
import { PUBLIC_PREVIEW_ORIGIN } from 'astro:env/client';
import { defineMiddleware } from 'astro:middleware';
import { isPreviewHost, uncacheableReason } from './lib/cache-policy';
import { buildCsp, CSP_REPORT_PATH, cspExempt, reportingEndpointsHeader } from './lib/csp';
import type { FormOutcome } from './lib/forms/action-paths';
import {
  enquiryKindFrom,
  redirectAfterEnquiry,
  redirectAfterNewsletter,
} from './lib/forms/modal-state';
import type { FormResult } from './lib/forms/result';
import { isDraftRequest, PERSPECTIVE_COOKIE } from './lib/sanity/preview';

const CSP_REPORT_ONLY = buildCsp();
const REPORTING_ENDPOINTS = reportingEndpointsHeader(CSP_REPORT_PATH);

function setHeaders(
  response: Response,
  { csp, noindex }: { csp: boolean; noindex: boolean },
): void {
  if (csp) {
    response.headers.set('Content-Security-Policy-Report-Only', CSP_REPORT_ONLY);
    response.headers.set('Reporting-Endpoints', REPORTING_ENDPOINTS);
  }
  // The preview host serves every page uncached for the Studio's iframe and, as a custom domain,
  // outside Vercel Authentication; search engines keep to the public host.
  if (noindex) response.headers.set('X-Robots-Tag', 'noindex, nofollow');
}

/**
 * Three jobs. The report-only CSP header on every page (docs/adr/0011), and `noindex` on
 * everything the preview host answers. The forms without
 * JavaScript (ADR 0019): a form posted to an action runs here, before the page; a success
 * redirects to the same page with the modal open on its success block (or the footer on its
 * thanks), so a refresh never resubmits, and an error hands the result to the page, which
 * re-renders it with the values kept. Astro's documented pattern for redirect after POST. And
 * the cache guard (ADR 0021): after the page rendered, a draft-mode request, a request on the
 * preview host or anything but a GET switches the cache off, last, so no page-level
 * `cache.set()` can switch it back on.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { action, setActionResult, serializeActionResult } = getActionContext(context);
  if (action?.calledFrom === 'form') {
    const result = await action.handler();
    const data = result.data as FormResult | undefined;
    if (data?.ok) {
      const kind = enquiryKindFrom(action.name.replace(/^enquiry\./, ''));
      const target =
        action.name === 'newsletter'
          ? redirectAfterNewsletter(context.url)
          : kind
            ? redirectAfterEnquiry(context.url, kind)
            : context.url.pathname;
      return context.redirect(target, 303);
    }
    // Astro's own bookkeeping (the result stays readable through Astro.getActionResult and is
    // not run twice); the layout reads the outcome from locals rather than importing the
    // actions module, which would carry the Studio's stylesheets into the page
    // (src/lib/forms/action-paths.ts).
    setActionResult(action.name, serializeActionResult(result));
    const outcome: FormOutcome = { name: action.name, data };
    if (result.error) outcome.error = { message: result.error.message };
    context.locals.formOutcome = outcome;
  }

  const response = await next();
  const previewOrigin = PUBLIC_PREVIEW_ORIGIN || undefined;
  const reason = uncacheableReason({
    method: context.request.method,
    draft: isDraftRequest(context.cookies.get(PERSPECTIVE_COOKIE)?.value),
    origin: context.url.origin,
    previewOrigin,
  });
  if (reason) context.cache.set(false);
  const headers = {
    csp: !cspExempt(context.url.pathname),
    noindex: isPreviewHost(context.url.origin, previewOrigin),
  };
  try {
    setHeaders(response, headers);
    return response;
  } catch {
    // Response.redirect() and fetch() responses carry immutable headers on Node.
    const copy = new Response(response.body, response);
    setHeaders(copy, headers);
    return copy;
  }
});
