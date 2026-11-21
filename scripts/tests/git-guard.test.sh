#!/usr/bin/env bash
# Feeds every case in fixtures/git-guard-cases.txt to the git guard as a PreToolUse event on
# stdin, four ways: through Claude Code's registration (.claude/settings.json), through Codex's
# (.codex/hooks.json) from the repository root and from a subdirectory, and with no jq on PATH,
# where the hook reads the JSON itself. Each must give the fixture's verdict: exit 2 blocks,
# exit 0 allows. A literal \n in a fixture stands for a newline.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cases="$root/scripts/tests/fixtures/git-guard-cases.txt"
hook="$root/.claude/hooks/block-dangerous-git.sh"
claude_hook=$(jq -r '.hooks.PreToolUse[] | select(.matcher == "Bash") | .hooks[].command' "$root/.claude/settings.json")
codex_hook=$(jq -r '.hooks.PreToolUse[] | select(.matcher == "Bash") | .hooks[].command' "$root/.codex/hooks.json")
[[ -n "$claude_hook" && -n "$codex_hook" ]] || { echo "FAIL a Bash PreToolUse hook is not registered"; exit 1; }

# A PATH with what the hook needs but no jq.
nojq="$(mktemp -d)"
trap 'rm -rf "$nojq"' EXIT
for tool in cat tr; do ln -s "$(command -v "$tool")" "$nojq/$tool"; done
bash_path="$(command -v bash)"

code_of() {
  local code=0
  "$@" >/dev/null 2>&1 || code=$?
  case "$code" in
    0) echo allow ;;
    2) echo block ;;
    *) echo "error $code" ;;
  esac
}

verdict() {
  local how="$1" payload="$2" file="$nojq/payload.json"
  printf '%s' "$payload" >"$file"
  case "$how" in
    claude) code_of bash -c "cd '$root' && export CLAUDE_PROJECT_DIR='$root' && $claude_hook <'$file'" ;;
    codex) code_of bash -c "cd '$root' && $codex_hook <'$file'" ;;
    codex-subdir) code_of bash -c "cd '$root/packages/web/src' && $codex_hook <'$file'" ;;
    no-jq) code_of env PATH="$nojq" "$bash_path" "$hook" <"$file" ;;
  esac
}

failures=0
total=0
while IFS=$'\t' read -r want command; do
  [[ -z "$want" || "$want" == \#* ]] && continue
  total=$((total + 1))
  command="${command//\\n/$'\n'}"
  payload=$(jq -cn --arg command "$command" '{tool_name: "Bash", tool_input: {command: $command}}')
  for how in claude codex codex-subdir no-jq; do
    got=$(verdict "$how" "$payload")
    if [[ "$got" != "$want" ]]; then
      printf 'FAIL %s: want %s, got %s: %s\n' "$how" "$want" "$got" "$command"
      failures=$((failures + 1))
    fi
  done
done <"$cases"

if ((failures)); then
  echo "$failures failure(s) in $total case(s)"
  exit 1
fi
echo "all $total cases agree with the fixtures in all four runs"
