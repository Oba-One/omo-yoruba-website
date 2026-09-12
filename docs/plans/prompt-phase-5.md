# Prompt: Phase 5, the event pages

Written 12 September 2026 at the end of Phase 4, to paste into a fresh session at the repo root once
pull request 5 has merged (wayfinder ticket 26). It extends the Phase 5 prompt in
`docs/design/PROMPTS.md` with what Phase 4 learned and the tickets it left (33 and 34).

---

Read AGENTS.md, CONTEXT.md, docs/plans/handoff-phase-4.md (the environment notes and the owner
follow-ups: CI's Playwright job builds with a placeholder Sanity project, so every spec must pass
with and without Studio data; the Vercel adapter has no preview command, so production checks run on
`.vercel/output` served locally; lhci reads `LIGHTHOUSE_*`, never `LHCI_*`), docs/plans/wayfinder.md
with tickets 03, 04, 05, 06, 09, 33 and 34, ADRs 0018 to 0023 (ADR 0023 lists where a prototype wins
and where a repo rule still outranks it), docs/design/ROUTES-AND-INTERACTIONS.md sections 1, 3, 4 and
5 for /odunde and /gala, docs/design/CONTENT-MODEL.md sections 3 and 4 for festivalPage, galaPage,
event, zone, scheduleItem, ticketTier, sponsorLevel, honoree, partner and album, and
docs/design/COMPONENT-MAP.md for the parts below. Open docs/design/design/08 Odunde Festival.dc.html,
09 End-of-Year Gala.dc.html and Photo Carousel.dc.html in full: they are the fidelity bar at 375 and
1440. Every rule in AGENTS.md holds: never invent content, Pending for every empty required field,
one gold action per screen view, and "Odunde" unmarked in display text where the prototypes mark it
(ADR 0009).

Work on a new branch phase-5/event-pages cut from main after pull request #5 merges (from
phase-4/homepage-editing-caching if it has not), and finish by opening a pull request against main.

Start with wayfinder ticket 33: bring the homepage under the mobile Lighthouse budget before the event
pages add weight. Right-size the nav and footer logo images, cut the fonts that load before first
paint without losing the latin-ext and vietnamese coverage the Yoruba marks need (read ticket 19
first), and add the favicon only if ticket 32 is answered. Measure both presets with lhci on the
local production build before and after, and write the numbers into the ticket.

Before pinning astro-portabletext or anything else new, verify it against its primary docs with the
research skill (docs/research/phase-3-astro-portabletext.md is where Phase 3 left it) and add the
findings to docs/research/; wait for my yes before installing. Research without installing: the Photo
Carousel as a plain custom element under ADR 0018, with no library (keyboard arrows, focus, reduced
motion, the 44px targets and what 07 Interaction Inventory.dc.html says about the carousel).

Run /grill-with-docs on the event-page seam: which edition each page shows and what it shows between
editions (the lead event rule the homepage band uses, a past edition's recap, or the next edition
with its Pending chips); how the owner's open tickets render until they are answered (05: four zone
cards with the two unnamed zones Pending, or three cards and a line; 04: tables through the `table`
enquiry; 06: honourees hidden by default; 03: seats with no Eventbrite URL); past years and past
galas from albums with unconfirmed credits (ticket 09); the take-part band's rows, order and label
style per page from the singletons; and each page's layout options as Studio fields with the names
in packages/content/src/layout-options.ts (Odunde: phead, zones, schedule, takepart, labels; Gala:
treatment, tiers, emphasis, awards, schedule, past, labels). Update CONTEXT.md and add ADRs as
decisions land. Then run /to-tickets for Phase 5 and work them with /implement.

Build in @oy/ui with stories and tests, each variant a story and each empty state Pending:
PageHeader (slim and photo band, kicker, title, line, up to two actions with one gold), GlanceStrip
(four and five facts, a fact can be Pending), ZoneCard (the Yoruba name with marks, the translation,
one line, the photo; the zones block as mosaic, five, grid and list), ScheduleRow (time-led and
day-led; the schedule shown, collapsed or hidden), TakePartBand (the rows each page lists, label
styles column, none and kicker, the accent per way in, reorderable, and the quiet action the
prototypes give the give row, which PathRow lacks today), TicketTierCard (buy-now to Eventbrite in a
new tab with its notice, enquiry opening `table`, featured with the gold inset ring), ListRow in its
sponsor tier form, PartnerRow (text chips without a logo, the logo when present) and PhotoCarousel
(framed, a 16:8 stage and 4:3 under 720px, previous and next, dots, caption, count, keyboard arrows).
Handoff exists. Fixtures come from packages/ui/src/fixtures with confirmed facts and Pending states
only: the register marks the zone descriptions, the schedule, the plan-your-visit facts, the vendor
fees, the tiers, the sponsor levels, the honourees and the partner names as invented. Add one
page-section story per layout option of both pages.

In packages/web: compose /odunde and /gala from Sanity, one defineQuery each in @oy/content (the only
place GROQ lives) through the hand-written loadQuery; every layout option read from the singleton's
layout object; block content through the researched Portable Text renderer; cachePage with
tagsForRoute on both routes, and the Presentation locations and data-sanity edit attributes as on the
homepage (ADRs 0021 and 0022); and move the route mapping from an edition's kind or a program's page
into @oy/content/routes as one helper that newsHref, the Presentation resolvers and EventBand share
(ticket 34). Gala seats open Eventbrite in a new tab; tables open the `table` enquiry; the vendor,
sponsor and performer rows open their kinds; both pages close with the same take-part band
reordered. Extend the seed only with confirmed facts. Nothing on the site names a person, price,
date, address or phone the Studio does not hold.

Before the code review, compare both pages side by side with their prototypes at 375 and 1440 (serve
docs/design/design over HTTP and capture both with the Chrome DevTools MCP, as the Phase 4
environment notes describe), fix what differs, and record in an ADR where a repo rule outranks a
prototype. Playwright and axe on both routes at 375 and 1440, passing with and without Studio data
the way CI runs them, with the Phase 3 and 4 suites kept green. Append /odunde and /gala to
lighthouserc.cjs and run lhci on the local production build, or on the preview if ticket 28 has put
the bypass secret in place; report the numbers as measured against docs/design/QUALITY.md section 3.

Run /code-review on the whole diff, fix what it finds, commit, open the pull request, and stop. Run
/handoff before ending and save it to docs/plans/handoff-phase-5.md. I will check both pages in the
Studio and on the preview myself.
