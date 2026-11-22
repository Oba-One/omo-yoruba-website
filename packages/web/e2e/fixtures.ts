import { test as base } from '@playwright/test';

export { expect } from '@playwright/test';

/**
 * The address of the fixture API when the run reads the fixture dataset (CI's `Playwright with fixture data`,
 * the verify-omo-yoruba skill), else undefined.
 */
export const FIXTURE_API = process.env.SANITY_API_HOST;

/**
 * Playwright's `test`, with one automatic addition for fixture runs: the browser context answers Sanity's image
 * CDN from the fixture API, which serves the photograph behind each fixture asset id. Without it every photograph
 * fails to load, and a page whose lazy photographs fail while it scrolls keeps moving under a click. Every spec
 * takes `test` and `expect` from here.
 */
export const test = base.extend<{ fixtureImages: undefined }>({
  fixtureImages: [
    async ({ context }, use) => {
      if (FIXTURE_API) {
        await context.route('https://cdn.sanity.io/images/**', async (route) => {
          const answer = await fetch(`${FIXTURE_API}${new URL(route.request().url()).pathname}`);
          await route.fulfill({
            status: answer.status,
            contentType: answer.headers.get('content-type') ?? 'image/jpeg',
            body: Buffer.from(await answer.arrayBuffer()),
          });
        });
      }
      await use(undefined);
    },
    { auto: true },
  ],
});
