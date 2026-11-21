#!/usr/bin/env bash
# PreToolUse hook for Claude Code (.claude/settings.json) and Codex (.codex/hooks.json): blocks
# destructive git commands before an agent runs them. It is a seatbelt, the floor for cloud
# sessions, which never run the machine-wide guards; a determined script can still get past any
# text matcher (variables, eval of decoded text, scripts on disk). Exit 2 blocks; the reason goes
# to stderr. Plain pushes are allowed (owner's instruction, 5 September 2026).
#
# The command is read the way a shell reads it: quotes, escapes, line continuations, command
# substitutions and here-documents. A git call is judged only where it runs (the start of a
# simple command, after assignments and wrappers such as env, sudo or xargs, or inside bash -c,
# eval and command substitutions), so a commit message or a search that only mentions one is not
# blocked. Flags are matched in any order and position, in clusters, and as the abbreviations git
# accepts. It needs bash and cat; without jq it reads the JSON itself, and a payload it cannot read
# is judged as raw text. scripts/tests/git-guard.test.sh holds the fixtures.
# No set -u: bash 3.2 (macOS) treats an empty array expansion as unbound, which would fail open.
set -o pipefail
export LC_ALL=C

INPUT=$(cat)

block() {
  {
    echo "BLOCKED by the repository's git guard (.claude/hooks/block-dangerous-git.sh): $1"
    echo "If the command only carries this text (a commit message, a PR body, a search), pass it through a file instead (git commit -F, gh pr create --body-file). Otherwise ask the user to run it."
  } >&2
  exit 2
}

json_unescape() {
  local s="$1" out="" i c n
  for ((i = 0; i < ${#s}; i++)); do
    c="${s:i:1}"
    if [[ "$c" == "\\" ]]; then
      i=$((i + 1))
      n="${s:i:1}"
      case "$n" in
        n) out+=$'\n' ;;
        t) out+=$'\t' ;;
        r) out+=$'\r' ;;
        *) out+="$n" ;;
      esac
    else
      out+="$c"
    fi
  done
  printf '%s' "$out"
}

COMMAND=""
PARSED=0
if command -v jq >/dev/null 2>&1 && COMMAND=$(printf '%s' "$INPUT" | jq -er '.tool_input.command | strings' 2>/dev/null); then
  PARSED=1
else
  json_command='"command"[[:space:]]*:[[:space:]]*"(([^"\\]|\\.)*)"'
  if [[ "$INPUT" =~ $json_command ]]; then
    COMMAND=$(json_unescape "${BASH_REMATCH[1]}")
    PARSED=1
  else
    COMMAND="$INPUT"
  fi
fi

# --- What counts as destructive -------------------------------------------------------------

# A short flag cluster such as -xdf or -4f.
has_short() {
  local letter="$1" arg
  shift
  for arg in "$@"; do
    [[ "$arg" =~ ^-[A-Za-z0-9]+$ && "$arg" == *"$letter"* ]] && return 0
  done
  return 1
}

