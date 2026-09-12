import { getActionContext } from 'astro:actions';
import { defineMiddleware } from 'astro:middleware';
import { buildCsp, CSP_REPORT_PATH, cspExempt, reportingEndpointsHeader } from './lib/csp';
import {
  enquiryKindFrom,
  redirectAfterEnquiry,
  redirectAfterNewsletter,
} from './lib/forms/modal-state';
import type { FormResult } from './lib/forms/result';

const CSP_REPORT_ONLY = buildCsp();
const REPORTING_ENDPOINTS = reportingEndpointsHeader(CSP_REPORT_PATH);

function setHeaders(response: Response): void {
  response.headers.set('Content-Security-Policy-Report-Only', CSP_REPORT_ONLY);
  response.headers.set('Reporting-Endpoints', REPORTING_ENDPOINTS);
}

/**
 * Two jobs. The report-only CSP header on every page (docs/adr/0011). And the forms without
 * JavaScript (ADR 0019): a form posted to an action runs here, before the page; a success
 * redirects to the same page with the modal open on its success block (or the footer on its
 * thanks), so a refresh never resubmits, and an error hands the result to the page, which
 * re-renders it with the values kept. Astro's documented pattern for redirect after POST.
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
    setActionResult(action.name, serializeActionResult(result));
  }

  const response = await next();
  if (cspExempt(context.url.pathname)) return response;
  try {
    setHeaders(response);
    return response;
  } catch {
    // Response.redirect() and fetch() responses carry immutable headers on Node.
    const copy = new Response(response.body, response);
    setHeaders(copy);
    return copy;
  }
});
