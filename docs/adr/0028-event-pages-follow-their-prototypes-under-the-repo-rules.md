# The event pages follow their prototypes, except where a repo rule outranks them

Decided on 12 September 2026 (Phase 5, ticket 10), after comparing `/odunde` and `/gala` with `08
Odunde Festival.dc.html` and `09 End-of-Year Gala.dc.html` side by side at 375 and 1440 (captures in
`test-results/`, the prototypes served by the `design` entry of `.claude/launch.json`). Both pages keep
the prototypes' order of sections, their kickers and headings, the tokens' components and spacing, the
layout options with the prototypes' names and values, and the mobile stacking. They depart from the
prototypes only where a rule that outranks a prototype says so (AGENTS.md: the handoff beats the design
system readme, and no content is invented):

- **Content the Studio does not hold is Pending.** The prototypes' dates, hours, prices, venues,
  addresses, the Gala's dress note, the zone lines, the schedule and running order, sponsor levels,
  honorees, partners and attendance are mock; the pages show the registry's chips and lines until the
  Studio holds the facts (AGENTS.md; the spec's list of removed copy).
- **Empty blocks stay on the page.** The prototypes mark the schedule, the running order and past galas
  "hidden until set"; a block the option shows renders its heading and a Pending line instead, and
  hiding stays the editor's choice through the option (ADR 0024).
- **"Odunde" is unmarked** in display text where the prototypes write "Ọdúndé" ("Odunde Festival",
  "What Odunde is", "Take part in Odunde"); the kickers' Yoruba halves keep their marks (ADR 0009).
- **Four zones.** The prototype draws five; the page draws the named zones and placeholders up to the
  confirmed four (spec Q3).
- **Take-part rows** come from the singleton with the prototypes' invented facts taken out, the lead
  row moved in the markup rather than by CSS `order` (ADR 0025).
- **The carousel** has 44px dot tabs, drawn chevrons and a count that is not uppercase (ADR 0027).
- **Honorees** are hidden by default where the prototype shows them (spec Q5).

One site-wide departure came out of Lighthouse: the footer's headings are h2, not the prototype's h4,
because `/odunde` ends on an h2 and a jump to h4 fails axe's heading-order rule, which Lighthouse's
accessibility score counts (the elder test: AA and the budget of 100).

Four differences were fixed rather than recorded: a wrapped line of header facts ended on its gold dot
(each fact now carries its dot and a clipping box hides the one that starts a line); a long Pending chip
became an oval in a narrow glance or fact cell (the chip's corners are 16px, a pill on one line); a
section head in a split sat 30px above its prose where the prototypes set 16px; the schedule's "Hide the
schedule" toggle sat on the left because the button class made it inline (it is block-level and sits on
the right, as drawn).

## Considered options

- Match the prototypes pixel for pixel, mock content included, and swap content in later: rejected; it
  would ship invented facts to a grant reviewer's first visit.
- Hide every empty block until the Studio fills it: rejected by ADR 0024; the page and the Studio's
  Pending view would stop naming the same owed item.

## Consequences

- Once the Studio holds the 2027 and Gala 2026 facts, the pages converge on the prototypes without code
  changes; the comparison is worth repeating then (the handoff lists it).
- The chip's corner radius changes wherever a Pending chip appears, the homepage included; a one-line
  chip looks the same.
