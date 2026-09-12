# Create the Lighthouse bypass secret, and decide the Lighthouse checks

Type: task
Status: open
Owner: yes
Labels: infra
Phase: 4
Blocked by: none

## Question

`.github/workflows/lighthouse.yml` audits every successful Preview deployment with the budgets in
`docs/design/QUALITY.md` section 3, and skips with a notice until it can pass Vercel Authentication.

1. The secret: in the Vercel project, Settings, Deployment Protection, Protection Bypass for
   Automation, create one named for CI (a team member or Project Administrator), then run
   `gh secret set VERCEL_AUTOMATION_BYPASS_SECRET`. Lighthouse sends it as a header with every
   request the page makes, so it also reaches the Sanity CDN and PostHog. Either accept that, or
   ask a session for the cookie route instead (a Puppeteer script that sets Vercel's bypass cookie
   before the audit; `puppeteer-core` becomes a dependency to research and approve).
2. Branch protection: whether `Lighthouse (mobile)` and `Lighthouse (desktop)` become required. They
   are missing when a Vercel build fails and for a fork's pull request (no run starts).

Expect the mobile audit to fail the performance budget until ticket 33 lands; the local production
build scored 0.67 to 0.77 on mobile on 12 September 2026 (`docs/plans/handoff-phase-4.md`).
