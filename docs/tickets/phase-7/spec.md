# Phase 7 spec: conversion and trust

Written 13 September 2026 from the Phase 7 prompt (`docs/plans/prompt-phase-7.md`), ROUTES sections 1,
3, 4 and 5, CONTENT-MODEL sections 3 and 4, the COMPONENT-MAP, `docs/design/design/13 Get Involved.dc.html`,
`14 Impact.dc.html`, `15 People and History.dc.html` and `16 Donate.dc.html` (the fidelity bar at 375 and
1440), their wireframes and rails in `06 Site Wireframes.dc.html`, `19 Mock Content Register.dc.html`, the
Build Brief's polish passes 2 and 3, and the grill on the trust seam. The owner accepted every
recommendation in one round (Q1 to Q18); each answer below is theirs. Decisions marked "session" were made
without a question, as the consequence of an answer or of a repo rule.

## Facts the grill stood on

- `development` matches the seed: the four singletons' headers, actions and copy (Get Involved's doors,
  associations prose and fallback; Impact's stats, civic prose, six photographs and "Fund the next year";
  Our Story's Reach us; Donate's give now and larger-scale blocks), the four doors, the four confirmed
  stats. No person, partner, testimonial, outcome, governance document, timeline entry, giving level or
  hometown association exists, and every routing contact is empty.
- The prototypes disagree with the glossary and with each other in ways the register settles: Get
  Involved draws member, volunteer, vendor and partner doors with a give box after them (the wireframe's
  "signpost" to the vendor form); Donate draws two gold "Give now" where polish pass 3 keeps one; the
  timeline defaults to shown where the register hides it until the owner confirms it (ticket 07).
- The register marks as invented: every source line (even "Founded 1997, counted to 2026"), every
  outcome figure, the civic cells, the governance positions, every name on Our Story, the founding
  story and its first-year facts, the dues and volunteer roles, the giving levels and what they buy, the
  other ways to give, the partner names and every response time. Four photographs these prototypes use
  (`community-table`, `festival-elders`, `festival-food`, `kids-art-day`) are summer camp photographs the
  register allows only under a summer camp caption or none.
- Every shared class the four prototypes use is ported to `@oy/tokens` (`.oy-outcome`, `.oy-timeline`,
  `.oy-source`, `.oy-g5`, `.oy-person--compact`, `.oy-mosaic`, `.oy-lrow-where`, the `data-portraits`
  and `data-sources` rules); the page-only `gi-*`, `im-*`, `pp-*` and `dn-*` rules and the other option
  selectors are not.
- The footer links `/get-involved#member`, `/get-involved#partner` and `/impact#governance`; every
  Donate trigger's no-JavaScript href is `/donate#give`. `goldSharingAView` counts `main`'s gold buttons
  only, so the nav's Donate never counts.

## The design tree, answered

