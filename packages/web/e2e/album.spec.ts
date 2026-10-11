import { photographCount } from '@oy/content/albums';
import { pendingWhat } from '@oy/content/pending';
import { PUBLIC_ROUTES } from '@oy/content/routes';
import { expect, type Page, type Request, test } from '@playwright/test';
import {
  albumToOpen,
  axeViolations,
  goldSharingAView,
  NO_SUCH_ALBUM,
  type OpenableAlbum,
  PLACEHOLDER_PROJECT,
  photoAddress,
  settle,
  swipe,
} from './helpers';

// An album's page and its Lightbox (ROUTES sections 1 and 3, ADR 0037, ADR 0038): the page in the prototype's
// order, the photo address served open and shareable, Back closing the Lightbox and Forward reopening it without
// a new page, focus back on the photograph's tile, and a swipe on touch. The album is whichever the gallery
// lists first with enough photographs to step through, read from the pages themselves (`albumToOpen`): members
// edit `development`, so no title, count or key is named here (review ticket R136). CI runs with a placeholder
// project, where the read fails: the route answers 503 with its Pending form and no Lightbox, which every
// Lightbox spec asserts before it stops. In any other run with no album to open, a spec is skipped by name.

/** The Lightbox specs step as far as the fifth photograph, so the album they open holds at least five. */
const PHOTOGRAPHS_NEEDED = 5;

const dialog = (page: Page) => page.locator('dialog.oy-lightbox');
/** The key of the photograph at this place in the album, counted from one as the Lightbox counts. */
const keyAt = (album: OpenableAlbum, place: number) => album.keys[place - 1] as string;
const photoTile = (page: Page, key: string) => page.locator(`a[data-photo="${key}"]`);
/** The Lightbox's count reads the place of the photograph on screen among the album's. */
const expectPlace = (page: Page, album: OpenableAlbum, place: number) =>
  expect(page.locator('.oy-lb-count')).toHaveText(`${place} of ${album.keys.length}`);

/**
 * Stops a spec that has no album to open. With CI's placeholder project the read fails, so the album route is
 * first held to that: 503, no Lightbox, nothing open. In any other run the gallery lists no album with enough
 * photographs (an empty dataset, small albums, or the albums held, ADR 0043, whose album page
 * `album-page.test.ts` covers), and the spec is skipped by name, never passed.
 */
async function stopWithoutAlbum(page: Page, address = NO_SUCH_ALBUM): Promise<undefined> {
  test.skip(!PLACEHOLDER_PROJECT, 'The gallery lists no album with enough photographs to open.');
  const response = await page.goto(address);
  expect(response?.status()).toBe(503);
  await expect(page.locator('oy-lightbox')).toHaveCount(0);
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  return undefined;
}

/**
 * An album's page with its Lightbox wired: on its own address, or served open on the photograph at `place`.
 * Undefined when there is none to open, once `stopWithoutAlbum` has asserted why.
 */
async function openAlbum(page: Page, place?: number): Promise<OpenableAlbum | undefined> {
  const album = await albumToOpen(page, PHOTOGRAPHS_NEEDED);
  if (!album) return stopWithoutAlbum(page);
  await page.goto(place === undefined ? album.path : photoAddress(album, place));
  await expect(page.locator('oy-lightbox')).toHaveAttribute('data-ready', 'true');
  return album;
}

/** Every page request for the album's own path from now on: a document, or the router's fetch of one. */
function pageRequests(page: Page, album: OpenableAlbum): string[] {
  const seen: string[] = [];
  page.on('request', (request: Request) => {
    const url = new URL(request.url());
    if (
      url.pathname === album.path &&
      ['document', 'fetch', 'xhr'].includes(request.resourceType())
    ) {
      seen.push(request.url());
    }
  });
  return seen;
}

