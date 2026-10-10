#!/usr/bin/env bash
# The Node and Bun versions are pinned in several places (.node-version, .mise.toml, the
# engines fields, packageManager). They must agree, or local, Vercel and CI drift apart.
# Vercel reads Node from engines, but its build image brings its own Bun, so each vercel.json
# must send its install and its build through scripts/pinned-bun.sh.
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

# One call of the script and nothing chained after it, where a plain bun could run again.
one_pinned_call='^bash \.\./\.\./scripts/pinned-bun\.sh [^;&|]+$'
if [[ ! -f scripts/pinned-bun.sh ]]; then
  echo "scripts/pinned-bun.sh is missing, and each vercel.json calls it" >&2
  status=1
fi
for config in packages/*/vercel.json; do
  [[ -f "$config" ]] || continue
  through_pinned_bun=yes
  for key in installCommand buildCommand; do
    vercel_command=$(sed -n "s/.*\"$key\": \"\([^\"]*\)\".*/\1/p" "$config")
    if [[ ! "$vercel_command" =~ $one_pinned_call ]]; then
      echo "$config: $key must be one call of bash ../../scripts/pinned-bun.sh, or Vercel runs its image's Bun (found: ${vercel_command:-nothing})" >&2
      through_pinned_bun=no
      status=1
    fi
  done
  echo "vercel: $config install and build through scripts/pinned-bun.sh=$through_pinned_bun"
done
exit $status
