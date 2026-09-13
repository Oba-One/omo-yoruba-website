import { ALBUM_CREDIT_PENDING, pendingWhat } from '@oy/content/pending';
import { expect, type Page, type Request, test } from '@playwright/test';
import { axeViolations, goldSharingAView, PLACEHOLDER_PROJECT, settle, swipe } from './helpers';

// An album's page and its Lightbox (ROUTES sections 1 and 3, ADR 0037, ADR 0038): the page in the prototype's
// order, the photo address served open and shareable, Back closing the Lightbox and Forward reopening it without
// a new page, focus back on the photograph's tile, and a swipe on touch. End-of-Year Gala 2025 has six
// photographs in `development`. CI runs with a placeholder project, where the read fails: the route answers 503
// with its Pending form and no Lightbox, which every Lightbox spec asserts before it stops.

const ALBUM = '/gallery/gala-2025';
const KEYS = [
  'gala-2025-attendees-group-photo',
  'gala-2025-three-friends-selfie',
  'gala-2025-attendees-smiling',
  'gala-2025-group-photo',
  'gala-2025-attendees-sitting',
  'gala-2025-attendees-getting-food',
];

const dialog = (page: Page) => page.locator('dialog.oy-lightbox');
const count = (page: Page) => page.locator('.oy-lb-count');
const tile = (page: Page, key: string) => page.locator(`a[data-photo="${key}"]`);

/**
 * The album page with its Lightbox wired. With the placeholder project the read fails: the page answers 503 with
 * nothing to open, which is asserted before the spec stops (false).
 */
async function albumPage(page: Page, address = ALBUM): Promise<boolean> {
  const response = await page.goto(address);
  if (PLACEHOLDER_PROJECT) {
    expect(response?.status()).toBe(503);
    await expect(page.locator('oy-lightbox')).toHaveCount(0);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    return false;
  }
  await expect(page.locator('oy-lightbox')).toHaveAttribute('data-ready', 'true');
  return true;
}

/** Every page request for the album's own path from now on: a document, or the router's fetch of one. */
function pageRequests(page: Page): string[] {
  const seen: string[] = [];
  page.on('request', (request: Request) => {
    const url = new URL(request.url());
    if (url.pathname === ALBUM && ['document', 'fetch', 'xhr'].includes(request.resourceType())) {
      seen.push(request.url());
    }
  });
  return seen;
}

