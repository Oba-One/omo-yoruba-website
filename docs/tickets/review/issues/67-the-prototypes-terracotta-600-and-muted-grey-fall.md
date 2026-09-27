# 67: The prototypes' terracotta 600 and muted grey fall under AA on the indigo tint; the site darkens them, unrecorded in an ADR and also inside cards that pass

Labels: design, later
Status: open
Blocked by: none

**Finding** (R67 in `docs/plans/review-alignment-and-quality.md`; Section alt ground (all three pages); polish; rule-conflict): AGENTS.md's elder test outranks the prototypes, so the site is right to darken on the tint; this entry exists so the next comparison does not flag the darker kickers and links as drift. Measured with getComputedStyle on both and the WCAG luminance formula.

**Evidence:** Computed contrast on the tint rgb(232,236,246): terracotta 600 rgb(180,85,45) 4.15:1 (kickers, the handoff box's quiet button in 10 and 11), muted rgb(107,107,118) 4.45:1. The site uses terracotta 700 (6.13:1) and rgb(95,95,106) (5.33:1) through packages/ui/src/page/Section/Section.astro:65-69 and packages/ui/src/page/Handoff/Handoff.astro:81-84. ADR 0033 names only the strong green tint; docs/plans/handoff-phase-4.md notes the tint for the homepage. The section-wide override also darkens text on paper and white inside the section: the sub-program cards' fact labels (terracotta 700, where 600 measures 4.52:1 on their paper rgb(250,245,236)) and the year strip's notes (on white, where the muted grey measures 5.26:1).

**What to build:** Keep the darker colours (the elder test's AA outranks the prototype) and record the indigo-tint case in ADR 0033; optionally scope the override to text that sits on the tint itself. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
