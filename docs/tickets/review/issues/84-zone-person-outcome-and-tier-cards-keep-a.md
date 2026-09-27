# 84: Zone, person, outcome and tier cards keep a beige hairline where every other card has the indigo one

Labels: design, later
Status: open
Blocked by: none

**Finding** (R84 in `docs/plans/review-alignment-and-quality.md`; ZoneCard, PersonCard, OutcomeCard, TicketTierCard; polish; rule-conflict): Polish pass 2 and AGENTS.md give cards an indigo hairline, and the card treatment block says so, but a later shorthand in the same file resets four card kinds to the beige line, in the prototype and in the port alike. On hover they all deepen to the same indigo, so only the resting state differs.

**Evidence:** Measured at rest (/private/tmp/claude-501/-Users-afo-Code-omo-yoruba/452b50c5-d114-459b-9fb8-3a0945241754/scratchpad/lr/rules/*.json, boxes): .oy-zone, .oy-person, .oy-outcome border rgb(236, 226, 205); .oy-card border rgba(30, 42, 90, 0.22). packages/tokens/src/oy-components.css:26-39 sets border-color: var(--card-line) for all of them, then the page-library blocks restate border: 1px solid var(--border-soft) (:1316-1320 .oy-person, :1486-1490 .oy-zone, :1822 .oy-tier, :2117 .oy-outcome), as the prototype CSS does (lines 294, 330, 396, 476).

**What to build:** Drop the border shorthand from those four blocks (or restate border-color: var(--card-line) after them) so every card has the indigo hairline at rest. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
