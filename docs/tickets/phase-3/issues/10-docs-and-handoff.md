# 10: Phase 3 documentation, the review and the handoff

Labels: infra
Status: open
Blocked by: 09

**What to build:** the runbook (Playwright locally and in CI, the actions and the spam controls,
the analytics events), the package READMEs and the component map as built (the script
convention, the dialogs, the footer choices), `packages/ui/README.md` on inline scripts and
play functions, the two-axis code review of the whole diff with its findings fixed, the pull
request against `main`, and `docs/plans/handoff-phase-3.md` written with `/handoff`.

- [ ] `bun check` and `bun run build` are green; the six existing CI jobs and the new one pass on the pull request
- [ ] The handoff lists what exists, the decisions made without the owner, the owner's follow-ups (Blueprint deploy for the email, ticket 02 for the contacts, ticket 03 for the Zeffy URL) and the suggested skills for Phase 4
- [ ] The branch protection note names the seventh context to add
