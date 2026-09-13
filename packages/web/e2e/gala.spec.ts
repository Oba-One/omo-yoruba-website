import AxeBuilder from '@axe-core/playwright';
import { ENQUIRY_SPECS, type EnquiryKind } from '@oy/content/enquiry-kinds';
import { expect, type Page, test } from '@playwright/test';

// The End-of-Year Gala page in the prototype's order (ROUTES section 4), each block present whether
// the Studio holds its content or renders Pending: CI runs with a placeholder project, where every
// read answers null. The next gala edition leads (ADR 0024); nothing names a date, price or address
// the Studio does not hold.

const settle = (page: Page) =>
  page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  );

test.describe('the End-of-Year Gala page', () => {
  test('carries its blocks in order, one h1, the options on the body and nothing open', async ({
    page,
  }) => {
    await page.goto('/gala');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    const order = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main > *')).map(
        (el) => el.id || (el.classList.contains('oy-seam') ? 'seam' : el.tagName.toLowerCase()),
      ),
    );
    expect(order.slice(0, 4)).toEqual(['top', 'glance', 'evening', 'seam']);
    expect(order.at(-1)).toBe('take-part');
    const body = page.locator('body');
    await expect(body).toHaveAttribute('data-treatment', /^(formal|warm)$/);
    await expect(body).toHaveAttribute('data-labels', /^(column|none|kicker)$/);
    await expect(page.locator('.oy-nav-drop[data-current="true"]')).toHaveCount(1);
  });

  test('shows the Studio facts or the registry chips, never an invented one', async ({ page }) => {
    await page.goto('/gala');
    for (const label of ['Date', 'Doors', 'Venue', 'Dress', 'Seats from']) {
      await expect(page.locator('#glance b', { hasText: new RegExp(`^${label}$`) })).toHaveCount(1);
    }
    await expect(page.locator('#glance .oy-glance > div')).toHaveCount(5);
    const main = await page.locator('main').innerText();
    expect(main).not.toMatch(
      /5 Dec(ember)? 2026|The Ebell|4400 Wilshire|\$\d|black tie|Dinner served|encouraged|within a working day/i,
    );
    await expect(page.locator('#evening h2')).toHaveText('The evening');
  });

  test('shows the running order the option asks for, or its Pending line', async ({ page }) => {
    await page.goto('/gala');
    const option = await page.locator('body').getAttribute('data-schedule');
    const aside = page.locator('#evening .oy-split-aside');
    if (option === 'hidden') {
      await expect(aside.locator('.oy-schedule')).toHaveCount(0);
    } else {
      const rows = await aside.locator('.oy-sched > li').count();
      if (rows === 0) await expect(aside.locator('.oy-pend-line')).toBeVisible();
      await expect(aside.locator('details')).toHaveCount(0);
    }
  });

  test('closes with the take-part rows, one gold action, the give row quiet', async ({ page }) => {
    await page.goto('/gala');
    const section = page.locator('#take-part');
    await expect(section.locator('h2')).toHaveText('Take part');
    const rows = section.locator('.oy-takepart > .oy-path');
    if ((await rows.count()) === 0) {
      await expect(section.locator('.oy-pend-line')).toBeVisible();
      return;
    }
    await expect(section.locator('.oy-btn--primary')).toHaveCount(1);
    const give = section.locator('.oy-path[data-way="give"] a.oy-btn');
    if ((await give.count()) === 1) await expect(give).toHaveClass(/oy-btn--quiet/);
    const dialog = page.locator('dialog#enquiry');
    for (const trigger of await section.locator('.oy-takepart a[data-enquiry]').all()) {
      const kind = (await trigger.getAttribute('data-enquiry')) as EnquiryKind;
      await trigger.scrollIntoViewIfNeeded();
      await trigger.click();
      await expect(dialog).toHaveAttribute('open', '');
      await expect(page.locator('#enquiry-title')).toHaveText(ENQUIRY_SPECS[kind].title);
      await page.keyboard.press('Escape');
      await expect(dialog).not.toHaveAttribute('open', '');
      await expect(trigger).toBeFocused();
    }
  });

  test('is clean for axe in both treatments with the page settled', async ({ page }) => {
    await page.goto('/gala');
    await settle(page);
    for (const treatment of ['formal', 'warm']) {
      await page.evaluate(
        (value) => document.body.setAttribute('data-treatment', value),
        treatment,
      );
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        results.violations.map((violation) => ({
          id: violation.id,
          nodes: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
        })),
        treatment,
      ).toEqual([]);
    }
  });
});
