#!/usr/bin/env bash
# The merge policy agrees with CODEOWNERS, the CI jobs and the tracked tree (merge-policy-check.mjs).
set -euo pipefail
node "$(dirname "${BASH_SOURCE[0]}")/merge-policy-check.mjs"
