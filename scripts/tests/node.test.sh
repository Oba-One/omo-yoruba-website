#!/usr/bin/env bash
# The node:test suites under scripts/tests: the comment codemod and the regrowth ratchet.
set -euo pipefail
node --test "$(dirname "${BASH_SOURCE[0]}")"/*.test.mjs
