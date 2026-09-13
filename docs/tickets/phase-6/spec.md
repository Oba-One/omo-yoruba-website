# Phase 6 spec: the program pages

Written 12 September 2026 from the Phase 6 prompt (`docs/plans/prompt-phase-6.md`), ROUTES sections 1,
3, 4 and 5, CONTENT-MODEL sections 3 and 4, the COMPONENT-MAP, `docs/design/design/10 Programs.dc.html`,
`11 Yoruba Language School.dc.html` and `12 Yoruba Cultural Collective.dc.html` (the fidelity bar at 375
and 1440), `19 Mock Content Register.dc.html`, the Build Brief's polish passes 2 and 3, and the grill on
the program seam. The owner accepted every recommendation in two rounds (Q1 to Q15); each answer below is
theirs. Decisions marked "session" were made without a question, as the consequence of an answer or of
a repo rule.

## Before the grill: the two Phase 5 gaps

- `pendingWhat(type, field, kind)` answers a kind only from a row narrowed to that kind or a row every
  kind shares, for field rows and the condition-row fallback alike (commit `6ef2e08`).
- The header, the extra glance facts, the take-part rows, the layout options' edit attributes and past
  years moved from the festival and Gala builders into `page-skeleton.ts` beside `view.ts` (commit
  `c0b69ec`); the event pages' Vitest and Playwright suites passed unchanged.

## Facts the grill stood on

- `development` matches the seed: the three singletons' headers and actions, the Lessons glance
  (Format, When and Cost filled, Ages empty), five FAQ questions without answers, Kids & STEM's prose and
  two sub-programs (names, blurbs, actions), the year strip's five rows, the two initiatives with their
  names and `memberLed` only. No person, testimonial or collective event exists.
- Polish pass 3 of the Build Brief slimmed Lessons to "teacher + contact, levels, one lesson, five FAQs,
  take part", which outranks the wireframe's parent voices.
- Every shared class the three prototypes use is already ported to `@oy/tokens`; the page-only `pg-*`,
  `ls-*` and `cc-*` rules and the option selectors are not. The tokens hold one green (`--green-600`).
  The prototype's member-led pill measures 4.18:1 (fails AA at 12px). The prototypes carry three bugs
  not to copy: the `three` card grid never collapses, the `strong` swatch never shows, and a stray
  caption sits in the Collective's first split.

## The design tree, answered

**Q1. Take-part rows.** The ways in grow from six to nine: `enrol`, `member` and `updates` join vendor,
sponsor, performer, volunteer, table and give, on ADR 0025's one row object. A row gains an optional
`chip` that overrides its way in's default chip ("Partner" on a sponsor row, "Skills" on a volunteer
row). The way in still fixes the accent and what the button opens: `enrol` and `member` their enquiry
kinds, `give` the Give Dialog, `updates` the newsletter form on the same page (the footer's block gains
the anchor). The band keeps its rule: the first working row is gold, give and updates are quiet.
`keepsOwnList` stays off and unread; Updates points at the footer newsletter until the owner says the
Collective keeps a list (ADR 0029).

