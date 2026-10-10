# 143: The weekly dependency audit has failed on every run since it was wired, and no document records it

Labels: bug
Status: resolved
Blocked by: none

**Finding** (R143 in `docs/plans/review-alignment-and-quality.md`; .github/workflows/audit.yml; major; correctness): The audit is red every Monday, so an advisory that matters would look like the same noise. Every advisory on 21 September sits in build and tooling dependencies (Lighthouse CI, the Sanity CLI, Astro's build helpers), so the live site is probably not exposed, but nobody has made that call in writing. With Dependabot alerts and security updates both disabled, this job is the only vulnerability signal the repository has. Accepting advisories or adding overrides is the owner's call.

**Evidence:** gh run list --workflow audit.yml: failure on 2026-09-07, 2026-09-14 and 2026-09-21, the only three runs. The 21 Sep log ends '9 vulnerabilities (9 high)': extract-zip and tmp (via @lhci/cli), js-yaml (astro and @astrojs/* internal-helpers, @lhci/utils, @sanity/cli), path-to-regexp (@astrojs/vercel routing-utils, lhci's express), smol-toml (astro internal-helpers, @sanity/cli). audit.yml:1-2 and dependabot.yml:1-3 call this audit the one place vulnerabilities surface; gh api .../dependabot/alerts answers 403 'Dependabot alerts are disabled for this repository'. git grep finds no open-work row, ticket or runbook line about the failures.

**What to build:** Triage the nine advisories: bump or override the transitive packages that have fixed releases, record the build-time-only ones as accepted with bun audit's ignore option and a comment saying why, and add an open-work row so the next red run is noticed. Size M. Needs the owner's decision first.

- [x] The fix, with a test that fails before it where the behaviour can be tested
- [x] `bun check` green; Playwright in both data modes where a page changes

## Comments

**Triage, 27 September 2026:** An agent can triage the nine advisories and propose bumps, overrides and an ignore list with a reason for each; the owner approves which build-time-only advisories are accepted.

**In-range upgrades and a proposal for the rest, 9 October 2026 (branch `fix/audit-advisories`, open-work D27):** The audit had grown to 27 advisories at its gate (1 critical, 26 high) in 15 packages, and had failed on all five runs. `bun audit fix` moved eleven transitive packages to fixed releases inside their dependents' ranges, in `bun.lock` only, which clears 11 of the 27: proxy-addr (the critical one), brace-expansion (4), devalue (3), http-cache-semantics, sharp and source-map-js. The other five (dompurify, fast-uri, ip-address, smol-toml 1.8.0 and the js-yaml copy under `@lhci/utils`) moved for moderate and low advisories, and that js-yaml copy also for the three high ones that stay listed below for a second copy. Across all levels the count fell from 57 to 36. Proof: `bun run check` and `bun run build` pass, `bun typegen` shows no drift, the built function answers its routes and two invalid form posts in process, and Bun 1.3.14 installs the lockfile with `--frozen-lockfile`.

The finding's "probably not exposed" needs a correction: three packages with advisories are bundled into the Vercel function. devalue and sharp are now on fixed releases, and neither could be triggered on this site: the devalue leak needs a Buffer in an action result, and the nine form actions answer with an action result of plain strings; no page uses `/_image`, and it refuses images from other hosts. path-to-regexp 6.1.0 is the third; it stays, with no caller in the function (see the table).

Sixteen high advisories remain in nine packages. Each is held by an exact pin or a range inside a dependency, or has no fixed release, and none sits in a path a visitor can reach:

| Package | Advisories | Held by | Where it runs |
| --- | --- | --- | --- |
| adm-zip 0.6.0 | GHSA-7q85-xj36-vmfc, GHSA-rcw4-f5rp-g42v, GHSA-j5f4-cc29-5x44, GHSA-8238-w5pm-2374 | `@module-federation/dts-plugin` 2.9.0 pins it, under `sanity` 6.12.0 → `@sanity/cli` 8.11.0 → `@sanity/workbench-cli` 2.5.0 | The Sanity CLI's `dev`, `build` and `deploy` commands, none of which the repo runs |
| undici 7.29.0 | GHSA-rfgv-xxqx-mfg5, GHSA-w293-vg96-wgc3 | The same plugin pins it | The same; the copy traced into the function is 7.29.1 |
| js-yaml 3.13.1 | GHSA-52cp-r559-cp3m, GHSA-5p4m-2wfm-xmqj, GHSA-2883-xcg3-v3hh | `@vercel/frameworks` 3.29.0 pins it, and `@sanity/cli` pins that | The Sanity CLI's framework detection (`sanity init`) |
| smol-toml 1.5.2 | GHSA-7w5x-hrqm-74c2 | The same | The same |
| path-to-regexp 6.1.0 | GHSA-9wv6-86v2-598j | `@vercel/routing-utils` 6.5.0 pins it, under `@astrojs/vercel` 11.0.10 | Bundled into the function but never called there; at build time the adapter compiles only `redirects` and `trailingSlash`, and the site sets neither |
| tmp 0.1.0 and 0.0.33 | GHSA-ph9p-34f9-6g65 | `@lhci/cli` 0.15.1 (`^0.1.0`), and `external-editor` (`^0.0.33`) under its `inquirer`; the fix is in 0.2.6 | Lighthouse CI (`lhci open`, and inquirer's editor prompt) |
| basic-ftp 5.3.1 | GHSA-c475-qrg2-pj4r | `get-uri` 6.0.5 (`^5.0.2`), under `@lhci/cli`'s `proxy-agent`; the fix is in 6.2.1 | Lighthouse CI, only for a proxy file at an ftp address |
| extract-zip 2.0.1 | GHSA-jmr9-qjv8-65gv, GHSA-7pqw-9j4j-h8q3 | `@puppeteer/browsers` 2.13.2, under `lighthouse` 12.6.1 | Lighthouse CI, only when puppeteer downloads a browser; no fixed release exists |
| braces 3.0.3 | GHSA-vfj7-8cjw-p6xm | `@sanity/codegen` 8.1.0, through `chokidar` 3 and `micromatch` | TypeGen's file globbing; no fixed release exists |

Proposal, waiting on the owner (nothing here is applied):

1. Two flat overrides in the root `package.json`, `"adm-zip": "0.6.1"` and `"smol-toml": "1.9.0"`, clear five. Checked in a scratch copy of the manifests: only the two pinned copies change, `bun.lock` keeps `lockfileVersion` 1, and Bun 1.3.14 installs it with `--frozen-lockfile`.
2. No override scoped to a parent or a version for now. Bun 1.4.2 writes `lockfileVersion` 3 for either form, and Vercel's build runs Bun 1.3.14 (its build log of 9 October; the repo pins 1.4.2), which stops at "Unknown lockfile version", so every deployment would fail at install. A flat override cannot stand in for these three, because another major of each is in use (unifont needs undici 8, Astro needs js-yaml 4, express needs path-to-regexp 0.1). So undici 7.29.0 → 7.29.1, js-yaml 3.13.1 → 3.15.2 and path-to-regexp 6.1.0 → 6.3.0 wait.
3. adm-zip and undici also have a route with no override: `@sanity/cli`'s range (`^2.5.0`) allows `@sanity/workbench-cli` 2.8.4, which carries the fixed plugin. `bun audit fix` does not move a vulnerable package's parents, and doing it by hand adds 31 packages (a second vite and rolldown among them) beside a CLI released against 2.5.0, so it is not taken here. Upgrading `sanity` to 6.18.0 brings `@sanity/cli` 8.16.0 and gets there properly; js-yaml, smol-toml and braces stay pinned even there.
4. Accept ten with `--ignore` in `audit.yml`, each with its reason from the table: the undici, js-yaml, tmp, basic-ftp, extract-zip and braces rows. With the two overrides, path-to-regexp is then the only advisory left at the gate. It is not build-time-only (its code ships in the function, uncalled), so it is a separate call: accept it on that reading and the job passes, or leave the job red until `@vercel/routing-utils` drops 6.1.0 (6.6.0, the latest, still pins it).

**Update, 9 October 2026 (pull request 29 merged):** Vercel now installs with the pinned Bun through `scripts/pinned-bun.sh`, so item 2's limit is lifted: undici, js-yaml and path-to-regexp can each take an override scoped to their parent. Overriding the first two leaves five to accept instead of ten. For path-to-regexp an override is now a third option beside item 4's two. The owner left the choice of overrides to the agent; the change follows in its own pull request.

**Decided and fixed, 9 October 2026 (the pull request that carries this comment):** The owner left the choice of overrides to the agent and asked for this follow-up to be merged once its checks pass. Four overrides in the root `package.json`, each scoped to the package that pins the vulnerable version, clear ten of the sixteen: `@module-federation/dts-plugin` takes adm-zip 0.6.1 and undici 7.29.1, which is what its own 2.9.2 release asks for, and `@vercel/frameworks` takes js-yaml 3.15.2 and smol-toml 1.9.0. All four are scoped, not only the two that need it, so no other package's copy moves. `bun.lock` becomes `lockfileVersion` 3, which Vercel reads since pull request 29. The other six are accepted in `scripts/check-audit.sh`, each with its reason and the condition for removing it: tmp, basic-ftp, extract-zip (2) and braces, which only Lighthouse CI and TypeGen reach, and path-to-regexp, whose code ships in the function with no caller and whose pin Vercel keeps on purpose. That list was put to the owner on 9 October and stays theirs to change. `audit.yml` now runs `bun run check:audit`, which passes: the six accepted are exactly what `bun audit --audit-level=high` still reports, and across all levels the count is 11, from 57. No unit test can hold this; the weekly job is the test, red on its first five runs. No page changed, so there is no second data mode to run.
