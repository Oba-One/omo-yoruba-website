import type { APIRoute } from 'astro';

// Public and unauthenticated by nature (browsers post here), so keep it cheap and bounded.
const MAX_BYTES = 32 * 1024;
const MAX_REPORTS = 20;
const MAX_FIELD = 200;
const ACCEPTED_TYPES = /^application\/(?:csp-report|reports\+json|json)\b/i;

interface ViolationSummary {
  document: string;
  directive: string;
  blocked: string;
  source: string;
}

/** Accepts both the legacy csp-report body and Reporting API batches. */
function summarise(report: unknown): ViolationSummary {
  const r = (report ?? {}) as Record<string, unknown>;
  const body = ((r['csp-report'] ?? r.body ?? r) as Record<string, unknown>) ?? {};
  const text = (key: string, fallback: string) =>
    String(body[key] ?? body[fallback] ?? '').slice(0, MAX_FIELD);
  return {
    document: text('document-uri', 'documentURL'),
    directive:
      text('effective-directive', 'effectiveDirective') ||
      text('violated-directive', 'violatedDirective'),
    blocked: text('blocked-uri', 'blockedURL'),
    source: text('source-file', 'sourceFile'),
  };
}

export const POST: APIRoute = async ({ request }) => {
  if (!ACCEPTED_TYPES.test(request.headers.get('content-type') ?? '')) {
    return new Response(null, { status: 415 });
  }
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BYTES) {
    return new Response(null, { status: 413 });
  }
  let payload: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BYTES) return new Response(null, { status: 413 });
    payload = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 204 }); // junk: drop quietly, never echo
  }
  const reports = (Array.isArray(payload) ? payload : [payload]).slice(0, MAX_REPORTS);
  for (const report of reports) {
    console.warn('[csp-report]', JSON.stringify(summarise(report)));
  }
  return new Response(null, { status: 204 });
};

export const ALL: APIRoute = () =>
  new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
