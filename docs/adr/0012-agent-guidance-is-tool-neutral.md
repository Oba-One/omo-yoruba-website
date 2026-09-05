# Agent guidance is tool-neutral, with AGENTS.md as the contract

The owner works with more than one coding agent (Claude Code, Codex, and GitHub Copilot on
pull requests), so the repository contract lives in `AGENTS.md`, the file those tools read
natively. `CLAUDE.md` is a short Claude Code note that imports it (`@AGENTS.md`) and lists
the Claude-only entry points: the guardrail hook, `.mcp.json`, the plugin commands. Skills
stay in `.claude/skills/` as the single source, and `.agents/skills` is a symlink for tools
that discover skills there, never a second copy. This mirrors the green-goods layout and
deviates from `docs/design/AGENT-DOCS.md`, which named `CLAUDE.md` alone.

## Consequences

- The `## Agent skills` block the Matt Pocock skills read is in `AGENTS.md`; a re-run of
  `/setup-matt-pocock-skills` edits that file, not `CLAUDE.md`.
- Anything specific to one tool (hooks, MCP config, plugin commands) goes in that tool's
  file; anything about the repo goes in `AGENTS.md`.
