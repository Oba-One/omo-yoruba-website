# Wayfinder map: omoyorubasocal.org on Astro 7 and Sanity

Charted 4 September 2026 in Phase 0. Tracker conventions: `docs/agents/issue-tracker.md`.
Child tickets: `docs/tickets/wayfinder/issues/`. A ticket marked `Owner: yes` is the
owner's decision; no session answers it for them.

## Destination

Every route in `docs/design/ROUTES-AND-INTERACTIONS.md` renders from Sanity and matches
its prototype at 375 and 1440 with a named Pending chip wherever content is still owed;
every component lives once in `@oy/ui` with a story; Visual Editing and cache purge work;
the eight enquiry forms create a document and an email within a minute, and the newsletter
stores its subscriber (it sends nothing, ticket 01); the quality bars in
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

- [GitHub and Vercel are named](../tickets/wayfinder/issues/12-github-org-and-vercel-team.md): the
  repository `Oba-One/omo-yoruba-website` on the owner's personal account, and the project
  `omo-yoruba` in the Greenpill Dev Guild team; resolved 27 September 2026.

- Domain: `omoyorubasocal.org`, bought by the owner on 11 September 2026 through Vercel, since the
  old `omoyorubaofsocal.org` is registered elsewhere and not yet in the owner's hands. Its DNS
  is at Cloudflare. The repo, the wizard and the Vercel project use the new name; the old one
  redirects here once the owner controls it (ticket 10). Vercel reads the `development` dataset
  until D3 makes `production` private and it is seeded.

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
- [The FAQ accordion and the inline programs are native disclosures](../adr/0032-native-disclosures-for-the-accordion-and-inline-programs.md)
  with no script (`docs/research/phase-6-faq-accordion.md`), and
  [the program pages follow their prototypes under the repo rules](../adr/0033-program-pages-follow-their-prototypes-under-the-repo-rules.md):
  placeholders instead of interim photographs, AA greens and kickers on the Collective's strong tint, a
  handoff box white on an alternate ground (Phase 6).