**Q1. Get Involved's doors.** `vendor` joins the door keys. The seed adds a vendor door: "Sell at
Odunde", the button "Apply for a booth" opening `vendor`, the Odunde 2026 photograph of a vendor serving
suya at Ọjà Balógun; its blurb and bullets stay owed (the fees, the dates and "four thousand people" are
invented). The page draws member, volunteer, vendor and partner as cards and the give door as the closing
box ("Would rather give than join? That takes about a minute." and its Donate, the door's own words).

**Q2. Header actions and gold.** The seed stops writing Get Involved's "Become a member" and Our Story's
"Send a message" header actions, which the prototypes do not draw. The header still draws whatever the
Studio holds. On Get Involved the first door is gold only while the header holds no action; otherwise
every door is outline.

**Q3. Hometown associations.** The names are optional: the presence row asking for nine retires, so no
chip. When association documents exist the page lists them under the prose, each linked where it has a
site, and the "Listed publicly" cell goes. The cells: Associations, from the stat document the homepage
uses (a new reference on the block, seeded to the "9 hometown associations" stat); Listed publicly, "Not
yet" while none is listed; To connect, "Ask when you join" (the prose's own "say so when you join").

**Q4. The contact blocks.** `ContactBlock` gains optional rows from the general routing contact: its name
("Who answers" on Get Involved, "Who receives this" on Our Story) and its response line ("Response
time"), each with its own chip; a Call button that shows only when the settings hold a phone; and its own
"Send a message" button becomes optional. Get Involved: email, phone, who answers, response time, the
Call button (outline) and a quiet "Send a message", then two boxes, one to Our Story (quiet) and the give
door (gold). Our Story: email, phone, mailing address, who receives this and a box to Impact's governance,
beside the existing `EnquiryCard` for `contact` (gold, the spec's copy and question count) with "If it is
urgent, calling reaches a person faster than email does." only when the settings hold a phone.

**Q5. Headline numbers.** A stat with no source keeps its figure with the chip "a source line under the
figure". Under `six` with fewer than six stats, each empty cell shows one registry row's chip,
"attendance and learners served, with their sources", listed in the Studio only while `six` is chosen.
`sources: hidden` hides every source line on the page and their chips, and the lead that promises one
under every number. The strip is the prototype's framed grid inside its section, a `StatStrip` variant.

**Q6. What each program produced.** An outcome names exactly one subject, a program or an event page's
kind (festival, gala), as the year strip row does (ADR 0031); the card's heading is the subject's name,
so `outcome.title` and the undrawn `outcome.year` retire. A card draws the figure's value, its label as
the sentence and its source line or chip; without a figure, the plain statement alone; with neither, the
chip "participation figures or what is being measured". While the page references fewer than four,
placeholder cards fill the grid with the prototype's subjects not yet covered (Yoruba Language Lessons,
Odunde Festival, Kids & STEM, Yoruba Cultural Collective), each its name and the chip, as the homepage's
voice slots fill. `rows` is the prototype's row form of the same card. The quiet links under the grid
name each subject's page, never "The school".

**Q7. How we work, and Odunde as civic infrastructure.** `impactPage.howWeWorkImage` is new, seeded with
the homepage's "Àjọṣe • Partners and friends at the table" photograph (Odunde 2026); empty shows its chip.
The civic cells read from the editions: Attendance from the newest past festival edition's figure (the one
Odunde's past years asks for), Vendors hosted from a new sourced figure on that edition, Partners as the
count of partners the festival page shows, Cost to attend from the next festival edition's cost; each
empty cell shows its chip. The heading is unmarked: "Odunde as civic infrastructure" (ADR 0009).

**Q8. Governance and accountability.** Cells: Tax status "501(c)(3)", "Since 1997"; EIN from the settings
or its chip; Board "Listed", its note linking to Our Story's board once a board member exists, else the
board's chip; Financials from the newest annual report document ("Published" with a link to its file, or
"Not yet published" with its note, or the chip). Facts: the mailing address from the settings, then one
row each for Form 990, Annual report and Audit from the newest `governanceDoc` of that kind: a link to its
file with its note, or the note alone ("Copies on request"), or that kind's chip. The presence row splits
per kind. The block always renders.

**Q9. Partners and funders, and Fund the next year.** Every partner document, whatever its scope,
funders first, then partners, then sponsors, each group by name; `funders: hidden` removes the section;
none shows the Pending line. The dark band: its heading, then a sentence from the partnerships routing
contact built as the sponsor form's success copy is ("{name}, our partnerships lead, answers {responds}."
or "Our partnerships lead answers {responds}."), the response line's chip while empty; the gold "Sponsor or
partner" and a secondary "Write to {name}" `mailto:` when the contact has a name and an email, else "Talk
to us" opening `contact`. `impactPage.nextYear.blurb` retires.

**Q10. How it began.** `storyPage.foundingFacts[]` is new, seeded with Founded "1997, Los Angeles" and
Status "501(c)(3) nonprofit" and the labels Founders and First year with their values owed.
`storyPage.foundingImage` is new and left empty: the placeholder names "the earliest photograph you have:
an early gathering, or the founders", under its chip.

**Q11. The timeline.** An entry is its year, one required line (`blurb`) and a `milestone` switch;
`timelineEntry.title` and `timelineEntry.image` retire. The `timeline` option stays hidden by default and
wayfinder ticket 07 stays the owner's; shown with no entries, the Pending line "the dated entries". The
seed writes no entry.

**Q12. Board, staff and volunteers.** Board: people in the board group by order, cards with the role, the
name and the short bio, each missing one its chip; `bios: full` adds the full bio beneath when written.
Staff and volunteers: the staff group then the volunteer group, compact cards with the role and the name.
The teacher is never listed here; the box "Meet the teacher on the Language Lessons page." links to her
card. A person without a portrait draws the library's woven tick, not the prototype's "[ Portrait ]"
placeholder; `portraits: hidden` hides every portrait. An empty group draws its own Pending line, so the
one presence row splits into the board and the staff and volunteers.

