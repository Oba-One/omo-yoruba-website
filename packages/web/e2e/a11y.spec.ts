import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

const audit = async (page: Page) => {
  // The bottom sheet slides up over 300ms; a half-faded panel is not the contrast to measure.
  // Only finite animations are awaited: the footer's dot field drifts forever.
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  );
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  return results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
  }));
};

test.describe('axe on the layout', () => {
  test('nothing open', async ({ page }) => {
    await page.goto('/');
    expect(await audit(page)).toEqual([]);
  });

  test('with the Enquiry Modal open', async ({ page }) => {
    await page.goto('/');
    await page.locator('.oy-enquiry-card[data-kind="member"] a[data-enquiry]').click();
    await expect(page.locator('dialog#enquiry')).toHaveAttribute('open', '');
    expect(await audit(page)).toEqual([]);
  });

  test('with the Give Dialog open', async ({ page }) => {
    await page.goto('/#give');
    await expect(page.locator('dialog#give')).toHaveAttribute('open', '');
    expect(await audit(page)).toEqual([]);
  });

  test('with the mobile menu open', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'the menu exists under 880px');
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.locator('dialog.oy-nav-menu')).toHaveAttribute('open', '');
    expect(await audit(page)).toEqual([]);
  });
});
