#!/usr/bin/env bash
# The Node and Bun versions are pinned in several places (.node-version, .mise.toml, the
# engines fields, packageManager). They must agree, or local, Vercel and CI drift apart.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

node_version_file=$(tr -d '[:space:]' < .node-version)
mise_node=$(sed -n 's/^node = "\(.*\)"/\1/p' .mise.toml)
mise_bun=$(sed -n 's/^bun = "\(.*\)"/\1/p' .mise.toml)
pm_bun=$(sed -n 's/.*"packageManager": "bun@\([^"]*\)".*/\1/p' package.json)
root_engine=$(sed -n 's/.*"node": "\([^"]*\)".*/\1/p' package.json | head -1)
web_engine=$(sed -n 's/.*"node": "\([^"]*\)".*/\1/p' packages/web/package.json | head -1)

status=0
major() { printf '%s' "${1%%.*}"; }
same_major() {
  if [[ "$(major "$1")" != "$(major "$2")" ]]; then
    echo "$3" >&2
    status=1
  fi
}

echo "node: .node-version=$node_version_file .mise.toml=$mise_node engines root=$root_engine web=$web_engine"
echo "bun: .mise.toml=$mise_bun packageManager=$pm_bun"
same_major "$node_version_file" "$mise_node" "Node major differs between .node-version and .mise.toml"
same_major "$node_version_file" "$root_engine" "Node major differs between .node-version and the root engines field"
same_major "$node_version_file" "$web_engine" "Node major differs between .node-version and packages/web engines"
if [[ "$mise_bun" != "$pm_bun" ]]; then
  echo "Bun version differs between .mise.toml ($mise_bun) and packageManager ($pm_bun)" >&2
  status=1
fi
exit $status
