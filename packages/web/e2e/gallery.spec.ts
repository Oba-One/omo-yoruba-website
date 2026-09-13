import { ALBUM_YEAR_PENDING, pendingWhat, presenceWhat } from '@oy/content/pending';
import { expect, test } from '@playwright/test';
import {
  axeViolations,
  bodyOption,
  expectEnquiryRoundTrip,
  expectNoMockWhileOwed,
  goldSharingAView,
  PLACEHOLDER_PROJECT,
  settle,
} from './helpers';

// The gallery in the prototype's order (ROUTES section 4, ADR 0039): the slim header, the albums in the mosaic
// newest year first (or the soon sentence), photography credit and permissions. CI runs with a placeholder
// project, where every read answers null and the albums are the Pending line. None of the prototype's inventions
// (the consent rows, the soon sentence's delivery, the camp's college, the old inbox) stands in.

const CONSENT_PENDING = pendingWhat('galleryPage', 'creditsAndConsent');
const INBOX_PENDING = pendingWhat('siteSettings', 'generalEmail');

test.describe('the gallery', () => {
  test('carries its blocks in order, one h1, the options on the body and nothing open', async ({
    page,
  }) => {
    await page.goto('/gallery');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    const order = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main > *')).map((el) => el.id),
    );
    expect(order).toEqual(['top', 'albums', 'credit']);
    expect(await bodyOption(page, 'open')).toMatch(/^(viewer|grid)$/);
    expect(await bodyOption(page, 'captions')).toMatch(/^(always|hover)$/);
    expect(await bodyOption(page, 'state')).toMatch(/^(built|soon)$/);
    // No filters: the gallery is one mosaic.
    await expect(page.locator('main select, main [role="tablist"], main .oy-chips')).toHaveCount(0);
  });

  test('shows the albums newest year first, each tile one link with its line, or the Pending line', async ({
    page,
  }) => {
    await page.goto('/gallery');
    if ((await bodyOption(page, 'state')) === 'soon') {
      await expect(page.locator('#albums .oy-album-grid')).toHaveCount(0);
      return;
    }
    const tiles = page.locator('#albums a.oy-album');
    if (PLACEHOLDER_PROJECT) {
      await expect(tiles).toHaveCount(0);
      await expect(page.locator('#albums .oy-pend-line')).toContainText(
        presenceWhat('album')?.what ?? '',
      );
      return;
    }
    await expect(tiles.locator('h2')).toHaveText([
      'Odunde 2026',
      'End-of-Year Gala 2025',
      'Summer camp',
    ]);
    await expect(tiles.locator('.oy-album-line')).toHaveText([
      '43 photographs',
      '6 photographs',
      `19 photographs Pending: ${ALBUM_YEAR_PENDING}`,
    ]);
    const open = await bodyOption(page, 'open');
    const hrefs = await tiles.evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')),
    );
    expect(hrefs).toEqual(
      open === 'viewer'
        ? [
            '/gallery/odunde-2026?photo=odunde-2026-kid-playing-with-elder',
            '/gallery/gala-2025?photo=gala-2025-attendees-group-photo',
            '/gallery/summer-camp?photo=community-dance',
          ]
        : ['/gallery/odunde-2026', '/gallery/gala-2025', '/gallery/summer-camp'],
    );
    // The lead's cover is the page's largest paint: fetched at once and first.
    await expect(tiles.first().locator('img')).toHaveAttribute('fetchpriority', 'high');
    // The summer camp has no year the register confirms.
    expect(await page.locator('#albums').innerText()).not.toMatch(/Citrus College|2018|2019/);
  });

  test("opens an album's first photograph from its tile under open: viewer", async ({ page }) => {
    await page.goto('/gallery');
    const tile = page.locator('#albums a.oy-album').first();
    test.skip((await tile.count()) === 0, 'The Studio holds no album with a photograph here.');
    const open = await bodyOption(page, 'open');
    await tile.click();
    await expect(page).toHaveURL(/\/gallery\/odunde-2026/);
    await expect(page.locator('h1')).toHaveText('Odunde 2026');
    if (open === 'viewer') {
      await expect(page.locator('dialog.oy-lightbox')).toHaveAttribute('open', '');
      await expect(page).toHaveURL(/photo=odunde-2026-kid-playing-with-elder/);
    } else {
      await expect(page.locator('dialog[open]')).toHaveCount(0);
    }
  });

  test('closes with photography credit and permissions, the policy and the inbox owed until the Studio holds them', async ({
    page,
  }) => {
    await page.goto('/gallery');
    const section = page.locator('#credit');
    await expect(section.locator('h2')).toHaveText('Photography credit and permissions');
    await expect(section.locator('.oy-fact dt')).toHaveText([
      'Credits',
      'Consent policy',
      'Removal requests',
    ]);
    await expect(section.locator('.oy-fact').first()).toContainText(
      'Given with each album, and with a photograph where it differs.',
    );
    const text = await section.innerText();
    expectNoMockWhileOwed(text, [
      [/Signs at every entrance|written consent at registration/i, CONSENT_PENDING],
      [/info@omoyorubaofsocal\.org/, INBOX_PENDING],
    ]);
    expect(text).not.toMatch(/Many festival sets|omoyorubaofsocal/);
    await expectEnquiryRoundTrip(page, section.locator('a[data-enquiry="contact"]'));
  });

  test('keeps one gold action per screen view', async ({ page }) => {
    await page.goto('/gallery');
    expect(await goldSharingAView(page)).toEqual([]);
  });

  test('is clean for axe with the page settled', async ({ page }) => {
    await page.goto('/gallery');
    await settle(page);
    expect(await axeViolations(page)).toEqual([]);
  });
});
