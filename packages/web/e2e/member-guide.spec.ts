import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('the guide supports keyboard navigation and loads every screenshot', async ({ page }) => {
  // The trailing slash must resolve the same relative screenshot links as the Studio iframe.
  await page.goto('/member-guide/');
  await expect(page.getByRole('heading', { name: 'Your guide to Studio', level: 1 })).toBeVisible();
  const contents = page.getByRole('navigation', { name: 'Guide contents' });
  await contents.getByRole('link', { name: 'Before you publish', exact: true }).press('Enter');
  await expect(page).toHaveURL(/\/member-guide#before-you-publish$/);
  await expect(
    page.getByRole('heading', { name: 'Before you publish', exact: true }),
  ).toBeInViewport();

  const screenshots = page.locator('article img');
  await expect(screenshots).toHaveCount(8);
  for (const image of await screenshots.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth))
      .toBeGreaterThan(0);
  }
  const largerImage = page.getByRole('link', { name: 'Open the larger image in a new tab' });
  await expect(largerImage).toHaveAttribute('target', '_blank');
  const imageUrl = await largerImage.getAttribute('href');
  const imageResponse = await page.request.get(imageUrl as string);
  expect(imageResponse.ok()).toBe(true);
  expect(imageResponse.headers()['content-type']).toContain('image/jpeg');
});

test('the guide is accessible and fits the viewport', async ({ page }) => {
  await page.goto('/member-guide');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('unknown guide screenshots return 404', async ({ request }) => {
  expect((await request.get('/screenshots/member-guide/unknown.jpg')).status()).toBe(404);
});
