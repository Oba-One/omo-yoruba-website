import { expect, test } from '@playwright/test';

// The seam every later spec relies on: the page renders, carries one h1, and nothing opens on
// load (docs/design/ROUTES-AND-INTERACTIONS.md section 3, shared conventions).
test('the home page renders with one h1 and no dialog open on load', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('dialog[open]')).toHaveCount(0);
});
