import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

// The Odunde Festival page in the prototype's order (ROUTES section 4), each block present whether
// the Studio holds its content or renders Pending: CI runs with a placeholder project, where every
// read answers null. The next festival edition leads (ADR 0024); nothing names a date, price or
// address the Studio does not hold.

const settle = (page: Page) =>
  page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  );

test.describe('the Odunde Festival page', () => {
  test('carries its blocks in order, one h1, the header option on the body and nothing open', async ({
    page,
  }) => {
    await page.goto('/odunde');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    const order = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main > *')).map((el) => el.id),
    );
    expect(order.slice(0, 3)).toEqual(['top', 'glance', 'about-festival']);
    const phead = await page.locator('body').getAttribute('data-phead');
    expect(phead).toMatch(/^(photo|slim)$/);
    await expect(page.locator(`header#top.oy-phead--${phead}`)).toHaveCount(1);
    // The nav marks Events as the current section (the dropdown trigger hides under 880px).
    await expect(page.locator('.oy-nav-drop[data-current="true"]')).toHaveCount(1);
  });

  test('shows the Studio facts or the registry chips, never an invented one', async ({ page }) => {
    await page.goto('/odunde');
    const glance = page.locator('#glance .oy-glance > div');
    const cells = await glance.count();
    expect(cells).toBeGreaterThanOrEqual(4);
    expect(cells).toBeLessThanOrEqual(5);
    for (const label of ['Date', 'Time', 'Where', 'Cost']) {
      await expect(page.locator('#glance b', { hasText: label })).toHaveCount(1);
    }
    const header = await page.locator('header#top').innerText();
    const seeded = header.includes('Odunde Festival');
    expect(seeded || /pending: the page heading/i.test(header)).toBe(true);
    // The prototype's invented facts never reach the page.
    const body = await page.locator('main').innerText();
    expect(body).not.toMatch(/12 June 2027|11am to 7pm|Free entry|43rd Place|since 2003|\$\d/i);
    await expect(page.locator('#about-festival h2')).toHaveText('What Odunde is');
  });

  test('is clean for axe with the page settled', async ({ page }) => {
    await page.goto('/odunde');
    await settle(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
      })),
    ).toEqual([]);
  });
});
