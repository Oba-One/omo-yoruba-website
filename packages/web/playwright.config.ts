import { defineConfig, devices } from '@playwright/test';

// Playwright against its own dev server on 4322 (the Vercel adapter has no preview command, and
// a `bun dev` on 4321 keeps its toolbar and stays untouched) or against a deployed URL when
// PLAYWRIGHT_TEST_BASE_URL is set. Two projects: desktop Chromium at 1440 and a 375 wide mobile
// Chromium (the iPhone descriptors default to WebKit, which CI does not install). Facts and
// sources: docs/research/phase-3-playwright-and-axe.md.
const deployed = process.env.PLAYWRIGHT_TEST_BASE_URL;
const baseURL = deployed ?? 'http://localhost:4322';

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
  ],
  webServer: deployed
    ? undefined
    : {
        // Node runs Astro directly so the runner's shutdown reaches the server itself. Astro 7
        // backgrounds the dev server when it detects a coding agent (the process then "exits
        // early" and the daemon keeps the port); ASTRO_DEV_BACKGROUND set to anything turns that
        // detection off, so the server stays in the foreground under the runner.
        command: 'node ./node_modules/astro/bin/astro.mjs dev --port 4322',
        env: { ...process.env, PLAYWRIGHT: '1', ASTRO_DEV_BACKGROUND: '0' },
        stdout: 'ignore',
        stderr: 'pipe',
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      },
});
