# Wayfinder map: omoyorubasocal.org on Astro 7 and Sanity

Charted 4 September 2026 in Phase 0. Tracker conventions: `docs/agents/issue-tracker.md`.
Child tickets: `docs/tickets/wayfinder/issues/`. A ticket marked `Owner: yes` is the
owner's decision; no session answers it for them.

## Destination

Every route in `docs/design/ROUTES-AND-INTERACTIONS.md` renders from Sanity and matches
its prototype at 375 and 1440 with a named Pending chip wherever content is still owed;
every component lives once in `@oy/ui` with a story; Visual Editing and cache purge work;
all nine forms create a document and an email within a minute; the quality bars in
`docs/design/QUALITY.md` are met; and the owner adds a news post, an event and an album from
Claude Code without opening code. Full list: `docs/design/README.md` section 8.

## Notes

- The route is already charted: ten phases in `docs/design/README.md` section 6, one
  paste-ready prompt per phase in `docs/design/PROMPTS.md`, and the confirmed decisions in
  README section 3 (recorded as ADRs 0001 to 0010). This map holds what those documents
  leave open, plus what Phase 0 research surfaced.
- Skills every session should consult: `oy-design-system`, `oy-voice`, `oy-component`,
  `oy-page`, `oy-content-model`, `oy-content-ops`; `/to-tickets` and `/implement` per phase;
  `research` before pinning any library; `/handoff` at the end.
- Standing preferences: no em dashes; never invent content; `.astro` components only;
  stop and ask before any pivot; owner checkpoints after Phase 0 and Phase 1.
- Stall rules: `docs/design/PROMPTS.md`, last section.

## Decisions so far

- [Phase 0 stack versions and library facts](../tickets/wayfinder/issues/24-phase-0-stack-research.md):
  pins in `docs/research/phase-0-stack-versions.md`; Astro CSP, cache and env facts,
  Biome, lefthook and PostHog notes alongside it.
- [Issue tracker is local Markdown under docs/tickets](../agents/issue-tracker.md):
  single owner, five labels, wayfinding operations defined.
- [CSP ships as a report-only header, enforcement decided in Phase 9](../adr/0011-csp-report-only-header-until-phase-9.md):
  ADR 0011, status proposed; the owner's call is ticket 13.

- [Every workspace lives under packages/, like green-goods](../adr/0003-bun-workspaces-monorepo.md):
  `packages/web` instead of the handoff's `apps/web`, and the Storybook config inside
  `packages/ui/.storybook/` instead of a workspace of its own; owner's instructions on 4 and
  5 September 2026.

- [Agent guidance is tool-neutral](../adr/0012-agent-guidance-is-tool-neutral.md): `AGENTS.md`
  is the contract, `CLAUDE.md` imports it, `.agents/skills` symlinks the skills; owner's
  instruction on 5 September 2026.

- [Fonts: self-hosted fontsource files, subsets latin, latin-ext and vietnamese](../tickets/wayfinder/issues/19-fonts-provider-and-subsets.md):
  hand-written `@font-face` rules in `@oy/tokens/fonts.css`, no font origin in the CSP, Yoruba
  text kept NFC; research in `docs/research/fonts-source-serif-sans-subsets.md` (Phase 1).

- [.astro holds in Storybook: the Phase 1 checkpoint is closed](../tickets/wayfinder/issues/16-astro-in-storybook-checkpoint.md):
  the owner merged pull request #2 on 5 September 2026; the stubs and workarounds carry in the
  ticket's answer; no pivot (ADR 0002).

- Domain: `omoyorubasocal.org`, bought by the owner on 11 September 2026 through Vercel, since the
  old `omoyorubaofsocal.org` is registered elsewhere and not yet in the owner's hands. Its DNS
  is at Cloudflare. The repo, the wizard and the Vercel project use the new name; the old one
  redirects here once the owner controls it (ticket 10). Vercel reads the `development` dataset
  until `production` is seeded.

- `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` are required at build time since Phase 2
  (the data layer exists); CI builds with placeholder values (`docs/runbook.md`).

