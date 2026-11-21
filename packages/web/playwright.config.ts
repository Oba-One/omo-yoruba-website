import { defineConfig, devices } from '@playwright/test';

// Playwright against its own dev server on 4322 (the Vercel adapter has no preview command, and
// a `bun dev` on 4321 keeps its toolbar and stays untouched) or against a deployed URL when
// PLAYWRIGHT_TEST_BASE_URL is set. Two projects: desktop Chromium at 1440 and a 375 wide mobile
// Chromium (the iPhone descriptors default to WebKit, which CI does not install); a third, WebKit
// at 1440, joins when PLAYWRIGHT_WEBKIT is set. Facts and sources:
// docs/research/phase-3-playwright-and-axe.md.
const deployed = process.env.PLAYWRIGHT_TEST_BASE_URL;
const baseURL = deployed ?? 'http://localhost:4322';
// With SANITY_API_HOST set (CI's fixture job, the verify-omo-yoruba skill), the dev server reads the fixture
// dataset from packages/content/scripts/fixture-api.ts, which the runner starts first on that address.
const fixtureApi = process.env.SANITY_API_HOST;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  expect: { timeout: 10_000 },
  use: { baseURL, trace: 'on-first-retry' },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
    // Local only, after `bunx playwright install webkit` from this package: the engine whose persisted
    // elements leave the top layer on a swap (ADR 0041). CI installs Chromium alone.
    ...(process.env.PLAYWRIGHT_WEBKIT === '1'
      ? [
          {
            name: 'webkit',
            use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
          },
        ]
      : []),
  ],
  webServer: deployed
    ? undefined
    : [
        ...(fixtureApi
          ? [
              {
                command: 'bun ../content/scripts/fixture-api.ts',
                env: { ...process.env, FIXTURE_API_PORT: new URL(fixtureApi).port || '80' },
                url: `${fixtureApi}/health`,
                stdout: 'ignore' as const,
                stderr: 'pipe' as const,
                reuseExistingServer: false,
                timeout: 60_000,
              },
            ]
          : []),
        {
          // Node runs Astro directly so the runner's shutdown reaches the server itself. Astro 7
          // backgrounds the dev server when it detects a coding agent (the process then "exits
          // early" and the daemon keeps the port); ASTRO_DEV_BACKGROUND set to anything turns that
          // detection off, so the server stays in the foreground under the runner.
          command: 'node ./node_modules/astro/bin/astro.mjs dev --port 4322',
          // Against the fixture, the dev server holds no Sanity token, even where packages/web/.env has one:
          // the fixture needs none, and no request then carries one.
          env: {
            ...process.env,
            PLAYWRIGHT: '1',
            ASTRO_DEV_BACKGROUND: '0',
            ...(fixtureApi ? { SANITY_API_READ_TOKEN: '', SANITY_API_WRITE_TOKEN: '' } : {}),
          },
          stdout: 'ignore',
          stderr: 'pipe',
          url: baseURL,
          reuseExistingServer: false,
          timeout: 120_000,
        },
      ],
});
