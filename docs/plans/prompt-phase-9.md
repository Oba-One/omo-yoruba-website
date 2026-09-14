# Prompt: Phase 9, hardening

Written 13 September 2026 at the end of Phase 8, to paste into a fresh session at the repo root once the
Phase 8 pull request has merged (wayfinder ticket 43). It extends the Phase 9 prompt in
`docs/design/PROMPTS.md` with what Phases 4 to 8 learned.

---

Read AGENTS.md, CONTEXT.md, docs/plans/handoff-phase-8.md (if the owner ran /handoff; otherwise the Phase 8
tickets' comments in docs/tickets/phase-8/issues/ and ADRs 0037 to 0040), docs/design/QUALITY.md in full,
docs/runbook.md, docs/plans/wayfinder.md with tickets 10, 13, 28, 32, 35 and 43, ADR 0011 (the report-only
CSP), ADR 0018 (the inline custom elements), ADR 0019 and ADR 0037 (the two addresses that open a dialog
beside `#give`), ADR 0026 (the fonts), and docs/research/astro-7-csp-cache-env.md and
phase-4-lighthouse-ci.md. Every rule in AGENTS.md holds: never invent content, Pending for every empty required
field, one gold action per screen view, full diacritics, no em dashes, no emoji.

Work on a new branch phase-9/hardening cut from main after the Phase 8 pull request merges, and finish by
opening a pull request against main.

Run /improve-codebase-architecture first and bring the owner the candidates before changing anything. Then run
/grill-with-docs on the owner's hardening decisions before building: ticket 13 (enforce the CSP as a header
with hashes or nonces and keep the cross-fade, or Astro's meta CSP without it; first read the `[csp-report]`
lines `/api/csp-report` has written to the Vercel runtime logs since Phase 3), ticket 10's redirects
(`docs/redirects.md`: if the owner has not supplied it, the redirects wait; never guess an old URL), ticket 32's
favicon (best practices cannot reach 100 while `/favicon.ico` is a 404), ticket 28 (the bypass secret, without
which `lighthouse.yml` skips on every preview), what the sitemap lists and what each page shares. Update
CONTEXT.md and add ADRs as decisions land. Then /to-tickets and /implement.

The CSP. `script-src 'self'` blocks every inline script once enforced: the `<script is:inline>` of SiteNav,
EnquiryModal, GiveDialog, NewsletterForm, PhotoCarousel and Lightbox in @oy/ui (ADR 0018), the layout's
head guard that hands Back and Forward to the Lightbox before Astro's router (ADR 0037; without it Back
reloads the album page), whatever Astro injects for islands and the router, and any stylesheet the build
inlines (`style-src 'self'`). Their text is static, so hashes can come from the build; prove each with the
policy enforced in Playwright (a dialog that opens, a Lightbox that closes on Back without a reload, the Give
Dialog's Zeffy frame and its fallback), keep the Studio at `/admin` exempt, and document the allow-list in
docs/runbook.md. Headers: HSTS, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy` beside the
policy, where the middleware already sends it, or in `vercel.json`.

Pages. A 404 page in the site chrome with a way on; the album route already answers an unknown slug with an
empty 404, which Astro renders through `src/pages/404.astro` once it exists (prove it), and a failed Sanity
read with 503 and the page's skeleton, which stays. The sitemap and robots: the site renders on the server,
so the sitemap cannot find `/gallery/<slug>` on its own; read the album slugs from Sanity (albums holding a
photograph), never list a photo address (`?photo=`), `/admin`, `/api/*` or the preview host. Canonical links:
every page names its own address, and ADR 0037 leaves the photo address's to this phase (its album page, or
itself). Sharing: each page's `seo.ogImage` or a chosen fallback, never an invented image; decide with the owner
whether an album shares its cover and a photo address its photograph. Redirects in `astro.config.ts` only from
`docs/redirects.md`.

Checks. Lighthouse on every route in `lighthouserc.cjs` at both presets, on the local production build until
ticket 28 lands (docs/runbook.md, Lighthouse: `bun run build`, serve `.vercel/output` with the render
function's `fetch`, brotli and the cache headers, then `LIGHTHOUSE_BASE_URL`; lhci reads every `LHCI_*`
variable as a flag, so the config uses `LIGHTHOUSE_*`). Commit the serve script this time, since every phase
has rebuilt it. Ticket 35 is open work: the homepage's mobile LCP and the event pages' font-swap CLS
(metric-matched fallback faces first, then inlining with its CSP hash). Axe clean on every route at 375 and
1440 and with every dialog open, the Lightbox included; Lighthouse also counts axe's best-practice rules that
the WCAG-tagged Playwright run skips, so new routes join `a11y.spec.ts`'s heading-order check. Build QUALITY
section 2's contrast helper (computed colours of text in default, hover and focus; AA; gold text on light
flagged); widen the 44px sweep in `targets.spec.ts` to every route and every open dialog; make the gold rule
(`goldSharingAView`) one sweep across the routes. The "no dialog open on load" check covers every route, with
AGENTS.md's two URL-driven exceptions (`#give`, a photo address) and ADR 0019's no-JavaScript `?enquiry=<kind>`
as the addresses that open one. Playwright in both data modes (`PLACEHOLDER_PROJECT`; every test asserts
something in both, and the album pages answer 503 in the placeholder project), the earlier suites green with
`--workers=1`. Chromatic: accept the baselines with the
owner at 375 and 1440 once `CHROMATIC_PROJECT_TOKEN` is set (ticket 17's wizard, stage 6). Nightly
`content-lint.yml` as QUALITY section 5 describes: the `content-lint` Sanity Function's em dash and diacritics
checks (`functions/content-lint/lint.ts`) over the whole dataset, plus QUALITY's missing alt and unconfirmed
credits, writing the `lintReport` documents the Pending view already lists; its read token is a repository
secret the owner adds.

Run /code-review on the whole diff, fix what it finds, commit, open the pull request and stop. Ask the owner to
run /mattpocock-skills:handoff (the skill cannot be invoked by the agent) and save it to
docs/plans/handoff-phase-9.md; write the owner's tickets and the Phase 10 prompt as Phase 8 did. Leave every
`Owner: yes` ticket for the owner, and do not merge.
