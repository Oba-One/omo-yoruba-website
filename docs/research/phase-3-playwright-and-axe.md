# Phase 3: Playwright 1.63 and @axe-core/playwright 4.13 verified before pinning

Date: 11 September 2026. Method: `npm view <pkg> version|engines|peerDependencies|dependencies|time`
against the npm registry, both packages installed into a scratch directory with Bun 1.4.2 (`exact = true`)
so the shipped `types/*.d.ts`, `lib/*.js` and READMEs could be read (paths below of the form
`node_modules/...` refer to that install), `bunx playwright ...` run there to see which runtime Bun uses,
the primary docs named per bullet, and `gh api` for releases, tags, pull requests and issues. Every pin is exact.

| Package | Pinned | Latest on registry | Why this pin |
| --- | --- | --- | --- |
| `@playwright/test` | 1.63.0 | 1.63.0 (2026-09-04) | `engines.node >=20`; depends on `playwright 1.63.0` exactly; ships Chromium 153; no install scripts. |
| `@axe-core/playwright` | 4.13.0 | 4.13.0 (2026-08-11) | Peer `playwright-core >= 1.0.0`; bundles `axe-core ~4.13.0` (installs 4.13.0); no `engines` field. |
| `playwright`, `playwright-core` | not pinned | 1.63.0 | Pulled in exactly by `@playwright/test`; in the scratch install Bun kept one top level `playwright-core` and `require.resolve` from inside the axe package returns it (no nested copy, no peer warning). |
| `axe-core` | not pinned | 4.13.0 (2026-08-05) | Dependency of `@axe-core/playwright`; its major and minor track axe-core by design. |
| `mcr.microsoft.com/playwright` | not used | `v1.63.0-noble` | `ubuntu-latest` (24.04) plus `--with-deps chromium` is the documented non container route. |
| `actions/upload-artifact` | `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a` (v7.0.1) | v7.0.1 (2026-04-10) | For `playwright-report/`; the tag object dereferences to this commit today. |

## Versions, engines, peers

- `@playwright/test` 1.63.0 was published 2026-09-04T22:44Z; dist-tags `latest` 1.63.0, `next`
  1.64.0-alpha-2026-09-11. `engines.node >=20`; dependency `playwright 1.63.0`, which depends on
  `playwright-core 1.63.0`; `@playwright/test/index.d.ts` is `export * from 'playwright/test'`. None of
  the three has install scripts, so `bun install --frozen-lockfile --ignore-scripts` in
  `.github/actions/setup-js` needs no change. Sources: `npm view @playwright/test`,
  `node_modules/@playwright/test/package.json`, `node_modules/playwright/package.json`.
- System requirements: Node "22.x, 24.x or 26.x", Linux "Debian 12 / 13, Ubuntu 22.04 / 24.04 / 26.04",
  macOS 14 or later; `ubuntu-latest` is Ubuntu 24.04 today; 1.63 ended Ubuntu 20.04 support.
  Sources: https://playwright.dev/docs/intro, https://github.com/actions/runner-images (README),
  https://playwright.dev/docs/release-notes.
- 1.63.0 (2026-09-04): Chromium 153.0.8010.12, Firefox 155.0, WebKit 26.6; test `lock`; `page.frameLocator()`
  without a selector ("search in any frame of the subtree"); `locator.visible()`, "the recommended
  replacement for the `:visible` CSS pseudo-class". Source: https://github.com/microsoft/playwright/releases/tag/v1.63.0.
- `@axe-core/playwright` 4.13.0 was published 2026-08-11T17:07Z (tag `v4.13.0`, commit `70dca949`);
  peer `playwright-core >= 1.0.0`, dependency `axe-core ~4.13.0`, `exports` with `types`, `import`
  (`dist/index.mjs`) and `require`; Deque's devDependency is `@playwright/test ^1.60.0`. README: the
  package "does not follow Semantic Versioning" but "uses the major and minor version (but not patch
  version) of axe-core". Changelog 4.13.0 (2026-08-10): "update axe-core to v4.13.0". Sources:
  `npm view @axe-core/playwright`, `node_modules/@axe-core/playwright/package.json` and `README.md`,
  https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/CHANGELOG.md.
