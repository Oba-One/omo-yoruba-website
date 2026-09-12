# Phase 4: Lighthouse CI 0.15.1 verified before pinning

Date: 12 September 2026. Method: `npm view <pkg> version|time|engines|bin|dependencies` against the npm
registry, `@lhci/cli@0.15.1` installed into a scratch directory with Bun 1.4.2 (`exact = true`) so the
shipped `src/*.js`, the bundled `lighthouse` and its `cli/cli-flags.js`, `core/config/*` and
`core/audits/*` could be read (paths of the form `node_modules/...` below refer to that install),
`gh api` for the raw lighthouse-ci docs, releases, the main branch and issues and for the
treosh action's tagged files, WebFetch for the Vercel, GitHub, Playwright, Bun, Astro and
runner-images docs, and two `bunx lhci autorun` runs of the candidate config under Node 22.22.1
against the production alias (see "Smoke run"). A `gh api` read of this repository's own
deployment statuses was not permitted in this session, so the environment name Vercel writes to
GitHub is marked unverified below. Every pin is exact. The Phase 0 note recorded 0.15.1 on
4 September 2026 without checking it; it is still the latest.

| Package | Recommended pin | Latest on registry | Why this pin |
| --- | --- | --- | --- |
| `@lhci/cli` | 0.15.1 | 0.15.1 (2025-06-25) | The only current line; depends on `lighthouse 12.6.1` exactly; no `engines` field; no install scripts. Add to `packages/web` devDependencies. |
| `lighthouse` | not pinned (12.6.1 arrives through `@lhci/cli`) | 13.4.1 (2026-07-20) | lhci pins it exactly; 13.x needs Node `>=22.19` and an lhci release that does not exist yet (issue 1136, open since 2026-04-06). |
| `puppeteer` | not installed | not checked | Only `collect.puppeteerScript` needs it; the header route below does not. |
| `treosh/lighthouse-ci-action` | not used | 12.6.2 (2026-03-12, commit `3e7e23fb74242897f95c0ba9cabad3d0227b9b18`) | Bundles the same `@lhci/cli` 0.15.1 and `lighthouse` 12.6.1 on a `node24` runtime; a second config surface and action pin for nothing the CLI lacks. |
| Google Chrome on `ubuntu-latest` | the image's 152.0.7977.82 | image 20260907.300.1 (Ubuntu 24.04.5) | No install step: chrome-launcher finds it. `CHROME_PATH` can point at Playwright's Chromium when a pinned browser is wanted. |
| Node | 22 (`.node-version`, unchanged) | 22.23.2 cached on the image | `lighthouse` 12.6.1 wants `>=18.20`; `bunx lhci` and `bun run` hand the CLI to Node anyway. |

## Versions, engines and the bundled Lighthouse

- `@lhci/cli` 0.15.1 was published 2025-06-25T23:52Z (`npm view @lhci/cli time`); the GitHub release
  `v0.15.1` is dated 2025-06-26. The registry's `time.modified` is the same day, so no release has
  followed in fifteen months; the main branch's last commit is `ebee453d` "chore: bump version
  references to 0.15.1" (2025-06-26) and its `packages/cli/package.json` still says
  `"lighthouse": "12.6.1"`. Sources: `npm view @lhci/cli version time`,
  https://github.com/GoogleChrome/lighthouse-ci/releases, `gh api repos/GoogleChrome/lighthouse-ci/commits`.
- The package has no `engines` field (`npm view @lhci/cli engines` prints nothing;
  `node_modules/@lhci/cli/package.json` has none). Its `bin` is `lhci: ./src/cli.js`, whose first
  line is `#!/usr/bin/env node`. Dependencies: `lighthouse 12.6.1` and `@lhci/utils 0.15.1` exact,
  `chrome-launcher ^0.13.4`, `express ^4.17.1`, `inquirer ^6.3.1`, `yargs ^15.4.1`,
  `yargs-parser ^13.1.2`, `proxy-agent ^6.4.0`, `isomorphic-fetch ^3.0.0`, `open ^7.1.0`,
  `tmp ^0.1.0`, `uuid ^8.3.1`, `debug ^4.3.1`, `compression ^1.7.4`, `lighthouse-logger 1.2.0`.
  Sources: `node_modules/@lhci/cli/package.json`, `node_modules/@lhci/cli/src/cli.js` line 1.
- The lhci docs' CI examples are stale on Node: the README's GitHub Actions snippet uses
  `actions/setup-node@v4` with `node-version: 18`, the getting-started page uses 16.x. Sources:
  https://github.com/GoogleChrome/lighthouse-ci/blob/main/README.md lines 15 to 25,
  https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md lines 74 to 100.
- Bundled Lighthouse: 12.6.1 (published 2025-06-02), `engines.node >=18.20`, dependencies
  `puppeteer-core ^24.10.0` (24.43.1 installed), `chrome-launcher ^1.2.0` (1.2.1, nested under
  `lighthouse/node_modules` because lhci keeps 0.13.4 at the top), `axe-core ^4.10.3` (resolved to
  4.13.0, the same version the Phase 3 axe suite uses), `devtools-protocol 0.0.1467305`,
  `@paulirish/trace_engine 0.0.53`. Lighthouse 12.0.0 (2024-04-22) removed the PWA category and
  "remove budgets" is in its breaking changes. Sources: `npm view lighthouse@12.6.1 engines dependencies`,
  `node_modules/lighthouse/package.json`, `npm view lighthouse time`,
  https://github.com/GoogleChrome/lighthouse/releases/tag/v12.0.0.
