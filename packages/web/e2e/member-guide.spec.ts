import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('the guide supports keyboard navigation and loads every screenshot', async ({ page }) => {
  // The trailing slash must resolve the same relative screenshot links as the Studio iframe.
  await page.goto('/member-guide/');
  await expect(
    page.getByRole('heading', { name: 'How to update our website', level: 1 }),
  ).toBeVisible();
  const contents = page.getByRole('navigation', { name: 'Guide contents' });
  await contents
    .getByRole('link', { name: 'Check your work and publish', exact: true })
    .press('Enter');
  await expect(page).toHaveURL(/\/member-guide#check-your-work-and-publish$/);
  await expect(
    page.getByRole('heading', { name: 'Check your work and publish', exact: true }),
  ).toBeInViewport();

  const screenshots = page.locator('article img');
  await expect(screenshots).toHaveCount(12);
  for (const image of await screenshots.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth))
      .toBeGreaterThan(0);
    // A screenshot never stands alone: its figure says what it shows.
    await expect(image.locator('xpath=parent::figure/figcaption')).not.toBeEmpty();
  }
  // The relative address the Markdown writes resolves to the file kept beside it.
  const imageUrl = await screenshots.first().evaluate((node: HTMLImageElement) => node.src);
  const imageResponse = await page.request.get(imageUrl);
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

test('the list of tasks stays beside the steps on a wide screen', async ({ page, isMobile }) => {
  test.skip(isMobile, 'a narrow screen keeps the list above the steps');
  await page.goto('/member-guide');
  await page
    .getByRole('heading', { name: 'Words Studio uses', exact: true })
    .scrollIntoViewIfNeeded();
  await expect(page.getByRole('navigation', { name: 'Guide contents' })).toBeInViewport();
});

test('a member can open the guide in its own tab and print the steps alone', async ({ page }) => {
  await page.goto('/member-guide');
  const ownTab = page.getByRole('link', { name: 'open this guide in its own browser tab' });
  await expect(ownTab).toHaveAttribute('href', '/member-guide');
  await expect(ownTab).toHaveAttribute('target', '_blank');

  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('navigation', { name: 'Guide contents' })).toBeHidden();
  await expect(page.getByRole('heading', { name: 'How to update our website' })).toBeVisible();
});

test('unknown guide screenshots return 404', async ({ request }) => {
  expect((await request.get('/screenshots/member-guide/unknown.jpg')).status()).toBe(404);
});
