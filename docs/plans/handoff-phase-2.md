# Handoff: Phase 2, the content model

Written 11 September 2026 at the end of the Phase 2 session, for the owner's follow-ups and the
session that runs Phase 3 (`docs/design/PROMPTS.md`). Branch: `phase-2/content-model`, pull
request https://github.com/Oba-One/omo-yoruba-website/pull/3 against `main`. Tickets:
`docs/tickets/phase-2/issues/` (fourteen; 11 is `claimed`, the rest resolved). Research with
sources: `docs/research/phase-2-sanity-studio-v6-and-astro.md`,
`docs/research/phase-2-sanity-client-and-image-url.md`,
`docs/research/phase-2-sanity-functions-blueprints-resend.md`. Decisions: ADR 0013 to 0017,
`CONTEXT.md` (edition, routing contact, pending registry, presence pending, lint report, stat).

## What exists now

- `@oy/content`: every shared object, the thirteen singletons (`definePage`), the document types,
  the enquiry kinds spec with Zod (`parseEnquiry`) and the generated enquiry objects, the voice
  validation rules, the Pending registry (`src/pending.ts`), the Studio structure with the Inbox
  and the Pending group (a presence pane, the voice findings), Presentation resolvers derived
  from `src/routes.ts`, `cacheTagsFor`, TypeGen (`bun typegen`, `schema.json` and
  `sanity.types.ts` committed), the seed (`bun seed`) and the two functions under `functions/`.
  The deltas from `docs/design/CONTENT-MODEL.md` are listed in `packages/content/README.md`.
- `packages/web`: the Studio at `/admin` (`@sanity/astro` 3.5.1, `@astrojs/react`), the preview
  routes, `/api/revalidate` (signature verified, tags returned, no purge yet), the required
  `PUBLIC_SANITY_*` variables, `sanity.config.ts` re-exporting `@oy/content/studio`.
- `@oy/lint`: browser-safe modules (`em-dash`, `yoruba`, `sentence-case`), the Node loaders in
  `terms.ts`, `proper-nouns.json`.
- CI: the sixth job `TypeGen drift`. Add the context `TypeGen drift` to the branch protection when
  this pull request merges (`docs/runbook.md`, CI and merging).
- Root: `sanity.blueprint.ts` (both functions), `.claude/launch.json` (the dev server for the
  in-app browser).

## Owner follow-ups, in order

1. `packages/web/.env`: rename `SANITY_READ_TOKEN` and `SANITY_WRITE_TOKEN` to
   `SANITY_API_READ_TOKEN` and `SANITY_API_WRITE_TOKEN`, add `SANITY_PREVIEW_SECRET` and
   `SANITY_WEBHOOK_SECRET` (wizard stage 2 generates them), and replace the write token with an
   Editor token: the current one is a Contributor token (role `contributor`), which uploaded the
   68 photographs but cannot create published documents. The seed now stops before uploading
   when the role cannot publish.
2. `bun seed` (against `development`), then `bun seed` again to confirm nothing changes, then
   `bun seed -- --dry-run --dataset production` to read the plan before a production run.
3. Log in at http://localhost:4321/admin (`bun dev`) and open Pending: the field rows fill from
   the seed, "Missing entirely" lists the document types with nothing yet, and the Inbox is
   empty until Phase 3. The project's CORS origins must include `http://localhost:4321`
   (wizard stage 1).
4. Functions: `bunx sanity login`, `bunx sanity blueprints init`, `bunx sanity blueprints deploy`
   from the repo root, then `bunx sanity functions env add enquiry-notify RESEND_API_KEY <value>`
   and `... ENQUIRY_FROM "<Name> <address on the verified domain>"` (`docs/runbook.md`,
   Functions). Wizard stage 4 creates the Resend domain and key.
5. Branch protection: add the context `TypeGen drift`.
6. Wayfinder tickets 02 (EIN, address, phone, routing emails and response lines), 05 (the two
   zones), 09 (photo credits, the summer camp year) and 22 (roles on the plan) still gate content.

## Decisions made without the owner (reverse any)

