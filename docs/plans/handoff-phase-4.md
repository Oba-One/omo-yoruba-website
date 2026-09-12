# Handoff: Phase 4, the homepage, Visual Editing and route caching

Written 12 September 2026 at the end of the Phase 4 session, for the owner's follow-ups and the
session that runs Phase 5 (`docs/design/PROMPTS.md`). Branch: `phase-4/homepage-editing-caching`,
pull request https://github.com/Oba-One/omo-yoruba-website/pull/5 against `main`. Tickets: `docs/tickets/phase-4/` (the spec from the grill
and ten tickets, all resolved, each with a Comments section on what was found). Research with
sources: `docs/research/phase-4-astro-cache-and-vercel-provider.md`,
`phase-4-sanity-visual-editing.md`, `phase-4-live-collections-loader.md`,
`phase-4-lighthouse-ci.md`. Decisions: ADR 0021 and 0022, `CONTEXT.md` (page root, lead event,
draft mode, preview host, type tag, purge, edit attribute). Wayfinder tickets 15, 20 and 21
resolved; 25 (the webhook) still waits on the domain.

## What exists now

- `@oy/ui`: `core/ActionButton` (a Studio action as the right trigger), `cards/Card` (the base),
  `page/CardGrid`, `page/SectionHead`, `page/Section` (white, the tint or paper, batik or corner
  textures), `page/Hero`, `bands/EventBand`, `page/StatStrip`, `cards/ProgramCard`,
  `cards/PullQuote`, `cards/NewsCard`, `content/ProverbLine`, `media/PhotoTile`,
  `media/PhotoMosaic`, `cards/DoorCard`, `cards/PathRow`, `content/PathRows`,
  `bands/NewsletterBand`, `page/HomeRoot` (the page root's data attributes for the stories),
  `media/image.ts` (`ImageInput`), `SiteFooter` with `newsletter={false}`. Fixtures in
  `src/fixtures/` (the seed's facts, the register's photographs imported from
  `docs/design/design/images/w2` as URL assets, Pending states). `src/pages/homepage/`: one
  page-section story per layout option under `Pages/Homepage`. 142 tests in the package; the
  static Storybook builds.
- `@oy/content`: `src/queries/` (the one composed `homepageQuery`, `site.ts` as before),
  `src/lead-event.ts` (the season rule), `src/layout-options.ts` and `src/layout.ts` (the tweak
  lists and the defaults, no Sanity import), `src/images.ts` (`createImageSet` from the asset
  reference), `src/stega.ts` (the filter for the logic keys), `src/api-version.ts`,
  `tagsForRoute` and a filtered `pendingWhat`. Schema: `homepage.hero.blessing`, `voicesIntro`,
  `voicesProverb`, `program.action`. The seed patches one level into objects and ran against
  `development` (the copy above, the Lessons and Kids & STEM photographs and actions, the member
  and partner door photographs); TypeGen committed.
- `packages/web`: `/` composed from `buildHomepage` (`src/lib/sanity/homepage.ts`) over
  `loadQuery`; `SiteLayout` takes `root`, `newsletter` and `description`, mounts `VisualEditing`
  in draft mode and reads a posted form outcome from `Astro.locals.formOutcome`;
  `src/lib/forms/action-paths.ts`; `src/lib/cache.ts` (`cachePage`) and `src/lib/cache-policy.ts`
  (the middleware's guard: draft mode, the preview host, non-GET); `src/lib/sanity/data-attribute.ts`
  (the `data-sanity` encoder), `purge.ts` (`purgePlan`); `/api/revalidate` purging through the
  provider; `cacheVercel()` and `PUBLIC_PREVIEW_ORIGIN` in the config; the perspective cookie
  validated; the stega filter on the client. `lighthouserc.cjs` with the QUALITY budgets.
  Playwright: `e2e/home.spec.ts`, the Phase 3 specs opening the forms from the real doors; 54
  pass, 6 skip by design, axe clean at both widths.
- Proof in `development`: none left behind; the publish-to-purge run patched `hero.sub` and
  reverted it. The photographs and copy the seed added stay.

## Owner follow-ups, in order

1. The custom domain. Every `vercel.app` host of the project, the production alias included, is
   behind Vercel Authentication since Deployment Protection reads "all except custom domains",
   and the share links the Vercel tools mint land on the Vercel login. Until
   `omoyorubasocal.org` resolves to the project, nothing outside a Vercel session can reach the
   site: not the Sanity webhook, not Lighthouse, not a browser check of the cache. Attach the
   domain (the Cloudflare records), then run the checks in `docs/runbook.md` ("Webhook and cache
   purge", "Lighthouse") and create the webhook (wayfinder ticket 25).
2. Visual Editing: open `/admin`, the Presentation tool, the homepage; check click-to-edit on the
   hero heading, a photograph, the event band (the season option) and the mosaic (the gallery
   option); a saved change reloads the page. Then decide the preview host: set
   `PUBLIC_PREVIEW_ORIGIN` to a second hostname of the production deployment (ADR 0021) or accept
   that an editor's iframe on the public host may show the cached public copy.
3. Lighthouse CI: say yes to `@lhci/cli` 0.15.1 (`docs/research/phase-4-lighthouse-ci.md`,
   Recommendation) and create the Protection Bypass for Automation secret as the repository
   secret `VERCEL_AUTOMATION_BYPASS_SECRET`; the config and the workflow shape are ready.
4. Branch protection: no new context this phase.
5. Wayfinder tickets 02 (contacts, EIN, address, phone), 03 (Zeffy, Eventbrite), 05 (zones),
   09 (credits) and the testimonials (presence pending) still gate content; the homepage shows
   their chips.

## Decisions made without the owner (reverse any)

- The grill's six answers in `docs/tickets/phase-4/spec.md`: per-request opt-out plus an optional
  preview host for draft mode; `type:` tags per route with the purge by type and by path; the
  overlay's default reload on a mutation; the season rule (explicit reference, then the kind's
  nearest edition, then auto by date or by calendar); the seven options from the singleton with
  the highlight collapsing the prototype's three hero buttons into the one primary action; the
  forms seam opening from the real doors and the `?enquiry=<kind>` opener where the page has no
  trigger.
- Four schema fields for copy the prototype carries (`hero.blessing`, `voicesIntro`,
  `voicesProverb`, `program.action`), seeded with the prototype's words; program and door
  photographs seeded from the register (the Collective and Cultural Exchange stay placeholders).
- Section kickers and headings ("Our programs", "Member voices", "News & events", "A year in the
  life") are page copy in `index.astro`, not Studio fields.
- Four programs across, from Sanity, where the prototype shows three.
- News cards carry no link until the News page exists (ticket 08); the three posts are newest
  first, where the prototype lists them oldest first.
- Three Pending quote cards while there is no testimonial, as the prototype's placeholders.
- The gallery section sits on the theme tint and deepens its kicker and muted text
  (`--text-muted-on-tint`, a new token) for AA; the voices section sits on paper as the prototype
  does.
- Images are CDN sets from the asset reference, never `<Image>` (ADR 0022); the `data-sanity`
  attribute is encoded locally rather than adding `@sanity/visual-editing` as a dependency.
- The layout reads form outcomes from locals and the form paths from a helper, so no page
  imports `astro:actions` (which carried the Studio's stylesheets into every page, a Phase 3
  leak found by Lighthouse). The action query parameter `_action` is Astro's internal name.
- `@lhci/cli` is not installed (the owner gates installs); Lighthouse ran through Chrome
  DevTools on the built output.
- The middleware treats anything but a GET as uncacheable, HEAD included.
- Two chip labels the prototypes lack, for the owner to confirm: "Volunteering" and "Giving" on
  the volunteer and give path rows (the prototype shows only "Membership" and "Partnership").

## Which document won where they disagreed

- ROUTES section 4 ("programs (4 cards)") over the prototype's three cards.
- The prototype (voices on paper, gallery on the tint) over a uniform alt ground; AA over the
  prototype for the tint's kicker and muted grey.
- `docs/research/phase-4-*` over the brief: no live loader (wayfinder ticket 20), the
  `VisualEditing` export not `SanityVisualEditing`, `_action` form paths instead of
  `astro:actions` in a page, the Vercel CDN key ignoring cookies (hence the preview host).
- The tickets' Comments over the prompt where the preview could not be reached: the proofs ran on
  the built output served locally.

## What the code review changed

The two-axis review (Standards and Spec, `/code-review`) found five bugs and a dozen smaller
items, all fixed before the last commit: the `highlight` option never reached the page (the
prototype's page rule for the gold ring was not in the ported CSS; it now lives in
`ProgramCard`); the program and door photographs never rendered their edit attribute (`Card`
takes `imageEdit`); the newsletter and motion options had no edit container (the band and the
hero carry theirs); the head's title and description carried stega in draft mode (`stegaClean`
in `buildHomepage`); an explicit `leadEvent` reference to a past edition led anyway (it falls
through now); the hero heading ignored the theme's scale (the token instead of the prototype's
clamp); the door photo asked for a 360px `sizes`; the homepage spec would have gone red on the
first dated edition or the `gallery: 5` option. Standards: `HomeRoot` had no story or test;
`Default` and `Pending` stories were missing on several parts; the gallery's closing line was
page styling (the map's `Handoff` part exists now); `EventBand` keyed the registry with a GROQ
string (`pendingWhat` takes a kind); chips stood in for fields the registry never listed (the
registry gained `homepage.hero.title`, `hero.image`, `stats[]`, `raiseYourHand.title` and
`door.blurb`; validation-required fields render nothing when empty); "the next event" drifted
from the glossary's lead event, as did `preview` from draft mode in the new modules; the
"See the program" fallback link had no prototype (no action, no link); `ActionButton` defaulted
to gold; the `readonly` layout specs lost their casts; `ImageSetOptions.widths`, the unused
`corners` texture, the unused `href` and `theme` props and `cachePage`'s `uncacheable` went;
`ResolvedImage` and `FormOutcome` are declared once. Left as recorded: the `Volunteering` and
`Giving` chip labels (no prototype, the owner's to confirm); raw pixel sizes where the prototype
sets them and no scale token matches; the festival and gala mapping in three places; the proofs
on the built output rather than the Vercel preview.

## Environment notes

`docs/runbook.md` and the session memory hold the details: Node 22 on PATH for every Astro,
Vitest and Playwright command; Astro refuses a second dev server while the Playwright one runs
on 4322 (stop the preview first); the Vercel adapter has no `astro preview`, so the built
function was served by a scratch Node server around `.vercel/output` for the cache, draft,
purge and Lighthouse checks; `curl` is denied by the permission system, `bun` scripts with
`fetch` are not; the Chrome DevTools MCP runs Lighthouse (no performance category) and a
performance trace against a local URL.

## Suggested skills for the next session

`/to-tickets` for Phase 5 (the two event pages), then `/implement` per ticket with `/tdd` on the
schedule and tier logic; `research` before pinning `astro-portabletext` (Phase 5 renders block
content) and before any `@sanity/visual-editing` decision; repo skills `oy-page` (the Odunde and
Gala pages from their prototypes, `cachePage` on each), `oy-component` (PageHeader, GlanceStrip,
TakePartBand, ZoneCard, TicketTierCard, ScheduleRow, PhotoCarousel, PartnerRow), `oy-content-model`;
`/code-review` before the commit; `/handoff` at the end.
