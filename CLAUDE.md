# CLAUDE.md

Claude Code notes for this repo. The tool-neutral contract every agent follows is `AGENTS.md`,
imported below so Claude reads it first. Repo rules belong there, not here.

@AGENTS.md

## Claude Code entry points

- `.claude/settings.json` installs a PreToolUse hook (`.claude/hooks/block-dangerous-git.sh`)
  that blocks forced pushes, hard resets, tree cleaning, branch deletion and whole-tree
  checkouts or restores where they would run, reading quotes and here-documents as a shell does,
  so a commit message that mentions one passes. It is a seatbelt, not a sandbox. Plain pushes
  are allowed. `.codex/hooks.json`
  registers the same script for Codex.
- `.claude/skills/` is the one skill source: the repo's `oy-*` skills and the kit's `review`,
  `debug`, `plan`, `ship` and `research`. `.agents/skills` is its symlink for Codex and other
  tools; never create a second copy.
- `.mcp.json` points Claude Code at the Sanity MCP server (OAuth on first use).
- The Matt Pocock plugin (`claude plugins install mattpocock-skills`) provides `/code-review`
  (the kit `review` skill is the one AGENTS.md names, since cloud agents lack the plugin; for
  research, the kit's read-only `research` answers questions, and the plugin's writes a file),
  `/handoff`, `/to-tickets`, `/implement`, `/wayfinder` and the model-invoked `tdd`,
  `research` and `wizard`. The `## Agent skills` block those skills read lives in `AGENTS.md`.
- Use `bun run test` and `bun run build`; `bun test` and `bun build` are Bun built-ins.
