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
    const awards = await page.locator('body').getAttribute('data-awards');
    const past = await page.locator('body').getAttribute('data-past');
    expect(order).toEqual([
      'top',
      'glance',
      'evening',
      'seam',
      'seats',
      'sponsor',
      ...(awards === 'shown' ? ['honorees'] : []),
      ...(past === 'hidden' ? [] : ['past']),
      'take-part',
    ]);
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

  test('seats leave for Eventbrite in a new tab and the table tier opens its form, focus returning', async ({
    page,
  }) => {
    await page.goto('/gala');
    const seats = page.locator('#seats');
    await expect(seats.locator('h2')).toHaveText('Seats and tables');
    const cards = seats.locator('article.oy-tier');
    if ((await cards.count()) === 0) {
      // No tiers for the next gala (or CI's placeholder project): the registry's Pending line.
      await expect(seats.locator('.oy-pend-line')).toContainText(
        'three prices and what each includes',
      );
      return;
    }
    const layout = await page.locator('body').getAttribute('data-tiers');
    await expect(seats.locator('.oy-tiers')).toHaveAttribute('data-layout', layout ?? '');
    expect(await seats.locator('.oy-btn--primary').count()).toBeLessThanOrEqual(1);
    for (const link of await seats.locator('article[data-variant="buyNow"] a.oy-btn').all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
    if ((await page.locator('body').getAttribute('data-emphasis')) === 'tables') {
      const first = seats.locator('.oy-tiers > article').first();
      const hasTable = (await seats.locator('article[data-variant="enquiry"]').count()) > 0;
      if (hasTable) await expect(first).toHaveAttribute('data-variant', 'enquiry');
    }
    const table = seats.locator('article[data-variant="enquiry"] a[data-enquiry="table"]').first();
    if ((await table.count()) === 1) {
      await table.scrollIntoViewIfNeeded();
      await table.click();
      const dialog = page.locator('dialog#enquiry');
      await expect(dialog).toHaveAttribute('open', '');
      await expect(page.locator('#enquiry-title')).toHaveText(ENQUIRY_SPECS.table.title);
      await page.keyboard.press('Escape');
      await expect(dialog).not.toHaveAttribute('open', '');
      await expect(table).toBeFocused();
    }
  });

  test('sponsor levels or their Pending line, one gold Sponsor the Gala, and the impact handoff', async ({
    page,
  }) => {
    await page.goto('/gala');
    const sponsor = page.locator('#sponsor');
    await expect(sponsor.locator('h2')).toHaveText('Sponsor the Gala');
    if ((await sponsor.locator('li.oy-lrow--tier').count()) === 0) {
      await expect(sponsor.locator('.oy-pend-line')).toContainText('level names and amounts');
    }
    const gold = sponsor.locator('.oy-btn--primary');
    await expect(gold).toHaveCount(1);
    await expect(gold).toHaveAttribute('data-enquiry', 'sponsor');
    await expect(sponsor.locator('.oy-handoff a.oy-btn--quiet')).toHaveAttribute('href', '/impact');
  });

  test('honorees only when the option shows them; past galas as the option says', async ({
    page,
  }) => {
    await page.goto('/gala');
    const body = page.locator('body');
    const honorees = page.locator('#honorees');
    if ((await body.getAttribute('data-awards')) === 'shown') {
      await expect(honorees.locator('h2')).toHaveText('Honorees and recognitions');
      const cards = await honorees.locator('article.oy-person').count();
      if (cards === 0) await expect(honorees.locator('.oy-pend-line')).toBeVisible();
    } else {
      await expect(honorees).toHaveCount(0);
    }
    const past = page.locator('#past');
    if ((await body.getAttribute('data-past')) === 'hidden') {
      await expect(past).toHaveCount(0);
      return;
    }
    await expect(past.locator('h2')).toHaveText('Past galas');
    await expect(past.getByRole('link', { name: 'All gala albums' })).toHaveAttribute(
      'href',
      '/gallery',
    );
    await expect(
      past.getByRole('link', { name: /The other half of our year, Odunde/ }),
    ).toHaveAttribute('href', '/odunde');
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