- axe-core 4.13.0 (2026-08-05) adds Element Internals support, `aria-actions`, deprecated ARIA
  attributes as needs review, `sectionheader` and `sectionfooter` roles, ten false positive fixes;
  "This release is one of the bigger changes we've done in a few years, so likely issue numbers are
  going to change". Tags in the bundle: `wcag2a`, `wcag2aa`, `wcag2aaa`, `wcag21a`, `wcag21aa`,
  `wcag22aa`, `best-practice`, `ACT`, `experimental`; by default axe runs "all rules except for rules
  with the 'experimental' tag". The `target-size` rule (2.2 AA) reads "All touch targets must be 24px
  large, or leave sufficient space", so the 44 px rule in QUALITY.md still needs the custom helper.
  Sources: https://github.com/dequelabs/axe-core/releases/tag/v4.13.0,
  https://github.com/dequelabs/axe-core/blob/develop/doc/API.md, `node_modules/axe-core/axe.js`.

## Browsers, Bun and CI

- Browser install: `npx playwright install --with-deps chromium` combines `install` and
  `install-deps` ("useful for CI environments"); only npx forms are documented. Linux cache
  `~/.cache/ms-playwright`, macOS `~/Library/Caches/ms-playwright`, `PLAYWRIGHT_BROWSERS_PATH`
  relocates it; "every time you update Playwright, you might need to re-run the `install` CLI
  command". 1.63.0 fetches Chromium build 1243 (Chrome for Testing 153.0.8010.12), the headless shell
  1243 and ffmpeg 1011; `--only-shell` skips the full Chromium. Sources:
  https://playwright.dev/docs/browsers, `bunx playwright install --dry-run chromium`.
- Bun runs the CLI under Node: `cli.js` starts `#!/usr/bin/env node`, and "By default, Bun respects
  shebangs. If an executable is marked with `#!/usr/bin/env node`, Bun spins up a `node` process to
  execute the file"; `--bun` overrides. Verified: `bunx playwright --version` and `bun run e2e`
  (script `playwright test --list`) run on Node v22.22.1 (a probe binary printed the runtime), `bunx
  --bun` on Bun 1.4.2. So `bunx playwright install --with-deps chromium` and `bun run --filter @oy/web
  e2e` work and need Node 22 on `PATH`, like `astro` and `vitest`. Sources:
  https://bun.com/docs/cli/bunx, https://bun.com/docs/cli/run, the scratch install.
- Bun as runtime is unsupported upstream: issues #27139 and #38121 (2026-05-12) closed "not planned"
  ("As of today Bun is not Node.js compatible"). PR #38599 (merged 2025-12-19, in 1.58.0) skips the ESM
  loader under Bun and `bunx --bun playwright test --list` did work here; oven-sh/bun #28609 (open)
  records the pre 1.58 failure. Never add `--bun`. Sources: https://github.com/microsoft/playwright/issues/38121,
  https://github.com/microsoft/playwright/pull/38599, https://github.com/oven-sh/bun/issues/28609.
- Official GitHub Actions job: `actions/checkout@v6`, `actions/setup-node@v6` (`lts/*`), `npm ci`,
  `npx playwright install --with-deps`, `npx playwright test`, then `actions/upload-artifact@v5` with
  `if: ${{ !cancelled() }}`, `path: playwright-report/`, `retention-days: 30`. Container variant:
  `container.image: mcr.microsoft.com/playwright:v1.63.0-noble`, `options: --user 1001`, no install
  step; "always pin your Docker image to a specific version". "Caching browser binaries is not
  recommended, since the amount of time it takes to restore the cache is comparable to the time it
  takes to download the binaries. Especially under Linux, operating system dependencies need to be
  installed, which are not cacheable." Sources: https://playwright.dev/docs/ci, https://playwright.dev/docs/docker.