- [Sanity Studio v6, not the v5 line the brief named](../tickets/wayfinder/issues/14-sanity-studio-major.md):
  `sanity` 6.12.0 with `@sanity/astro` 3.5.1; the v6 breaking changes touch nothing the repo
  configures; pins and the facts that contradict the brief are in the ticket's answer and
  `docs/research/phase-2-*.md` (Phase 2, the owner's yes gates the install).

- [Newsletter: subscriber documents, nothing sends](../tickets/wayfinder/issues/01-newsletter-provider.md):
  the `newsletter` action stores the address, a repeat reads as success, the Inbox marks exports;
  a provider is a later forward step (ADR 0019); owner's yes on 11 September 2026.

- [The newsletter success label is "Ẹ ṣé! ✓"](../tickets/wayfinder/issues/23-newsletter-success-label.md):
  the routes table's tilde spelling was a typo; one spelling for every success state; owner's
  yes on 11 September 2026.

- [Lists read through the hand-written loadQuery, not a live loader](../tickets/wayfinder/issues/20-sanity-loader-for-live-collections.md):
  a live loader never sees the perspective cookie and `@sanity/astro` ships none; one `defineQuery`
  per page in `packages/content/src/queries/` (Phase 4).

- [Draft mode opts out of the cache per request; a preview host keeps editors off the public copy](../tickets/wayfinder/issues/21-cache-and-draft-mode.md):
  ADR 0021; pages carry `type:` tags and `/api/revalidate` purges by type and by path (Phase 4).

- [The homepage loads 15 KB of gzipped JavaScript; PostHog alone is 89 KB, deferred](../tickets/wayfinder/issues/15-analytics-bundle-vs-js-budget.md):
  measured on the Phase 4 build; Phase 9 picks between `posthog-js`, its lite build and the snippet.

- [The homepage follows its prototype where ROUTES and the Phase 4 spec differed](../adr/0023-homepage-follows-its-prototype.md):
  ADR 0023, at the owner's request after the design review on 12 September 2026; repo rules still
  outrank the prototype (Odunde unmarked, Lessons never School, the Pending chip, no invented copy).

- [Lighthouse CI: `@lhci/cli` 0.15.1 installed, every preview audited](../research/phase-4-lighthouse-ci.md):
  owner's yes on 12 September 2026; `.github/workflows/lighthouse.yml` skips until the bypass secret
  exists (ticket 28); the config reads `LIGHTHOUSE_*`, since lhci treats `LHCI_*` as flags.

- [One route map for editions and programs](../tickets/wayfinder/issues/34-phase-4-leftovers.md):
  `editionRoute` and `programRoute` in `@oy/content/routes` serve the news cards, the event band and
  the Presentation tool; the dead hero switch rules are gone (Phase 5).

- [Event pages show the next edition, the last one as past years](../adr/0024-event-pages-show-the-next-edition.md):
  Pending between editions, the Eventbrite link on the edition, empty blocks as Pending lines (Phase 5).
- [Take-part rows live on the page singleton](../adr/0025-take-part-rows-live-on-the-page-singleton.md),
  [the photo carousel is a tabbed carousel under the repo rules](../adr/0027-photo-carousel-is-a-tabbed-carousel-under-the-repo-rules.md)
  (ticket 37 holds the owner's review), and
  [the event pages follow their prototypes under the repo rules](../adr/0028-event-pages-follow-their-prototypes-under-the-repo-rules.md).
  Page-section stories show owed content in the prototypes' bracketed placeholder form ("[ Price ]",
  "[ The opening of the day ]") beside Pending chips, never a mock name or price.
- [Take-part rows grow to nine ways in, with the row's own chip](../adr/0029-nine-ways-in-and-the-row-chip.md),
  [collective events list while dated and still to come](../adr/0030-collective-events-list-while-dated-and-to-come.md),
  and [the program pages follow the slimmed prototypes](../adr/0031-program-pages-content-model.md): Lessons
  without voices, sub-programs with their own photographs and facts, the year strip naming kinds, green
  inside the Collective page's `main` (Phase 6 grill, owner's answers in `docs/tickets/phase-6/spec.md`).
- [The homepage under the mobile performance budget](../tickets/wayfinder/issues/33-homepage-mobile-lighthouse-budget.md):
  right-sized logos, weight-only Source Serif 4 and renamed Yoruba subsets (ADR 0026); mobile 0.77 to
  0.95, LCP 5.9 s to 2.7 s; the last 0.2 s is ticket 35 (Phase 5, owner's choice of fonts).

## Frontier

Owner decisions that gate a phase, in phase order. Details in each ticket.

| Ticket | Decision | Gates |
| --- | --- | --- |
| 12 | GitHub org and repo name, Vercel team | Phase 0 wizard |
| 17 | Run `scripts/setup-wizard.sh` (Sanity, Vercel, Resend, PostHog, Chromatic) | Phase 2 seed, Phase 4 preview |
| 18 | Accept the em dash lint carve-out for `docs/design/` | Phase 0 sign-off |
| 11 | Storybook hosting: separate Vercel project or a path under the site | Phase 1 |
| 02 | EIN, mailing address, phone, routing email per enquiry kind | Phase 2 seed, Phase 3 routing |
| 05 | The two unnamed festival zones | Phase 2 seed, Phase 5 |
| 09 | Photo credits to confirm | Phase 2 seed |
| 22 | Editor roles on the Sanity plan | Phase 2 |
| 03 | Zeffy embed URL and Eventbrite event URL | Phase 3, Phase 5 |
| 26 | Check Visual Editing and the cache, merge pull request 5 | Phase 5 branch, ticket 25 |
| 25 | Create the Sanity webhook on the public domain | Publish-to-purge in production |
| 27 | Put the recap post's title back to "Odunde 2026: the recap" in `development` | The homepage news card |
| 28 | Lighthouse bypass secret (header or cookie route), required Lighthouse checks | Lighthouse on previews |
| 29 | Preview host `preview.omoyorubasocal.org` for editors | Draft previews on the live site |
| 30 | Photo hero heading on phones: the prototype's 34px or the brief's 44px | One token |
| 31 | A photograph of the Yoruba Cultural Collective | Phase 6 program pages |
| 32 | The favicon | Ticket 33 (best practices) |
| 04 | Gala tables: enquiry or purchase | Phase 5 |
| 06 | Gala awards: yes or no | Phase 5 |
| 36 | Check the event pages in the Studio and on the preview, merge pull request 6 | Phase 6 branch |
| 37 | The photo carousel's controls (ADR 0027's answers) | The Lightbox, Phase 8 |
| 38 | The event pages' owed facts (Odunde 2027, Gala 2026, albums) | Launch |
| 07 | Our Story timeline shown by default | Phase 7 |
| 10 | Old site URLs for redirects | Phase 9 |
| 13 | CSP enforcement versus the `<ClientRouter />` cross-fade | Phase 9 |
| 08 | News cadence: feed or list | Later phase |

Research and design tickets the phases work themselves: 15 (analytics bundle versus the JS
budget), 20 (Sanity loader for live collections), 21 (cache and draft mode), 35 (the last 0.2 s of
the homepage's mobile LCP, Phase 9). Tickets 33 and 34 were resolved in Phase 5. Ticket 19 (fonts) was resolved in Phase 1.

## Not yet specified

- The News & Events page: feed or list, filter chips, calendar rows or cards. Waits on
  ticket 08.
- Agent Actions candidates (alt text drafts, Yoruba kicker suggestions): owner-triggered
  only; shape unknown until Phase 10.
- Nightly `content-lint.yml` delivery: a summary in the Pending view, an email, or both.
- OG image generation and the 404 page's three doors (Phase 9); redirects list shape
  (ticket 10).
- Content Release naming and who may publish one; depends on ticket 22.

## Out of scope

- Building the News & Events page before the posting cadence is known (README section 3).
- Any React or framework component shipped to the site; islands only with owner approval.
- remark or rehype plugins (Sätteri is the pipeline; no need has appeared).
- A third-party form service or emailing straight from actions (ADR 0004).
- A newsletter sender: subscribers are stored, nothing sends, until ticket 01 names one.
- Custom checkout: Zeffy's API is read-only, so the embed is the checkout.
- `AmountSelector` and `MultiStepForm` (retired in the component map).
- Iconography beyond the glyph set; kente or Adinkra patterns; stock or AI imagery.
- Redesigning the homepage, nav, footer or card hover language (Build Brief, "Do not").