**Q13. Take part on Our Story.** `storyPage.takePart[]` (the shared row, ADR 0025), seeded with two rows:
member ("Become a member", no line, button "Become a member") and volunteer ("Raise your hand", "One form.
We place you where you are needed.", button "Volunteer"). The prototype's member line promises a say in
what gets built next, a member vote the register marks invented.

**Q14. Donate's one gold Give now.** The header's gold "Give now" is the one. The Give now section keeps
its heading, the seeded blurb and its facts, with no button. `donatePage.giveNow.facts[]` is new, seeded
with Fees, Receipt, Monthly and "If the form fails", only the last valued ("The dialog offers contact and a
mailing address instead.", the Give Dialog's own fallback); Fees, Receipt and Monthly depend on how the
owner's Zeffy form is set up (wayfinder ticket 03) and show a chip, and the prototype's paragraph on
Zeffy's optional tip waits. The trust block's Receipt cell reads the same fact.

**Q15. Giving at a larger scale.** The page draws its referenced doors, outline and without bullets: one
door in the Get Involved row form (photograph on the left) so it fills the width, two or more as cards.
No second door is seeded; the prototype's two cards carry a summer camp photograph and invented claims.

**Q16. What your gift does.** Each giving level is an `OutcomeCard`: the amount as the figure ("a month"
after it when monthly), what it does as the sentence, its source line; a missing sentence or source shows
its chip; no level shows the Pending line "the preset amounts and what each buys". `impact` keeps its
prototype default, shown.

**Q17. Other ways to give, and the trust block.** Each other way gains a `kind` (check, employer
matching, in-kind goods, donor-advised fund, other) and an optional `detail` line. The check row adds the
mailing address, and the matching and fund rows add the EIN with the legal name, from the settings (chips
while empty), so neither is typed twice. None is seeded. Trust cells: Tax status "501(c)(3)", "Since 1997";
EIN from the settings; Deductible from `taxLine`, seeded "To the extent allowed by law" (the standard
wording for a 501(c)(3), from the confirmed status); Receipt as Q14. Then the box to Impact.

**Q18. Claims link to Impact, faces to Our Story.** The four new pages carry exactly their prototypes'
handoffs: Get Involved to Our Story; Impact and Our Story both ways through governance; Donate to Impact;
Impact to the gallery and the subjects' pages. Earlier pages stay as built (ADR 0023; the footer reaches
both pages from every route).

## Further decisions (session)

### Content model

- `door.key` gains `vendor`; `PathRow` names its chip "Vendors" with the vendor accent. On Get Involved each
  card carries its chip as the prototype's small label above the title ("Membership", "Volunteer",
  "Vendors", "Partnership"; one chip per door across the site, so the prototype's "Volunteering" reads
  "Volunteer").
- `getInvolvedPage.hometownAssociations.stat` (reference to `stat`).
- `impactPage.howWeWorkImage` (oyImage); `event.vendorsHosted` (sourcedFigure, festival editions, the
  Vendors group).
- `outcome`: `kind` (festival, gala) beside `program`, exactly one required; `title` and `year` retire.
- `timelineEntry`: `blurb` required, `milestone` (boolean); `title` and `image` retire.
- `storyPage`: `foundingFacts[]` (fact), `foundingImage` (oyImage), `takePart[]`; `staffIntro` seeded with
  the prototype's lead ("The people who run the programs, and the volunteers who have been here longest.").
- `donatePage`: `giveNow.facts[]` (fact); `otherWay.kind` and `otherWay.detail`; `taxLine` seeded.
- Retired and unset by the seed where stored: `impactPage.nextYear.blurb` (never stored today).
- **Seed revisions.** A value still exactly as an earlier seed wrote it moves to the new seed's value; a
  value anyone changed stays. The Phase 7 revisions: Get Involved's and Our Story's header actions go,
  Get Involved's doors gain the vendor door after volunteer, and Impact's six photographs take the
  prototype's short captions ("Odunde • 2026", "Àgbàlá Ọmọde • 2026", "Yoruba lesson • Odunde 2026",
  "Ọjà Balógun • 2026", "End-of-Year Gala • 2025", "Summer camp"; no place or year the register does not
  confirm). Alt text keeps the register's description.

### The registry

New rows, each wording read by the site through `pendingWhat`, `presenceWhat` or a named constant:

- Get Involved: the general contact's name ("who answers the general inbox") and response line ("how
  soon the general inbox replies"), both named constants shared with Our Story; the presence row for the
  nine association names retires.
