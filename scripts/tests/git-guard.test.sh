#!/usr/bin/env bash
# Feeds every case in fixtures/git-guard-cases.txt to the git guard through both registrations,
# Claude Code's (.claude/settings.json) and Codex's (.codex/hooks.json), as a PreToolUse event on
# stdin. Each must give the fixture's verdict: exit 2 blocks, exit 0 allows.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cases="$root/scripts/tests/fixtures/git-guard-cases.txt"
claude_hook=$(jq -r '.hooks.PreToolUse[] | select(.matcher == "Bash") | .hooks[].command' "$root/.claude/settings.json")
codex_hook=$(jq -r '.hooks.PreToolUse[] | select(.matcher == "Bash") | .hooks[].command' "$root/.codex/hooks.json")
[[ -n "$claude_hook" && -n "$codex_hook" ]] || { echo "FAIL a Bash PreToolUse hook is not registered"; exit 1; }

verdict() {
  local hook="$1" command="$2" code=0
  jq -n --arg command "$command" '{tool_name: "Bash", tool_input: {command: $command}}' |
    (cd "$root" && CLAUDE_PROJECT_DIR="$root" bash -c "$hook" >/dev/null 2>&1) || code=$?
  case "$code" in
    0) echo allow ;;
    2) echo block ;;
    *) echo "error $code" ;;
  esac
}

failures=0
total=0
while IFS=$'\t' read -r want command; do
  [[ -z "$want" || "$want" == \#* ]] && continue
  total=$((total + 1))
  for harness in claude codex; do
    if [[ $harness == claude ]]; then hook="$claude_hook"; else hook="$codex_hook"; fi
    got=$(verdict "$hook" "$command")
    if [[ "$got" != "$want" ]]; then
      printf 'FAIL %s: want %s, got %s: %s\n' "$harness" "$want" "$got" "$command"
      failures=$((failures + 1))
    fi
  done
done <"$cases"

if ((failures)); then
  echo "$failures failure(s) in $total case(s)"
  exit 1
fi
echo "all $total cases agree with the fixtures in both harnesses"
