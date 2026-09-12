# Phase 5 spec: the event pages

Written 12 September 2026 from the Phase 5 prompt (`docs/plans/prompt-phase-5.md`), ROUTES sections 1,
3, 4 and 5, CONTENT-MODEL sections 3 and 4, the COMPONENT-MAP, `docs/design/design/08 Odunde
Festival.dc.html`, `09 End-of-Year Gala.dc.html` and `Photo Carousel.dc.html` (the fidelity bar at 375
and 1440), and the grill on the event-page seam. The owner answered every question in the session;
each answer below is theirs. Decisions marked "session" were made without a question, as the
consequence of an answer or of a repo rule.

## Ticket 33 first: the homepage under the mobile budget

Measured with `@lhci/cli` 0.15.1 on the production build served locally (brotli, in-memory edge
cache), three runs per preset, the median reported. Before: mobile 0.77 (0.69 to 0.79), LCP 5.9 s;
desktop 0.98, LCP 1.1 s; best practices 0.93 on both.

- The logo images are right-sized WebP at twice and three times the drawn size, with the drawn size
  as `width` and `height`, the footer lockup lazy (committed, a553051). Mobile 0.82, LCP 4.5 s;
  desktop 0.99.
- **Q1. Which font change lands?** The owner chose both levers: Source Serif 4 moves from the
  optical-size files to the weight-only files (the headings lose the display cut, 253 KB to 106 KB
  normal, 130 KB to 52 KB italic; ticket 19 had left this to the owner), and the Yoruba letters that
  live in latin-ext (Ń ń, Ǹ ǹ, Ḿ ḿ, Ṣ ṣ) come from committed micro subsets of 3 to 4 KB declared after
  each family's latin-ext rule, so the full latin-ext files still cover every other character.
  Measured together: fonts 472 KB to 152 KB, mobile 0.89 (0.89 to 0.94), LCP 3.0 s. The subsets are cut
  once with fontTools from the pinned fontsource files by a script in `@oy/tokens`; nothing is added
  to `package.json` (research: `docs/research/phase-5-yoruba-font-subsets.md`).
- Not taken: inlining the stylesheets on top reached mobile 0.95 and LCP 2.49 s, but the font swap
  then lands after first paint and desktop CLS rose to 0.23; it needs metric-matched fallback faces
  first (a follow-up ticket). The favicon waits on ticket 32.

## The design tree, answered

**Q2. Which edition does each page show, and what between editions?** The next edition of the
page's kind: the nearest one still to come by the rule the homepage band already uses (a dated
edition until it ends, an undated one by the calendar, so Odunde 2026 is over once July 2026 arrives
and Gala 2026 stays ahead until the year ends). Its missing facts render the registry's Pending
chips. No edition to come renders the same Pending chips for the next edition. The last edition's
recap is the past-years carousel, never the header. No reference field on the singletons.

**Q3. Zones while ticket 05 is open.** Four cards: the named zones in order, then placeholder cards
naming the zones still owed, up to the confirmed count of four, so the mosaic keeps the four-zone
shape the stat strip claims. A placeholder gives way as a zone document is added. Zone lines render
Pending until written.

**Q4. The take-part band's rows.** Row objects on each page singleton, `takePart[]`: the way in
(vendor, sponsor, performer, volunteer, table, give; unique), a title, a line and the button label,
in order; they replace `takePartOrder`. The seed writes the prototypes' titles and lines with the
facts the register marks as invented taken out. The chip, the accent and what the button opens
follow the way in. The vendor row adds the edition's vendor terms (fees, applications close,
decisions by, the permit note) with Pending chips, since the vendor form says fees and dates are on
the festival page. Odunde's `takepart` option moves the vendor or the sponsor row to the top in the
markup, never with CSS `order`, so reading and tab order follow what is seen. Session: the first row
carries the band's gold action; the give row's action is quiet.

**Q5. Honorees while ticket 06 is open.** The Gala's `awards` option defaults to `hidden`. Shown
with no honoree documents, the block renders the registry's Pending line. The development dataset
keeps its stored `shown` until the owner switches it in the Studio.