# A long option, its =value form, or an abbreviation of it (git accepts any unambiguous prefix).
has_long() {
  local want="$1" arg name
  shift
  for arg in "$@"; do
    [[ "$arg" == --?* ]] || continue
    name="${arg%%=*}"
    [[ "$name" == "$want" ]] && return 0
    ((${#name} >= 3)) && [[ "$want" == "$name"* ]] && return 0
  done
  return 1
}

# A pathspec that names the whole tree.
has_whole_tree() {
  local arg
  for arg in "$@"; do
    [[ "$arg" =~ ^(\.\.?/*)+$ ]] && return 0
    [[ "$arg" =~ ^:(\(top\))?/?[.*]?$ ]] && return 0
    case "$arg" in
      '*' | '$PWD' | '${PWD}' | '$(pwd)' | '`pwd`' | '~+') return 0 ;;
    esac
  done
  return 1
}

judge_config() {
  local value="$1"
  local lower
  lower=$(printf '%s' "$value" | tr '[:upper:]' '[:lower:]')
  case "$lower" in
    alias.*) block "an inline alias can hide any git command." ;;
    clean.requireforce=*) block "turning off clean.requireForce lets git clean delete files." ;;
    remote.*.push=*+* | remote.*.push=+*) block "a + push refspec in config forces the push." ;;
  esac
}

judge_git() {
  local via_xargs="$1" arg i=0
  shift
  local -a words=("$@")
  # Skip git's global options to reach the subcommand.
  while ((i < ${#words[@]})); do
    case "${words[i]}" in
      -c | --config-env)
        judge_config "${words[i + 1]:-}"
        i=$((i + 2))
        ;;
      -C | --git-dir | --work-tree | --namespace | --super-prefix | --attr-source) i=$((i + 2)) ;;
      --config-env=*) judge_config "${words[i]#--config-env=}" && i=$((i + 1)) ;;
      -*) i=$((i + 1)) ;;
      *) break ;;
    esac
  done
  ((i < ${#words[@]})) || return 0
  local sub="${words[i]}"
  local -a args=("${words[@]:i+1}")
  set -- "${args[@]}"

  if ((via_xargs)); then
    case "$sub" in
      push | reset | clean | branch | checkout | switch | restore)
        block "xargs can append flags to git $sub that this guard never sees."
        ;;
    esac
  fi

  case "$sub" in
    push)
      if has_long --force "$@" || has_long --force-with-lease "$@" || has_long --force-if-includes "$@" || has_short f "$@"; then
        block "a forced push rewrites the remote's history."
      fi
      if has_long --delete "$@" || has_short d "$@" || has_long --mirror "$@" || has_long --prune "$@"; then
        block "the push deletes remote branches."
      fi
      for arg in "$@"; do
        [[ "$arg" == +* || "$arg" == *:+* ]] && block "a + refspec forces the push."
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
    switch)
      if has_long --force "$@" || has_long --discard-changes "$@" || has_short f "$@"; then
        block "a forced switch discards uncommitted work."
      fi
      ;;
    restore)
      # --staged alone only unstages; a worktree restore of the whole tree discards changes.
      if has_whole_tree "$@"; then
        if ! { has_long --staged "$@" || has_short S "$@"; } || has_long --worktree "$@" || has_short W "$@"; then
          block "a whole-tree restore discards uncommitted work."
        fi
      fi
      ;;
  esac
  return 0
}

# --- Reading the command as a shell would ---------------------------------------------------

DEPTH=0
SEGMENT_FEEDS_SHELL=0

# judge_segment WORD...: one simple command. Skips assignments, keywords and wrappers, then
# judges git, or reads the command string of bash -c, eval and find -exec.
judge_segment() {
  local -a w=("$@")
  local k=0 n=${#w[@]} via_xargs=0 word
  SEGMENT_FEEDS_SHELL=0
  while ((k < n)); do
    word="${w[k]}"
    if [[ "$word" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]]; then
      k=$((k + 1))
      continue
    fi
    case "$word" in
      '{' | '}' | '!' | if | then | elif | else | do | while | until | time | command | builtin | exec | nohup)
        k=$((k + 1))
        while ((k < n)) && [[ "${w[k]}" == -* ]]; do k=$((k + 1)); done
        ;;
      env | */env)
        k=$((k + 1))
        while ((k < n)); do
          case "${w[k]}" in
            -S | --split-string)
              scan "${w[k + 1]:-}" && return 0
              ;;
            -u | -C | --unset | --chdir) k=$((k + 2)) ;;
            -*) k=$((k + 1)) ;;
            *=*) k=$((k + 1)) ;;
            *) break ;;
          esac
        done
        ;;
      sudo | doas | */sudo)
        k=$((k + 1))
        while ((k < n)); do
          case "${w[k]}" in
            -u | -g | -h | -p | -C | -U) k=$((k + 2)) ;;
            -*) k=$((k + 1)) ;;
            *) break ;;
          esac
        done
        ;;
      nice | ionice | stdbuf)
        k=$((k + 1))
        while ((k < n)); do
          case "${w[k]}" in
            -n | -c | -p) k=$((k + 2)) ;;
            -*) k=$((k + 1)) ;;
            *) break ;;
          esac
        done
        ;;
      timeout | */timeout)
        k=$((k + 1))
        while ((k < n)) && [[ "${w[k]}" == -* ]]; do
          case "${w[k]}" in -s | -k | --signal | --kill-after) k=$((k + 2)) ;; *) k=$((k + 1)) ;; esac
        done
        k=$((k + 1))
        ;;
      xargs | */xargs)
        via_xargs=1
        k=$((k + 1))
        while ((k < n)); do
          case "${w[k]}" in
            -I | -n | -P | -L | -d | -E | -s | -a) k=$((k + 2)) ;;
            -*) k=$((k + 1)) ;;
            *) break ;;
          esac
        done
        ;;
      *) break ;;
    esac
  done
  ((k < n)) || return 0
  word="${w[k]}"
  case "$word" in
    git | */git)
      judge_git "$via_xargs" "${w[@]:k+1}"
      ;;
    bash | sh | zsh | dash | ksh | */bash | */sh | */zsh | */dash)
      local j=$((k + 1)) found=0
      while ((j < n)) && [[ "${w[j]}" == -* ]]; do
        if [[ "${w[j]}" =~ ^-[A-Za-z]*c[A-Za-z]*$ ]]; then
          found=1
          scan "${w[j + 1]:-}"
          break
        fi
        j=$((j + 1))
      done
      # No -c and no script file: the shell reads commands from stdin (a here-document).
      ((found)) || ((j < n)) || SEGMENT_FEEDS_SHELL=1
      ;;
    eval | source | .)
      if [[ "$word" == eval ]]; then
        scan "${w[*]:k+1}"
      else
        ((k + 1 < n)) || SEGMENT_FEEDS_SHELL=1
      fi
      ;;
    find | */find)
      local j=$((k + 1)) start=-1
      for ((; j < n; j++)); do
        case "${w[j]}" in
          -exec | -execdir | -ok | -okdir) start=$((j + 1)) ;;
          ';' | '+')
            if ((start >= 0)); then
              judge_segment "${w[@]:start:j-start}"
              start=-1
            fi
            ;;
        esac
      done
      ((start >= 0)) && judge_segment "${w[@]:start}"
      ;;
    watch)
      scan "${w[*]:k+1}"
      ;;
  esac
  return 0
}

