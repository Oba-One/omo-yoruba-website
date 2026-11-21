#!/usr/bin/env bash
# PreToolUse hook for Claude Code (.claude/settings.json) and Codex (.codex/hooks.json): blocks
# destructive git commands before an agent runs them. It is a seatbelt, the floor for cloud
# sessions, which never run the machine-wide guards; a determined script can still get past any
# text matcher. Exit 2 blocks; the reason goes to stderr. Plain pushes are allowed (owner's
# instruction, 5 September 2026).
#
# How it reads a command:
# - Words are split as a shell splits them (quotes, escapes, line continuations, redirections,
#   separators), and every unquoted word `git` is judged wherever it stands, so any wrapper
#   (env, sudo, xcrun, mise exec, a pipe into bash) is covered.
# - Quoted text is a mention only when the command it is passed to treats it as text (git's own
#   messages, gh, grep, echo and the like). Passed to anything else (bash -c, eval, ssh, a
#   here-string), quoted text that holds `git` is read again as a command.
# - Command substitutions are read as commands. Here-document bodies are read as commands when
#   their line feeds a shell, eval or xargs.
# - Flags match in any order and position, in clusters, and as the abbreviations git accepts.
#   An expansion or a brace list in a destructive verb's arguments blocks, since it can hide a
#   flag, and so does inline config that renames or loosens a verb.
# - A command longer than 16,000 characters is judged as plain text instead (quote marks
#   dropped), which can only block more.
# It needs bash (3.2 or later) and cat; without jq it reads the JSON itself.
# scripts/tests/git-guard.test.sh holds the fixtures.
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
  local s="$1" out="" i c n hex
  for ((i = 0; i < ${#s}; i++)); do
    c="${s:i:1}"
    if [[ "$c" == "\\" ]]; then
      i=$((i + 1))
      n="${s:i:1}"
      case "$n" in
        n) out+=$'\n' ;;
        t) out+=$'\t' ;;
        r) out+=$'\r' ;;
        u)
          hex="${s:i+1:4}"
          if [[ "$hex" =~ ^00[0-7][0-9A-Fa-f]$ ]]; then
            out+=$(printf "\\x${hex:2:2}")
            i=$((i + 4))
          else
            out+="u"
          fi
          ;;
        *) out+="$n" ;;
      esac
    else
      out+="$c"
    fi
  done
  printf '%s' "$out"
}

COMMAND=""
if command -v jq >/dev/null 2>&1 && COMMAND=$(printf '%s' "$INPUT" | jq -er '.tool_input.command | strings' 2>/dev/null); then
  :
else
  json_command='"command"[[:space:]]*:[[:space:]]*"(([^"\\]|\\.)*)"'
  if [[ "$INPUT" =~ $json_command ]]; then
    COMMAND=$(json_unescape "${BASH_REMATCH[1]}")
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

# A pathspec that names the whole tree, everything but an exclusion, or paths read from a file.
has_whole_tree() {
  local arg
  for arg in "$@"; do
    [[ "$arg" =~ ^(\.\.?/*)+$ ]] && return 0
    [[ "$arg" =~ ^:(\(top\))?/?[.*]*$ ]] && return 0
    case "$arg" in
      '*' | '**' | '**/*' | :!* | :^* | ':(exclude'* | --pathspec-from-file*) return 0 ;;
    esac
  done
  return 1
}

# Any argument built by the shell at run time: a variable, a substitution, a brace list.
has_expansion() {
  local arg
  for arg in "$@"; do
    [[ "$arg" == *'$'* || "$arg" == *'`'* ]] && return 0
    [[ "$arg" =~ \{[^}]*,[^}]*\} ]] && return 0
  done
  return 1
}

judge_config() {
  local lower
  lower=$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')
  case "$lower" in
    alias.*) block "an inline alias can hide any git command." ;;
    clean.requireforce*) block "loosening clean.requireForce lets git clean delete files." ;;
    remote.*.push*+* | push.*+*) block "a + push refspec in config forces the push." ;;
    remote.*.mirror*) block "a mirror remote deletes remote branches on push." ;;
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
        judge_config "${words[i + 1]}"
        i=$((i + 2))
        ;;
      --config-env=*)
        judge_config "${words[i]#--config-env=}"
        i=$((i + 1))
        ;;
      -C | --git-dir | --work-tree | --namespace | --super-prefix | --attr-source) i=$((i + 2)) ;;
      -*) i=$((i + 1)) ;;
      *) break ;;
    esac
  done
  ((i < ${#words[@]})) || return 0
  local sub="${words[i]}"
  local -a args=("${words[@]:i+1}")
  set -- "${args[@]}"

  if [[ "$sub" == *'$'* || "$sub" == *'`'* || "$sub" == *'{'* ]]; then
    block "a git verb built by the shell at run time can be any verb."
  fi

  case "$sub" in
    push | reset | clean | branch | checkout | switch | restore)
      if ((via_xargs)); then
        block "xargs can append flags to git $sub that this guard never sees."
      fi
      if has_expansion "$@"; then
        block "an expansion or brace list in git $sub's arguments can hide a destructive flag; write them out."
      fi
      ;;
  esac

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
    config)
      for arg in "$@"; do judge_config "$arg"; done
      ;;
  esac
  return 0
}

