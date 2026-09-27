import { expect, test } from '@playwright/test';
import { axeViolations, PLACEHOLDER_PROJECT } from './helpers';

// The 404 page (ROUTES section 1, open-work E4): an indigo band in the site chrome, three doors home.
test.describe('the 404 page', () => {
  test('answers an unknown address with 404 inside the chrome, three doors home and one gold', async ({
    page,
  }) => {
    const response = await page.goto('/no-such-page');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText('This page is not here');
    await expect(page.locator('nav.oy-nav')).toBeVisible();
    await expect(page.locator('footer.oy-footer')).toBeVisible();
    await expect(page.locator('main section.oy-not-found.oy-dark')).toBeVisible();
    const doors = page.locator('main .oy-button-row a.oy-btn');
    await expect(doors).toHaveCount(3);
    expect(
      await doors.evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
    ).toEqual(['/', '/get-involved', '/programs']);
    await expect(page.locator('main .oy-btn--primary')).toHaveCount(1);
    expect(await axeViolations(page)).toEqual([]);
  });

  test('fills an album the Studio does not hold', async ({ page }) => {
    // With the placeholder project no read succeeds, so the album page answers 503 instead (album.spec.ts).
    test.skip(PLACEHOLDER_PROJECT, 'the placeholder project cannot tell a missing album');
    const response = await page.goto('/gallery/no-such-album');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveText('This page is not here');
  });
});
