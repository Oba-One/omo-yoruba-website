import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

// The past years carousel (docs/research/phase-5-photo-carousel-custom-element.md, ADR 0027): an
// inline custom element that upgrades the server-rendered first photograph. CI builds with a
// placeholder project and no photographs, so every spec skips when fewer than two render.

const ROUTES = ['/odunde', '/gala'];
const NO_PHOTOGRAPHS = 'fewer than two photographs in the Studio (the CI placeholder project)';

async function carouselOn(page: Page, route: string) {
  await page.goto(route);
  const host = page.locator('oy-photo-carousel');
  test.skip((await host.count()) === 0, NO_PHOTOGRAPHS);
  await host.scrollIntoViewIfNeeded();
  await expect(host).toHaveAttribute('data-ready', 'true');
  return host;
}

const tab = (host: ReturnType<Page['locator']>, n: number) =>
  host.getByRole('tab', { name: `Photo ${n}`, exact: true });

for (const route of ROUTES) {
  test.describe(`the past photographs on ${route}`, () => {
    test('previous and next move the photograph and the count, wrap, and keep focus', async ({
      page,
    }) => {
      const host = await carouselOn(page, route);
      const total = await host.getByRole('tab').count();
      await expect(host.getByRole('tabpanel')).toHaveCount(1);
      const next = host.getByRole('button', { name: 'Next photo' });
      await next.click();
      await expect(tab(host, 2)).toHaveAttribute('aria-selected', 'true');
      await expect(host.locator('.oy-carousel-count')).toHaveText(`2 of ${total}`);
      await expect(host.getByRole('tabpanel')).toHaveCount(1);
      await expect(next).toBeFocused();
      const previous = host.getByRole('button', { name: 'Previous photo' });
      await previous.click();
      await previous.click();
      await expect(tab(host, total)).toHaveAttribute('aria-selected', 'true');
      await expect(host.locator('.oy-carousel-count')).toHaveText(`${total} of ${total}`);
    });

    test('the dots are one tab stop that arrows, Home and End move through', async ({ page }) => {
      const host = await carouselOn(page, route);
      const total = await host.getByRole('tab').count();
      await tab(host, 1).focus();
      await page.keyboard.press('ArrowRight');
      await expect(tab(host, 2)).toBeFocused();
      await expect(tab(host, 2)).toHaveAttribute('aria-selected', 'true');
      await expect(host.locator('[role="tab"]:not([tabindex="-1"])')).toHaveCount(1);
      await page.keyboard.press('End');
      await expect(tab(host, total)).toBeFocused();
      await page.keyboard.press('ArrowRight');
      await expect(tab(host, 1)).toBeFocused();
      await expect(tab(host, 1)).toHaveAttribute('aria-selected', 'true');
      // A held modifier belongs to the browser.
      await page.keyboard.press('Shift+ArrowRight');
      await expect(tab(host, 1)).toHaveAttribute('aria-selected', 'true');
      await page.keyboard.press('ArrowLeft');
      await expect(tab(host, total)).toBeFocused();
      await page.keyboard.press('Home');
      await expect(tab(host, 1)).toBeFocused();
    });

    test('nothing rotates on its own', async ({ page }) => {
      await page.clock.install();
      const host = await carouselOn(page, route);
      await page.clock.runFor(60_000);
      await expect(tab(host, 1)).toHaveAttribute('aria-selected', 'true');
      await expect(host.locator('.oy-carousel-count')).toHaveText(/^1 of \d+$/);
    });

    test('the neighbours start loading once the carousel is near, and reduced motion swaps at once', async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const host = await carouselOn(page, route);
      const images = host.locator('.oy-carousel-slide img');
      await expect(images.nth(1)).toHaveJSProperty('loading', 'eager');
      await expect(images.last()).toHaveJSProperty('loading', 'eager');
      const shown = await host.evaluate(async (el) => {
        el.querySelector<HTMLButtonElement>('[data-next]')?.click();
        await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
        return el.querySelectorAll('.oy-carousel-slide:not([hidden])').length;
      });
      expect(shown).toBe(1);
    });

    test('a sideways swipe on touch moves the photograph; a short or mostly vertical one does not', async ({
      page,
      isMobile,
    }) => {
      test.skip(!isMobile, 'Touch runs in the mobile project.');
      const host = await carouselOn(page, route);
      const stage = host.locator('.oy-carousel-stage');
      const total = await host.getByRole('tab').count();
      const swipe = async (dx: number, dy: number) => {
        const box = await stage.boundingBox();
        const x = (box?.x ?? 0) + (box?.width ?? 0) / 2;
        const y = (box?.y ?? 0) + (box?.height ?? 0) / 2;
        const start = [{ identifier: 1, clientX: x, clientY: y }];
        const end = [{ identifier: 1, clientX: x + dx, clientY: y + dy }];
        await stage.dispatchEvent('touchstart', {
          touches: start,
          changedTouches: start,
          targetTouches: start,
        });
        await stage.dispatchEvent('touchend', {
          touches: [],
          changedTouches: end,
          targetTouches: [],
        });
      };
      await swipe(-120, 12);
      await expect(host.locator('.oy-carousel-count')).toHaveText(`2 of ${total}`);
      await swipe(120, -6);
      await expect(host.locator('.oy-carousel-count')).toHaveText(`1 of ${total}`);
      await swipe(-30, 0);
      await swipe(-50, 120);
      await expect(host.locator('.oy-carousel-count')).toHaveText(`1 of ${total}`);
    });

    test('is clean for axe on the second photograph', async ({ page }) => {
      const host = await carouselOn(page, route);
      await host.getByRole('button', { name: 'Next photo' }).click();
      await expect(host.getByRole('tabpanel')).toHaveCount(1);
      const results = await new AxeBuilder({ page })
        .include('#past')
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
}

test('the carousel upgrades after a client-side navigation, and again on a second visit', async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    'the Events dropdown is the desktop path; the mobile menu is covered in chrome',
  );
  await page.goto('/');
  await page.getByRole('button', { name: 'Events' }).hover();
  await page.getByRole('link', { name: 'Ọdúndé Festival' }).click();
  await expect(page).toHaveURL(/\/odunde$/);
  const host = page.locator('oy-photo-carousel');
  test.skip((await host.count()) === 0, NO_PHOTOGRAPHS);
  await expect(host).toHaveAttribute('data-ready', 'true');
  await page
    .getByRole('link', { name: /Omo Yorùbá/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/$/);
  await page.getByRole('button', { name: 'Events' }).hover();
  await page.getByRole('link', { name: 'Ọdúndé Festival' }).click();
  await expect(page.locator('oy-photo-carousel')).toHaveAttribute('data-ready', 'true');
  await page.locator('oy-photo-carousel [data-next]').click();
  await expect(page.locator('oy-photo-carousel .oy-carousel-count')).toHaveText(/^2 of \d+$/);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const route of ROUTES) {
    test(`${route} shows the first photograph and keeps the controls invisible`, async ({
      page,
    }) => {
      await page.goto(route);
      const host = page.locator('oy-photo-carousel');
      test.skip((await host.count()) === 0, NO_PHOTOGRAPHS);
      await expect(host.locator('.oy-carousel-slide:not([hidden])')).toHaveCount(1);
      await host.scrollIntoViewIfNeeded();
      await expect(host.locator('.oy-carousel-slide').first()).toBeVisible();
      await expect(host.locator('[data-next]')).toBeHidden();
      await expect(host.locator('.oy-carousel-dots')).toBeHidden();
      await expect(page.locator('#past a.oy-btn[href="/gallery"]')).toBeVisible();
    });
  }
});