**Q6. Gala seats while ticket 03 is open.** The edition's `ticketsUrl` is the one source (each Gala
has its own Eventbrite event); `siteSettings.eventbriteUrl` and `PUBLIC_EVENTBRITE_URL` retire.
Without it a buy-now tier shows the Pending chip "the Eventbrite link" where its button would be; the
header's Get tickets keeps pointing at `#seats`. With it the button opens Eventbrite in a new tab with
`rel="noopener"` and the card carries the one-line notice. Tables open the `table` enquiry either
way (ticket 04 stays open for a purchase).

**Q7. Empty blocks.** A block the option shows renders its heading and the registry's Pending line
when the Studio holds nothing for it: the festival schedule, the Gala running order, past galas,
honorees, sponsor levels, tiers, partners. Hiding stays the editor's choice through the option. The
prototypes' "CMS: hidden until set" is outranked by AGENTS.md (recorded in the event-page ADR).

**Q8. Past years and past galas.** The album of the newest past edition of the page's kind: its first
eight photographs in album order, each with its own caption and alt text; under the carousel the
album's credit with the Pending chip "photographer credit to confirm" while `creditConfirmed` is off
(ticket 09). The festival section's lead is the page's `pastYearsIntro`, followed by the Pending chip
for the past edition's attendance figure while it is missing. "All Odunde albums" and "All gala
albums" link to `/gallery` (Phase 8), as the homepage already does.

**Q9. The Gala's "Seats from".** Derived: the first buy-now tier's price by order, with the table
tier's price as the note ("Tables of ten from ..."); Pending ("three prices and what each includes")
while no tiers exist. No price is typed twice.

**Q10. Portable Text.** `astro-portabletext` 1.0.0 in `@oy/ui` dependencies (owner's yes;
`docs/research/phase-5-portable-text-renderer.md`), behind a `Prose` component: the four overrides
(h3, blockquote, link with a scheme check, pullQuote), a copy of the value, an unmapped node throws in
dev and tests and logs in production, and a test covers every node `blockContent` allows.

## Further decisions (session)

### Content model

- `festivalPage`: `takePart[]` (above); `whatItIsImage` (oyImage), the figure beside "What Odunde
  is", seeded with the prototype's photograph, framing and caption ("Festival day • Leimert Park").
  `extraFacts` stays for glance facts beyond the edition's date, time, place and cost (the seed's
  Family fact). The glance shows at most five facts.
- `galaPage`: `takePart[]`; `extraFacts` stays after date, doors, venue, dress and the derived seats.
- `event.ticketsUrl` is described as the Eventbrite link for this edition's seats; the vendor terms,
  schedule, attendance and album stay on the edition (ADR 0013).
- The Pending registry drops the settings' Eventbrite row, adds rows for the take-part rows of both
  pages and the festival figure, and gains presence wording helpers for zones, tiers, sponsor levels,
  honorees and partners so a page chip and the Studio row read the same.
- The seed writes `takePart` and `whatItIsImage` and unsets the retired `takePartOrder` and
  `siteSettings.eventbriteUrl`; nothing else it writes is new, and it never overwrites a stored value.

Take-part rows as seeded (prototype copy, invented facts removed):

| Page | Way in | Title | Line | Button |
| --- | --- | --- | --- | --- |
| Odunde | vendor | Sell at Ọjà Balógun | A booth is held once the fee is paid. (then the vendor terms) | Apply for a booth |
| Odunde | sponsor | Keep the day open | Four questions, and we send the deck with our impact numbers. | Sponsor Odunde |
| Odunde | performer | Drummers, dancers, cultural groups | One short form, and the program committee sees every one. | Ask about performing |
| Odunde | volunteer | Festival day needs hands | One short form, and we place you where the gap is. | Volunteer |
| Gala | sponsor | Sponsor the evening | Four questions and we send the deck. One enquiry covers the Gala, Odunde, or both. | Sponsor the Gala |
| Gala | table | Bring your table | Ten seats together, placed by hand and invoiced afterwards. | Reserve a table |
| Gala | volunteer | The night needs hands | One form, and we place you. | Volunteer |
| Gala | give | Cannot come this year? | A gift does the same work as a seat, and monthly does more. | Donate |

