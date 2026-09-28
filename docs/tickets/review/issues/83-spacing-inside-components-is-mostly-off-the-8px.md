# 83: Spacing inside components is mostly off the 8px grid

Labels: design, later
Status: open
Blocked by: none

**Finding** (R83 in `docs/plans/review-alignment-and-quality.md`; every route; polish; rule-conflict): The rule reads "spacing on an 8px grid", but the interaction layer and the port's deliberate matches to the prototypes (ADR 0036 records several) use 14, 18, 22 and 26px throughout. Nothing looks broken; the rule and the design simply disagree below the section level.

**Evidence:** Census of margins, paddings and gaps at 1440 (/private/tmp/claude-501/-Users-afo-Code-omo-yoruba/452b50c5-d114-459b-9fb8-3a0945241754/scratchpad/lr/grid.mjs): / 33% on the 8px grid (49% on 4px), /odunde 34%, /impact 32%; the common values are 22, 14, 18, 26, 13, 6 and 10px. docs/design/design/oy-components.css uses 14px 22 times, 18px 19 times, 22px 17 times. Section padding (88px desktop, 48px mobile) and the 1100px content width hold on every route. Also: packages/tokens/src/tokens/spacing.css:6-13 (--space-1 to --space-8): git grep 'var(--space-' over tokens, ui and web returns nothing; the 197 margin, padding and gap declarations in ui scoped styles use 12px (21), 14px (14), 26px (10), 18px (10), 22px (7) and similar; also unread: --surface-alt, --surface-tint, --accent-sustain, --pattern-ayo-dot (colors.css, patterns.css); DESIGN.md:236 and oy-design-system/SKILL.md:32 present --space-* as the grid

**What to build:** Owner call: keep the prototypes' spacing and narrow the rule to section rhythm and width, or retune the component spacing to 8px steps in the tokens. Size L. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
