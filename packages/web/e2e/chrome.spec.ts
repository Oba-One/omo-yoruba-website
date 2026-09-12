import { expect, test } from '@playwright/test';

test.describe('site chrome', () => {
  test('nothing is open on load, the footer carries the trust line, and the router is on', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await expect(page.locator('footer.oy-footer .oy-footer-trust')).toContainText(
      '501(c)(3) nonprofit since 1997 • EIN XX-XXXXXXX • Los Angeles, CA',
    );
    await expect(page.locator('meta[name="astro-view-transitions-enabled"]')).toHaveCount(1);
    await expect(page.locator('html')).not.toHaveAttribute('data-loading', 'true');
    const fadeDuration = await page.evaluate(() =>
      Array.from(document.querySelectorAll('style')).some((style) =>
        style.textContent?.includes('380ms'),
      ),
    );
    expect(fadeDuration).toBe(true);
  });

  test('the cross-fade honours reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const reduced = await page.evaluate(
      () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
    expect(reduced).toBe(true);
    // Astro's own stylesheet switches every view transition animation off under this query.
    const rule = await page.evaluate(() =>
      Array.from(document.styleSheets).some((sheet) => {
        try {
          return Array.from(sheet.cssRules).some(
            (r) =>
              r instanceof CSSMediaRule &&
              r.conditionText.includes('prefers-reduced-motion') &&
              r.cssText.includes('view-transition'),
          );
        } catch {
          return false;
        }
      }),
    );
    expect(rule).toBe(true);
  });

  test('the Events dropdown opens on hover and focus and closes on Escape', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'the links give way to the burger under 880px');
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Events' });
    const festival = page.locator('.oy-nav-drop-menu a', { hasText: 'Ọdúndé Festival' });
    await expect(festival).toBeHidden();
    await trigger.hover();
    await expect(festival).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.mouse.move(0, 400);
    await expect(festival).toBeHidden();
    await trigger.focus();
    await expect(festival).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(festival).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('the mobile menu traps focus, closes on Escape and returns focus to the burger', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'the burger shows under 880px');
    await page.goto('/');
    const burger = page.getByRole('button', { name: 'Open menu' });
    const menu = page.locator('dialog.oy-nav-menu');
    await burger.click();
    await expect(menu).toHaveAttribute('open', '');
    await expect(burger).toHaveAttribute('aria-expanded', 'true');
    // The page behind a modal dialog is inert: focus stays in the menu, or leaves the document
    // for the browser's own chrome (the body in a headless run), never a link behind the scrim.
    for (let step = 0; step < 10; step += 1) {
      await page.keyboard.press('Tab');
      const where = await page.evaluate(() => {
        const active = document.activeElement;
        if (!active || active === document.body) return 'body';
        return document.querySelector('dialog.oy-nav-menu')?.contains(active) ? 'menu' : 'page';
      });
      expect(where).not.toBe('page');
    }
    await page.keyboard.press('Escape');
    await expect(menu).not.toHaveAttribute('open', '');
    await expect(burger).toBeFocused();
    await expect(burger).toHaveAttribute('aria-expanded', 'false');
  });
});
