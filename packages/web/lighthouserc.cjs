// Lighthouse CI against a Vercel preview, one run per preset (LIGHTHOUSE_PRESET=mobile, then desktop),
// with the budgets of docs/design/QUALITY.md section 3 as assertions. `bun run --filter @oy/web
// lighthouse` runs @lhci/cli 0.15.1 (docs/research/phase-4-lighthouse-ci.md) with this file;
// .github/workflows/lighthouse.yml runs it on every preview. The preview sits behind Vercel
// Authentication, so the project's Protection Bypass for Automation secret travels as a header on
// every request Lighthouse makes; never upload the reports, which embed it. Pointed at a local
// production build instead, the secret is left unset. The variables are LIGHTHOUSE_*, not LHCI_*:
// lhci reads every LHCI_* variable as a flag (yargs `.env('LHCI')`), so LHCI_PRESET would reach
// `lhci assert` as an invalid `--preset`.
const base = process.env.LIGHTHOUSE_BASE_URL;
const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
if (!base)
  throw new Error('LIGHTHOUSE_BASE_URL is required: the preview or production URL to audit');
const desktop = process.env.LIGHTHOUSE_PRESET === 'desktop';
// Content routes only: /admin is the Studio and /api/* are endpoints. Later phases append theirs.
const routes = ['/'];

module.exports = {
  ci: {
    collect: {
      url: routes.map((route) => new URL(route, base).href),
      numberOfRuns: 3,
      settings: {
        ...(desktop ? { preset: 'desktop' } : {}),
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        // Vercel adds X-Robots-Tag: noindex to every preview; a failing is-crawlable drops SEO
        // to about 0.69 for a reason that is not the page's.
        skipAudits: ['is-crawlable'],
        // Every request the page makes carries these headers, the Sanity CDN's and PostHog's
        // included (Lighthouse sets them for the whole page), so the bypass secret reaches those
        // origins too; the owner accepts that when creating it (docs/runbook.md, Lighthouse).
        // x-vercel-skip-toolbar keeps Vercel's preview toolbar out of the measurement.
        extraHeaders: JSON.stringify({
          'x-vercel-skip-toolbar': '1',
          ...(secret ? { 'x-vercel-protection-bypass': secret } : {}),
        }),
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 61440 }],
      },
    },
    // No upload block: the reports would carry the bypass secret.
  },
};
