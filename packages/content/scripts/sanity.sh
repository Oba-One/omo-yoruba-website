#!/usr/bin/env bash
# Runs the Sanity CLI for this package with the site's environment loaded, so `sanity documents`,
# `sanity datasets` and the TypeGen commands see the project id and dataset the wizard wrote to
# packages/web/.env. The CLI's own shebang keeps it on Node (bunx honours it), never Bun.
# The file is parsed line by line (KEY=VALUE, optional quotes) like astro.config.ts does, never
# sourced: a hand-edited line without "=" must not run as a command or stop the wrapper.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
if [[ -f ../web/.env ]]; then
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" =~ ^[[:space:]]*([A-Za-z_][A-Za-z0-9_]*)[[:space:]]*=[[:space:]]*(.*)$ ]] || continue
    key="${BASH_REMATCH[1]}"
    value="${BASH_REMATCH[2]}"
    value="${value%"${value##*[![:space:]]}"}"
    if [[ "$value" =~ ^\"(.*)\"$ ]] || [[ "$value" =~ ^\'(.*)\'$ ]]; then
      value="${BASH_REMATCH[1]}"
    fi
    export "$key=$value"
  done < ../web/.env
fi
exec bunx sanity "$@"
