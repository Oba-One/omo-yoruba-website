import { ALBUM_YEAR_PENDING, pendingWhat, presenceWhat } from '@oy/content/pending';
import { expect, test } from '@playwright/test';
import {
  albumTiles,
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
// (the consent rows, the soon sentence's delivery, the camp's college) stands in, nor its inbox while the Studio
// holds none. Members edit `development`, so the albums are read from the page and checked for their shape and
// order, never against a list of titles and counts (review ticket R136).

/** The prototype's soon sentence waits on a delivery the dataset already holds. */
const SOON_INVENTION = /delivers the 2026 set|stays out of the navigation/;

const CONSENT_PENDING = pendingWhat('galleryPage', 'creditsAndConsent');
const INBOX_PENDING = pendingWhat('siteSettings', 'generalEmail');
/** The chip a tile's line ends with while its album has no year. */
const YEAR_OWED = ` Pending: ${ALBUM_YEAR_PENDING}`;
/** A tile's line before any chip: the year, unless the title carries it, then the count. */
const YEAR_AND_COUNT = /^(?:(\d{4}) • )?\d+ photographs?$/;
/** Every year a title names. */
const YEARS_IN = /(?<!\d)\d{4}(?!\d)/g;

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
    await expect(page.locator('#albums')).not.toContainText(SOON_INVENTION);
    if ((await bodyOption(page, 'state')) === 'soon') {
      await expect(page.locator('#albums .oy-album-grid')).toHaveCount(0);
      await expect(page.locator('#albums')).toContainText('The albums are being prepared.');
      return;
    }
    const albums = await albumTiles(page);
    // With the placeholder project every read answers null, so nothing is listed.
    if (PLACEHOLDER_PROJECT) expect(albums).toEqual([]);
    if (albums.length === 0) {
      await expect(page.locator('#albums .oy-pend-line')).toContainText(
        presenceWhat('album')?.what ?? '',
      );
      return;
    }
    // Under open: viewer a tile opens its album on the first photograph; under grid, on the album's page.
    const open = await bodyOption(page, 'open');
    const address =
      open === 'viewer' ? /^\/gallery\/[^/?#]+\?photo=[^&#]+$/ : /^\/gallery\/[^/?#]+$/;
    const tiles = albums.map(({ title, line, href }) => {
      expect(title, href).not.toBe('');
      expect(href, title).toMatch(address);
      const owed = line.endsWith(YEAR_OWED);
      const shape = YEAR_AND_COUNT.exec(owed ? line.slice(0, -YEAR_OWED.length) : line);
      expect(shape, `${title}: ${line}`).not.toBeNull();
      const lineYear = shape?.[1];
      const titleYears = title.match(YEARS_IN) ?? [];
      if (owed) {
        // An album that owes its year shows none in its line, nor the college and years the prototype's camp named.
        expect(lineYear, line).toBeUndefined();
        expectNoMockWhileOwed(`${title} ${line}`, [
          [/Citrus College|2018|2019/, ALBUM_YEAR_PENDING],
        ]);
        return { owed, year: undefined };
      }
      // Every other tile shows its year once: in its line, or else in its title.
      if (lineYear) expect(titleYears, title).not.toContain(lineYear);
      else expect(titleYears.length, `${title}: ${line}`).toBeGreaterThan(0);
      // A title that names several years does not say which is the album's, so it sits out the order check.
      const year = lineYear ?? (titleYears.length === 1 ? titleYears[0] : undefined);
      return { owed, year: year === undefined ? undefined : Number(year) };
    });
    // Newest year first, the albums that owe their year after the dated ones.
    const firstOwed = tiles.findIndex((tile) => tile.owed);
    if (firstOwed !== -1) expect(tiles.slice(firstOwed).every((tile) => tile.owed)).toBe(true);
    const years = tiles.flatMap(({ year }) => (year === undefined ? [] : [year]));
    expect(years).toEqual([...years].sort((a, b) => b - a));
    // The lead's cover is the page's largest paint: fetched at once and first.
    await expect(page.locator('#albums a.oy-album').first().locator('img')).toHaveAttribute(
      'fetchpriority',
      'high',
    );
  });

  test('opens an album from its tile, its first photograph under open: viewer; closing shows the album and Back returns', async ({
    page,
  }) => {
    await page.goto('/gallery');
    const [album] = await albumTiles(page);
    if (!album) {
      // No album holds a photograph here (the placeholder project, or state: soon): nothing to open.
      await expect(page.locator('#albums .oy-pend-line, #albums .oy-prose').first()).toBeVisible();
      await expect(page.locator('dialog[open]')).toHaveCount(0);
      return;
    }
    const open = await bodyOption(page, 'open');
    await page.locator('#albums a.oy-album').first().click();
    // The tile's own address: the album's page, or its first photograph under open: viewer.
    await expect(page).toHaveURL(album.href);
    await expect(page.locator('h1')).toHaveText(album.title);
    const lightbox = page.locator('dialog.oy-lightbox');
    if (open === 'viewer') {
      await expect(lightbox).toHaveAttribute('open', '');
      await expect(page.locator('oy-lightbox')).toHaveAttribute('data-ready', 'true');
      // Closing keeps the album page, on its own address, with its photographs behind.
      await page.keyboard.press('Escape');
      await expect(lightbox).not.toHaveAttribute('open', '');
      await expect(page).toHaveURL(album.path);
      await expect(page.locator('.oy-photo-grid a[data-photo]').first()).toBeVisible();
    } else {
      await expect(page.locator('dialog[open]')).toHaveCount(0);
    }
    // Back returns to the gallery: the router's own traverse, which the Lightbox leaves alone.
    await page.goBack();
    await expect(page).toHaveURL(/\/gallery$/);
    await expect(page.locator('#albums a.oy-album').first()).toBeVisible();
    await expect(page.locator('dialog[open]')).toHaveCount(0);
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
    // The policy is the Studio's words or its chip, and removal requests the inbox's link or its chip.
    const [policy, removal] = [
      section.locator('.oy-fact').nth(1),
      section.locator('.oy-fact').nth(2),
    ];
    if ((await policy.locator('.oy-pend').count()) > 0) {
      await expect(policy).toContainText(`Pending: ${CONSENT_PENDING}`);
    } else {
      await expect(policy.locator('dd')).not.toBeEmpty();
    }
    if ((await removal.locator('.oy-pend').count()) > 0) {
      await expect(removal).toContainText(`Pending: ${INBOX_PENDING}`);
    } else {
      await expect(removal.locator('a[href^="mailto:"]')).toHaveCount(1);
    }
    const text = await section.innerText();
    expectNoMockWhileOwed(text, [
      [/Signs at every entrance|written consent at registration/i, CONSENT_PENDING],
      // The prototype's inbox is the organization's own since 9 October 2026: an invention only while one is owed.
      [/omoyorubaofsocal/, INBOX_PENDING],
    ]);
    expect(text).not.toMatch(/Many festival sets/);
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
