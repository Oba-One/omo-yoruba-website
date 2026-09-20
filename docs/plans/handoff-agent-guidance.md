# Shared agent guidance

The personal Pragmatic and DDD guidance is connected through `AGENTS.md`,
`docs/agents/domain.md`, and `oy-content-model`. The shared skills live in the
user environment; the repository owns its vocabulary, rules, and checks.

This change preserves the single-context model, `CONTEXT.md`, ADRs, Pending
registry, enquiry specification, schema generation, and release procedures.
It changes guidance only. No content, schema, application behavior, dependency,
or permission setting was changed.

Validation: the content-model skill passed the skill frontmatter validator;
`git diff --check` passed for the changed guidance; the repo's focused dash,
diacritics, and colour checks passed. Fresh Codex discovery found both enabled
personal skills for this repo. Claude's existing root import and shared skill
symlink were checked. A comparative coding-behavior pilot was not run.

Before continuing product work, read the current wayfinder and the relevant
phase handoff; this file does not change their priorities or open decisions.
