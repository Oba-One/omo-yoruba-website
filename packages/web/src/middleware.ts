import { getActionContext } from 'astro:actions';
import { PUBLIC_PREVIEW_ORIGIN } from 'astro:env/client';
import { defineMiddleware } from 'astro:middleware';
import { isUnlistedHost, uncacheableReason } from './lib/cache-policy';
import {
  buildCsp,
  CSP_ENFORCED,
  CSP_REPORT_PATH,
  cspExempt,
  cspHeaderName,
  reportingEndpointsHeader,
  SECURITY_HEADERS,
} from './lib/csp';
import type { FormOutcome } from './lib/forms/action-paths';
import {
  enquiryKindFrom,
  redirectAfterEnquiry,
  redirectAfterNewsletter,
} from './lib/forms/modal-state';
import type { FormResult } from './lib/forms/result';
import { oldSiteRedirect } from './lib/redirects';
import { DRAFT_SESSION_COOKIE, isDraftRequest, PERSPECTIVE_COOKIE } from './lib/sanity/preview';

const CSP = buildCsp();
const REPORTING_ENDPOINTS = reportingEndpointsHeader(CSP_REPORT_PATH);

interface HeaderPlan {
  /** The CSP header's name, or false where the policy does not apply (ADR 0062). */
  csp: ReturnType<typeof cspHeaderName> | false;
  noindex: boolean;
}

function setHeaders(response: Response, { csp, noindex }: HeaderPlan): void {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) response.headers.set(name, value);
  if (csp) {
    response.headers.set(csp, CSP);
    response.headers.set('Reporting-Endpoints', REPORTING_ENDPOINTS);
  }
  // The preview host serves every page uncached for the Studio's iframe and, as a custom domain,
  // outside Vercel Authentication; a `vercel.app` host serves the same pages as the public one
  // (ADR 0060). Search engines keep to the public host, and neither answer is ever cached.
  if (noindex) response.headers.set('X-Robots-Tag', 'noindex, nofollow');
}

/**
 * Four jobs. The old site's addresses answer 301 to their successors here (ADR 0061). The
 * CSP header on every page, enforced in production (ADR 0011, ADR 0062), with the security headers on every answer, and `noindex` on
 * everything the preview host and a `vercel.app` host answer (ADR 0060). The forms without
 * JavaScript (ADR 0019): a form posted to an action runs here, before the page; a success
 * redirects to the same page with the modal open on its success block (or the footer on its
 * thanks), so a refresh never resubmits, and an error hands the result to the page, which
 * re-renders it with the values kept. Astro's documented pattern for redirect after POST. And
 * the cache guard (ADR 0021): after the page rendered, a draft-mode request, a request on the
 * preview host or a `vercel.app` host, or anything but a GET switches the cache off, last, so no page-level
 * `cache.set()` can switch it back on.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  // The old site's addresses go to their successors before anything renders (ADR 0061). This serves
  // `astro dev` and the Playwright server only: on Vercel the build's routes answer them first
  // (src/lib/redirects.ts, oldSiteRoutes), without the `noindex` this adds on an unlisted host.
  const successor = ['GET', 'HEAD'].includes(context.request.method)
    ? oldSiteRedirect(context.url.pathname)
    : undefined;
  if (successor) {
    const redirect = new Response(null, { status: 301, headers: { Location: successor } });
    setHeaders(redirect, {
      csp: false,
      noindex: isUnlistedHost(context.url.origin, PUBLIC_PREVIEW_ORIGIN || undefined),
    });
    return redirect;
  }
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
      return withHeaders(context.redirect(target, 303), {
        csp: false,
        noindex: isUnlistedHost(context.url.origin, PUBLIC_PREVIEW_ORIGIN || undefined),
      });
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
  const draft = isDraftRequest({
    perspective: context.cookies.get(PERSPECTIVE_COOKIE)?.value,
    session: context.cookies.get(DRAFT_SESSION_COOKIE)?.value,
  });
  const reason = uncacheableReason({
    method: context.request.method,
    draft,
    origin: context.url.origin,
    previewOrigin,
  });
  // An error page Astro renders in place of an empty 404 has no cache object (lib/cache.ts).
  if (reason) context.cache?.set(false);
  return withHeaders(response, {
    csp:
      !cspExempt(context.url.pathname) &&
      cspHeaderName({
        draft,
        previewHost: context.url.origin === previewOrigin,
        enforced: CSP_ENFORCED && import.meta.env.PROD,
      }),
    noindex: isUnlistedHost(context.url.origin, previewOrigin),
  });
});

function withHeaders(response: Response, plan: HeaderPlan): Response {
  try {
    setHeaders(response, plan);
    return response;
  } catch {
    // Response.redirect() and fetch() responses carry immutable headers on Node.
    const copy = new Response(response.body, response);
    setHeaders(copy, plan);
    return copy;
  }
}
