# Handoff: Phase 4, the homepage, Visual Editing and route caching

Written 12 September 2026 at the end of the Phase 4 session and revised the same day after the
owner's design review, for the owner's follow-ups and the session that runs Phase 5
(`docs/design/PROMPTS.md`). Branch: `phase-4/homepage-editing-caching`, pull request
https://github.com/Oba-One/omo-yoruba-website/pull/5 against `main`. Tickets: `docs/tickets/phase-4/`
(the spec from the grill, revised at its end, and ten tickets, all resolved, each with a Comments
section on what was found). Research with sources: `docs/research/phase-4-astro-cache-and-vercel-provider.md`,
`phase-4-sanity-visual-editing.md`, `phase-4-live-collections-loader.md`,
`phase-4-lighthouse-ci.md` (with a correction after installing). Decisions: ADR 0021, 0022 and
0023, `CONTEXT.md` (page root, lead event, draft mode, preview host, type tag, purge, edit
attribute). Wayfinder tickets 15, 20 and 21 resolved; 25 (the webhook) still waits on the domain.

## What exists now

- `@oy/ui`: `core/ActionButton` (a Studio action as the right trigger, `usableAction` for the first
  one that renders), `cards/Card` (the base, photos framed by the hotspot), `page/CardGrid`,
  `page/SectionHead`, `page/Section` (white, the tint or paper, batik or corner textures),
  `page/Hero` (copy set left, gold words from `emphasis.ts`), `bands/EventBand`, `page/StatStrip`,
  `cards/ProgramCard`, `cards/PullQuote` (the registry chip over the prototype's placeholder
  slot), `cards/NewsCard`, `content/ProverbLine`, `media/PhotoTile`, `media/PhotoMosaic`,
  `cards/DoorCard`, `cards/PathRow` (chips Membership, Partnership, Volunteer, Give),
  `content/PathRows`, `bands/NewsletterBand`, `page/HomeRoot` (the page root's attributes with the
  `adire` theme), `media/image.ts` (`ImageInput`, `positionOf`), `SiteFooter` with
  `newsletter={false}`. Fixtures in `src/fixtures/` (the seed's facts, the register's photographs
  imported from `docs/design/design/images/w2` as URL assets, Pending states).
  `src/pages/homepage/`: one page-section story per layout option under `Pages/Homepage`. 159
  tests in the package; the static Storybook builds.
