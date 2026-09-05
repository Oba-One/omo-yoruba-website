#!/usr/bin/env bash
# PreToolUse hook (registered in .claude/settings.json): block destructive git commands before
# Claude runs them. Adapted from .claude/skills/git-guardrails-claude-code/scripts. This copy
# fails closed and needs nothing but bash: a payload it cannot parse is judged as raw text,
# and matching uses bash's own regex engine rather than grep.
set -uo pipefail

INPUT=$(cat)
COMMAND=""
if command -v jq >/dev/null 2>&1; then
  COMMAND=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null) || COMMAND=""
fi
if [[ -z "$COMMAND" ]]; then
  # No jq, or a payload jq could not read: judge the raw text instead of allowing by default.
  COMMAND="$INPUT"
fi

DANGEROUS_PATTERNS=(
  'git push'
  'git reset --hard'
  'git clean -f'
  'git branch -D'
  'git checkout \.'
  'git restore \.'
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if [[ "$COMMAND" =~ $pattern ]]; then
    echo "BLOCKED: the command matches the dangerous pattern '$pattern'. The user has prevented you from doing this." >&2
    exit 2
  fi
done

exit 0
