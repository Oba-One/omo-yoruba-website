import AxeBuilder from '@axe-core/playwright';
import { ENQUIRY_SPECS, type EnquiryKind } from '@oy/content/enquiry-kinds';
import { pendingWhat } from '@oy/content/pending';
import { expect, test } from '@playwright/test';
import { expectNoMockWhileOwed, settle } from './helpers';

// The Programs hub in the prototype's order (ROUTES section 4), each block present whether the Studio
// holds its content or renders Pending: CI runs with a placeholder project, where every read answers
// null. No cadence, age or program fact the register marks as invented stands in for an owed one.

test.describe('the Programs page', () => {
  test('carries its blocks in order, one h1, the options on the body and nothing open', async ({
    page,
  }) => {
    await page.goto('/programs');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    const order = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main > *')).map((el) => el.id),
    );
    expect(order[0]).toBe('top');
    expect(order[1]).toBe('four');
    expect(order.at(-1)).toBe('take-part');
    expect(await page.locator('body').getAttribute('data-cards')).toMatch(/^(four|three|pairs)$/);
    await expect(page.locator('header#top.oy-phead--slim')).toHaveCount(1);
    // The nav marks Programs as the current page, in its links and in the mobile menu.
    await expect(
      page.locator('.oy-nav a[href="/programs"][aria-current="page"]').first(),
    ).toBeAttached();
  });

  test('draws the cards the option asks for, each with its cadence and ages or their chips', async ({
    page,
  }) => {
    await page.goto('/programs');
    const option = await page.locator('body').getAttribute('data-cards');
    const grid = page.locator('#four .oy-card-grid');
    await expect(grid).toHaveAttribute(
      'data-columns',
      option === 'three' ? '3' : option === 'pairs' ? '2' : '4',
    );
    const cards = grid.locator('[data-program]');
    const count = await cards.count();
    if (count > 0) {
      expect(count).toBeLessThanOrEqual(option === 'three' ? 3 : 4);
      for (const card of await cards.all()) {
        await expect(card.locator('.pg-when > *')).toHaveCount(2);
        await expect(card.locator('h3')).toHaveCount(1);
      }
      // A program with its own page links there; an inline program links to its section here.
      await expect(grid.locator('[data-program="lessons"] a.oy-btn')).toHaveAttribute(
        'href',
        '/programs/yoruba-lessons',
      );
      for (const [slug, section] of [
        ['kids-stem', '#kids'],
        ['cultural-exchange', '#exchange'],
      ]) {
        const link = grid.locator(`[data-program="${slug}"] a.oy-btn`);
        if ((await link.count()) === 1) {
          await expect(link).toHaveAttribute('href', section);
          await expect(link).toContainText('On this page');
        }
      }
    }
    await expect(page.locator('#four .oy-card-grid-note')).toContainText(
      'Each card says who it is for and when it runs',
    );
    // The register's cadences and ages (docs/design/design/19 Mock Content Register) never fill a gap.
    expectNoMockWhileOwed(await page.locator('#four').innerText(), [
      [/4 to 14|16\+|All ages/i, pendingWhat('program', 'ages')],
      [/Saturdays|Monthly|Twice a year/i, pendingWhat('program', 'cadence')],
    ]);
  });

  test('closes with the take-part rows, one gold action, the give row quiet', async ({ page }) => {
    await page.goto('/programs');
    const section = page.locator('#take-part');
    await expect(section.locator('h2')).toHaveText('Take part');
    const rows = section.locator('.oy-takepart > .oy-path');
    if ((await rows.count()) === 0) {
      await expect(section.locator('.oy-takepart .oy-pend-line')).toBeVisible();
      await expect(section.locator('.oy-btn--primary')).toHaveCount(0);
    } else {
      await expect(section.locator('.oy-btn--primary')).toHaveCount(1);
      const give = rows.and(page.locator('[data-way="give"]'));
      if ((await give.count()) === 1) {
        await expect(give.locator('a.oy-btn')).toHaveClass(/oy-btn--quiet/);
      }
      expectNoMockWhileOwed(await section.innerText(), [
        [/classroom helpers|festival hands/i, pendingWhat('programsPage', 'takePart[]')],
      ]);
    }
  });

  test('each take-part button opens its own form and the give row the Give Dialog, focus returning', async ({
    page,
  }) => {
    await page.goto('/programs');
    const section = page.locator('#take-part');
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
    const give = section.locator('.oy-takepart a[data-give]');
    if ((await give.count()) === 1) {
      await give.scrollIntoViewIfNeeded();
      await give.click();
      const giveDialog = page.locator('dialog#give');
      await expect(giveDialog).toHaveAttribute('open', '');
      await page.keyboard.press('Escape');
      await expect(giveDialog).not.toHaveAttribute('open', '');
      await expect(give).toBeFocused();
    }
  });

  test('is clean for axe with the page settled', async ({ page }) => {
    await page.goto('/programs');
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
