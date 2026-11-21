import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, type Page, test } from '@playwright/test';

// Labeled captures for a pull request, at 375 and 1280 wide, kept outside the checkout so they survive its
// cleanup (the verify-omo-yoruba skill). Skipped unless OY_EVIDENCE_DIR names where to keep them, so the suite
// and CI never run it. With SANITY_API_HOST set, the photographs load from the fixture API (Sanity's image CDN
// is answered from it), so a capture shows the page as a visitor would see it.
//
//   OY_EVIDENCE_DIR=~/omo-yoruba-evidence/<branch> bun e2e -- e2e/evidence.spec.ts --project desktop
//
// CI's fixture job sets it too and uploads the folder as the `evidence` artifact.

const DIR = process.env.OY_EVIDENCE_DIR;
const FIXTURE_API = process.env.SANITY_API_HOST;
const WIDTHS = [
  { label: '375', width: 375, height: 812 },
  { label: '1280', width: 1280, height: 900 },
] as const;

interface Capture {
  flow: string;
  step: string;
  width: string;
  url: string;
  file: string;
}

const captures: Capture[] = [];

async function capture(page: Page, flow: string, step: string): Promise<void> {
  const original = page.viewportSize();
  for (const { label, width, height } of WIDTHS) {
    await page.setViewportSize({ width, height });
    // Let a layout that changes at the breakpoint settle, and lazy photographs in view load.
    await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => done(null))));
    await page.waitForLoadState('networkidle');
    const file = `${flow}-${step}-${label}.png`;
    await page.screenshot({ path: join(DIR as string, file), fullPage: false });
    captures.push({ flow, step, width: label, url: new URL(page.url()).pathname, file });
  }
  if (original) await page.setViewportSize(original);
}

test.describe('evidence', () => {
  test.skip(!DIR, 'captures run only when OY_EVIDENCE_DIR names where to keep them');
  // Each capture sets its own width, so one project is enough.
  test.skip(({ isMobile }) => isMobile, 'the desktop project takes both widths');

  test.beforeAll(() => mkdirSync(DIR as string, { recursive: true }));
  test.afterAll(() => {
    const manifest = {
      takenAt: new Date().toISOString(),
      data: FIXTURE_API ? `fixture API at ${FIXTURE_API}` : 'the dataset packages/web/.env names',
      engine: 'Chromium (Playwright)',
      captures,
    };
    writeFileSync(join(DIR as string, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  });

  test.beforeEach(async ({ page }) => {
    if (FIXTURE_API) {
      await page.route('https://cdn.sanity.io/images/**', async (route) => {
        const url = new URL(route.request().url());
        const answer = await fetch(`${FIXTURE_API}${url.pathname}`);
        await route.fulfill({
          status: answer.status,
          contentType: answer.headers.get('content-type') ?? 'image/jpeg',
          body: Buffer.from(await answer.arrayBuffer()),
        });
      });
    }
  });

  // The gallery flow (feature map, Gallery): the album mosaic, an album page with its video, then the
  // Lightbox on a photograph.
  test('gallery', async ({ page }) => {
    await page.goto('/gallery');
    await expect(page.locator('#albums a.oy-album').first()).toBeVisible();
    await capture(page, 'gallery', '1-mosaic');

    // The fixture's video sits on Odunde 2026; any other dataset opens its first album.
    const odunde = page.locator('#albums a.oy-album[href^="/gallery/odunde-2026"]');
    await ((await odunde.count()) > 0 ? odunde : page.locator('#albums a.oy-album'))
      .first()
      .click();
    await expect(page.locator('h1')).toHaveCount(1);
    await capture(page, 'gallery', '2-album');

    const video = page.locator('oy-video').first();
    if ((await video.count()) > 0) {
      await video.scrollIntoViewIfNeeded();
      await capture(page, 'gallery', '3-video');
    }

    await page.locator('a[data-photo]').first().click();
    await expect(page.locator('dialog.oy-lightbox[open]')).toBeVisible();
    await capture(page, 'gallery', '4-lightbox');
  });
});