test.describe('an album page', () => {
  test('carries its blocks in order, one h1, the credit owed and nothing open on its own address', async ({
    page,
  }) => {
    const response = await page.goto(ALBUM);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    const order = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main > *')).map((el) => el.id),
    );
    expect(order).toEqual(['top', 'photographs', 'credit']);
    // Photography credit and permissions closes the page in both data modes, the policy and the inbox owed.
    const credit = page.locator('#credit');
    await expect(credit.locator('h2')).toHaveText('Photography credit and permissions');
    await expect(credit.locator('.oy-fact dt')).toHaveText([
      'Credits',
      'Consent policy',
      'Removal requests',
    ]);
    if (PLACEHOLDER_PROJECT) {
      // The read failed: the Pending form, never cached, no Lightbox, no kicker the Studio did not give.
      expect(response?.status()).toBe(503);
      await expect(page.locator('#photographs .oy-pend-line')).toContainText(
        pendingWhat('album', 'photos[]') ?? '',
      );
      await expect(page.locator('oy-lightbox')).toHaveCount(0);
      await expect(page.locator('header#top .oy-kicker')).toHaveCount(0);
      return;
    }
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText('End-of-Year Gala 2025');
    await expect(page.locator('header#top')).toContainText('6 photographs');
    await expect(page.locator('.oy-album-intro-links a')).toHaveText([
      'All albums',
      /End-of-Year Gala/,
    ]);
    await expect(page.locator('.oy-album-intro-links a').last()).toHaveAttribute('href', '/gala');
    await expect(page.locator('.oy-album-intro .oy-credit-line')).toContainText(
      `Photographs: Members and volunteers Pending: ${ALBUM_CREDIT_PENDING}`,
    );
    await expect(page.locator('.oy-photo-grid a[data-photo]')).toHaveCount(6);
    // A tile reads its caption once: the image beside the same words stays silent.
    await expect(tile(page, KEYS[0] as string).locator('img')).toHaveAttribute('alt', '');
  });

  test('answers 404 for an album the Studio does not hold, and 503 while the Studio cannot be read', async ({
    page,
  }) => {
    const response = await page.goto('/gallery/no-such-album');
    // With the placeholder project no read succeeds, so the page cannot tell a missing album from a failure.
    expect(response?.status()).toBe(PLACEHOLDER_PROJECT ? 503 : 404);
  });

  test('a tile opens the Lightbox on its photograph and writes its address; arrows move and replace it', async ({
    page,
  }) => {
    if (!(await albumPage(page))) return;
    const before = await page.evaluate(() => history.length);
    await tile(page, KEYS[1] as string).click();
    await expect(dialog(page)).toHaveAttribute('open', '');
    await expect(page).toHaveURL(`${ALBUM}?photo=${KEYS[1]}`);
    await expect(count(page)).toHaveText('2 of 6');
    await expect(page.getByRole('link', { name: 'Close' })).toBeFocused();
    expect(await page.evaluate(() => history.length)).toBe(before + 1);
    await page.keyboard.press('ArrowRight');
    await expect(count(page)).toHaveText('3 of 6');
    await expect(page).toHaveURL(`${ALBUM}?photo=${KEYS[2]}`);
    await page.getByRole('link', { name: 'Previous photo' }).click();
    await expect(count(page)).toHaveText('2 of 6');
    // Moving replaces the entry: no step of history per photograph.
    expect(await page.evaluate(() => history.length)).toBe(before + 1);
    // A held modifier belongs to the browser.
    await page.keyboard.press('Shift+ArrowRight');
    await expect(count(page)).toHaveText('2 of 6');
  });

  test('Back closes the Lightbox onto the tile of the photograph on screen, Forward reopens it, with no page load', async ({
    page,
  }) => {
    if (!(await albumPage(page))) return;
    await tile(page, KEYS[0] as string).click();
    await page.keyboard.press('ArrowRight');
    await expect(count(page)).toHaveText('2 of 6');
    const loads = pageRequests(page);
    await page.goBack();
    await expect(dialog(page)).not.toHaveAttribute('open', '');
    await expect(page).toHaveURL(ALBUM);
    await expect(tile(page, KEYS[1] as string)).toBeFocused();
    await page.goForward();
    await expect(dialog(page)).toHaveAttribute('open', '');
    await expect(count(page)).toHaveText('2 of 6');
    await expect(page).toHaveURL(`${ALBUM}?photo=${KEYS[1]}`);
    // Neither traverse asked for the page again: no document, and no fetch by the router.
    expect(loads).toEqual([]);
  });

  test('Escape and the dark background close it; closing goes back one entry, so Forward reopens it', async ({
    page,
  }) => {
    if (!(await albumPage(page))) return;
    await tile(page, KEYS[3] as string).click();
    await expect(dialog(page)).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(dialog(page)).not.toHaveAttribute('open', '');
    await expect(page).toHaveURL(ALBUM);
    await expect(tile(page, KEYS[3] as string)).toBeFocused();
    // The photo address is still ahead in history, not replaced: Forward opens it again.
    await page.goForward();
    await expect(dialog(page)).toHaveAttribute('open', '');
    await expect(count(page)).toHaveText('4 of 6');
    // The corner of the overlay: no photograph, no control.
    await page.mouse.click(8, 8);
    await expect(dialog(page)).not.toHaveAttribute('open', '');
    await expect(page).toHaveURL(ALBUM);
  });

  test('a shared photo address loads open; closing keeps the page and Back leaves it', async ({
    page,
  }) => {
    await page.goto('/gallery');
    if (!(await albumPage(page, `${ALBUM}?photo=${KEYS[4]}`))) return;
    await expect(dialog(page)).toHaveAttribute('open', '');
    expect(await dialog(page).evaluate((el) => el.matches(':modal'))).toBe(true);
    await expect(count(page)).toHaveText('5 of 6');
    await page.getByRole('link', { name: 'Close' }).click();
    await expect(dialog(page)).not.toHaveAttribute('open', '');
    await expect(page).toHaveURL(ALBUM);
    await expect(tile(page, KEYS[4] as string)).toBeFocused();
    await page.goBack();
    await expect(page).toHaveURL(/\/gallery$/);
  });

  test('a photo address the album does not hold serves the album with nothing open', async ({
    page,
  }) => {
    await page.goto(`${ALBUM}?photo=a-removed-photograph`);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('is clean for axe with the Lightbox closed and open', async ({ page }) => {
    await page.goto(ALBUM);
    await settle(page);
    expect(await axeViolations(page)).toEqual([]);
    // The placeholder project serves the Pending form, with no Lightbox to open.
    if (PLACEHOLDER_PROJECT) return;
    await tile(page, KEYS[0] as string).click();
    await expect(dialog(page)).toHaveAttribute('open', '');
    await settle(page);
    expect(await axeViolations(page)).toEqual([]);
  });

  test('keeps one gold action per screen view', async ({ page }) => {
    await page.goto(ALBUM);
    expect(await goldSharingAView(page)).toEqual([]);
  });
});

test.describe('the Lightbox on touch', () => {
  test('a sideways swipe moves the photograph; a short or mostly vertical one does not', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'Touch runs in the mobile project.');
    if (!(await albumPage(page, `${ALBUM}?photo=${KEYS[0]}`))) return;
    const stage = page.locator('dialog.oy-lightbox .oy-lb-stage');
    await swipe(stage, -120, 10);
    await expect(count(page)).toHaveText('2 of 6');
    await expect(page).toHaveURL(`${ALBUM}?photo=${KEYS[1]}`);
    await swipe(stage, 120, -8);
    await expect(count(page)).toHaveText('1 of 6');
    await swipe(stage, -30, 0);
    await expect(count(page)).toHaveText('1 of 6');
    await swipe(stage, -60, 140);
    await expect(count(page)).toHaveText('1 of 6');
  });
});

test.describe('the Lightbox without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('a photo address serves it open, and its links step through the album and close it', async ({
    page,
  }) => {
    const response = await page.goto(`${ALBUM}?photo=${KEYS[0]}`);
    if (PLACEHOLDER_PROJECT) {
      expect(response?.status()).toBe(503);
      await expect(page.locator('dialog[open]')).toHaveCount(0);
      return;
    }
    await expect(dialog(page)).toHaveAttribute('open', '');
    await expect(count(page)).toHaveText('1 of 6');
    await page.getByRole('link', { name: 'Next photo' }).click();
    await expect(page).toHaveURL(`${ALBUM}?photo=${KEYS[1]}`);
    await expect(count(page)).toHaveText('2 of 6');
    await page.getByRole('link', { name: 'Close' }).click();
    await expect(page).toHaveURL(ALBUM);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
  });
});
