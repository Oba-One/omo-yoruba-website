# The trust pages follow their prototypes, except where a repo rule outranks them

Decided on 13 September 2026 (Phase 7, ticket 15), after comparing `/get-involved`, `/impact`, `/our-story`
and `/donate` with `13 Get Involved.dc.html`, `14 Impact.dc.html`, `15 People and History.dc.html` and
`16 Donate.dc.html` section by section at 375 and 1440 (full-page captures in `test-results/phase7-compare/`,
the prototypes served by the `design` entry of `.claude/launch.json`). The pages keep the prototypes' order
of sections, their kickers and headings, the tokens' components and spacing, the layout options with the
prototypes' names and values, and the mobile stacking. As ADR 0028 and ADR 0033 record for the event and
program pages, they depart only where a rule that outranks a prototype says so:

- **Content the Studio does not hold is Pending.** The register invents the doors' bullets and the vendor
  door's blurb, the general inbox's people and reply times, every figure's source line, How we work, each
  program's outcome, the civic figures, the voices, the governance positions and the EIN, the partners,
  the partnerships lead, the founding story, founders and first year, the board, staff and volunteers, the
  Zeffy form's fees, receipt and monthly facts, the giving levels and the other ways to give; the pages show
  the registry's chips and Pending lines (ADR 0035).
- **A placeholder, not an interim photograph,** beside How it began. The prototype stands the summer camp
  photograph in for the earliest image; a photograph of people beside the founding facts would tell a
  reviewer who founded the organization.
- **Copy the rules retire.** "Odunde" stays unmarked in display text (ADR 0009: "Sell at Odunde", "Odunde
  as civic infrastructure", the outcome card's "Odunde Festival"). Impact's outcome links name the programs
  ("Yoruba Language Lessons", never "The school"), the placeholder quote asks what the lessons changed, not
  Saturday mornings, and the header line and give-now section make no claim about Zeffy's fees. The links
  to Our Story use the nav's name, not "People & history". The register's named partnerships lead gives way
  to "Our partnerships lead answers" and "Talk to us". The timeline keeps its heading without the
  prototype's lead, "The years before Odunde, and everything since.", which dates the festival after the
  founding where no confirmed fact does; Donate's box to Impact drops "with a source line under every number"
  while Impact hides its source lines.
- **One gold action per screen view.** Get Involved's member card is the only gold door, where the
  prototype draws four; Our Story's contact card is the outline beside the take-part member row (ticket 12);
  Donate's give-now section draws no second Give now under the header's (spec Q14).
- **The doors and rows the Studio holds.** Donate's larger scale shows the one partner door in the row form
  where the prototype draws two cards of invented copy (spec Q15); Our Story's member row has no line, since
  the prototype's promised a say in what gets built, a member vote the register marks invented.
- **The timeline waits for the owner** (ticket 07), hidden where the prototype shows it; compared through
  `Pages/OurStory/Timeline`, whose dots, milestone colour, rule and spacing match.
- **Headings a little wider.** Source Serif 4 ships weight-only (ADR 0026), so a heading the prototype fits
  on one line can wrap ("Giving at a larger scale" at 375) and the figures run a few pixels wider.

Two prototype renderings were not taken as intent. `15 People and History.dc.html`'s runtime draws every
section from the board on outside `.oy-home`, the trap ADR 0033 found in the Collective prototype: Staff and
Take part read as paper, the take-part rows take dark borders and the contact card is white; the site keeps
the `adire` tint, the light borders and the library's `EnquiryCard`. And `16 Donate.dc.html` sets the
give-now split's columns inline, which overrides the tokens' mobile stacking, so at 375 its facts run off
the screen; the site stacks them.

One library choice was kept where a page prototype differs. The volunteer take-part row's chip keeps the
volunteer accent's green tint, as `08`, `09`, `10` and `12` draw it through `data-accent`; `15` sets no
accent on its rows. The handoff reads that tint as a way in's accent, not Cultural Collective content, and
one accent per way in holds across the site.

Eight differences were fixed rather than recorded:

- The door card's label was a paragraph, so the card's `.oy-door p` rules set it at 15px and grew it when
  a card was shorter than its neighbour ("Vendors" sat 22px above its title); it is the prototype's span.
- The door bullets take the prototype's gold bullet glyph, 15px lines and 9px spacing.
- The six photographs on Impact kept the homepage mosaic's wide first tile under 860px, leaving the sixth
  alone on its row; six stays equal tiles, two across at 160px under 900px, as drawn.
- A glance strip first in a split's aside (Get Involved's associations, Impact's civic figures) sat 20px
  below the heading beside it; it aligns with the heading.
- `SectionHead` took the prototypes' section lead: 12px under the heading, 64ch, line height 1.7, and the
  heading 6px under a kicker only, flush without one (every kicker-less head sat 6px low).
- Impact's dark closing band draws its kicker without the aṣọ òkè swatch (`SectionHead`'s `swatch`).
- Donate's give-now copy centres on its facts, as the prototype sets that split (`Split`'s `align`).
- Impact's headline numbers read in the prototype's order, the associations before the zones, under the
  full label "hometown associations in the community", with the homepage strip keeping the short one; Our
  Story's volunteer row wears the prototype's "Volunteer" chip. The seed writes both (ADR 0035's revisions).

## Considered options

- Match the prototypes pixel for pixel, mock content and the stand-in photograph included: rejected, as in
  ADR 0028 and ADR 0033; it would show a grant reviewer invented facts, names and a founding picture.
- Copy the People and History prototype's paper grounds and dark borders: rejected; they come from its
  runtime, and the other three trust prototypes draw the theme's tint.
- Follow `15`'s indigo chip for the volunteer row: rejected for now; the four prototypes that set accents
  agree, and a trust page would be the one place the volunteer chip changed colour.

## Consequences

- Once the Studio holds the owed facts, levels and photographs, the pages converge on the prototypes
  without code changes; the comparison is worth repeating then.
- The `SectionHead` lead and heading spacing changed on every page that uses it, the homepage, event and
  program pages included, towards their prototypes' `.oy-sec-lead`.
- Should the owner read the volunteer chip's green as the Collective's, the accent is one token rule in
  `oy-components.css`.
