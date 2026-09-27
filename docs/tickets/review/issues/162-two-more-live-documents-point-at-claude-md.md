# 162: Two more live documents point at CLAUDE.md for rules that live in AGENTS.md, and domain.md miscounts the handoff docs

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R162 in `docs/plans/review-alignment-and-quality.md`; .github/pull_request_template.md, docs/agents/domain.md; polish; docs): CLAUDE.md is a short import, so a non-Claude tool following these pointers finds no rule there. Verified by grepping the live documents for CLAUDE.md.

**Evidence:** .github/pull_request_template.md:16 asks that CLAUDE.md still describe the system (AGENTS.md is the contract since ADR 0012); docs/agents/domain.md:33-34 sends readers to CLAUDE.md for the Storybook pivot rule, which is AGENTS.md:109-110; domain.md:10-11 counts five companion docs, while docs/design holds six besides README.md (ADR 0010:12 and .lintignore:8 say six).

**What to build:** Replace CLAUDE.md with AGENTS.md in both places and say six. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