# scan TEXT: splits TEXT into simple commands and judges each.
scan() {
  local text="$1"
  ((DEPTH > 8)) && block "the command nests too deeply to read."
  DEPTH=$((DEPTH + 1))
  local -a words=() delims=() strips=() feeds=()
  local word="" have=0 q="" i=0 len=${#text} c n inner level j
  local feed_pending

  flush() {
    if ((have)); then words+=("$word"); fi
    word=""
    have=0
  }
  end_segment() {
    flush
    if ((${#words[@]})); then
      judge_segment "${words[@]}"
      feed_pending=$SEGMENT_FEEDS_SHELL
      local d
      for ((d = 0; d < ${#feeds[@]}; d++)); do
        [[ "${feeds[d]}" == "?" ]] && feeds[d]=$feed_pending
      done
    fi
    words=()
  }
  # capture_paren START: the text of $( ... ) from START (just after "$("), and the index after it.
  capture_paren() {
    local p=$1 depth=1 ch
    inner=""
    while ((p < len)); do
      ch="${text:p:1}"
      if [[ "$ch" == "(" ]]; then
        depth=$((depth + 1))
      elif [[ "$ch" == ")" ]]; then
        depth=$((depth - 1))
        ((depth == 0)) && break
      fi
      inner+="$ch"
      p=$((p + 1))
    done
    j=$((p + 1))
  }
  capture_tick() {
    local p=$1 ch
    inner=""
    while ((p < len)); do
      ch="${text:p:1}"
      [[ "$ch" == '`' ]] && break
      inner+="$ch"
      p=$((p + 1))
    done
    j=$((p + 1))
  }
  # Here-document bodies start after the newline that ends their command line.
  read_heredocs() {
    local d line body
    for ((d = 0; d < ${#delims[@]}; d++)); do
      body=""
      while ((i < len)); do
        line="${text:i}"
        line="${line%%$'\n'*}"
        i=$((i + ${#line} + 1))
        local cmp="$line"
        [[ "${strips[d]}" == 1 ]] && cmp="${cmp#"${cmp%%[!$'\t']*}"}"
        [[ "$cmp" == "${delims[d]}" ]] && break
        body+="$line"$'\n'
      done
      [[ "${feeds[d]}" == 1 ]] && scan "$body"
    done
    delims=()
    strips=()
    feeds=()
  }

  while ((i < len)); do
    c="${text:i:1}"
    if [[ "$q" == "'" ]]; then
      if [[ "$c" == "'" ]]; then q=""; else word+="$c"; fi
      i=$((i + 1))
      continue
    fi
    if [[ "$q" == '"' ]]; then
      case "$c" in
        '"') q="" ;;
        "\\")
          n="${text:i+1:1}"
          if [[ "$n" == $'\n' ]]; then
            i=$((i + 1))
          elif [[ "$n" == '"' || "$n" == "\\" || "$n" == '$' || "$n" == '`' ]]; then
            word+="$n"
            i=$((i + 1))
          else
            word+="$c"
          fi
          ;;
        '$')
          if [[ "${text:i+1:1}" == "(" ]]; then
            capture_paren $((i + 2))
            scan "$inner"
            word+="\$($inner)"
            i=$((j - 1))
          else
            word+="$c"
          fi
          ;;
        '`')
          capture_tick $((i + 1))
          scan "$inner"
          word+="\`$inner\`"
          i=$((j - 1))
          ;;
        *) word+="$c" ;;
      esac
      i=$((i + 1))
      continue
    fi
    case "$c" in
      "'" | '"')
        q="$c"
        have=1
        ;;
      "\\")
        n="${text:i+1:1}"
        if [[ "$n" != $'\n' ]]; then
          word+="$n"
          have=1
        fi
        i=$((i + 1))
        ;;
      ' ' | $'\t') flush ;;
      $'\n')
        end_segment
        i=$((i + 1))
        ((${#delims[@]})) && read_heredocs
        continue
        ;;
      ';' | '&' | '|' | '(' | ')') end_segment ;;
      '#')
        if ((have)); then
          word+="$c"
        else
          while ((i < len)) && [[ "${text:i:1}" != $'\n' ]]; do i=$((i + 1)); done
          continue
        fi
        ;;
      '$')
        n="${text:i+1:1}"
        if [[ "$n" == "(" ]]; then
          capture_paren $((i + 2))
          scan "$inner"
          word+="\$($inner)"
          have=1
          i=$((j - 1))
        elif [[ "$n" == "{" ]]; then
          inner="${text:i}"
          inner="${inner%%\}*}"
          word+="$inner}"
          have=1
          i=$((i + ${#inner}))
        else
          word+="$c"
          have=1
        fi
        ;;
      '`')
        capture_tick $((i + 1))
        scan "$inner"
        word+="\`$inner\`"
        have=1
        i=$((j - 1))
        ;;
      '<')
        if [[ "${text:i:3}" == "<<<" ]]; then
          flush
          i=$((i + 2))
        elif [[ "${text:i:2}" == "<<" ]]; then
          flush
          i=$((i + 2))
          local strip=0
          if [[ "${text:i:1}" == "-" ]]; then
            strip=1
            i=$((i + 1))
          fi
          while [[ "${text:i:1}" == " " || "${text:i:1}" == $'\t' ]]; do i=$((i + 1)); done
          local delim="" dc
          while ((i < len)); do
            dc="${text:i:1}"
            case "$dc" in
              ' ' | $'\t' | $'\n' | ';' | '&' | '|' | '<' | '>' | '(' | ')') break ;;
              "'" | '"' | "\\") ;;
              *) delim+="$dc" ;;
            esac
            i=$((i + 1))
          done
          delims+=("$delim")
          strips+=("$strip")
          feeds+=("?")
          continue
        else
          flush
        fi
        ;;
      '>') flush ;;
      *)
        word+="$c"
        have=1
        ;;
    esac
    i=$((i + 1))
  done
  end_segment
  ((${#delims[@]})) && read_heredocs
  DEPTH=$((DEPTH - 1))
  return 0
}

scan "$COMMAND"
exit 0