- Display text says "Odunde" without marks in event titles, album titles and the festival page
  heading (ADR 0009); the prototype heading shows marks. Kickers and captions keep the Yoruba
  form with marks.
- US spelling in copy and Studio labels ("neighbors", "organization", "honorees") following
  CONTEXT.md's "program"; the two real post titles keep their wording ("fall term").
- The `highlight` layout value stays `school` (the prototype's value, ADR 0006) and the Studio
  shows "lessons" for it.
- `venue.name` is "Leimert Park" (the confirmed fact); "Plaza" and the exact line are pending.
- The festival's framing paragraph uses the prototype's "Lunar New Year" where the `oy-voice`
  skill says "Chinese New Year"; the prototype was followed as the later polish.
- The Get Involved page references the four doors of `CONTEXT.md` (member, volunteer, partner,
  give); the prototype shows a vendor card in place of give. Phase 7 settles it.
- The routing contact phrases in `enquiry-kinds.ts` ("our partnerships lead", "our teacher",
  "the person who places volunteers", "our team") and the response slot are copy, not facts.
- News posts are dated the first of their month; albums carry no date until confirmed; the
  summer camp album is titled "Summer camp" (no college named).
- The three albums follow CONTENT-MODEL section 6; the gallery prototype's fourth album (a
  subset) was not seeded. The five "earlier set" photographs joined the summer camp album.
- The homepage "raise your hand" references the member and partner doors; Donate references the
  partner door.
- Extra fields the prototypes carry (`event.attendance`, `initiative.serves`, `since`, `next`,
  `givingLevel.source`, `culturalExchange.howToJoin`, `siteSettings.newsletterBlurb`,
  `oyImage.creditNote`) exist and render Pending while empty.
- Site settings and the Inbox are administrator only through structure visibility and document
  actions until ticket 22 names the plan's roles.
- The sentence case check warns above two capitalised words per line, so two word labels pass.
- API version `2026-09-11` in the Studio, the site and the functions; functions run on Node 24 in
  production and Node 22 locally; `.build/` is ignored; the seed accepts the old token name with
  a warning.

## Which document won where they disagreed

- Prototype H1 ("Yoruba culture, alive in Southern California") over ROUTES section 4 (owner's
  Q8 answer).
- ADR 0013 to 0017 over CONTENT-MODEL sections 2 to 5 where they differ (the owner's grill).
- The register over the prototypes for what is mock: every value the register lists is empty.
- `docs/research/phase-2-*.md` over the brief for the Sanity facts: v6 not v5, no `loadQuery`
  export, `VisualEditing` not `SanityVisualEditing`, a perspective cookie not a draft cookie.

## What the code review changed

The two-axis review (Standards and Spec) found two bugs and a dozen smaller items, all fixed in
`d6f374a`: the presence pane refetched forever (a new client per render), the routing-contacts
Pending row cleared as soon as the seed wrote role-only entries, an invented sender mailbox
(`ENQUIRY_FROM` is now required), Presentation locations drifting from the route map (now
derived, with a test), no role gating, `scheduleItem.title` as two strings, string-array members
without voice rules, and the vocabulary items above. Left as recorded: `documents/content.ts`
holds 21 types in one file; `LINT_TYPES` and the manifest filter are held together by a test.

## Environment notes

`docs/runbook.md` and the session memory hold the details: Node 22 on PATH for every Astro and
Sanity command, `bunx sanity` from a workspace that depends on `sanity`, the seed and the CLI
wrapper load `packages/web/.env`, the agent cannot read that file (the permission system denies
it), Claude in Chrome was not connected so the logged-in Studio was not screenshotted, and
`sanity functions test` wants paths relative to `packages/content`.

## Suggested skills for the next session

`/to-tickets` for Phase 3, then `/implement` per ticket with `/tdd` on the actions and the
modal state; `research` before pinning `@playwright/test`, `@axe-core/playwright` and any
form library; repo skills `oy-component` (SiteNav, SiteFooter, EnquiryModal, GiveDialog),
`oy-page`, `oy-voice`, `oy-content-model` (the actions write `{ kind, [kind]: fields }`,
`parseEnquiry` validates), `oy-content-ops`; `/code-review` before the commit; `/handoff` at
the end.