- [Doors gain the vendor door, and the give door closes Get Involved](../adr/0034-doors-gain-vendor-and-give-closes-get-involved.md),
  and [the trust pages' content model](../adr/0035-trust-pages-content-model.md): an outcome names one
  subject (a program or an event page), Impact reads the civic figures from the festival's editions and
  the newest governance document of each kind, a timeline entry is a year and one line, Our Story's names
  come from `person` documents, Donate's Zeffy facts stay owed until the form is set up, and the seed
  moves a value an earlier seed wrote only while it still reads as written (Phase 7 grill, owner's answers
  in `docs/tickets/phase-7/spec.md`).
- [The trust pages follow their prototypes under the repo rules](../adr/0036-trust-pages-follow-their-prototypes-under-the-repo-rules.md):
  a placeholder for the earliest photograph, one gold action per view on all four pages, the prototypes'
  section lead on every section head, Impact's six photographs as equal tiles, and the People and History
  prototype's paper grounds read as its runtime, not intent (Phase 7).
- [A photo address opens the Lightbox, and Back closes it](../adr/0037-a-photo-address-opens-the-lightbox-and-back-closes-it.md):
  `?photo=<key>` is the second URL-driven open beside `#give`, served open without JavaScript; one history entry
  per visit, and a guard in the layout's head keeps Astro's router from reloading the page on Back (Phase 8 grill,
  owner's answers in `docs/tickets/phase-8/spec.md`).
- [Photographs swipe on touch](../adr/0038-photographs-swipe-on-touch.md), answering ticket 37's swipe question for
  the Lightbox and the carousel together, and [the gallery's content model](../adr/0039-gallery-content-model.md):
  an album's year from its edition, albums shown only with a photograph, one `captions` option for both pages,
  `soon` beside the Pending line, and the consent policy in the owner's words (Phase 8).
- [The gallery follows its prototype under the repo rules](../adr/0040-gallery-follows-its-prototype-under-the-repo-rules.md):
  the mosaic's geometry to the pixel, the whole photograph in the Lightbox, the register's captions and chips in
  place of the prototype's inventions, and the prototype runtime's shrunken titles read as its runtime (Phase 8).
- [The homepage under the mobile performance budget](../tickets/wayfinder/issues/33-homepage-mobile-lighthouse-budget.md):
  right-sized logos, weight-only Source Serif 4 and renamed Yoruba subsets (ADR 0026); mobile 0.77 to
  0.95, LCP 5.9 s to 2.7 s; the last 0.2 s is ticket 35 (Phase 5, owner's choice of fonts).
- [Editor roles](../tickets/wayfinder/issues/22-editor-roles.md): members are Sanity Editors, and
  administrators keep site settings, the Inbox and the held-back switches (D4, ADR 0042).
- Phases 4 to 7 checked and merged ([26](../tickets/wayfinder/issues/26-check-phase-4-and-merge.md),
  [36](../tickets/wayfinder/issues/36-check-phase-5-and-merge.md),
  [39](../tickets/wayfinder/issues/39-check-phase-6-and-merge.md),
  [41](../tickets/wayfinder/issues/41-check-phase-7-and-merge.md)): what they left open moved to open-work rows.

- [Persisted dialogs listen for their triggers once, and draft mode loads pages in full](../adr/0041-dialog-listeners-register-once-and-draft-mode-full-loads.md):
  the home page's flashing and white gap after a client-side arrival (weeks 1 and 2, 26 September 2026).
- [The deep review](review-alignment-and-quality.md): 165 findings with a ticket each, the blockers fixed and the
  majors triaged on 27 September (pull requests 16 and 17).
- [Coming soon is the consent hold for the albums](../adr/0043-coming-soon-is-the-consent-hold-for-the-albums.md):
  album pages, photo addresses and the event pages' past photographs; a page's own photographs stay (D5 decides
  whether the hold should reach them).
- [Draft mode needs a session the enable route signs](../adr/0044-draft-mode-needs-a-signed-session.md): a
  perspective cookie set by hand reads as published.
- [Online giving options](../research/online-giving-options.md): Zeffy embedded properly, Stripe behind our own
  form, Every.org and Give Lively, ranked with sources (27 September 2026).
- Consent for faces (D5): the organization has consent; its event photographer took the photographs (27 September
  2026). `development` holds the real content through launch, and `production` is made private (D3, the same day).
- [A photo credit links to the photographer's page](../adr/0046-a-photo-credit-links-to-the-photographers-page.md):
  the three albums credit the event photographer, Red Carpet Films, confirmed, the name linking to their YouTube
  channel (28 September 2026). A later album's photographer is the owner's word again.

## Frontier

Phases 0 to 8 have merged (pull requests 1 to 9), and so has the weeks 1 and 2 work in
`docs/plans/four-week-plan.md`: pull requests 10 to 17 merged on 27 September, 13 and 14 with their migrations
applied that day (ADR 0042). The Zeffy embed work (the owner chose Zeffy, embedded) has its own pull request. `docs/plans/open-work.md` holds everything still
open. Below are the owner decisions still open; Gates names what each holds up now, with its
open-work row and priority. Details in each ticket.

| Ticket | Decision | Gates |
| --- | --- | --- |
| 17 | Finish the setup: Resend and the functions, PostHog, Chromatic (wizard stages 4 to 6) | Enquiry emails and the content-lint reports, analytics, visual baselines (D16, E16: Launch) |
| 18 | Accept the em dash lint carve-out for `docs/design/` | Nothing waits: `.lintignore` holds the carve-out today (D23: Later) |
| 11 | Storybook hosting: separate Vercel project or a path under the site | A shareable Storybook (D20: Later) |
| 02 | EIN, mailing address, phone, routing email per enquiry kind | Enquiry routing and the organization's facts on every page (C1: Now); tickets 38, 42 and 44 |
| 05 | The two unnamed festival zones | Odunde's zones (C4: Launch) |
| 09 | The summer camp's year (the credits were confirmed on 28 September, ADR 0046) | The summer camp album's year (C3: Now) |
| 03 | Zeffy embed URL and Eventbrite event URL | The Give Dialog's form (C1: Now) and the Gala's ticket buttons (C5: Launch); Zeffy, embedded, chosen on 27 September from `docs/research/online-giving-options.md` |
| 25 | Create the Sanity webhook on the public host | Edits on the site within a minute (E1: Now): one exists on the stand-in host; the purge check and the move with D2 remain |
| 27 | Put the recap post's title back to "Odunde 2026: the recap" in `development` | The homepage's news card (C2: Now) |
| 28 | Lighthouse bypass secret (header or cookie route), required Lighthouse checks | Lighthouse on previews (D14, E14: Launch) |
| 29 | A preview host for editors | Drafts in the Presentation tool on the public host (D15: Launch) |
| 30 | Photo hero heading on phones: the prototype's 34px or the brief's 44px | The type tokens and AGENTS.md's sizes (D11: Launch; the sizes half of E7) |
| 31 | A photograph of the Yoruba Cultural Collective | The Collective's photograph on the homepage, Programs and Collective pages (C2: Now) |
| 32 | The favicon: confirm the icon that went in on 10 October, or pick another of its five options | Nothing waits: the files are in (D7: Now; E3 is done) |
| 04 | Gala tables: enquiry or purchase | The Gala's tables block and its copy (D9: Launch) |
| 06 | Gala awards: yes or no | The Gala's honorees block (D10: Launch) |
| 37 | The photo carousel's controls, answers 2 to 5 (ADR 0027) | Styling only (D19: Later) |
| 38 | The event pages' owed facts (Odunde 2027, Gala 2026, albums) | Their Pending chips (C4, C5: Launch) |
| 40 | The program pages' owed facts (the teacher, the Lessons answers, the initiatives, the Collective's argument and voice) | Their Pending chips (C6 to C8: Launch) |
| 42 | The trust pages' owed facts (the EIN and contacts, sources, outcomes, governance, people, the Zeffy form, giving levels) | Their Pending chips (C9 to C12: Launch) |
| 44 | The gallery's owed facts (the consent policy, the general inbox, the summer camp's year, captions, the header line; consent for faces is settled, D5, and the credits, ADR 0046) | Its Pending chips (C3: Now) |
| 07 | Our Story's timeline: show it once its entries are confirmed, keep it hidden, or drop it | The timeline block (D21: Later) |
| 10 | Old site URLs for redirects | The redirects (D18, E11: Launch) |
| 13 | CSP enforcement versus the `<ClientRouter />` cross-fade | The enforced CSP (D13, E9: Launch) |
| 08 | News cadence: feed or list | The News page (D22, C13: Later) |

A session works ticket 35 without the owner (the last 0.2 s of the mobile LCP and the event pages'
font-swap shift, open-work E12). Resolved: 19 in Phase 1; 15, 20 and 21 in Phase 4; 33 and 34 in
Phase 5; 12 on 27 September. The check-and-merge tickets are closed: 43 on 13 September with pull
request 9, and 26, 36, 39 and 41 on 27 September, their pull requests (5 to 8) having merged on 12
and 13 September. Each one's last comment says where its remaining calls went.

## Not yet specified

- The News & Events page: feed or list, filter chips, calendar rows or cards. Waits on
  ticket 08.
- Agent Actions candidates (alt text drafts, Yoruba kicker suggestions): owner-triggered
  only; shape unknown until Phase 10.
- Nightly `content-lint.yml` delivery: a summary in the Studio's To do, an email, or both.
- OG image generation (Phase 9); redirects list shape (ticket 10). The 404 page's three doors
  (the homepage, Get Involved, Programs) were chosen in week 1 for the owner to confirm.
- Who may publish once members edit: settled by D4 (members are Editors, ADR 0042); Content
  Releases are off.

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
