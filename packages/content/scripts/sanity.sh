#!/usr/bin/env bash
# Runs the Sanity CLI for this package with the site's environment loaded, so `sanity documents`,
# `sanity datasets` and the TypeGen commands see the project id and dataset the wizard wrote to
# packages/web/.env. The CLI's own shebang keeps it on Node (bunx honours it), never Bun.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
if [[ -f ../web/.env ]]; then
  set -a
  # shellcheck disable=SC1091
  source ../web/.env
  set +a
fi
exec bunx sanity "$@"