- `@oy/content`: `src/queries/` (the one composed `homepageQuery`, reading every program for the
  highlight while the page shows three), `src/lead-event.ts` (the season rule),
  `src/layout-options.ts` and `src/layout.ts`, `src/images.ts` (`createImageSet` from the asset
  reference, with the hotspot as `position`), `src/stega.ts`, `src/api-version.ts`,
  `tagsForRoute`, `pendingWhat` and `HOMEPAGE_VOICE_SLOTS`. Schema: `homepage.hero.blessing`,
  `hero.emphasis` (warns when the words are not in the heading), `voicesIntro`, `voicesProverb`,
  `program.action`, `stat.shortLabel`. The seed patches one level into objects and into keyed
  array items, never into a photograph whose asset the owner replaced; it ran against
  `development` (the copy, the photographs with the prototype's framing as hotspots, the
  Collective's interim photograph, the short labels, the gold word, the Odunde 2027 line);
  TypeGen committed.
- `packages/web`: `/` composed from `buildHomepage` (`src/lib/sanity/homepage.ts`) over
  `loadQuery`; `SiteLayout` takes `root`, `newsletter` and `description`, mounts `VisualEditing`
  in draft mode and reads a posted form outcome from `Astro.locals.formOutcome`;
  `src/lib/forms/action-paths.ts`; `src/lib/cache.ts` and `src/lib/cache-policy.ts` (the
  middleware's guard: draft mode, the preview host, non-GET; the preview host also answers
  `X-Robots-Tag: noindex, nofollow`); `src/lib/sanity/data-attribute.ts`, `purge.ts`;
  `/api/revalidate` purging through the provider; `cacheVercel()` and `PUBLIC_PREVIEW_ORIGIN` in
  the config. Lighthouse CI: `@lhci/cli` 0.15.1 installed, `bun run --filter @oy/web lighthouse`
  with `LIGHTHOUSE_BASE_URL` and `LIGHTHOUSE_PRESET`, `.github/workflows/lighthouse.yml` on every
  `Preview` deployment. Playwright: `e2e/home.spec.ts` (with a layout check against the
  prototype), the Phase 3 specs opening the forms through `openEnquiry` in `e2e/helpers.ts`; 56
  pass and 6 skip by design, both with the seeded dataset and the way CI runs it (placeholder
  project, no Studio data); axe clean at both widths.
- Proof in `development`: none left behind from the publish-to-purge run. One field is wrong, see
  follow-up 4.

## Owner follow-ups, in order

Each is a wayfinder ticket (`docs/plans/wayfinder.md`, Frontier) with the steps in it.

1. Ticket 26: check Visual Editing and the homepage against the prototype, then merge pull request
   5. Production on `omoyorubasocal.org` is a custom domain, outside Vercel Authentication, so after
   the merge the purge and Lighthouse checks in `docs/runbook.md` run against it.
2. Ticket 25: create the Sanity webhook on the public domain.
3. Ticket 27: in `development`, change the recap post's title from "Ọdúndé 2026: the recap" back to
   "Odunde 2026: the recap" (a seed run wrote the prototype's spelling before ADR 0009 was checked;
   a scripted patch was not allowed from the session).
4. Ticket 28: the Lighthouse bypass secret. Lighthouse sends it with every request the page makes
   (the Sanity CDN and PostHog today); the alternative is a Puppeteer cookie route with a new
   dependency. Also whether the two Lighthouse checks become required.
5. Ticket 29: the preview host `preview.omoyorubasocal.org` for editors (domain, CNAME,
   `PUBLIC_PREVIEW_ORIGIN`, redeploy).
6. Ticket 30: the photo hero's heading on phones, the prototype's 34px or the brief's 44px.
7. Ticket 31: a photograph of the Yoruba Cultural Collective (the card shows the interim one).
8. Ticket 32: the favicon (none exists; best practices scores 0.93 partly because of it).
9. Still open from earlier phases: 02 (contacts, EIN, address, phone), 03 (Zeffy, Eventbrite), 04
   and 06 (Gala tables and awards, Phase 5), 05 (zones), 09 (credits), and the testimonials.

Work a session does without the owner: ticket 33 (the homepage misses the mobile Lighthouse budget
on the local production build, 0.67 to 0.77 with a simulated LCP near 6 s against 2.5 s: a 171 KB
logo PNG drawn at 40px and about 470 KB of fonts; desktop 0.97 to 0.98) and ticket 34 (Phase 4
leftovers). The Phase 5 prompt starts with 33.

## Decisions made without the owner (reverse any)

- The grill's answers in `docs/tickets/phase-4/spec.md`: per-request opt-out plus an optional
  preview host for draft mode; `type:` tags per route with the purge by type and by path; the
  overlay's default reload on a mutation; the season rule; the seven options from the singleton;
  the forms seam opening from the real doors and the `?enquiry=<kind>` opener where the page has
  no trigger. The spec's revision records what the design review superseded.
- After the design review (ADR 0023): three program cards; the highlight swapping the hero's gold
  button for the highlighted program's action; news oldest first with Read more on the page each
  post is tagged to, its name completed by the post's title; the voices' placeholder slots under
  the registry chip, filled by context; `hero.emphasis` and `stat.shortLabel`; the prototype's
  framing as hotspots; no CDN crop for card and door photos (the box changes shape with the
  width, so a crop would be cropped again).
- Section kickers and headings are page copy in `index.astro`, not Studio fields.
- The gallery section sits on the theme tint and deepens its kicker and muted text
  (`--text-muted-on-tint`) for AA; the voices section sits on paper as the prototype does.
- Images are CDN sets from the asset reference, never `<Image>` (ADR 0022); the `data-sanity`
  attribute is encoded locally.
- The layout reads form outcomes from locals and the form paths from a helper, so no page imports
  `astro:actions` (which carried the Studio's stylesheets into every page).
- The middleware treats anything but a GET as uncacheable, HEAD included.
- The path-row chips for the volunteer and give doors are "Volunteer" and "Give", from the take-part
  rows of `11 Yoruba Language School.dc.html`.
- Lighthouse's variables are `LIGHTHOUSE_*`, because lhci reads every `LHCI_*` variable as a flag.

## Which document won where they disagreed

- The homepage prototype over ROUTES section 4 and the first Phase 4 spec (three cards, the hero
  button switch, news order and links), at the owner's request (ADR 0023).
- The repo's rules over the prototype: "Odunde" unmarked in display text (ADR 0009), Lessons never
  "School" and no Saturdays, no copy the register marks as invented, the Pending chip on missing
  voices (ADR 0014), the footer's 44px targets.
- The prototype over the brief's hero range for the photo hero, left open for the owner.
- `docs/research/phase-4-*` over the brief: no live loader (wayfinder ticket 20), the
  `VisualEditing` export, `_action` form paths, the Vercel CDN key ignoring cookies (hence the
  preview host).
- The tickets' Comments over the prompt where the preview could not be reached: the proofs ran on
  the built output served locally.

## What the code reviews changed

The first two-axis review found five bugs and a dozen smaller items, all fixed before the first
pull request commit: the `highlight` option never reached the page; the program and door
photographs never rendered their edit attribute; the newsletter and motion options had no edit
container; the head's title and description carried stega in draft mode; an explicit `leadEvent`
reference to a past edition led anyway; the door photo asked for a 360px `sizes`; the homepage
spec would have failed on the first dated edition. Standards: missing stories and tests, page
styling in the gallery, the registry keyed by a GROQ string, chips for unregistered fields, drift
from the glossary, a fallback link without a prototype, a gold default on `ActionButton`.

The design review's multi-angle review (15 findings reported) changed: a re-seed would have
reframed and recaptioned photographs the owner replaced (the seed now checks the asset); a
half-filled program action removed the hero's gold button (`usableAction`); the highlight could
not reach a program outside the first three (the query reads all); the newsletter band's form
hugged the right on tablets; the band's summary ran into the date and its line inherited the
generic band's 15px; placeholder voice slots ignored which voices exist and had dropped the Pending
chip; the gold word rendered at 700; three identical "Read more" names; the band e2e check passed
on a missing edition and CI audited a different form than local runs; stale Studio descriptions,
the handoff and a detached doc comment; Lighthouse measured Vercel's toolbar and its workflow's
comment misdescribed forks. Left as recorded: the header route's disclosure of the bypass secret
(the owner's call, follow-up 3), the dead `.v2-cta--*` rules in the ported CSS, the route mapping in
`newsHref` beside the Presentation resolvers, the Presentation locations listing the homepage for
the fourth program, and the `@lhci/cli` install size in every workspace install.

## Environment notes

`docs/runbook.md` and the session memory hold the details: Node 22 on PATH for every Astro,
Vitest and Playwright command; Astro refuses a second dev server while the Playwright one runs on
4322 (stop the preview first); the Vercel adapter has no `astro preview`, so the built function is
served by a scratch Node server around `.vercel/output` (build request URLs from the Host header,
add brotli and a cache before trusting Lighthouse numbers); run Playwright once with
`PUBLIC_SANITY_PROJECT_ID=placeholder SANITY_API_READ_TOKEN=` to see what CI sees; compare a
prototype by serving `docs/design/design` over HTTP and capturing both pages with the Chrome
DevTools MCP into the gitignored `test-results/`; `CHROME_PATH` for lhci can point at Playwright's
Chrome for Testing.

## Suggested skills for the next session

The paste-ready prompt for Phase 5 is `docs/plans/prompt-phase-5.md`; it starts with ticket 33.

`/to-tickets` for Phase 5 (the two event pages), then `/implement` per ticket with `/tdd` on the
schedule and tier logic; `research` before pinning `astro-portabletext` (Phase 5 renders block
content) and before any `@sanity/visual-editing` decision; repo skills `oy-page` (the Odunde and
Gala pages from their prototypes, `cachePage` on each, compared against the prototype at 375 and
1440 before review), `oy-component` (PageHeader, GlanceStrip, TakePartBand, ZoneCard,
TicketTierCard, ScheduleRow, PhotoCarousel, PartnerRow; PathRow needs the quiet action the give row
uses on the program pages), `oy-content-model`; `/code-review` before the commit; `/handoff` at the
end.
