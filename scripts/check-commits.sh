#!/usr/bin/env bash
# Check every commit message in BASE..HEAD, and the pull request title when PR_TITLE is set,
# with the rules the local commit-msg hook applies: a conventional subject and no em or en
# dash. Usage: scripts/check-commits.sh <base> [head]
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

base="${1:?usage: check-commits.sh <base> [head]}"
head="${2:-HEAD}"
status=0
tmp=$(mktemp)
trap 'rm -f "$tmp"' EXIT

if [[ -n "${PR_TITLE:-}" ]]; then
  printf '%s\n' "$PR_TITLE" > "$tmp"
  if bun packages/lint/src/cli.ts commit-msg "$tmp"; then
    echo "ok   pull request title"
  else
    echo "FAIL pull request title (squash merges use it as the commit subject)" >&2
    status=1
  fi
fi

for sha in $(git rev-list --reverse "$base..$head"); do
  git log -1 --format=%B "$sha" > "$tmp"
  if bun packages/lint/src/cli.ts commit-msg "$tmp"; then
    echo "ok   $(git log -1 --format='%h %s' "$sha")"
  else
    echo "FAIL $(git log -1 --format='%h %s' "$sha")" >&2
    status=1
  fi
done

exit $status
