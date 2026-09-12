import { defineConfig, devices } from '@playwright/test';

// Playwright against the dev server (the Vercel adapter has no preview command) or against a
// deployed URL when PLAYWRIGHT_TEST_BASE_URL is set. Two projects: desktop Chromium at 1440 and a
// 375 wide mobile Chromium (the iPhone descriptors default to WebKit, which CI does not install).
// Facts and sources: docs/research/phase-3-playwright-and-axe.md.
const deployed = process.env.PLAYWRIGHT_TEST_BASE_URL;
const baseURL = deployed ?? 'http://localhost:4321';

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
        command: 'bun run dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
