#!/usr/bin/env bash
# PreToolUse hook for Claude Code (.claude/settings.json) and Codex (.codex/hooks.json): blocks
# destructive git commands before an agent runs them. It is the floor for cloud sessions, which
# never run the machine-wide guards. Exit 2 blocks; the reason goes to stderr.
#
# Flags are matched in any order and position, so flag clusters and reordered spellings are
# caught (R144). Plain pushes are allowed (owner's instruction, 5 September 2026).
#
# It fails closed and needs nothing but bash, tr and jq when present: a payload jq cannot read
# is judged as raw text. Quoting is not parsed: quote characters are dropped before splitting
# into words, which can only block more, never less. scripts/tests/git-guard.test.sh holds the
# fixtures.
set -uo pipefail

INPUT=$(cat)
COMMAND=""
if command -v jq >/dev/null 2>&1; then
  COMMAND=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null) || COMMAND=""
fi
[[ -n "$COMMAND" ]] || COMMAND="$INPUT"

block() {
  echo "BLOCKED: $1 The user has prevented you from doing this; ask them to run it if it is needed." >&2
  exit 2
}

# A short flag cluster such as -xdf: one dash, then letters only.
has_short() {
  local letter="$1" arg
  shift
  for arg in "$@"; do
    [[ "$arg" =~ ^-[A-Za-z]+$ && "$arg" == *"$letter"* ]] && return 0
  done
  return 1
}

has_long() {
  local want="$1" arg
  shift
  for arg in "$@"; do
    [[ "$arg" == "$want" || "$arg" == "$want="* ]] && return 0
  done
  return 1
}

# A pathspec that names the whole tree.
has_whole_tree() {
  local arg
  for arg in "$@"; do
    case "$arg" in
      . | ./ | .. | ../ | '*' | :/ | ':/*' | :/. | ':(top)' | ':(top).') return 0 ;;
    esac
  done
  return 1
}

judge_git() {
  local sub="$1" arg
  shift
  case "$sub" in
    push)
      if has_long --force "$@" || has_long --force-with-lease "$@" || has_short f "$@"; then
        block "a forced push rewrites the remote's history."
      fi
      if has_long --delete "$@" || has_short d "$@" || has_long --mirror "$@" || has_long --prune "$@"; then
        block "the push deletes remote branches."
      fi
      for arg in "$@"; do
        [[ "$arg" == +* ]] && block "a + refspec forces the push."
        [[ "$arg" == :* ]] && block "a :ref refspec deletes a remote branch."
      done
      ;;
    reset)
      has_long --hard "$@" && block "a hard reset discards uncommitted work."
      ;;
    clean)
      if has_long --force "$@" || has_short f "$@"; then
        block "cleaning deletes untracked and ignored files, .env included."
      fi
      ;;
    branch)
      if has_long --delete "$@" || has_short d "$@" || has_short D "$@"; then
        block "branch deletion."
      fi
      ;;
    checkout)
      if has_long --force "$@" || has_short f "$@"; then
        block "a forced checkout discards uncommitted work."
      fi
      has_whole_tree "$@" && block "a whole-tree checkout discards uncommitted work."
      ;;
    restore)
      # --staged alone only unstages; any worktree restore of the whole tree discards changes.
      if has_whole_tree "$@"; then
        if ! { has_long --staged "$@" || has_short S "$@"; } || has_long --worktree "$@" || has_short W "$@"; then
          block "a whole-tree restore discards uncommitted work."
        fi
      fi
      ;;
  esac
  return 0
}

# Split into simple commands on shell separators and substitutions, then judge each git call.
segments=$(printf '%s' "$COMMAND" | tr -d "\"'\\\\" | tr ';|&(){}`' '\n')
while IFS= read -r segment; do
  read -ra words <<<"$segment"
  for ((i = 0; i < ${#words[@]}; i++)); do
    [[ "${words[i]}" == git || "${words[i]}" == */git ]] || continue
    # Skip git's global options to reach the subcommand.
    j=$((i + 1))
    while ((j < ${#words[@]})); do
      case "${words[j]}" in
        -C | -c | --git-dir | --work-tree | --namespace | --exec-path) j=$((j + 2)) ;;
        -*) j=$((j + 1)) ;;
        *) break ;;
      esac
    done
    ((j < ${#words[@]})) || continue
    judge_git "${words[j]}" "${words[@]:j+1}"
  done
done <<<"$segments"

exit 0