# Commands whose quoted arguments are text, not commands to run.
is_text_command() {
  case "${1##*/}" in
    echo | printf | gh | grep | egrep | fgrep | rg | ag | ack | cat | less | head | tail | sed | awk | \
      jq | yq | tee | test | '[' | '[[' | : | true | false | read | wc | sort | uniq | tr | cut | \
      column | diff | cmp | node-notifier | say | open | curl | wget)
      return 0
      ;;
  esac
  return 1
}

DEPTH=0

# judge_segment WORD...: one simple command.
judge_segment() {
  local -a w=("$@")
  local n=${#w[@]} k word cmd="" via_xargs=0 text_args=0
  for ((k = 0; k < n; k++)); do
    word="${w[k]}"
    if [[ "$word" =~ (^|[[:space:]])GIT_CONFIG_(PARAMETERS|COUNT|KEY_[0-9]+|VALUE_[0-9]+)= ]]; then
      block "GIT_CONFIG_* variables can alias or loosen any git verb."
    fi
    # The command word: the first that is not an assignment or a shell keyword.
    if [[ -z "$cmd" && ! "$word" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]]; then
      case "$word" in
        '{' | '}' | '!' | if | then | elif | else | do | while | until | time) ;;
        *) cmd="$word" ;;
      esac
    fi
    [[ "${word##*/}" == xargs ]] && via_xargs=1
    if [[ "$word" == git || "$word" == */git ]]; then
      judge_git "$via_xargs" "${w[@]:k+1}"
    fi
  done
  is_text_command "$cmd" && text_args=1
  if [[ "${cmd##*/}" == git ]]; then
    # git's quoted arguments are messages, except where a verb runs a command.
    case " ${w[*]} " in
      *" rebase "* | *" bisect "* | *" submodule "* | *" filter-branch "* | *" filter-repo "*) text_args=0 ;;
      *) text_args=1 ;;
    esac
  fi
  ((text_args)) && return 0
  # Anywhere else, quoted text that holds git is read again as a command.
  for ((k = 0; k < n; k++)); do
    word="${w[k]}"
    if [[ "$word" == *[[:space:]]* && "$word" =~ (^|[^[:alnum:]_.-])git([[:space:]]|$) ]]; then
      scan "$word"
    fi
  done
  return 0
}

