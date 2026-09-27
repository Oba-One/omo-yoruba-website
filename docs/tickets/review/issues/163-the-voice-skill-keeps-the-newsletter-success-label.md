# 163: The voice skill keeps the newsletter success label as an open question after ticket 23 settled it

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R163 in `docs/plans/review-alignment-and-quality.md`; .claude/skills/oy-voice; polish; docs): An agent writing success copy is told to ask the owner something already answered. Verified against the ticket's status line.

**Evidence:** .claude/skills/oy-voice/SKILL.md:58-60: 'Open question ... confirm with the owner (wayfinder ticket 23)'. docs/tickets/wayfinder/issues/23-newsletter-success-label.md is Status: resolved, and docs/plans/wayfinder.md:79-81 records the owner's yes on 11 September 2026.

**What to build:** Replace the open question with the decision and its date. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
