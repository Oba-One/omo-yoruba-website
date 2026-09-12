# Handoff: Phase 3, site chrome and the forms seam

Written 12 September 2026 at the end of the Phase 3 session, for the owner's follow-ups and the
session that runs Phase 4 (`docs/design/PROMPTS.md`). Branch: `phase-3/chrome-and-forms`, pull
request https://github.com/Oba-One/omo-yoruba-website/pull/4 against `main`. Tickets: `docs/tickets/phase-3/issues/`
(ten, all resolved, each with a Comments section on what was found). Research with sources:
`docs/research/phase-3-playwright-and-axe.md`, `phase-3-astro-actions-transitions-islands.md`,
`phase-3-astro-portabletext.md`, `phase-3-storybook-play-functions.md`. Decisions: ADR 0018 to
0020, `CONTEXT.md` (trust line, mobile menu, cross-fade, track event, trigger, action result,
summary, success block, human fallback, honeypot, address cap, subscriber, bottom sheet).
Wayfinder tickets 01 and 23 resolved with the owner (subscriber documents, "Ẹ ṣé! ✓").

## What exists now

- `@oy/ui`: `navigation/SiteNav` (Events dropdown, current state, the mobile menu as a native
  dialog under 880px), `navigation/SiteFooter` (trust line with the EIN placeholder, address,
  email, phone and socials from the settings or Pending chips, the newsletter block, two link
  columns), `forms/Field`, `forms/NewsletterForm`, `forms/EnquiryCard`, `forms/EnquiryModal`
  (one native dialog, eight forms from the spec, five states, bottom sheet under 720px),
  `forms/GiveDialog` (embed template mounted on first open, timed fallback, pending mode) with
  `GiveEmbedPlaceholder` for the stories, `page/ProgressBar`. Every interactive component
  carries an inline plain-JavaScript custom element and a `play` function that passes in the
  canvas; `src/storybook.ts` gained `SlotValue`.
- `@oy/content`: `src/queries.ts` (the site's GROQ, typed by TypeGen), the form sentence
  templates and `contactsByRole` in `enquiry-kinds.ts`, `parseSubscriber`, `NEWSLETTER_COPY`,
  `scripts/query.ts` (`bun run --filter @oy/content query -- '<groq>'`, `--public`,
  `--perspective drafts`, `--dataset`), and `scripts/sanity.sh` no longer sources the env file.
- `packages/web`: `SiteLayout.astro` mounts the tokens, the nav, the footer, both dialogs (the
  Give Dialog around the `ZeffyEmbed` server island), the 380ms cross-fade, the progress bar,
  `FormBridge.astro` (`window.oySubmit` over `astro:actions`) and the analytics bridge in
  `Analytics.astro`; `src/lib/sanity/load-query.ts` (Viewer token, perspective cookie, never
  throws); `src/lib/forms/` (result shape, handlers with an injectable client, origin bucket,
  the no-JS modal state); `src/actions/index.ts` (nine actions); `src/middleware.ts` redirects a
  successful no-JS POST; `astro.config.ts` turns the dev toolbar off under `PLAYWRIGHT=1`.
- Playwright: `packages/web/e2e` (52 tests, 46 pass and 6 skip by design), `playwright.config.ts`,
  the CI job `Playwright and axe` (add the context to the branch protection when this merges).
- Proof in `development`: enquiry `7LO6o5K6XyoZKPjp1euFmv` (vendor, through the bridge),
  contact enquiries from the write-gated no-JS spec, subscriber `7LO6o5K6XyoZKPjp1euIhD`. The
  enquiry-notify function is not deployed, so no email was sent and no `notifiedAt` exists.

## Owner follow-ups, in order

1. Deploy the Blueprint (`docs/runbook.md`, Functions) with `RESEND_API_KEY` and `ENQUIRY_FROM`,
   then submit one enquiry from the site: `notifiedAt` appears on the document and the email
   arrives at the routing contact for the kind, or `generalEmail`.
2. Wayfinder ticket 02: the routing contacts (name, email, response line), `generalEmail`,
   `phone`, `address`, `ein`. Until then every success copy names the role, the human fallback
   and the trust line render Pending, and the enquiry-notify function has nowhere to send.
3. Wayfinder ticket 03: `siteSettings.zeffyEmbedUrl`. Until then the Give Dialog opens in its
   pending mode (the check line and the contact enquiry, no Try again).
4. Branch protection: add the context `Playwright and axe`.
5. The three e2e documents in `development` (a vendor enquiry, contact enquiries, a subscriber)
   can be deleted from the Inbox.
6. `PUBLIC_ZEFFY_EMBED_URL` and `PUBLIC_EVENTBRITE_URL` in the env schema are now unused by the
   site (the settings carry both); remove them in Phase 5 or 9 with the wizard's stage.

## Decisions made without the owner (reverse any)

- The datasets stay private and the site reads with the Viewer token on every request; without
  it every page renders Pending. Making a dataset public would expose enquiries and subscribers.
- The nav and the footer re-render on every navigation (custom elements upgrade on insertion);
  only the two dialogs are persisted across the cross-fade.
- The mobile menu breaks at 880px, the ported CSS breakpoint, not the brief's 760.
- The footer's structure follows the prototype (SVG marks, Take part and Learn more columns,
  the newsletter under the lockup); the routes table's initials and four columns were not built.
  Take part: Become a member and Sponsor go to Get Involved doors, Volunteer opens the enquiry,
  Donate opens the Give Dialog. Learn more: Impact, Our story, financials, Contact.