- Impact: `impactPage.stats[]` ("the headline figures"); the `six` condition row (named constant);
  `impactPage.howWeWorkImage` ("a photograph of the work"); `impactPage.voices[]` ("voices with
  permission to name"); an outcome with neither a figure nor a plain statement, an outcome's figure
  without its source; `event.vendorsHosted` for a past festival edition ("the number of vendors hosted");
  a governance document with neither a file nor a note; the governance presence row per kind ("the Form
  990 position", "the annual report position", "the audit position"); the partnerships contact's response
  line (named constant).
- Our Story: `storyPage.foundingImage` ("the earliest photograph you have"), a founding fact without its
  value ("a founding fact"), the take-part rows; the person presence row per group ("the board's names,
  roles and bios", "the staff and volunteers to list"), a board member's short bio ("a short bio") and a
  listed person's role ("the role").
- Donate: a give-now fact without its value ("how your Zeffy form handles this"), a giving level's line
  ("what the gift does") and source ("where the cost comes from").
- `presenceWhat` and `pendingWhat` find a row narrowed by `group` as they do by `kind`.

### Queries and routes

- `getInvolvedPageQuery`, `impactPageQuery`, `storyPageQuery` and `donatePageQuery` in
  `packages/content/src/queries/trust-pages.ts`, each `*[_type == "X" && _id == "X"][0]`, one read per
  page through `loadQuery`: the singleton, its referenced documents in order, the settings the page draws
  (the general inbox, phone, address, EIN, legal name, the general and partnerships contacts), and on Impact
  every festival edition (the civic cells), every program (the outcome slots' names), the board count and
  every partner. Images project the asset reference (ADR 0022); a governance file projects its URL, name
  and extension.
- The route map: `event` and `person` reach `/impact`; `stat` reaches `/get-involved`. Presentation and the
  cache tags follow.
- `cachePage(Astro, route, { draft, failed })` on each route; edit attributes on every option's container
  and on the images; text cleaned of stega before it becomes a key, an href or a comparison (the settings'
  address and EIN are shown, the contact's email becomes a `mailto:`); the stega filter gains the new
  option names (`doors`, `hta`, `stats`, `outcomes`, `sources`, `funders`, `timeline`, `bios`, `impact`).

### Layout options

Names and values from `packages/content/src/layout-options.ts`, the first the default.

- Get Involved: `doors` cards, rows; `hta` shown, hidden.
- Impact: `stats` four, six; `outcomes` cards, rows; `sources` shown, hidden; `funders` shown, hidden.
- Our Story: `timeline` hidden, shown; `bios` short, full; `portraits` shown, hidden.
- Donate: `impact` shown, hidden.

### Components

In `@oy/ui` with stories and tests, each variant a story and each empty state Pending:

- New: `OutcomeCard` (figure with its source, or the plain statement; heading optional; card and row),
  `Timeline` (year and line, milestones, the Pending line).
- Extended: `StatStrip` (the framed grid), `DoorCard` (the row form, the chip label, an anchor id),
  `PathRow` (the vendor chip), `ContactBlock` (the contact's rows, the Call button, the optional button),
  `PersonCard` (the full bio), `GlanceCell` (a note that links), `ListRow`'s entry form (the detail line),
  `PhotoMosaic` (six in three columns), `Section` (the dark ground with the drifting dot field).
- Reused as they are: `PageHeader`, `CardGrid`, `FactList`, `PartnerRow`, `PullQuote`, `Handoff`,
  `SectionHead`, `Split`, `Prose`, `EnquiryCard`, `TakePartBand`, `GlanceStrip`, `PhotoTile`.
- One page-section story per option under `Pages/GetInvolved`, `Pages/Impact`, `Pages/OurStory` and
  `Pages/Donate`, on fixtures of confirmed facts, bracketed placeholders and Pending states only: no dates,
  even as ISO strings, and no photograph of a person standing in for someone named.

## Proof

Playwright and axe on the four routes at 375 and 1440 in both data modes (`PLACEHOLDER_PROJECT` in
`packages/web/e2e/helpers.ts`), every test asserting something in both, `expectEnquiryRoundTrip` and
`axeViolations` rather than copies, `expectNoMockWhileOwed` for the register's mock values; the routes in
`targets.spec.ts` and the heading-order check; the earlier suites green. The four pages compared with their
prototypes at 375 and 1440 before the code review, with an ADR for where a repo rule outranks a prototype.
The routes appended to `lighthouserc.cjs`, lhci on the local production build against QUALITY section 3.
`bun check`, `bun run build` and the Storybook build pass.
