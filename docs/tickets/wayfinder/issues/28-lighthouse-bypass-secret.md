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

Ticket 33 raised the homepage's mobile performance from 0.67 to 0.77 to 0.94 to 0.96 on 12 September
2026, so its performance score now passes. Until their tickets land, expect the mobile audit to fail
on LCP on `/` and both gallery routes and on layout shift when the event pages' fonts swap (ticket 35,
open-work E12), and on best practices, 0.93 on every route for the favicon's 404 (ticket 32) and the
report-only CSP's issues (ADR 0011). Open-work D14 holds this ticket's two decisions.

## Comments

27 September 2026. Rewritten (open-work H2): ticket 33 is resolved, so the failures to expect are ticket
35's and ticket 32's. The repository still has no Actions secrets (`gh secret list`, 27 September), so
the workflow skips.
