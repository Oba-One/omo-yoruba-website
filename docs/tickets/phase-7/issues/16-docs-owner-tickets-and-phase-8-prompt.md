# 16: Docs, the owner's tickets and the Phase 8 prompt

Labels: later
Status: open
Blocked by: 15

**What to build:** the repo's documents describe what Phase 7 built, and the owner has what they need to
check it and fill the pages: the component map, the content-ops recipes (a person, an outcome, a
governance document, a giving level), the READMEs and runbook where they changed, CONTEXT and the ADRs,
the wayfinder map with a ticket to check and merge the pull request and one listing the trust pages' owed
facts, and the Phase 8 prompt in `docs/plans/prompt-phase-8.md`.

- [x] Component map rows for every new or changed component
- [x] `oy-content-ops` recipes; READMEs and runbook updated
- [x] Wayfinder: the decisions, the check-and-merge ticket, the owed-facts ticket and the frontier
- [x] The code review on the whole diff, its findings fixed, the pull request open against `main`
- [ ] The Phase 8 prompt; the owner runs `/mattpocock-skills:handoff` for `docs/plans/handoff-phase-7.md`

## Comments

13 September 2026. The component map describes every part Phase 7 added or changed; the content and UI
READMEs follow; `oy-content-ops` gains the person, outcome, governance document, giving level, other way to
give and timeline entry recipes; the runbook notes the People and History and Donate prototype traps, the
hidden-option comparison and the Lighthouse routes; the wayfinder records ADRs 0034 to 0036. The code
review ran on the whole diff in two axes (standards and spec, three reviewers each, split by area); the
fixes are in `fix(phase-7): apply the code review`, and the pull request lists what was left and why (the
give-now blurb's Zeffy claims wait for the owner, Q14; the Receipt cell reads its fact by label, Q17).
Pull request https://github.com/Oba-One/omo-yoruba-website/pull/8 is open. Wayfinder ticket 41 (check the
pages and merge) and ticket 42 (the trust pages' owed facts) join the frontier, and
`docs/plans/prompt-phase-8.md` is written. The handoff document is not: the handoff skill runs only when
the owner invokes it, so the ticket stays open until `/mattpocock-skills:handoff` saves
`docs/plans/handoff-phase-7.md`.