- Lighthouse on the registry is 13.4.1 (2026-07-20) with `engines.node >=22.19`; 13.0.0
  (2025-10-10) set that floor ("update min supported node version to 22.19") and removed
  `preload-fonts`, `uses-rel-preload`, `font-size`, `offscreen-images`, `no-document-write`,
  `uses-passive-event-listeners`, `third-party-facades` and `first-meaningful-paint`, several of
  which lhci's presets still name (`node_modules/@lhci/utils/src/presets/all.js`). The lhci issue
  "Lighthouse 13 support?" (#1136) has no maintainer reply; neighbouring open issues are #1143
  (2026-08-07, "uuid, glob, minimatch, and js-yaml pins are multiple majors behind") and #1134
  (2026-03-07, "0.15.1 does not work with Debian Trixie on ARM"). So the repo audits with
  Lighthouse 12.6.1 for now; the Node 22 runtime already satisfies 13's floor for a later bump.
  Sources: `npm view lighthouse version engines time`,
  https://github.com/GoogleChrome/lighthouse/releases/tag/v13.0.0,
  https://github.com/GoogleChrome/lighthouse-ci/issues/1136, `gh api repos/GoogleChrome/lighthouse-ci/issues`.
- Size: `@lhci/cli` itself is 97,899 bytes unpacked in 18 files, `lighthouse` 12.6.1 is
  19,260,671 bytes in 1,016 files. The scratch install (nothing else in it) resolved 291 packages
  and 201 MB on disk, of which `lighthouse` is 22 MB and the two `@lhci` packages 928 KB. None of
  `@lhci/cli`, `@lhci/utils`, `lighthouse`, `puppeteer-core` or `chrome-launcher` has an install
  script, so `bun install --frozen-lockfile --ignore-scripts` in `.github/actions/setup-js/action.yml`
  (lines 24 to 28) needs no change. Sources: `npm view @lhci/cli dist.unpackedSize dist.fileCount`,
  `npm view lighthouse@12.6.1 dist.unpackedSize dist.fileCount`, `bun add` output, `du -sh`,
  the five `package.json` files.

## Chrome on the runner

- Nothing downloads a browser: Lighthouse depends on `puppeteer-core`, not `puppeteer`, and
  lhci resolves Chrome in this order: the `chromePath` option, the `CHROME_PATH` variable, the
  executable of `puppeteer` or `puppeteer-core` if one is installed, then the highest priority
  installation `chrome-launcher` reports. The healthcheck line "Chrome installation not found"
  fails `autorun` before any collection when none resolves. Sources:
  `node_modules/@lhci/cli/src/utils.js` lines 56 to 64,
  `node_modules/@lhci/cli/src/healthcheck/healthcheck.js` lines 66 to 72,
  https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md lines 277 to 285.
- On Linux chrome-launcher looks at `CHROME_PATH`, the `.desktop` files under
  `~/.local/share/applications/` and `/usr/share/applications/`, then `which google-chrome-stable`,
  `google-chrome`, `chromium-browser`, `chromium`, and ranks `google-chrome-stable` highest.
  Source: `node_modules/lighthouse/node_modules/chrome-launcher/dist/chrome-finder.js`, `linux()`.
- `ubuntu-latest` is Ubuntu 24.04 ("the `-latest` label is used for the latest OS image version
  that is GA"). Image 20260907.300.1 (OS 24.04.5 LTS) ships Google Chrome 152.0.7977.82,
  Chromium 152.0.7977.0, ChromeDriver 152.0.7977.82 and Node.js 22.23.2; its environment table
  has `CHROMEWEBDRIVER` but no `CHROME_BIN`, so discovery goes through `which`. The lhci
  GitHub Actions example installs no browser; the treosh README says each URL "is audited using
  the latest version of Lighthouse and Chrome preinstalled on the environment"; the lhci
  getting-started page adds Chrome only for Jenkins (`apt-get install google-chrome-stable`,
  `CHROME_PATH=$(which google-chrome-stable)`). Sources:
  https://github.com/actions/runner-images/blob/main/README.md,
  https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md,
  getting-started.md lines 74 to 100 and 196 to 221, treosh README line 453.
- Compatibility: the lhci troubleshooting page lists "Protocol Error: X.Y wasn't found: Your
  version of Chrome is incompatible with the Lighthouse version, latest Lighthouse CI supports
  stable Chrome and later". The smoke run below drove Lighthouse 12.6.1 with Chrome 152 (Brave)
  and Chrome for Testing 153.0.8010.12 (Playwright build 1243) without a protocol error; the
  runner's 152 sits between them. `--no-sandbox` is documented for containers, not for the
  runner. Sources: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/troubleshooting.md
  lines 19 to 21, getting-started.md line 154, the LHRs' `environment.hostUserAgent`.
- A pinned browser instead: the e2e job already runs `bunx playwright install --with-deps chromium`
  (`.github/workflows/ci.yml` lines 176 to 177); exporting `CHROME_PATH` to that Chromium would
  audit with the same build Playwright tests, at the cost of the download.

## The lighthouserc shape

`lhci autorun` runs `healthcheck --fatal`, then `collect`, then `assert` (with
`--preset=lighthouse:recommended` when neither `assert` nor `upload` is configured), then `upload`
only when `upload` is configured; every child command is spawned with `process.argv[0]` and the
overrides use dot notation (`--collect.numberOfRuns=5`, "all CLI flags for child commands must
use the `=` syntax"). Config discovery order: `.lighthouserc.cjs`, `lighthouserc.cjs`,
`.lighthouserc.js`, `lighthouserc.js`, then `.json`, `.yml`, `.yaml` variants, no upward traversal;
`.cjs` and `.js` files are loaded with `require()`, so under `"type": "module"` in
`packages/web/package.json` the file must be `.cjs`. `--config=<path>` names any file. Sources:
`node_modules/@lhci/cli/src/autorun/autorun.js`, configuration.md line 159,
`node_modules/@lhci/utils/src/lighthouserc.js` lines 14 to 26 and 78.

### collect

- `url`: array; with no `staticDistDir` the URLs are used as given. `numberOfRuns` defaults to 3.
  `additive` keeps `.lighthouseci/` instead of clearing it. `chromePath`, `puppeteerScript`,
  `puppeteerLaunchOptions`, `startServerCommand` and `startServerReadyPattern` exist for local
  servers and authenticated flows. Sources: `node_modules/@lhci/cli/src/collect/collect.js`
  lines 40 to 100, configuration.md lines 200 to 260.
- `settings` are "The Lighthouse CLI flags to pass along to Lighthouse". lhci writes them to
  `.lighthouseci/flags-<uuid>.json`, runs `node <lighthouse>/cli/index.js <url> --output json
  --output-path stdout --cli-flags-path <file>` and deletes the file afterwards, so object
  values are fine; it appends `--headless=new` to `chromeFlags` unless `headful`, and strips
  `auditMode`, `gatherMode`, `output`, `outputPath`, `channel`, `listAllAudits`,
  `listAllCategories`, `printConfig` (the docs also reserve `port` and `cli-flags-path`).
  Sources: `node_modules/@lhci/cli/src/collect/node-runner.js` lines 40 to 75 and 96 to 98,
  configuration.md lines 370 to 406.
- Lighthouse 12.6.1 flags that matter here: `preset` with choices `perf`, `experimental`,
  `desktop` ("If the --config-path flag is provided, this preset will be ignored");
  `form-factor` (`mobile`, `desktop`; "For desktop, --preset=desktop instead");
  `screenEmulation.{width,height,deviceScaleFactor,mobile,disabled}`; `only-categories`
  ("Available categories: accessibility, best-practices, performance, seo"); `skip-audits`;
  `throttling-method` (`devtools`, `provided`, `simulate`) and `throttling.rttMs`,
  `throughputKbps`, `requestLatencyMs`, `downloadThroughputKbps`, `uploadThroughputKbps`,
  `cpuSlowdownMultiplier`; `extra-headers` ("Set extra HTTP Headers to pass with request"),
  coerced from an object, a JSON string or a path to a JSON file; `disable-storage-reset`;
  `max-wait-for-load`; `chrome-flags`. There is no `budget-path` flag any more (see assert).
  Sources: `node_modules/lighthouse/cli/cli-flags.js` lines 129 to 157, 187 to 192, 251 to 278,
  304 to 306 and 436 to 456.
- The desktop preset is `extends: 'lighthouse:default'` with `formFactor: 'desktop'`,
  `throttling: desktopDense4G`, screen 1350 x 940 at scale 1, desktop user agent. The mobile
  default is `formFactor: 'mobile'`, `throttling: mobileSlow4G`, `throttlingMethod: 'simulate'`,
  screen 412 x 823 at scale 1.75 (Moto G Power). Sources:
  `node_modules/lighthouse/core/config/desktop-config.js`,
  `node_modules/lighthouse/core/config/constants.js` lines 14 to 34 and 51 to 64.
- `extraHeaders` in the docs is shown as a JSON string (`"extraHeaders": "{\"Cookie\": \"token=1234\"}"`
  or `JSON.stringify({...})` in a `.js` config); `coerceExtraHeaders` also accepts an object.
  Sources: configuration.md lines 1215 to 1240, `cli-flags.js` lines 442 to 456.

### assert

- Assertions are keyed by audit id, `level | [level, options]`, levels `off`, `warn`, `error`;
  options `minScore`, `maxLength` (count of `details.items`), `maxNumericValue` (the audit's
  `numericValue`), `aggregationMethod` (`median`, `optimistic`, `pessimistic`, `median-run`;
  default `optimistic`, the value most likely to pass across the runs). The docs say the default
  options are `{"aggregationMethod": "optimistic", "minScore": 1}`, but the shipped code applies
  `minScore: 0.9` when an assertion has no options (the smoke run prints `expected: >=0.9` for
  `['error', {}]` entries); binary audits still need a perfect score under either number.
  `assert.aggregationMethod` at the top level sets the default for every assertion. Category
  scores are asserted as `categories:<id>`. Sources:
  `node_modules/@lhci/utils/src/assertions.js` lines 16 to 31, 139 to 181, 302 to 305, 361 and 426,
  configuration.md lines 693 to 760.
- Presets: `lighthouse:all` asserts every audit (`all.js`, 184 lines, turns off the diagnostic
  and informational ids such as `resource-summary`, `network-requests`, `metrics`);
  `lighthouse:recommended` extends it, warns on the flaky metric audits (`largest-contentful-paint`,
  `cumulative-layout-shift`, `first-contentful-paint`, `speed-index`, `interactive`,
  `max-potential-fid`, `bootup-time`, `mainthread-work-breakdown`), errors with `maxLength: 0` on
  `unused-javascript`, `unused-css-rules`, `uses-responsive-images`, `uses-text-compression`,
  `offscreen-images`, `unminified-css`, `unminified-javascript`, `uses-optimized-images`,
  `uses-rel-preconnect`, `efficient-animated-content`, warns on `render-blocking-resources`,
  `uses-long-cache-ttl`, `server-response-time`, `dom-size`, `modern-image-formats`,
  `is-on-https`, and turns off `uses-http2` and `long-tasks`; `lighthouse:no-pwa` is
  `recommended` plus `is-on-https: 'off'` and `viewport: 'off'` under the comment "TODO: PWA
  doesn't exist anymore, so remove?". Informative audits (`csp-xss`, `has-hsts`,
  `origin-isolation`, `clickjacking-mitigation`) cannot fail a preset: Lighthouse normalises an
  informative score to 1. Sources: `node_modules/@lhci/utils/src/presets/{all,recommended,no-pwa}.js`,
  `node_modules/lighthouse/core/audits/audit.js` lines 344 to 347, configuration.md lines 811 to 835.
- Per URL: `assertMatrix` is an array of `{matchingUrlPattern, assertions, preset?,
  aggregationMethod?}` objects, the pattern a regex tested against each run's final URL, and it
  "Cannot use assertMatrix with other options" (top level `assertions`, `preset`, `budgetsFile`,
  `aggregationMethod` all throw). Sources: `assertions.js` lines 463 to 466, configuration.md
  lines 782 to 810.
- Resource budgets: `resource-summary:<resourceType>:(size|count)` reads the `resource-summary`
  audit, `size` from the item's `size` then `transferSize`, `count` from `requestCount`;
  "the `maxNumericValue` unit for file size is in _bytes_ while the budget.json unit for file
  size is in _kilobytes_". In Lighthouse 12.6.1 `resource-summary` is informative, sits in the
  performance category's hidden group with weight 0, and lists `total`, `document`, `script`,
  `stylesheet`, `image`, `media`, `font`, `other` and `third-party` with `requestCount` and
  `transferSize`, every origin included. So `resource-summary:script:size` is the transfer size
  Chrome measured for every script request, third parties included, with whatever encoding
  Vercel negotiated; the build job's table in `.github/workflows/ci.yml` (lines 59 to 70)
  gzips first-party `_astro/*.js` files only. `resource-summary:third-party:size` shows the split.
  Sources: `assertions.js` lines 306 to 326, `node_modules/lighthouse/core/audits/resource-summary.js`
  lines 24, 42 to 56 and 64 to 67, `node_modules/lighthouse/core/config/default-config.js`
  lines 186 and 490, configuration.md lines 851 to 856.
- budget.json: `assert.budgetsFile` still works in lhci, which converts the file itself
  (`timings` to `<metric>` `maxNumericValue`, `resourceSizes` to `resource-summary:<type>:size`
  with the KB value times 1024, `resourceCounts` to `:count`, `path` to a `matchingUrlPattern`
  regex, all at `error`), but "Cannot use both budgets AND assertions". The docs' other example,
  `collect.settings.budgetPath` plus a `performance-budget: error` assertion, depends on the
  budgets feature Lighthouse 12 removed: `cli-flags.js` and `default-config.js` have no
  `budget` string left. Category scores cannot be expressed in budget.json, so this repo asserts
  in lhci syntax. Sources: `node_modules/@lhci/utils/src/budgets-converter.js`,
  `node_modules/@lhci/cli/src/assert/assert.js` lines 21 to 58, configuration.md lines 837 to
  856 and 1258 to 1275, https://web.dev/articles/use-lighthouse-for-performance-budgets.

### upload

- Targets: `lhci` (the default, needs a server and token), `temporary-public-storage` (Google
  Cloud storage, public link, deleted after a few days; "If you're uncomfortable with the idea of
  your Lighthouse reports being stored on a public URL for anyone to see, skip" it) and
  `filesystem` (`outputDir`, `reportFilenamePattern` with `%%HOSTNAME%%`, `%%PATHNAME%%`,
  `%%DATETIME%%`, plus a `manifest.json`). A GitHub status check is set "when the GitHub token
  is available and target is not `filesystem`". Sources: configuration.md lines 451 to 520 and
  607 to 645, getting-started.md line 49.
- The report carries the request headers: every LHR has `configSettings.extraHeaders` (null in
  the smoke run, the header object when set), and the HTML report embeds the same JSON. With the
  bypass secret passed as a header, uploading a report to temporary public storage publishes the
  secret, and an artifact on this public repository is downloadable by anyone with read access.
  Source: the smoke run's `report.json` (`"extraHeaders"` key present under `configSettings`),
  https://github.com/Oba-One/omo-yoruba-website is public per `docs/runbook.md` line 224.

### The budgets of QUALITY.md section 3 as one config

`docs/design/QUALITY.md` lines 70 to 75: every route at mobile and desktop presets against the
Vercel preview URL; performance 90+, accessibility 100, best practices 100, SEO 100; LCP under
2.5 s on 4G; CLS under 0.05; total JS under 60 KB gzipped on content pages. One `.cjs` file reads
the preview URL, the preset and the secret from the environment, so the same file serves both
matrix legs and never holds the secret in git (a JSON config could not read the environment):

```js
// packages/web/lighthouserc.cjs. Run once per preset: LIGHTHOUSE_PRESET=mobile and LIGHTHOUSE_PRESET=desktop.
const base = process.env.LIGHTHOUSE_BASE_URL;
const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
if (!base || !secret) throw new Error('LIGHTHOUSE_BASE_URL and VERCEL_AUTOMATION_BYPASS_SECRET are required');
const desktop = process.env.LIGHTHOUSE_PRESET === 'desktop';
// Content routes only: /admin is the Studio and /api/* are endpoints. Later phases append theirs.
const routes = ['/'];

module.exports = {
  ci: {
    collect: {
      url: routes.map((route) => new URL(route, base).href),
      numberOfRuns: 3,
      settings: {
        ...(desktop ? { preset: 'desktop' } : {}),
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        // Vercel adds X-Robots-Tag: noindex to every preview; a failing is-crawlable drops SEO to about 0.69.
        skipAudits: ['is-crawlable'],
        extraHeaders: JSON.stringify({ 'x-vercel-protection-bypass': secret }),
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 61440 }],
      },
    },
    // No upload block: the reports would carry the bypass secret (see "upload").
  },
};
```

- The mobile leg needs no preset key: the Lighthouse default is the mobile emulation with
  simulated Slow 4G. The desktop leg is `settings.preset: 'desktop'`, the documented "Desktop
  emulation" example. Nothing in lhci runs two presets in one `autorun`, so the CI shape is a
  matrix of two jobs (or two `lhci autorun --config=...` calls); `--collect.additive` could merge
  both into one `.lighthouseci/` but `assert` would then aggregate mobile and desktop runs of a
  URL together and `optimistic` would hide the mobile result. Sources: `constants.js` lines 51
  to 64, configuration.md lines 1187 to 1197, `node_modules/@lhci/cli/src/collect/collect.js`
  line 246, `assertions.js` lines 56 to 70 and 459.
- `onlyCategories` names all four categories Lighthouse 12 has (the PWA category is gone), so it
  is documentation more than a filter. Source: `cli-flags.js` lines 187 to 192.
- `skipAudits: ['is-crawlable']` because Vercel "adds an X-Robots-Tag: noindex HTTP response
  header to every Preview Deployment automatically" and cannot be turned off, the audit reads
  the `x-robots-tag` header, and it weighs 93/23 (about 4.04) against nine audits of weight 1,
  a weight Lighthouse chose "such that this audit failing results in the SEO category failing"
  (9 / 13.04, about 0.69); skipping removes the audit from the category and the score is the
  weighted mean of what remains. Keep it on for any run against the public domain. Sources:
  https://vercel.com/kb/guide/are-vercel-preview-deployment-indexed-by-search-engines,
  `node_modules/lighthouse/core/audits/seo/is-crawlable.js` lines 22 to 25,
  `default-config.js` line 622, `node_modules/lighthouse/core/config/filters.js` lines 264 to
  291, `node_modules/lighthouse/core/scoring.js` lines 22 to 41.
- Per URL, when a route needs a different number, replace `assertions` with `assertMatrix`,
  each entry carrying its own `matchingUrlPattern` and the full assertion set (the top-level
  `assertions` and `aggregationMethod` must go, see "assert"). For example
  `{ matchingUrlPattern: 'https://[^/]+/gallery', assertions: { ..., 'resource-summary:script:size': ['error', { maxNumericValue: 92160 }] } }`
  after a catch-all `{ matchingUrlPattern: '.*', assertions: { ... } }`.
- Tightening later: `assert.aggregationMethod: 'median'` (instead of the best of three runs),
  `numberOfRuns: 5`, and `preset: 'lighthouse:recommended'` on top of the explicit assertions
  once the `maxLength: 0` diagnostics (`unused-javascript`, `unused-css-rules`, and so on) are
  known to pass; that preset was not adopted here because QUALITY.md asks for scores and
  metrics, not for zero unused bytes.

### 4G throttling

- "LCP under 2.5s on 4G" is the mobile default: `throttling.mobileSlow4G` is `rttMs: 150`,
  `throughputKbps: 1638.4`, `requestLatencyMs: 562.5`, `downloadThroughputKbps: 1474.56`,
  `uploadThroughputKbps: 675`, `cpuSlowdownMultiplier: 4` under `throttlingMethod: 'simulate'`;
  Lighthouse describes it as 150 ms latency, "1.6Mbps down / 750 Kbps up", 4x CPU, "roughly the
  bottom 25% of 4G connections and top 25% of 3G connections". The desktop preset's
  `desktopDense4G` is `rttMs: 40`, `throughputKbps: 10240`, `cpuSlowdownMultiplier: 1`. To pin
  either explicitly, set `settings.throttlingMethod` and the `settings.throttling` object with
  those keys; `devtools` applies request-level throttling instead of the Lantern simulation and
  is slower and less deterministic. Sources:
  `node_modules/@paulirish/trace_engine/models/trace/lantern/simulation/Constants.js` lines 11
  to 35, the smoke run LHRs' `configSettings.throttling`,
  https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md.

## Against the protected Vercel preview

### The preview URL in the workflow

- Vercel "will deploy every push by default" and, "By default, Vercel notifies GitHub of
  deployments using the `deployment_status` webhook event" (a toggle in the project's Git
  settings can disable it); it also sends `repository_dispatch` events
  (`vercel.deployment.ready`, `.success`, `.error`, `.canceled`, `.ignored`, `.skipped`,
  `.pending`, `.failed`, `.promoted`) whose `client_payload` has the deployment `url` and
  `environment`, but "This event will only trigger a workflow run if the workflow file exists on
  the default branch". Vercel's own migration diff reads
  `github.event.deployment_status.environment_url` before switching to
  `github.event.client_payload.url`; Playwright's docs use `on: deployment_status`,
  `if: github.event.deployment_status.state == 'success'` and
  `github.event.deployment_status.target_url`, "Services like Vercel use this pattern".
  GitHub's REST reference: `environment_url` "Sets the URL for accessing your environment",
  `log_url` "replaces target_url" (setting it fills `target_url`), states `error`, `failure`,
  `inactive`, `in_progress`, `queued`, `pending`, `success`. For `deployment_status` runs
  `GITHUB_SHA` is "Commit to be deployed" and inactive states do not trigger. Sources:
  https://vercel.com/docs/git/vercel-for-github (sections "A Deployment for Each Push",
  "Silence deployment notifications on pull requests", "Repository dispatch events"),
  https://vercel.com/kb/guide/how-can-i-run-end-to-end-tests-after-my-vercel-preview-deployment,
  https://playwright.dev/docs/ci, https://docs.github.com/en/rest/deployments/statuses,
  https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#deployment_status,
  `docs/research/phase-3-playwright-and-axe.md` lines 137 to 154.
- `deployment_status` therefore fits this repo: GitHub's event table puts no default-branch
  condition on it and sets `GITHUB_SHA` to the deployed commit, so a branch can carry the
  workflow before merge and `actions/checkout` checks out that commit.
  Filter to the preview environment (`github.event.deployment.environment`; Vercel writes
  `Preview` and `Production` to GitHub's Deployments tab in the usual setup, unverified here) so
  the `main` production deployment does not run the job twice. Fork pull requests: "Vercel will
  require authorization from you or a team member to deploy the pull request", so no event
  arrives until someone approves. Source: https://vercel.com/docs/git/vercel-for-github
  ("Deployment Authorizations for Forks").
- Required checks: "Required checks must pass on the latest commit SHA" and a check that never
  reports stays pending and blocks merging ("Avoid requiring workflows that can be skipped").
  A `deployment_status` job whose `if:` is false is recorded as skipped; a job that never runs
  (no deployment, build failed on Vercel) leaves the context missing. The owner decides whether
  `Lighthouse (mobile)` and `Lighthouse (desktop)` join the required contexts in
  `docs/runbook.md` lines 241 to 255. Source:
  https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks.
- The Vercel CLI route (`vercel pull`, `vercel build`, `vercel deploy --prebuilt`) exists for
  GitHub Enterprise Server and custom pipelines; it would deploy a second time next to the Git
  integration, so it is not needed here. Source: https://vercel.com/docs/git/vercel-for-github
  ("Using GitHub Actions").

### The bypass header

- "Deployment Protection requires authentication for all requests, including those to Routing
  Middleware"; Standard Protection "protects all domains except production domains" and Vercel
  Authentication is available on all plans. Protection Bypass for Automation: "authenticate
  using either an HTTP header or a query parameter named `x-vercel-protection-bypass` with the
  value of the generated secret"; the header is "the recommended approach". Vercel creates the
  secret in the project's Deployment Protection settings (several per project, for example one
  named for CI), exposes it to builds as `VERCEL_AUTOMATION_BYPASS_SECRET`, and "regenerating or
  deleting the secret in the project settings will invalidate previous deployments". It needs a
  team member or Project Administrator to create. Vercel's Playwright example sets
  `extraHTTPHeaders` with `x-vercel-protection-bypass` and `x-vercel-set-bypass-cookie: 'true'`.
  Sources: https://vercel.com/docs/deployment-protection,
  https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation.
- `x-vercel-set-bypass-cookie: true` "will set the authorization bypass as a cookie using a
  redirect with a `Set-Cookie` header" (`samesitenone` for iframes). For Lighthouse that redirect
  lands on the audited navigation: the `redirects` audit and LCP both pay for it (the smoke
  run's `redirects` audit scored 0 on a chain of two redirects), so the header alone is the
  right form for `extraHeaders`. Sources: the same Vercel page, the smoke LHR's `redirects`
  audit (score 0, three URLs in `details.items`).

### The whole page load and where the secret travels

- Lighthouse applies `settings.extraHeaders` with one CDP call,
  `Network.setExtraHTTPHeaders`, on the page session before navigation; the protocol defines it
  as "Specifies whether to always send extra HTTP headers with the requests from this page". So
  every request the page makes carries the header: the document, `_astro/*` scripts and styles,
  fonts and images on the preview host all pass Vercel Authentication, which is what a full
  Lighthouse load needs. The same header also goes to every third-party origin the page
  requests (the Sanity CDN, PostHog, the Zeffy embed), which is a disclosure of the project's
  bypass secret to those services; the query-parameter form would avoid that but covers the
  document only, so subresources would be challenged. Sources:
  `node_modules/lighthouse/core/gather/driver/prepare.js` lines 131 to 132,
  https://chromedevtools.github.io/devtools-protocol/tot/Network/#method-setExtraHTTPHeaders.
- The cookie alternative keeps the secret on the preview host: a `collect.puppeteerScript`
  that opens the preview once with both bypass headers so Vercel's redirect sets its cookie, then
  Lighthouse runs without `extraHeaders`. Lighthouse 12.6.1 clears only `file_systems`,
  `shader_cache`, `service_workers` and `cache_storage` between runs, so the cookie survives, and
  the lhci docs say "the browser is kept open across all URLs, so if you're keeping auth in
  cookies then everything should be remembered between runs". It needs `puppeteer` or
  `puppeteer-core` resolvable from `@lhci/cli` ("Unable to require 'puppeteer' for script, have
  you run 'npm i puppeteer'?"), launches Chrome through puppeteer with `executablePath` from
  `chromePath`, and ignores `settings.chromeFlags` in favour of `puppeteerLaunchOptions.args`.
  Reports then carry no secret either. Sources: `constants.js` line 68,
  `node_modules/@lhci/cli/src/collect/puppeteer-manager.js` lines 29 to 73, configuration.md
  lines 286 to 334, `collect.js` lines 230 to 238.
- Either way the job needs the secret as a repository secret, absent on pull requests from
  forks like `CHROMATIC_PROJECT_TOKEN` (`.github/workflows/ci.yml` lines 128 to 131); the
  config above throws a clear error when it is missing rather than auditing the login page.

### Previews carry noindex

Covered under the config: every preview answers with `X-Robots-Tag: noindex`, so `is-crawlable`
fails and SEO cannot reach 100 there. Skip that audit on previews and run it against the public
domain once `omoyorubasocal.org` is attached (`docs/runbook.md` lines 44 to 48).

### A local production build instead

- `packages/web/playwright.config.ts` line 3 already records that "the Vercel adapter has no
  preview command": `astro preview` "starts a local server to serve the contents of your static
  directory (`dist/` by default)", and the Vercel adapter's guide has no local-run story for its
  `.vercel/output`. Vercel's `vercel dev` "is used to replicate the Vercel deployment environment
  locally" through the framework's development command, with the advice "If you're using a
  framework and your framework's Development Command already provides all the features you need,
  we do not recommend using `vercel dev`"; it is not the production build. `vercel build` writes
  `.vercel/output` and the docs pair it only with `vercel deploy --prebuilt`, with no local
  server for the Build Output API. Sources: https://docs.astro.build/en/reference/cli-reference/#astro-preview,
  https://docs.astro.build/en/guides/integrations-guide/vercel/, https://vercel.com/docs/cli/dev,
  https://vercel.com/docs/git/vercel-for-github ("Using GitHub Actions").
- What a local run would take: a CI-only Astro config with `@astrojs/node` in
  `mode: 'standalone'` (passed with `astro build --config`), then `node ./dist/server/entry.mjs`
  with `HOST` and `PORT`, which "serves" `dist/client/` assets with
  `Cache-Control: public, max-age=31536000, immutable`, wired as `collect.startServerCommand`
  with a `startServerReadyPattern`. It measures the application, not the deployment: no Vercel
  route cache (Phase 4 adds `Astro.cache` with the Vercel provider), no Vercel headers, no
  CDN, no real network. It is a fallback for runs without the secret, not the gate QUALITY.md
  describes. Sources: https://docs.astro.build/en/guides/integrations-guide/node/,
  `packages/web/astro.config.ts` lines 35 to 36, `docs/design/PROMPTS.md` lines 164 to 166.

## Bun or Node

- `bunx lhci` runs the CLI under Node: `src/cli.js` starts with `#!/usr/bin/env node` and Bun
  "will spin up a `node` process to execute the file" unless `--bun` precedes the executable name;
  `bunx` "checks for a locally installed package first, then falls back to auto-installing it".
  A `"lighthouse": "lhci autorun"` script under `bun run` resolves the same `node_modules/.bin/lhci`
  shim. Sources: https://bun.com/docs/cli/bunx, `node_modules/@lhci/cli/src/cli.js` line 1.
- lhci's own code also runs under Bun's runtime: `bun ./node_modules/@lhci/cli/src/cli.js collect`
  and `assert` completed in the smoke run. But Lighthouse itself is always a child process
  spawned as `node <lighthouse/cli/index.js>` (and `autorun` spawns its child commands with
  `process.argv[0]`), so Node must be on `PATH` in every case; `.github/actions/setup-js`
  installs Node from `.node-version` before Bun. Node 22 prints
  `[DEP0040] DeprecationWarning: The 'punycode' module is deprecated` from a Lighthouse
  dependency; it is noise. Sources: `node-runner.js` line 98, `autorun.js` lines 57 to 66,
  `.github/actions/setup-js/action.yml` lines 7 to 15, the smoke logs.

## Smoke run, 12 September 2026

- Setup: the config above without `extraHeaders` and `skipAudits`, `numberOfRuns: 1`,
  `upload.target: 'filesystem'`, URL `https://omo-yoruba-greenpilldevguild.vercel.app/`, Node
  22.22.1, Bun 1.4.2, `CHROME_PATH` first to Brave (Chrome 152) and again to Playwright's Chrome
  for Testing 153.0.8010.12. Each `autorun` took 21 to 25 seconds for one run.
- What it proved: the healthcheck found Chrome; `settings.preset: 'desktop'` switched the
  emulation and throttling to 1350 x 940 and `desktopDense4G`, the default leg used 412 x 823 and
  `mobileSlow4G`; every assertion type worked (`categories:*` with `minScore`, metric
  `maxNumericValue`, `resource-summary:script:size`), the output names the audit, the operator and
  the value, `.lighthouseci/assertion-results.json` lists every result, and `filesystem` wrote
  `manifest.json` plus a `.report.html` and `.report.json` per run.
- What it did not measure: the production alias itself answered 302 to
  `vercel.com/sso-api`, then `vercel.com/login`, so both LHRs describe Vercel's login page
  (1.38 MB of script from `vercel.com` and `accounts.google.com`, LCP 11.1 s mobile, SEO 0.82) and
  say nothing about the site. This matches Vercel's note that under Standard Protection "the
  production generated deployment URL becomes restricted"; the runbook's "which keeps working
  after the domain attaches" (line 39) no longer holds for anonymous visitors, and any Lighthouse
  run against a `vercel.app` URL, production included, needs the bypass. Sources: the LHRs'
  `requestedUrl`, `finalDisplayedUrl`, `runWarnings` and `network-requests` (status 302 on the
  first request), https://vercel.com/docs/deployment-protection ("How to migrate to Standard
  Protection"), `docs/runbook.md` lines 37 to 39.

## Correction after installing, 12 September 2026

The variable names first recommended here, `LHCI_BASE_URL` and `LHCI_PRESET`, collide with lhci's
own configuration: `src/cli.js` line 64 calls yargs `.env('LHCI')`, so every `LHCI_*` variable
becomes a flag for each subcommand. The first `lhci autorun` with `LHCI_PRESET=mobile` collected
three runs and then failed in `lhci assert` with `Invalid values: Argument: preset, Given:
"mobile"`. The config, the workflow and the runbook use `LIGHTHOUSE_BASE_URL` and
`LIGHTHOUSE_PRESET` instead, and the blocks below are updated to match.

Found in the review of the same change: a `deployment_status` run is never started for a fork's
preview (GitHub reports a startup failure for a commit no branch or tag of the repository points
to), so the fork remarks below about the secret being absent do not describe what happens; the
config now also sends `x-vercel-skip-toolbar` (Vercel's documented header for automation, "presence
of the header itself triggers Vercel to disable the toolbar"); and the header route's disclosure to
third-party origins is now stated in the runbook where the owner creates the secret.

## Recommendation for Phase 4

- Pin `@lhci/cli` 0.15.1 in `packages/web` devDependencies (Bun will keep `lighthouse` at 12.6.1
  through the lockfile) and add `"lighthouse": "lhci autorun"` to its scripts; from the root,
  `bun run --filter @oy/web lighthouse`. No Chrome step, no Puppeteer.
- Config: `packages/web/lighthouserc.cjs` exactly as above, routes `['/']` for Phase 4 and each
  later phase appending its content routes (never `/admin`, never `/api/*`); the assertions are
  QUALITY.md section 3 verbatim, `skipAudits: ['is-crawlable']` on previews, no upload block.
- CI job shape, a new `.github/workflows/lighthouse.yml` so `ci.yml` keeps its `pull_request`
  trigger:

```yaml
name: Lighthouse
on: deployment_status
permissions:
  contents: read
concurrency:
  group: lighthouse-${{ github.sha }}
  cancel-in-progress: true
jobs:
  lighthouse:
    name: Lighthouse (${{ matrix.preset }})
    if: github.event.deployment_status.state == 'success' && github.event.deployment.environment == 'Preview'
    runs-on: ubuntu-latest
    timeout-minutes: 20
    strategy:
      fail-fast: false
      matrix:
        preset: [mobile, desktop]
    env:
      LIGHTHOUSE_BASE_URL: ${{ github.event.deployment_status.environment_url || github.event.deployment_status.target_url }}
      LIGHTHOUSE_PRESET: ${{ matrix.preset }}
      VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
      - uses: ./.github/actions/setup-js
      - name: lhci autorun against the preview (docs/research/phase-4-lighthouse-ci.md)
        run: bun run --filter @oy/web lighthouse
```

  The checkout is the deployed commit, the setup action installs Node 22 and the frozen
  dependencies, the runner's Chrome 152 is found by chrome-launcher, and the job log carries
  the assertion table; nothing is uploaded. Add a `Lighthouse skipped` notice step when the
  secret is empty if the owner wants the job green on fork pull requests, as the Chromatic job does.
- Runbook and wayfinder: record the `VERCEL_AUTOMATION_BYPASS_SECRET` repository secret next to
  `CHROMATIC_PROJECT_TOKEN` (setup wizard stage 6 in `docs/plans/wayfinder.md` ticket 17), the
  Vercel project setting that creates it, the `deployment_status` toggle, and the corrected
  production alias sentence. The Phase 3 note's open question on the trigger
  (`docs/research/phase-3-playwright-and-axe.md` lines 240 to 243) resolves the same way for
  Playwright: the e2e job can move to this workflow with `PLAYWRIGHT_TEST_BASE_URL` set from the
  same event once the secret exists (`packages/web/playwright.config.ts` lines 8 to 9).

## Open questions for the owner

- The Protection Bypass for Automation secret: create it in the Vercel project's Deployment
  Protection settings (a team member or Project Administrator role), name it for CI, store it as
  the repository secret `VERCEL_AUTOMATION_BYPASS_SECRET`, and accept that with the header route
  it is sent to every third-party origin a page loads; or ask for the cookie route (Puppeteer
  dependency, a small script, no secret in reports).
- Confirm in the project's Git settings that `deployment_status` events are on, and read the
  environment name Vercel writes (`gh api repos/Oba-One/omo-yoruba-website/deployments`) to fix
  the `if:` filter; or choose `repository_dispatch` with `vercel.deployment.success`, which only
  works once the workflow file is on `main`.
- Whether `Lighthouse (mobile)` and `Lighthouse (desktop)` become required checks, given that a
  Vercel build failure or an unauthorised fork deployment leaves them missing.
- Whether the 60 KB script budget means first-party JavaScript (what the build job's table
  gzips) or everything Chrome loads (what `resource-summary:script:size` counts, PostHog and the
  Zeffy embed included); QUALITY.md says "islands only where interaction exists", which reads as
  first-party, so the number may need a third-party line of its own.
- Whether SEO 100 should be checked on the public domain from the nightly workflow instead of
  being partly skipped on previews, and what to do with the now protected production alias in
  `docs/runbook.md` line 39.
- `numberOfRuns` 3 with the optimistic aggregation (the first cut), or 5 with `median`.
- Reports: none kept in the first cut. If the owner wants HTML reports on failures, strip
  `configSettings.extraHeaders` before `actions/upload-artifact`, or switch to the cookie route.