# raw_scan TEXT: judges TEXT as plain words, quote marks dropped. Used for very long commands.
raw_scan() {
  local segments segment
  segments=$(printf '%s' "$1" | tr -d "\"'\\\\" | tr ';|&(){}`<>' '\n')
  while IFS= read -r segment; do
    local -a words=()
    read -ra words <<<"$segment"
    ((${#words[@]})) && judge_segment "${words[@]}"
  done <<<"$segments"
}

# scan TEXT: splits TEXT into simple commands and judges each.
scan() {
  local text="$1"
  ((DEPTH > 8)) && block "the command nests too deeply to read."
  DEPTH=$((DEPTH + 1))
  local -a words=() delims=() strips=() feeds=()
  local word="" have=0 q="" i=0 len=${#text} c n inner j line_start=0

  flush() {
    if ((have)); then words+=("$word"); fi
    word=""
    have=0
  }
  end_segment() {
    flush
    ((${#words[@]})) && judge_segment "${words[@]}"
    words=()
  }
  # capture_paren START: the text of $( ... ) from START, quotes respected; j is the index after it.
  capture_paren() {
    local p=$1 depth=1 ch quote=""
    inner=""
    while ((p < len)); do
      ch="${text:p:1}"
      if [[ -n "$quote" ]]; then
        [[ "$ch" == "$quote" ]] && quote=""
      elif [[ "$ch" == "'" || "$ch" == '"' ]]; then
        quote="$ch"
      elif [[ "$ch" == "(" ]]; then
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
  # skip_redirect: from a < or > at i, past the operator and its target word.
  skip_redirect() {
    if [[ "$word" =~ ^[0-9]+$ ]]; then
      word=""
      have=0
    fi
    flush
    while [[ "${text:i:1}" == [\<\>\&\|] ]]; do i=$((i + 1)); done
    if [[ "${text:i-1:1}" == "&" && "${text:i:1}" =~ [0-9-] ]]; then
      i=$((i + 1))
      return
    fi
    while [[ "${text:i:1}" == " " || "${text:i:1}" == $'\t' ]]; do i=$((i + 1)); done
    local quote=""
    while ((i < len)); do
      local ch="${text:i:1}"
      if [[ -n "$quote" ]]; then
        [[ "$ch" == "$quote" ]] && quote=""
      elif [[ "$ch" == "'" || "$ch" == '"' ]]; then
        quote="$ch"
      elif [[ "$ch" == [[:space:]\;\&\|\(\)\<\>] ]]; then
        break
      fi
      i=$((i + 1))
    done
  }
  # Here-document bodies start after the newline that ends their command line. A body is read as
  # commands when that line feeds a shell, eval, source or xargs.
  read_heredocs() {
    local d line body cmp feed=0 source_line
    source_line="${text:line_start:i-line_start}"
    if [[ "$source_line" =~ (^|[\|\;\&\(\`[:space:]])(bash|sh|zsh|dash|ksh|eval|source|xargs)([[:space:]\;\|\&\)\<]|$) ]]; then
      feed=1
    fi
    for ((d = 0; d < ${#delims[@]}; d++)); do
      body=""
      while ((i < len)); do
        line="${text:i}"
        line="${line%%$'\n'*}"
        i=$((i + ${#line} + 1))
        cmp="$line"
        [[ "${strips[d]}" == 1 ]] && cmp="${cmp#"${cmp%%[!$'\t']*}"}"
        [[ "$cmp" == "${delims[d]}" ]] && break
        body+="$line"$'\n'
      done
      ((feed)) && scan "$body"
    done
    delims=()
    strips=()
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
        line_start=$i
        continue
        ;;
      '&')
        if [[ "${text:i+1:1}" == ">" ]]; then
          skip_redirect
          continue
        fi
        end_segment
        ;;
      ';' | '|' | '(' | ')') end_segment ;;
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
        elif [[ "$n" == "'" || "$n" == '"' ]]; then
          # $'...' and $"..." are quoted text; the dollar sign is not part of the word.
          have=1
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
          i=$((i + 3))
          continue
        elif [[ "${text:i:2}" == "<<" && ! "${text:i+2}" =~ ^[[:space:]]*[0-9] ]]; then
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
          continue
        elif [[ "${text:i+1:1}" == "(" ]]; then
          # <( ... ) is a command substitution.
          end_segment
        else
          skip_redirect
          continue
        fi
        ;;
      '>')
        if [[ "${text:i+1:1}" == "(" ]]; then
          end_segment
        else
          skip_redirect
          continue
        fi
        ;;
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

if ((${#COMMAND} > 16000)); then
  raw_scan "$COMMAND"
else
  scan "$COMMAND"
fi
exit 0
