import { defineMiddleware } from 'astro:middleware';
import { buildCsp, CSP_REPORT_PATH, cspExempt, reportingEndpointsHeader } from './lib/csp';

const CSP_REPORT_ONLY = buildCsp();
const REPORTING_ENDPOINTS = reportingEndpointsHeader(CSP_REPORT_PATH);

function setHeaders(response: Response): void {
  response.headers.set('Content-Security-Policy-Report-Only', CSP_REPORT_ONLY);
  response.headers.set('Reporting-Endpoints', REPORTING_ENDPOINTS);
}

export const onRequest = defineMiddleware(async (context, next) => {
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