- `CI=true` alone changes only the default reporter (`process.env.CI ? "dot" : "list"`,
  `lib/common/index.js` line 700). The docs' CI knobs are explicit: `forbidOnly: !!process.env.CI`,
  `retries: process.env.CI ? 2 : 0`, `workers: process.env.CI ? 1 : undefined`, `use.trace:
  'on-first-retry'`. Sources: `node_modules/playwright/lib/common/index.js`,
  https://playwright.dev/docs/test-configuration.
- Reporters: `list`, `line`, `dot`, `html`, `blob`, `json`, `junit`, `github` ("provides automatic
  failure annotations when running in GitHub actions"); html `open` defaults to `'on-failure'`;
  `reporter: [['github'], ['html', { open: 'never' }]]` for CI. Source: https://playwright.dev/docs/test-reporters.

## `playwright.config.ts` essentials

- Reference shape: `testDir: 'tests'`, `fullyParallel: true`, `forbidOnly: !!process.env.CI`,
  `retries: process.env.CI ? 2 : 0`, `workers: process.env.CI ? 1 : undefined`, `reporter: 'html'`,
  `use: { baseURL, trace: 'on-first-retry' }`, `projects: [{ name: 'chromium', use: {
  ...devices['Desktop Chrome'] } }]`, `webServer: { command: 'npm run start', url:
  'http://localhost:3000', reuseExistingServer: !process.env.CI }`. `testMatch` default
  `**/*.@(spec|test).?(c|m)[jt]s?(x)` under `testDir`; `testIgnore` for exclusions.
  Sources: https://playwright.dev/docs/test-configuration, `node_modules/playwright/types/test.d.ts`.
- Timeouts: test 30 000 ms (`timeout`), expect 5 000 ms (`expect: { timeout: 10_000 }` or per call
  `{ timeout }`), action and navigation none (`use.actionTimeout`, `use.navigationTimeout`),
  `globalTimeout` none, `test.slow()` triples. Source: https://playwright.dev/docs/test-timeouts.
- `webServer` (`TestConfigWebServer`): `command`, `url` ("expected to return a 2xx, 3xx, 400, 401,
  402, or 403 status code"), `port` (deprecated; both set throws), `timeout` default 60 s,
  `reuseExistingServer` ("re-use an existing server on the `port` or `url`", docs use
  `!process.env.CI`), `cwd`, `env`, `ignoreHTTPSErrors`, `stdout`, `stderr`, `gracefulShutdown`,
  `name`, `wait`; an array starts several. Sources: https://playwright.dev/docs/test-webserver,
  `test.d.ts` lines 10979 to 11072, `node_modules/playwright/lib/runner/index.js` line 1004.
- The command cannot be `astro preview`: `@astrojs/vercel` 11.0.10 declares no `previewEntrypoint`
  and Astro 7.3.1 throws "[preview] The @astrojs/vercel adapter does not support the preview
  command." Use `astro dev` (default port 4321) or `vercel dev`. Sources:
  `node_modules/astro/dist/core/preview/index.js` line 50, `node_modules/@astrojs/vercel/dist/index.js`,
  https://docs.astro.build/en/reference/cli-reference/, https://docs.astro.build/en/reference/adapter-reference/.
- Projects: "a logical group of tests running with the same configuration", each with `name` and
  its own `use`; `--project=chromium` runs one. Source: https://playwright.dev/docs/test-projects.
- Device facts from the shipped descriptors (207 entries): `Desktop Chrome` is 1280x720, scale 1.
  `iPhone 13` is 390x664, scale 3, `isMobile`, `hasTouch`, `defaultBrowserType: 'webkit'`, so not a
  375 viewport. At 375 wide: `iPhone 8` and `iPhone SE (3rd gen)` 375x667, `iPhone 13 Mini` 375x629,
  all WebKit. The `browserName` fixture defaults to `defaultBrowserType` (`lib/index.js` line 188), so
  spreading an iPhone descriptor into a project moves it to WebKit, which a chromium only install
  lacks: add `browserName: 'chromium'` after the spread, or set `viewport: { width: 375, height: 667
  }, isMobile: true, hasTouch: true, deviceScaleFactor: 2` directly. Desktop: `{ ...devices['Desktop
  Chrome'], viewport: { width: 1440, height: 900 } }` (later keys win). Sources:
  `require('playwright').devices`, `node_modules/playwright/lib/index.js`, https://playwright.dev/docs/emulation.
- `testIdAttribute`: "`data-testid` is used by default"; `use: { testIdAttribute: 'data-pw' }` or a
  comma separated list; the locators guide ranks test ids last, after `getByRole`, `getByText`,
  `getByLabel`. Sources: `test.d.ts` lines 7891 to 7924, https://playwright.dev/docs/locators.
- `test.use` inside a file may change `colorScheme`, `forcedColors`, `reducedMotion`, `contrast`,
  `screen`, `userAgent`, `viewport` and `testIdAttribute` between tests without a fresh context;
  "Changing any other option ... silently forces a fresh context". Source: `test.d.ts` line 7110.

## Running against the Vercel preview instead of a local server

- `PLAYWRIGHT_TEST_BASE_URL` is built in: the `baseURL` fixture's default is
  `process.env.PLAYWRIGHT_TEST_BASE_URL` (`lib/index.js` line 260) and a config `use.baseURL` wins over
  it; the runner exports the variable itself only for a `port` based `webServer`, not a `url` one
  (`runner/index.js` lines 1000 to 1012). So: `use.baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL ??
  'http://localhost:4321'` and `webServer: process.env.PLAYWRIGHT_TEST_BASE_URL ? undefined : {
  command: 'bun run dev', url: 'http://localhost:4321', reuseExistingServer: !process.env.CI, timeout:
  120_000 }`. Docs "On deployment" job: `on: deployment_status`, `if:
  github.event.deployment_status.state == 'success'`, env `PLAYWRIGHT_TEST_BASE_URL: ${{
  github.event.deployment_status.target_url }}`; "Services like Vercel use this pattern".
  Sources: `node_modules/playwright/lib/index.js`, `node_modules/playwright/lib/runner/index.js`,
  https://playwright.dev/docs/ci.
- Vercel for GitHub "uses the deployment API"; "By default, Vercel notifies GitHub of deployments
  using the `deployment_status` webhook event" (a project toggle disables it) and also sends
  `repository_dispatch` events (`vercel.deployment.success`, `.ready`, `.error`, `.failed` and others)
  whose `client_payload` carries `url`, `environment` and `git.sha`; Vercel encourages "migrating to
  `repository_dispatch` events", its diff swaps `github.event.deployment_status.environment_url` for
  `github.event.client_payload.url`, and the KB checks out `ref: ${{ github.event.client_payload.git.sha }}`.
  GitHub: `repository_dispatch` "will only trigger a workflow run if the workflow file exists on the
  default branch" with `GITHUB_SHA` "Last commit on default branch"; `deployment_status` `GITHUB_SHA`
  is "Commit to be deployed" and `inactive` never triggers. Sources: https://vercel.com/docs/git/vercel-for-github,
  https://vercel.com/kb/guide/how-can-i-run-end-to-end-tests-after-my-vercel-preview-deployment,
  https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows.
- Vercel Authentication: "Protection Bypass for Automation" issues a per project secret, exposed to
  deployments as `VERCEL_AUTOMATION_BYPASS_SECRET`; send header `x-vercel-protection-bypass:
  <secret>` (recommended over the query parameter) plus `x-vercel-set-bypass-cookie: true`
  (`samesitenone` inside an iframe) so follow up requests carry a cookie. Vercel's Playwright example
  puts both in `use.extraHTTPHeaders` and throws at config load when the secret is missing;
  regenerating it "will invalidate previous deployments" until redeploy. Source:
  https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation.

## Test APIs the Phase 3 checks need

- Reduced motion: `page.emulateMedia({ reducedMotion: 'reduce' })` ("supported values are `'reduce'`,
  `'no-preference'`. Passing `null` disables reduced motion emulation"; also `colorScheme`,
  `contrast`, `forcedColors`, `media`) or the context option `use: { reducedMotion: 'reduce' }`
  ("Defaults to `'no-preference'`"). Sources: `node_modules/playwright-core/types/types.d.ts` lines
  2782 to 2813 and 26037 to 26041, https://playwright.dev/docs/emulation.
- Blocking the Zeffy embed: `page.route(url, handler, { times? })` with a glob, RegExp, `URLPattern`
  or predicate; `route.abort()` (docs: `page.route('**/*.{png,jpg,jpeg}', route => route.abort())`
  and by `route.request().resourceType()`); register before `page.goto` ("Mock the api call before
  navigating"); glob `*` stops at `/`, `**` does not; `browserContext.route()` also covers popups.
  Sources: `types.d.ts` line 4476, https://playwright.dev/docs/network, https://playwright.dev/docs/mock.
- Focus and keys: `locator.focus()` "Calls focus on the matching element"; `page.keyboard.press(key)`
  with `Tab`, `Escape`, `Enter`, `ArrowDown` and shortcuts such as `Shift+Tab`; `locator.press` is
  the locator first form. Sources: `types.d.ts` lines 13470 to 13504 and 15559 to 15562.
- Assertions: `toBeFocused()` "Ensures the Locator points to a focused DOM node"; `toBeVisible()`;
  `toHaveAttribute(name, value | RegExp)` and `toHaveAttribute(name)` (the gala link:
  `('target', '_blank')`, `('rel', /noopener/)`); `toHaveCount(n)` "Ensures the Locator resolves to an
  exact number of DOM nodes", so `expect(page.locator('dialog[open]')).toHaveCount(0)` after `goto`
  is the nothing opens on load check and `toHaveCount(1)` with `#give`. Each retries for
  `expect.timeout` or a per call `timeout`. Sources: `test.d.ts` lines 9228 to 9240, 9346, 9598 to 9717.
- Geometry and styles: `locator.boundingBox()` "returns the bounding box of the element matching the
  locator, or `null` if the element is not visible", viewport relative (x or y may go negative after
  scrolling), so the 44 px check iterates `await page.locator('a, button, input, summary').all()` and
  asserts `width` and `height` of each non null box. `locator.evaluate(pageFunction, arg?, {
  timeout?, signal?, exposeFunctions? })` runs in the page: `locator.evaluate(el =>
  getComputedStyle(el).color)` feeds the contrast helper. Sources: `types.d.ts` lines 14650 to 14676
  and 14274.

## `@axe-core/playwright` API and the Playwright guide

- Shipped `index.d.ts`: `new AxeBuilder({ page, axeSource? })`, `include(selector:
  SerialFrameSelector)`, `exclude(selector)`, `options(RunOptions)`, `withRules(rules)`,
  `withTags(tags: string | string[])`, `disableRules(rules)`, `setLegacyMode(legacyMode?)`, all
  returning `this`, and `analyze(): Promise<AxeResults>`; exported as `AxeBuilder` and as default.
  README: "arrays with more than one index when passing multiple CSS selectors are not currently
  supported" for `include` and `exclude` (chain calls); `options()` "Will override any other
  configured options. including calls to `AxeBuilder#withRules()` and `AxeBuilder#withTags()`"; it
  "automatically injects into all frames"; `setLegacyMode` "is a last resort" and disables cross
  origin frame testing. Sources: `node_modules/@axe-core/playwright/dist/index.d.ts` and `README.md`.
- Playwright's guide: `import AxeBuilder from '@axe-core/playwright'`; `const results = await new
  AxeBuilder({ page }).analyze(); expect(results.violations).toEqual([]);` WCAG A and AA:
  `.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])`. A dialog: open it, `await
  page.locator('#navigation-menu-flyout').waitFor()`, then `.include('#navigation-menu-flyout')`,
  because `analyze()` "will scan the page in its current state when you call it". Known issues:
  `.exclude('#element-with-known-issue')` or `.disableRules(['duplicate-id'])`. Shared setup: a
  fixture `test.extend<{ makeAxeBuilder: () => AxeBuilder }>`; attach results with
  `testInfo.attach('accessibility-scan-results', { body: JSON.stringify(results, null, 2),
  contentType: 'application/json' })`. Violation fields: `id`, `impact` (minor to critical), `tags`,
  `description`, `help`, `helpUrl`, `nodes[]` with `target`, `html`, `failureSummary`. Sources:
  https://playwright.dev/docs/accessibility-testing, https://github.com/dequelabs/axe-core/blob/develop/doc/API.md.

## Vitest and Playwright in one package

- Defaults overlap: Vitest 4.1.11 `include` is `**/*.{test,spec}.?(c|m)[jt]s?(x)` with `exclude`
  `**/node_modules/**`, `**/.git/**`; Playwright's `testMatch` is `**/*.@(spec|test).?(c|m)[jt]s?(x)`
  under `testDir`. The repo is already scoped: `packages/web/vitest.config.ts` includes only
  `src/**/*.test.ts`, the root config lists `projects` ("Vitest does not treat the root
  `vitest.config` file as a project unless it is explicitly specified") and projects "do not inherit
  any options from the root config"; Playwright with `testDir: './e2e'` never reaches `src/`. A spec
  loaded by the wrong runner fails with "Playwright Test did not expect test() to be called here."
  Import `test` and `expect` from `@playwright/test` only under `e2e/`. Sources:
  `node_modules/vitest/dist/*` (`defaultInclude`, `defaultExclude`), https://vitest.dev/guide/projects,
  `node_modules/playwright/lib/common/index.js` line 2225, https://github.com/microsoft/playwright/issues/31348.

## Repo fit

- Node 22.22.1 satisfies `>=20`; Bun 1.4.2 installs both exact pins with no peer warning; the `e2e`
  script becomes `playwright test` (Node under `bun run`), and CI adds one step after `setup-js`:
  `bunx playwright install --with-deps chromium` (Ubuntu 24.04 is supported). Two Chromium projects:
  desktop 1440x900 from `Desktop Chrome`, mobile 375x667 with `browserName: 'chromium'` after any
  iPhone spread. Against the preview the job needs `VERCEL_AUTOMATION_BYPASS_SECRET` as a repository
  secret (absent on fork PRs, like `CHROMATIC_PROJECT_TOKEN`) and an event carrying the URL:
  `deployment_status` (on by default, what Playwright's docs show) or `repository_dispatch: types:
  [vercel.deployment.success]` (Vercel's recommendation; main branch workflow file only; checkout by
  `client_payload.git.sha`). The `pull_request` jobs in `ci.yml` never learn the preview URL alone.

## Open questions for the session

- Which trigger: `deployment_status` in `ci.yml` style, or an `e2e.yml` on `repository_dispatch` that
  only fires once merged to `main`; and whether a `pull_request` fallback runs against `astro dev`
  through `webServer` when no preview URL or secret is present (no route caching, no Vercel runtime;
  `vercel dev` as the local server is unverified).
- `isMobile: true` on Chromium versus a bare 375 viewport for the touch target and overlay checks,
  and whether the 44 px helper (custom, axe checks 24 px) reads `boundingBox` or
  `getBoundingClientRect` through `evaluate`.
- `tsconfig` and Biome coverage for `packages/web/e2e` (not read here), and `.spec.ts` versus
  `.test.ts` for e2e files given the Vitest globs above. WebKit stays uninstalled; a future Safari
  project needs `playwright install webkit` in CI.
