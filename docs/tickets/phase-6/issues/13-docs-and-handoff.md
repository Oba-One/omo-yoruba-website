# 13: Docs, decisions and the handoff

Labels: later
Status: open
Blocked by: 12

**What to build:** the repo's documents describe what Phase 6 built, and the owner has what they need to
check it and fill the pages: the component map, the content-ops recipe for a collective event, the
runbook and READMEs where they changed, CONTEXT and the ADRs, the wayfinder map with a ticket listing the
program pages' owed facts (as ticket 38 does for the event pages), `docs/plans/handoff-phase-6.md` and the
Phase 7 prompt in `docs/plans/prompt-phase-7.md`.

- [x] Component map rows for every new or changed component
- [x] `oy-content-ops` gains the collective event recipe; runbook and READMEs updated
- [x] Wayfinder: the decisions, the owed-facts ticket (the teacher, the Lessons answers, levels and
      steps, the Kids & STEM and Cultural Exchange facts, the initiatives, the Collective's argument and
      voice, the year strip's cadences, whether the Collective keeps a list, the `enrol` success line's fee
      wording) and the frontier
- [x] The code review run on the whole diff and its findings fixed before the pull request
- [x] Phase 7 prompt written after the pull request is open
- [ ] Handoff (`docs/plans/handoff-phase-6.md`): the owner runs `/mattpocock-skills:handoff`

## Comments

13 September 2026. The component map describes every part Phase 6 added or changed; the UI, content and
tokens READMEs follow; `oy-content-ops` gains the collective event and initiative recipes; the runbook
notes the prototype runtime trap and the Lighthouse routes; the wayfinder records ADRs 0032 and 0033. The
code review ran on the whole diff in two axes (standards and spec, three reviewers each, split by area);
the fixes are in `fix(phase-6): apply the code review`. Pull request
https://github.com/Oba-One/omo-yoruba-website/pull/7 is open. Wayfinder ticket 39 (check the pages and
merge) and ticket 40 (the program pages' owed facts) join the frontier, and `docs/plans/prompt-phase-7.md`
is written. The handoff document is not: the handoff skill runs only when the owner invokes it, so the
ticket stays open until `/mattpocock-skills:handoff` saves `docs/plans/handoff-phase-6.md`.
