#!/usr/bin/env bash
# The weekly audit (.github/workflows/audit.yml): fails on a high or critical advisory that is
# not accepted below. Bun takes accepted advisories only on the command line, so the list lives
# here with the reason for each one (review ticket R143; docs/runbook.md, CI and merging). None
# of them is in a path a visitor can reach. Remove an entry when its condition is met.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

accepted=(
  # path-to-regexp 6.1.0, pinned by @vercel/routing-utils. The one entry an override could fix:
  # it stays accepted because its code ships in the Vercel function with no caller, and the
  # override would replace a pin Vercel keeps on purpose. Until routing-utils drops 6.1.0.
  GHSA-9wv6-86v2-598j
  # tmp 0.1.0 under @lhci/cli and 0.0.33 under its inquirer's external-editor: Lighthouse CI
  # only. Until both take tmp 0.2.6.
  GHSA-ph9p-34f9-6g65
  # basic-ftp 5.3.1, under @lhci/cli's proxy-agent: Lighthouse CI only, for a proxy file at an
  # ftp address. Until get-uri takes basic-ftp 6.2.1.
  GHSA-c475-qrg2-pj4r
  # extract-zip 2.0.1, under lighthouse's puppeteer: Lighthouse CI only, when puppeteer downloads
  # a browser. No fixed release exists; until one does.
  GHSA-jmr9-qjv8-65gv
  GHSA-7pqw-9j4j-h8q3
  # braces 3.0.3, under @sanity/codegen: TypeGen's file globbing. No fixed release exists; until
  # one does.
  GHSA-vfj7-8cjw-p6xm
)

# Written so that an empty list still expands: bash 3.2, the macOS default, treats a plain
# "${list[@]}" of an empty array as an unset variable.
ignore=()
for advisory in ${accepted[@]+"${accepted[@]}"}; do
  ignore+=(--ignore "$advisory")
done
exec bun audit --audit-level=high ${ignore[@]+"${ignore[@]}"}
