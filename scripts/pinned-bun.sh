#!/usr/bin/env bash
# Runs Bun at the version packageManager pins: bash scripts/pinned-bun.sh <bun arguments>.
# Vercel's build image runs its own Bun for the install and offers no setting for it, so each
# vercel.json sends its install and its build through this script (docs/runbook.md, Deploy).
# When the bun on PATH is another version, npm installs the pinned one under the repo root's
# node_modules/.cache, which bun install leaves alone, and a later call reuses that copy. npx
# is not used: started inside the workspace, it walks all of node_modules before it fetches
# anything. The working directory stays the caller's, which for Vercel is the package it builds.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
pinned=$(sed -n 's/.*"packageManager": "bun@\([^"]*\)".*/\1/p' "$root/package.json")
if [[ -z "$pinned" ]]; then
  echo "pinned-bun: package.json names no bun version in packageManager" >&2
  exit 1
fi

on_path=$(bun --version 2>/dev/null || true)
if [[ "$on_path" != "$pinned" ]]; then
  prefix="$root/node_modules/.cache/pinned-bun/$pinned"
  if [[ "$("$prefix/node_modules/.bin/bun" --version 2>/dev/null || true)" != "$pinned" ]]; then
    echo "pinned-bun: installing bun@$pinned from npm" >&2
    # Only one release is kept: a build cache that keeps node_modules would otherwise collect
    # the copy of every earlier pin.
    rm -rf "$root/node_modules/.cache/pinned-bun"
    mkdir -p "$prefix"
    npm install --prefix "$prefix" --no-save --no-audit --no-fund --loglevel=error \
      "bun@$pinned" >&2
  fi
  echo "pinned-bun: running bun $pinned; the bun on PATH is ${on_path:-missing}" >&2
  PATH="$prefix/node_modules/.bin:$PATH"
fi
exec bun "$@"
