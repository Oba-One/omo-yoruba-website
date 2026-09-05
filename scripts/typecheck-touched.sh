#!/usr/bin/env bash
# Typecheck only the workspaces that own the given files (lefthook passes the staged files).
# A workspace without a typecheck script is reported, never silently skipped.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

declare -a dirs=()
for file in "$@"; do
  case "$file" in
    apps/*/*|packages/*/*) dir="${file%%/*}/$(cut -d/ -f2 <<<"$file")" ;;
    *) continue ;;
  esac
  [[ " ${dirs[*]-} " == *" $dir "* ]] || dirs+=("$dir")
done

status=0
for dir in "${dirs[@]-}"; do
  [[ -n "$dir" && -f "$dir/package.json" ]] || continue
  if grep -q '"typecheck"' "$dir/package.json"; then
    echo "typecheck: $dir"
    (cd "$dir" && bun run typecheck) || status=1
  else
    echo "typecheck: $dir has no typecheck script; add one (QUALITY.md section 1)" >&2
    status=1
  fi
done
exit $status
