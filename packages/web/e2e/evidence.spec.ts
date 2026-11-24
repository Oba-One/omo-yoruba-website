import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Locator, Page } from '@playwright/test';
import { expect, FIXTURE_API, test } from './fixtures';

// Labeled captures for a pull request, at 375 and 1280 wide, kept outside the checkout so they survive its
// cleanup (the verify-omo-yoruba skill). Skipped unless OY_EVIDENCE_DIR names where to keep them, so a plain
// `bun e2e` skips it. With SANITY_API_HOST set, the photographs load from the fixture API (`fixtures.ts`
// answers Sanity's image CDN from it), so a capture shows the page as a visitor would see it.
//
//   OY_EVIDENCE_DIR=~/omo-yoruba-evidence/<branch> bun e2e -- e2e/evidence.spec.ts --project desktop
//
// CI's fixture job sets it too and uploads the folder as the `evidence` artifact.

const DIR = process.env.OY_EVIDENCE_DIR;
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

async function capture(page: Page, flow: string, step: string, target?: Locator): Promise<void> {
  const original = page.viewportSize();
  for (const { label, width, height } of WIDTHS) {
    await page.setViewportSize({ width, height });
    // Let a layout that changes at the breakpoint settle, and lazy photographs in view load.
    await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => done(null))));
    await page.waitForLoadState('networkidle');
    const file = `${flow}-${step}-${label}.png`;
    if (target) await target.screenshot({ path: join(DIR as string, file) });
    else await page.screenshot({ path: join(DIR as string, file), fullPage: false });
    captures.push({ flow, step, width: label, url: new URL(page.url()).pathname, file });
  }
  if (original) await page.setViewportSize(original);
}

test.describe('evidence', () => {
  // Both flows own one manifest, so they share a worker even when the group is retried.
  test.describe.configure({ mode: 'serial' });
  test.skip(!DIR, 'captures run only when OY_EVIDENCE_DIR names where to keep them');

  test.beforeAll(() => mkdirSync(DIR as string, { recursive: true }));
  // Only a run that took captures writes the manifest, so the skipped mobile project cannot empty it.
  test.afterAll(() => {
    if (captures.length === 0) return;
    const manifest = {
      takenAt: new Date().toISOString(),
      data: FIXTURE_API ? `fixture API at ${FIXTURE_API}` : 'the dataset packages/web/.env names',
      engine: 'Chromium (Playwright)',
      captures,
    };
    writeFileSync(join(DIR as string, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  });

  // The gallery flow (feature map, Gallery): the album mosaic, an album page with its video, then the
  // Lightbox on a photograph.
  test('gallery', async ({ page, isMobile }) => {
    // Each capture sets its own width, so the desktop project takes both.
    test.skip(isMobile, 'the desktop project takes both widths');
    await page.goto('/gallery');
    await expect(page.locator('#albums a.oy-album').first()).toBeVisible();
    await capture(page, 'gallery', '1-mosaic');

    // The fixture's video sits on Odunde 2026; any other dataset opens its first album. A tile may carry a
    // photo address (the gallery's open: viewer), which opens the Lightbox on load, so the album is opened at
    // its own address for the album and video captures.
    const odunde = page.locator('#albums a.oy-album[href^="/gallery/odunde-2026"]');
    const tile = ((await odunde.count()) > 0 ? odunde : page.locator('#albums a.oy-album')).first();
    const album = new URL((await tile.getAttribute('href')) as string, page.url()).pathname;
    await page.goto(album);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
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

  test('Odunde participation', async ({ page, isMobile }) => {
    test.skip(isMobile, 'the desktop project takes both widths');
    // Eight captures and three dialog flows share this test's budget.
    test.slow();
    await page.goto('/odunde');
    const participation = page.locator('#participate');
    await expect(participation.locator('.oy-enquiry-card')).toHaveCount(3);
    await capture(page, 'odunde', '1-participation', participation);
    for (const [kind, label] of [
      ['sponsor', 'Become a sponsor'],
      ['volunteer', 'Volunteer'],
      ['vendor', 'Apply as a vendor'],
    ] as const) {
      await participation.getByRole('link', { name: label, exact: true }).click();
      const dialog = page.locator('dialog#enquiry');
      await expect(dialog).toHaveAttribute('open', '');
      await expect(dialog).toHaveAttribute('data-kind', kind);
      await capture(page, 'odunde', `2-${kind}`);
      await page.keyboard.press('Escape');
      await expect(dialog).not.toHaveAttribute('open', '');
    }
  });
});
