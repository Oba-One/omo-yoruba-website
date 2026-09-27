# 158: The design documents disagree on which source wins when AGENTS.md and the brief differ

Labels: infra
Status: open
Blocked by: none

**Finding** (R158 in `docs/plans/review-alignment-and-quality.md`; DESIGN.md, AGENTS.md, oy-design-system skill; minor; docs): Read literally, AGENTS.md resolves a doubt about the overlay breakpoint to the brief's 760px, contradicting its own line and the build; DESIGN.md resolves it to 880px. Which source wins is the owner's call; E7 and D11 settle individual values, not the order. Verified by reading the three passages.

**Evidence:** DESIGN.md:188: the handoff is frozen background; where it differs, the tokens and AGENTS.md win. AGENTS.md:56: docs/design/README.md section 3 is the source when in doubt. .claude/skills/oy-design-system/SKILL.md:8: the brief is the source of truth. They already differ on the menu breakpoint (AGENTS.md:66-68 says 880px as built, the brief 760px) and on the hero and H2 sizes (AGENTS.md:96 against the tokens, DESIGN.md:227, D11).

**What to build:** State one order in AGENTS.md (for example the build and AGENTS.md first, the brief as background, open owner decisions in open-work) and have DESIGN.md and the skill quote it. Size S. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
