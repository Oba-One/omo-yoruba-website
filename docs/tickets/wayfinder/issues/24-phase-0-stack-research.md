# Phase 0 stack versions and library facts

Type: research
Status: resolved
Owner: no
Labels: infra
Phase: 0
Blocked by: none

## Question

Verify every Phase 0 package version against its primary docs before pinning, and confirm the Astro 7 APIs the bootstrap relies on (`security.csp`, `astro:env`, `Astro.cache`, the Vercel adapter), Biome's Astro coverage, lefthook 2 syntax and PostHog's Astro guidance.

## Answer

Resolved 4 September 2026. Findings with sources in `docs/research/`:
`phase-0-stack-versions.md` (every pin and why), `astro-7-csp-cache-env.md`,
`biome-astro-support.md`, `lefthook-2-config.md`, `posthog-astro.md`. Two facts changed
the plan: Astro's CSP has no report-only mode and is unsupported with `<ClientRouter />`
(ADR 0011, ticket 13), and Vitest 5 shipped the day before pinning without Storybook
support (pinned 4.1.11).