Removed as invented: booth fees and deadlines (they come from the vendor terms), "free" (the cost is
Pending), sponsor level amounts, "within a working day", "the main stage runs from four", "decides in
March", set-up times, shift length and the shirt, the volunteer roles. Odunde closes its band with the
page's give handoff ("Too small to sponsor, but want the day to happen? A gift does the same work.")
instead of a give row, as its prototype does.

### Queries and routes

- `festivalPageQuery` and `galaPageQuery` in `packages/content/src/queries/event-pages.ts`: the
  singleton, every edition of the page's kind with the fields the page reads (images as asset
  references), the zones in order, the partners scoped to the page, and on the Gala the tiers,
  sponsor levels (scope gala or org) and honorees of every gala edition; the page picks by edition.
- `pageEdition` and `pastEdition` join the season rule in `@oy/content/lead-event` (tested).
- `@oy/content/routes` gains the one helper that maps an edition's kind or a program's page to its
  route (ticket 34); `newsHref`, the Presentation resolvers and `EventBand` read it. The program
  resolver lists the homepage only for the first three by order. `sponsorLevel` reaches `/gala`
  only; `photographer` reaches both event pages (the credit line).

### Layout options

Names and values from `packages/content/src/layout-options.ts`; the first value is the default.

- Odunde `phead` photo or slim: one header rendered, not both hidden by CSS. `zones` mosaic, five,
  grid, list. `schedule` shown, collapsed (a native disclosure, closed, that opens without
  JavaScript), hidden. `takepart` vendor or sponsor leads. `labels` column, none, kicker.
- Gala `treatment` formal or warm (warm: paper grounds, the terracotta scrim and seams, from the
  tokens); `tiers` columns or rows; `emphasis` seats or tables (tables moves the table tier first in
  the markup; the featured ring stays on the tier the Studio marks); `awards` hidden (new default) or
  shown; `schedule` shown or hidden; `past` shown or hidden; `labels`.
- The options reach the body as data attributes the tokens read, and each option's container
  carries its edit attribute in draft mode (ADR 0021, ADR 0022).

### Page copy

Section kickers, headings and the leads that state no fact are page copy in `packages/web`, as on
the homepage. "Odunde" stays unmarked in display text where the prototypes mark it ("What Odunde is",
"Odunde in past years", "Take part in Odunde", "Partners and sponsors of Odunde"); the Yoruba halves of
the kickers keep their marks. Taken out of the prototypes' copy as invented: "since 2003", "Leimert
Park Plaza" and "43rd Place at Degnan", "Times are confirmed each spring", "Rain or shine",
"Procession at 11 sharp", "Dinner served at 7:30", "Gèlè encouraged", "The running order is confirmed
in October", "Tickets go on sale once the date is confirmed. If the room sells out, a waiting list
opens here.", "The deck and the impact numbers arrive within a working day". The take-part lead
counts the rows ("Four ways in.").

### Components

In `@oy/ui` with stories and tests, each variant a story and each empty state Pending: `PageHeader`,
`GlanceStrip`, `ZoneCard` and the zones block, `ScheduleRow` and the schedule, `TakePartBand` (with
`PathRow` taking a row and a quiet action), `TicketTierCard` and the tiers block, `ListRow` (sponsor
tier), `PartnerRow`, `PhotoCarousel` (a plain custom element under ADR 0018,
`docs/research/phase-5-photo-carousel-custom-element.md`), `Prose`, `FactList` (plan your visit),
`PersonCard` (the honorees), the boxed `Handoff`, a generic page root for the page-section stories,
and one page-section story per layout option of both pages.

## Proof

Playwright and axe on both routes at 375 and 1440, passing with and without Studio data (CI's
placeholder project), the Phase 3 and 4 suites green; the gold rule per section; seats with
`target="_blank"` and `rel="noopener"` when a link exists; nothing open on load. `/odunde` and
`/gala` appended to `lighthouserc.cjs`, lhci on the local production build, numbers against QUALITY
section 3. Both pages compared with their prototypes at 375 and 1440 before the code review.
