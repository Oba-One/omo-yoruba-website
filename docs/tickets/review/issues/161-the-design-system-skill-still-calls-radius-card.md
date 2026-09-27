# 161: The design-system skill still calls --radius-card a 14px token and never names DESIGN.md

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R161 in `docs/plans/review-alignment-and-quality.md`; .claude/skills/oy-design-system; polish; docs): An agent could avoid the card radius token on the skill's word and hard-code 6px, or look for the rules in CLAUDE.md, which only imports AGENTS.md. Verified against the token file.

**Evidence:** .claude/skills/oy-design-system/SKILL.md:37: 'the --radius-card 14px token is overridden by oy-components.css'; packages/tokens/src/tokens/spacing.css:17 sets --radius-card: 6px. SKILL.md:8 says the rules are restated in CLAUDE.md (they are in AGENTS.md). DESIGN.md:188 lists the skill as a source, but the skill does not mention DESIGN.md.

**What to build:** Say --radius-card is 6px in @oy/tokens, point to AGENTS.md, and name DESIGN.md as the one-file summary. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
