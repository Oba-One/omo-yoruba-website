# The program pages follow their prototypes, except where a repo rule outranks them

Decided on 13 September 2026 (Phase 6, ticket 12), after comparing `/programs`,
`/programs/yoruba-lessons` and `/programs/cultural-collective` with `10 Programs.dc.html`, `11 Yoruba
Language School.dc.html` and `12 Yoruba Cultural Collective.dc.html` section by section at 375 and 1440
(full-page captures in `test-results/phase6-compare/`, the prototypes served by the `design` entry of
`.claude/launch.json`). The pages keep the prototypes' order of sections, their kickers and headings, the
tokens' components and spacing, the layout options with the prototypes' names and values, and the mobile
stacking. As ADR 0028 records for the event pages, they depart only where a rule that outranks a
prototype says so:

- **Content the Studio does not hold is Pending.** The register invents every card's cadence and ages,
  Kids & STEM's ages and what they build, everything about Cultural Exchange, the Lessons glance notes and
  fee caption, the levels, the lesson's steps, the teacher, the answers, the Collective's argument, its
  voice, the initiatives' status lines, reach, dates, next steps and products, and the Collective's
  events; the pages show the registry's chips and lines (the spec's removed copy, Q15).
- **Placeholders, not interim photographs,** for Cultural Exchange and the two initiatives, whose interim
  photographs would tell a reviewer what the programs look like (Q4, Q10). The Collective's argument sits
  beside the Collective program's own photograph (Q13).
- **Copy the rules retire.** "Between" has no field (Q4); "When: Saturdays", "About an hour on a call",
  the Collective events lead and "open to any member who wants in" are invented (Q3, Q6, Q15); the enrol
  card takes the enrol spec's copy (Q7); "Enrol", not "Enroll" (ADR 0023); Yoruba Language Lessons, never
  "School".
- **The Studio's header actions.** The Programs header draws the gold "Enrol a learner" the development
  dataset stores, where the prototype has none; the owner can clear it (Q2).
- **One gold action per screen view.** The teacher's enrol card is an outline beside the header's gold
  "Write to the teacher" (Q7).
- **The teacher before she is linked** is the woven-tick card with "Teacher" and the chip, where the
  prototype draws a portrait placeholder above an invented name (Q7).
- **AA where the prototype measures under it.** The member-led pill's text is `--green-700` (Q12), and
  kickers on the Collective's strong green tint take terracotta 700: terracotta 600 measures 4.42:1 there.
- **Headings in order.** The Programs cards section carries a visually hidden h2, "The programs", since
  the prototype jumps from the h1 to the cards' h3.

Two prototype choices were kept where a reading of `oy-voice` or AGENTS.md could object. The status and
member-led pills set their words in capitals, as the prototype does: they are chips in the take-part
path chips' sense, the one place besides kickers AGENTS.md allows uppercase. And the quiet links "On this
page" and "All programs" keep the prototypes' wording without a verb: they are handoffs that name where
they go, as "See our impact" does, and a verb would only add "Go to".

Two prototype renderings were not taken as intent. The Collective prototype's runtime draws its sections
outside `.oy-home`, so the `adire` theme never reaches them: its alternate grounds read as paper and its
take-part rows take darker borders. `10 Programs.dc.html` and `11 Yoruba Language School.dc.html` apply
the theme, and the site follows them on all three pages: the indigo tint and the light row borders. On
that tint the tokens' handoff box, tinted the same, vanishes (as in the Programs prototype's year strip),
so a handoff box on an alternate ground takes white and keeps its shape.

Five differences were fixed rather than recorded: the photographs beside the Collective's argument and
Cultural Exchange are 280px as drawn, not the figure's 360px (`PhotoTile` takes a `height`, and the
initiatives use it for their 340px); Kids & STEM's prose runs at the prototype's 74ch (`Prose`'s wide
measure); "Hide details" sat on the left under 720px because the button class made it inline (it is
block-level and sits on the right); the questions parents ask sit in the prototype's 900px wrap
(`Section`'s narrow width); and a placeholder quote's closing bracket wrapped onto a line alone at 375
(each bracket is held to its word).

## Considered options

- Match the prototypes pixel for pixel, mock content and interim photographs included: rejected, as in
  ADR 0028; it would ship invented facts and pictures to a grant reviewer.
- Copy the Collective prototype's paper grounds: rejected; they come from its runtime, the other two
  prototypes draw the theme's tint, and one site-wide alternate ground keeps the pages alike.

## Consequences

- Once the Studio holds the owed facts and photographs, the pages converge on the prototypes without code
  changes; the comparison is worth repeating then.
- Any handoff box on an alternate ground is white, the event pages' included should one move there.