test.describe('an album page', () => {
  test('carries its blocks in order, one h1, its credits and nothing open on its own address', async ({
    page,
  }) => {
    const album = await albumToOpen(page);
    test.skip(!album && !PLACEHOLDER_PROJECT, 'The gallery lists no album to read.');
    const response = await page.goto(album?.path ?? NO_SUCH_ALBUM);
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
    if (!album) {
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
    // The page and the gallery's tile agree on the album: its title and how many photographs it holds.
    await expect(page.locator('h1')).toHaveText(album.title);
    await expect(page.locator('header#top')).toContainText(photographCount(album.photographs));
    await expect(page.locator('.oy-photo-grid a[data-photo]')).toHaveCount(album.photographs);
    expect(new Set(album.keys).size).toBe(album.photographs);
    // Back to the gallery first; an album that belongs to an edition links its event page after it.
    const links = page.locator('.oy-album-intro-links a');
    await expect(links.first()).toHaveText('All albums');
    await expect(links.first()).toHaveAttribute('href', '/gallery');
    if ((await links.count()) > 1) {
      expect(PUBLIC_ROUTES).toContain(await links.nth(1).getAttribute('href'));
    }
    // The album's credit is a name, linking out only to the photographer's own page (ADR 0046), with its chip
    // beside it until the owner confirms it.
    const albumCredit = page.locator('.oy-album-intro .oy-credit-line');
    if ((await albumCredit.count()) > 0) {
      await expect(albumCredit).toHaveText(/^Photographs: \S/);
      if ((await albumCredit.locator('a').count()) > 0) {
        await expect(albumCredit.locator('a')).toHaveAttribute('href', /^https?:\/\//);
      }
    }
    // A tile reads its caption once: an image beside words that say the same stays silent.
    const altAndCaption = await page.locator('.oy-photo-grid a[data-photo]').evaluateAll((links) =>
      links.map((link) => ({
        alt: (link.querySelector('img')?.getAttribute('alt') ?? '').replace(/\s+/g, ' ').trim(),
        caption: (link.querySelector('figcaption')?.textContent ?? '').replace(/\s+/g, ' ').trim(),
      })),
    );
    for (const { alt, caption } of altAndCaption) {
      expect(alt === '' || alt !== caption, caption).toBe(true);
    }
  });

  test('answers 404 for an album the Studio does not hold, and 503 while the Studio cannot be read', async ({
    page,
  }) => {
    const response = await page.goto(NO_SUCH_ALBUM);
    // With the placeholder project no read succeeds, so the page cannot tell a missing album from a failure.
    expect(response?.status()).toBe(PLACEHOLDER_PROJECT ? 503 : 404);
  });

  test('a tile opens the Lightbox on its photograph and writes its address; arrows move and replace it', async ({
    page,
  }) => {
    const album = await openAlbum(page);
    if (!album) return;
    const before = await page.evaluate(() => history.length);
    await photoTile(page, keyAt(album, 2)).click();
    await expect(dialog(page)).toHaveAttribute('open', '');
    await expect(page).toHaveURL(photoAddress(album, 2));
    await expectPlace(page, album, 2);
    await expect(page.getByRole('link', { name: 'Close' })).toBeFocused();
    expect(await page.evaluate(() => history.length)).toBe(before + 1);
    await page.keyboard.press('ArrowRight');
    await expectPlace(page, album, 3);
    await expect(page).toHaveURL(photoAddress(album, 3));
    await page.getByRole('link', { name: 'Previous photo' }).click();
    await expectPlace(page, album, 2);
    // Moving replaces the entry: no step of history per photograph.
    expect(await page.evaluate(() => history.length)).toBe(before + 1);
    // A held modifier belongs to the browser.
    await page.keyboard.press('Shift+ArrowRight');
    await expectPlace(page, album, 2);
  });

  test("keeps focus in the Lightbox when a credit's link has it and the photograph moves (ADR 0046)", async ({
    page,
  }) => {
    const album = await openAlbum(page);
    if (!album) return;
    await photoTile(page, keyAt(album, 1)).click();
    await expect(dialog(page)).toHaveAttribute('open', '');
    // A credit links out only when its photographer has a page, and a photograph may carry its own credit, so
    // the two photographs this visits must both hold a link for focus to stay on.
    const bothLinked = await page
      .locator('.oy-lb-cap > p')
      .evaluateAll((captions) =>
        captions.slice(0, 2).every((caption) => caption.querySelector('.oy-credit-line a')),
      );
    test.skip(!bothLinked, "The album's first two photographs do not both link their credit.");
    // The shown caption's credit link, whichever photograph is on screen.
    const creditLink = page.locator('.oy-lb-cap > p[data-active="true"] .oy-credit-line a');
    await creditLink.focus();
    await page.keyboard.press('ArrowRight');
    await expectPlace(page, album, 2);
    await expect(creditLink).toBeFocused();
    // Focus stayed in the dialog, so the arrows still move it.
    await page.keyboard.press('ArrowLeft');
    await expectPlace(page, album, 1);
    await expect(creditLink).toBeFocused();
  });

  test('Back closes the Lightbox onto the tile of the photograph on screen, Forward reopens it, with no page load', async ({
    page,
  }) => {
    const album = await openAlbum(page);
    if (!album) return;
    await photoTile(page, keyAt(album, 1)).click();
    await page.keyboard.press('ArrowRight');
    await expectPlace(page, album, 2);
    const loads = pageRequests(page, album);
    await page.goBack();
    await expect(dialog(page)).not.toHaveAttribute('open', '');
    await expect(page).toHaveURL(album.path);
    await expect(photoTile(page, keyAt(album, 2))).toBeFocused();
    await page.goForward();
    await expect(dialog(page)).toHaveAttribute('open', '');
    await expectPlace(page, album, 2);
    await expect(page).toHaveURL(photoAddress(album, 2));
    // Neither traverse asked for the page again: no document, and no fetch by the router.
    expect(loads).toEqual([]);
  });

  test('Escape and the dark background close it; closing goes back one entry, so Forward reopens it', async ({
    page,
  }) => {
    const album = await openAlbum(page);
    if (!album) return;
    await photoTile(page, keyAt(album, 4)).click();
    await expect(dialog(page)).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(dialog(page)).not.toHaveAttribute('open', '');
    await expect(page).toHaveURL(album.path);
    await expect(photoTile(page, keyAt(album, 4))).toBeFocused();
    // The photo address is still ahead in history, not replaced: Forward opens it again.
    await page.goForward();
    await expect(dialog(page)).toHaveAttribute('open', '');
    await expectPlace(page, album, 4);
    // The corner of the overlay: no photograph, no control.
    await page.mouse.click(8, 8);
    await expect(dialog(page)).not.toHaveAttribute('open', '');
    await expect(page).toHaveURL(album.path);
  });

  test('a shared photo address loads open; closing keeps the page and Back leaves it', async ({
    page,
  }) => {
    await page.goto('/gallery');
    const album = await openAlbum(page, 5);
    if (!album) return;
    await expect(dialog(page)).toHaveAttribute('open', '');
    expect(await dialog(page).evaluate((el) => el.matches(':modal'))).toBe(true);
    await expectPlace(page, album, 5);
    await page.getByRole('link', { name: 'Close' }).click();
    await expect(dialog(page)).not.toHaveAttribute('open', '');
    await expect(page).toHaveURL(album.path);
    await expect(photoTile(page, keyAt(album, 5))).toBeFocused();
    await page.goBack();
    await expect(page).toHaveURL(/\/gallery$/);
  });

  test('a photo address the album does not hold serves the album with nothing open', async ({
    page,
  }) => {
    const album = await albumToOpen(page);
    await page.goto(`${album?.path ?? NO_SUCH_ALBUM}?photo=a-removed-photograph`);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('is clean for axe with the Lightbox closed and open', async ({ page }) => {
    const album = await albumToOpen(page);
    await page.goto(album?.path ?? NO_SUCH_ALBUM);
    await settle(page);
    expect(await axeViolations(page)).toEqual([]);
    // No album to open: the Pending form or the not-found page stood in for it, and is clean.
    if (!album) return;
    await photoTile(page, keyAt(album, 1)).click();
    await expect(dialog(page)).toHaveAttribute('open', '');
    await settle(page);
    expect(await axeViolations(page)).toEqual([]);
  });

  test('keeps one gold action per screen view', async ({ page }) => {
    const album = await albumToOpen(page);
    await page.goto(album?.path ?? NO_SUCH_ALBUM);
    expect(await goldSharingAView(page)).toEqual([]);
  });
});

test.describe('the Lightbox on touch', () => {
  test('a sideways swipe moves the photograph; a short or mostly vertical one does not', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'Touch runs in the mobile project.');
    const album = await openAlbum(page, 1);
    if (!album) return;
    const stage = page.locator('dialog.oy-lightbox .oy-lb-stage');
    await swipe(stage, -120, 10);
    await expectPlace(page, album, 2);
    await expect(page).toHaveURL(photoAddress(album, 2));
    await swipe(stage, 120, -8);
    await expectPlace(page, album, 1);
    await swipe(stage, -30, 0);
    await expectPlace(page, album, 1);
    await swipe(stage, -60, 140);
    await expectPlace(page, album, 1);
  });
});

test.describe('the Lightbox without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('a photo address serves it open, and its links step through the album and close it', async ({
    page,
  }) => {
    const album = await albumToOpen(page, 2);
    // With the placeholder project's failed read, a photo address opens nothing.
    if (!album) return stopWithoutAlbum(page, `${NO_SUCH_ALBUM}?photo=any-photograph`);
    await page.goto(photoAddress(album, 1));
    await expect(dialog(page)).toHaveAttribute('open', '');
    await expectPlace(page, album, 1);
    await page.getByRole('link', { name: 'Next photo' }).click();
    await expect(page).toHaveURL(photoAddress(album, 2));
    await expectPlace(page, album, 2);
    await page.getByRole('link', { name: 'Close' }).click();
    await expect(page).toHaveURL(album.path);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
  });
});
