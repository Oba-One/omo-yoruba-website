---
status: proposed
---

# The CSP is a report-only header from middleware until Phase 9

Astro's built-in `security.csp` renders a `<meta>` tag, has no report-only mode, and is
documented as unsupported with the `<ClientRouter />` cross-fade the brief requires
(`docs/research/astro-7-csp-cache-env.md`). So `packages/web` keeps `security.csp: false` and
`src/middleware.ts` sends the allow-list from `src/lib/csp.ts` as
`Content-Security-Policy-Report-Only`, with violations posted to `/api/csp-report`. The
Studio at `/admin` is exempt.

## Considered options

- Astro's meta CSP now: enforces immediately and rules out `<ClientRouter />`.
- Report-only header now, decide enforcement in Phase 9 (chosen): header-based enforcement
  with nonces or hashes keeps the cross-fade; Astro's meta CSP would mean dropping it.

The owner settles enforcement in wayfinder ticket 13.