**Q2. The Programs cards and header.** Each card adds the Programs prototype's line: the cadence and
the ages, each its registry chip while empty. A program without its own page links "On this page" to its
inline section instead of its Studio action; Lessons and the Collective keep their actions. `cards`:
four across, three (the first three by order; the fourth program's inline section leaves with its card),
pairs. The header draws the Studio's actions as every page does; `development` stores "Enrol a learner",
which the owner can clear for the prototype's plain header.

**Q3. Kids & STEM inline.** The prototype's section: the head with a quiet "Hide details / Show details"
toggle (a native disclosure, open when `inline` is expanded, working without JavaScript), the prose,
then two sub-program cards with a photograph, the name, the blurb, the facts and an outline action.
Sub-programs gain `image` and `facts[]` (the shared `fact`); `kidsStem.image`, `kidsStem.ages` and the
sub-program's `ages` and `detail` retire (all empty or unrendered). The seed moves the robots photograph
to the STEM Hub, gives Àgbàlá Ọmọde the prototype's ayo photograph, and writes only the labels whose
chip reads true: Ages on both, What they build on the STEM Hub ("When: Saturdays" is invented). An empty
value shows "ages and what they build".

**Q4. Cultural Exchange inline.** The prototype's split from the fields the schema has: the blurb, then
Who it is for, Cadence and How to join, each value or its own chip (the registry's one row splits per
field), beside a photograph placeholder; the summer-camp photograph would show a reviewer what the
exchange looks like. "Between" has no field and is dropped.

**Q5. The year strip.** Five columns; each row: when (typed, chip "when it runs" while empty), the name
(the program's own name, or for an event row the kind's page name without a year), an optional note.
An event row names a kind (festival or gala) instead of an edition, which would go stale when it ends
(ADR 0024's reason); `yearStripRow.event` retires. The seed writes the confirmed notes ("Leimert Park",
"Àgbàlá Ọmọde runs at the festival", "Solar Hub, Green Goods"); "Year-round", "Saturdays" and "Monthly"
stay Pending; the Gala's "Date pending" is not a note.

**Q6. Lessons: glance, What you learn, one lesson.** The glance draws the four seeded facts; the
prototype's notes and fee caption stay out. What you learn gains a text field for its prose (chip "what
the lessons teach, in her words") and lists the levels or their Pending line. What a lesson looks like
draws `oneLesson[]` as day-led schedule rows or the Pending line; the lead loses "About an hour on a
call".

**Q7. The teacher.** Before a teacher is linked the card draws the woven tick, the role "Teacher" and
the chip "the teacher's name and bio"; linked, her name, role, short bio and, with `portraits` shown, her
portrait. Beside it the existing `EnquiryCard` for `enrol` (the spec's title, blurb and question count)
with "Or email" and her routing contact's address, or the chip "the teacher's email". The registry row
"the teacher, her bio and how she wants enquiries" splits in two. Should Playwright find the header's
gold button and the card's in one screen view at 1440, the card's goes outline.

**Q8. The FAQ accordion.** Single open, `faq` closed by default (`open` opens the first question). An
unanswered question stays in the list and opens onto the chip "an answer". The prototype's "+" and "−"
are outside the glyph set, so the mark is drawn in CSS. Native `details` with a shared `name` is the
first candidate (single open without JavaScript), confirmed by research before building
(`docs/research/phase-6-faq-accordion.md`), with a play function for the keyboard.

**Q9. Voices.** Lessons has no voices section, as its slimmed prototype; `lessonsPage.voices` and its
registry row retire, and a lessons testimonial still fills the homepage's parent slot. The Collective's
one voice is the prototype's large quote, not a card (a `PullQuote` variant): initials without
permission to name; without a testimonial, the chip "the quote and who said it", then the placeholder.

**Q10. Solar Hub and Green Goods.** Each its own section as drawn: the status pill from the typed status
line (hidden by `status`) or its chip, the member-led pill from `memberLed`, the heading, the blurb or its
chip, a four-cell glance (Status, Serves, Since, Next; the registry's one row splits per field), and the
initiative's photograph or a placeholder; `initiatives` puts the copy beside the photograph (side) or
above it (stacked). The prototype's interim photographs would state what the projects do and sell, so
the placeholders stay. `proceedsReturn` is not drawn.

**Q11. Collective events.** A rule of their own (ADR 0030): every collective event with a start, still to
come (until its end, or until its start day ends in Los Angeles, as ADR 0024 reads a dated edition), in
date order; an event without a start never lists. A row: the month and day, the title, the summary, the
weekday and time with the venue or its chip, and a quiet "Ask to join" opening `contact`. Nothing to
come: the heading and a Pending line from a count of upcoming collective events. `events` hidden also
drops the header's "See what is on".

**Q12. Green scope.** `data-scope="collective"` on the Collective page's `main`, so green reaches that
page's blocks and nothing in the nav, the footer or the dialogs. `green` strong tints the slim header and
the alternate grounds and turns the section swatch green and gold, inside that scope only. The
prototype's literal greens become tokens; the member-led pill's text takes the darker green (#1F5C41,
the volunteer chip's) for AA. Outside the page, green stays on the Collective card's link.

**Q13. The Collective photograph.** The photograph beside "Why culture and sustainability sit together"
is the Collective program's own (the interim festival portrait today), so replacing it once (ticket 31)
changes the homepage card, the Programs card and this page. No new field.

**Q14. The take-part rows as seeded.**

| Page | Way in (chip) | Title | Line | Button |
| --- | --- | --- | --- | --- |
| Programs | enrol (Enrol) | Start Yoruba lessons | Online lessons for children and adults, scheduled with the teacher. Write to her to start. | Enrol a learner |
| Programs | volunteer (Volunteer) | Help with a program | One form, and we place you. | Volunteer |
| Programs | give (Give) | Give toward the programs | Gifts hold up the language lessons, the children's programs, and the festival. | Donate |
| Lessons | volunteer (Volunteer) | Volunteer with us | One short form. You tell us when you are free and what you can do, and we place you where the gap is. | Raise your hand |
| Lessons | member (Membership) | Become a member | Members carry the lessons and every other program. | Become a member |
| Lessons | give (Give) | Give toward the lessons | (none) | Donate |
| Collective | sponsor (Partner) | Partner or fund a project | Organizations, funders, and civic partners. Four questions and we send the deck. | Talk to us |
| Collective | volunteer (Skills) | Bring a skill | Tell us what you can do and we will find where it fits. | Volunteer a skill |
| Collective | updates (Updates) | Follow the Collective | Collective news goes out with our newsletter, once or twice a month. | Subscribe |

Removed as invented: the volunteer roles ("Classroom helpers, festival hands, and the children's
compound", "A second adult on a children's call", "a few hours a month", "Engineering, supply,
permitting, and design"), the dues and what members get ("$75 a year", "a vote at the annual meeting"),
what a gift buys and the fee policy ("Books, materials, and the teacher's time", "A gift can cover a
learner whose family cannot pay"). The Lessons volunteer row takes the volunteer door's seeded title and
blurb, since "Help with lessons" claims a lesson-helper role.

**Q15. Page copy.** Taken out: the Lessons glance caption ("No family is turned away over the fee, so
say so when you write"), "About an hour on a call" from the lesson lead, the Collective events lead
("Talks, workshops, and site visits through the year. Everyone is welcome"), and "and open to any member
who wants in" from the Collective take-part lead ("The projects above are led by members. Three ways to
join them."). The Write to the teacher card takes the `enrol` spec's copy, which drops "She replies within
a few days" and "Nothing is charged online". The Collective's one voice waits as "[ Quote from a member
of the Collective, two or three sentences on why culture and sustainability belong together. ]" with
"Name pending • Member, Yoruba Cultural Collective". Kept: the cards note, the year strip lead, the two
handoff boxes; the take-part and FAQ leads count their rows. The `enrol` form's success line (Phase 3)
says fees are "settled after the first lesson", which the register marks invented: listed on the
owed-facts ticket, not changed here.

## Further decisions (session)

### Content model

- `takePart[]` (the shared `takePartRow`, now with `chip`) on `programsPage`, `lessonsPage` and
  `collectivePage`, with the registry's "the ways in" and "a way in, its title or its button label" rows
  for each.
- `programsPage`: sub-programs `image` and `facts[]`; `yearStripRow.kind` (festival, gala) with exactly
  one of a program or a kind; the retirements above. `lessonsPage.learn` (Portable Text); `voices`
  retires. `collectivePage` keeps its fields.
- Retired fields are unset by the seed where stored, nested paths included (`kidsStem.image`,
  `kidsStem.subprograms[_key=="sub-1"].detail`, `yearStrip[_key=="row-2"].event`); the seed's
  missing-field fill reaches keyed items inside an object's array.
- The registry: a `header.title` row per program singleton; the Lessons glance row reads "a glance
  fact"; the Kids & STEM facts row; Cultural Exchange per field ("what the exchange is", "who it is for",
  "the cadence", "how to join", "a photograph of the exchange"); the year strip's "when it runs"; the
  teacher's "the teacher's name and bio" and the settings' "the teacher's email"; the initiative per
  field ("the status", "the status line", "who it serves", "when it started", "what comes next", "a
  photograph of the project"); the collective event's venue; and a presence row counting collective
  events still to come ("the next Collective events"), which `presenceWhat` finds by kind as
  `pendingWhat` does.
- The stega filter gains the program pages' option names and the contacts' `email` (it becomes a
  `mailto:` link).

### Queries and routes

- `programsPageQuery`, `lessonsPageQuery` and `collectivePageQuery` in
  `packages/content/src/queries/program-pages.ts`, one read per page through `loadQuery`: the singleton,
  every program in order (Programs), the teacher and her routing contact (Lessons), the initiatives, the
  one voice, the Collective program's photograph and every dated collective event (Collective). Images
  project the asset reference (ADR 0022).
- The route map: `program` reaches the Collective page (the photograph); `testimonial` no longer reaches
  Lessons; `event` no longer reaches `/programs` (the year strip names kinds). Presentation follows.
- `cachePage(Astro, route, { draft, failed })` on each route; the edit attributes on the options'
  containers and the images, as on `/odunde`.

### Layout options

Names and values from `packages/content/src/layout-options.ts`, the first the default.

- Programs: `cards` four, three, pairs; `inline` expanded, collapsed; `yearstrip` shown, hidden (the
  handoff box goes with the strip).
- Lessons: `lesson` shown, hidden; `portraits` shown, hidden (the teacher card without a portrait);
  `faq` closed, open.
- Collective: `initiatives` side, stacked; `green` signal, strong; `status` shown, hidden; `events`
  shown, hidden.

### Components

In `@oy/ui` with stories and tests, each variant a story and each empty state Pending: `YearStrip`,
`Accordion`, `ContactBlock` (built for Phase 7's Our Story and Get Involved), a disclosure for the inline
programs, the sub-program card and the initiative section, `ListRow`'s event form, and the extended
`ProgramCard` (the when line), `PullQuote` (the single large quote, the page's wording), `TakePartBand`
and `PathRow` (nine ways in, the chip), `GlanceStrip` (inside a column, without its band) and `SiteFooter`
(the newsletter anchor). One page-section story per layout option under `Pages/Programs`,
`Pages/Lessons` and `Pages/Collective`, on fixtures of confirmed facts, bracketed placeholders and Pending
states.

## Proof

Playwright and axe on the three routes at 375 and 1440, seeded and as CI runs them (the placeholder
project, `--workers=1`), with `expectNoMockWhileOwed` for the register's mock values; the routes in
`targets.spec.ts` and the heading-order check; the earlier suites green. The routes appended to
`lighthouserc.cjs`, lhci on the local production build, numbers against QUALITY section 3. The three
pages compared with their prototypes at 375 and 1440 before the code review, with an ADR for where a repo
rule outranks a prototype. `bun check`, `bun run build` and the Storybook build pass.