- Field selects preselect their first option, as the prototype does; no native `required`.
- The card's "how long" reads as the count of questions from the spec.
- The newsletter's fallback and the modal's transport errors show the fallback sentence
  (naming the general inbox once set), never an error body.
- The placeholder home page carries the eight `EnquiryCard`s so the forms seam can be driven
  from a page until Phase 4 builds the homepage.
- Footer column links are 44px rows and the social circles 44px, for the elder test; inline
  links inside paragraphs are exempt in the targets spec, as WCAG allows.
- The no-JS Playwright specs submit with Enter: at 375 the sheet's nested scroll containers
  never settle for Playwright's click, though the button is reachable by hand.
- Two lines of new copy the prototypes lack, for the owner to confirm: the Give Dialog's pending
  heading and lead ("The online giving form is not set up yet." and "Two ways to give until the
  online form is set up.") and the burst refusal ("Too many messages in a few minutes. Try again
  shortly, or write to {email}.").
- The Playwright suite runs its own dev server on port 4322 so a `bun dev` on 4321 is never
  reused; `PLAYWRIGHT_TEST_BASE_URL` still points it at a deployment.

## Which document won where they disagreed

- `oy-components.css` (880px) over ROUTES section 2 (760px) for the mobile menu breakpoint.
- The footer prototype over ROUTES section 2 (marks and columns, above).
- ADR 0019 over Astro's `input` idiom: the actions answer a result object.
- The research notes over the brief: `astro/zod` not `astro:schema`; the datasets are private;
  Astro 7 backgrounds the dev server under a coding agent (`ASTRO_DEV_BACKGROUND=0` keeps it
  in the foreground for Playwright).

## What the code review changed

The two-axis review (Standards and Spec, `/code-review`) found one high item and a dozen
smaller ones, all fixed before the last commit: the persisted dialogs re-wired their document
and window listeners on every navigation (each element now wires itself once and adds those
listeners per connection with an AbortController, aborted on disconnection); a trigger inside
another dialog (Contact us in the Give Dialog, Donate in the mobile menu) returned focus into a
closed dialog (a dialog now exposes `oyTrigger` and the next dialog returns focus there); the
burst refusal spoke the address cap's sentence (its own `burstSentence` now); the bucket ran
after the routing read (before it now); the Give Dialog's pending mode hid the island's Pending
chip (visible above the fallback now); `siteSettings.analyticsEnabled` was ignored (it gates
PostHog beside the key); the modal's fields had no `autocomplete` (from `autocompleteFor` in the
spec); the suite reused a local `bun dev` with its toolbar (it runs its own server on 4322);
the trust line and Give Dialog specs would break once the settings are filled (tolerant now);
the email regex lived in two scripts (`EMAIL_PATTERN` from the content package); ADR 0020
claimed a `:target` fallback that did not exist (amended); "opener" drifted from the glossary's
"trigger"; the intercept delay was short for a slow runner. Left as recorded: the eight cards on
the placeholder home page (Phase 4 replaces the page), the mobile menu at 880px against
AGENTS.md's 760 (the owner's call), and the "iframe present but never loading" path, which no
test covers because an iframe fires `load` even for a refused frame.

## Environment notes

`docs/runbook.md` and the session memory hold the details: Node 22 on PATH for every Astro,
Vitest and Playwright command; `bunx playwright install chromium` once; stop a `bun dev` on
4321 before `bun e2e` or the suite reuses it with the toolbar on; `astro dev stop` clears a
daemon that Astro backgrounded; the in-app browser pane does not composite while hidden, so
CSS animations there sit at 0; the permission system denies reading `packages/web/.env`.

## Suggested skills for the next session

`/to-tickets` for Phase 4, then `/implement` per ticket with `/tdd` on the homepage loaders and
the cache tags; `research` before pinning `astro-portabletext` (Phase 5, not 4) and the Vercel
cache provider facts; repo skills `oy-page` (the homepage from `02 Homepage.dc.html`),
`oy-component` (Hero, EventBand, StatStrip, the cards), `oy-content-model` (Presentation
locations, cache tags), `oy-content-ops`; `/code-review` before the commit; `/handoff` at the end.
