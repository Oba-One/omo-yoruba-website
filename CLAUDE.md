# CLAUDE.md

Claude Code notes for this repo. The tool-neutral contract every agent follows is `AGENTS.md`,
imported below so Claude reads it first. Repo rules belong there, not here.

@AGENTS.md

## Claude Code entry points

- `.claude/settings.json` installs a PreToolUse hook (`.claude/hooks/block-dangerous-git.sh`)
  that blocks forced pushes, hard resets, tree cleaning, branch deletion and whole-tree
  checkouts or restores. Plain pushes are allowed.
- `.claude/skills/` is the one skill source: the repo's `oy-*` skills and the third-party
  `git-guardrails-claude-code`. `.agents/skills` is its symlink for Codex and other tools;
  never create a second copy.
- `.mcp.json` points Claude Code at the Sanity MCP server (OAuth on first use).
- The Matt Pocock plugin (`claude plugins install mattpocock-skills`) provides `/code-review`,
  `/handoff`, `/to-tickets`, `/implement`, `/wayfinder` and the model-invoked `tdd`,
  `research` and `wizard`. The `## Agent skills` block those skills read lives in `AGENTS.md`.
- Use `bun run test` and `bun run build`; `bun test` and `bun build` are Bun built-ins.
