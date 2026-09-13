import AxeBuilder from '@axe-core/playwright';
import { ENQUIRY_SPECS, type EnquiryKind } from '@oy/content/enquiry-kinds';
import { pendingWhat } from '@oy/content/pending';
import { expect, test } from '@playwright/test';
import { expectNoMockWhileOwed, settle } from './helpers';

// The Odunde Festival page in the prototype's order (ROUTES section 4), each block present whether
// the Studio holds its content or renders Pending: CI runs with a placeholder project, where every
// read answers null. The next festival edition leads (ADR 0024); nothing names a date, price or
// address the Studio does not hold.

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
    const schedule = await page.locator('body').getAttribute('data-schedule');
    const expected = [
      'top',
      'glance',
      'about-festival',
      'zones',
      ...(schedule === 'hidden' ? [] : ['schedule']),
      'plan',
      'take-part',
      'past',
      'partners',
    ];
    expect(order.slice(0, expected.length)).toEqual(expected);
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
    // The prototype's mock facts (docs/design/design/19 Mock Content Register) never fill a gap.
    expectNoMockWhileOwed(await page.locator('main').innerText(), [
      [/12 June 2027/i, pendingWhat('event', 'start', 'festival')],
      [/11am to 7pm/i, pendingWhat('event', 'end', 'festival')],
      [/Free entry/i, pendingWhat('event', 'cost', 'festival')],
      [/43rd Place/i, pendingWhat('event', 'venue.line', 'festival')],
      [/since 2003/i, pendingWhat('festivalPage', 'whatItIs')],
      [/\$150|\$275|\$325/, pendingWhat('event', 'vendorTerms.fees', 'festival')],
      [/within a working day|from \$2,500/i, pendingWhat('festivalPage', 'takePart[]')],
    ]);
    await expect(page.locator('#about-festival h2')).toHaveText('What Odunde is');
  });

  test('draws four zone cards, the named zones first, and names the owed ones', async ({
    page,
  }) => {
    await page.goto('/odunde');
    const layout = await page.locator('body').getAttribute('data-zones');
    const grid = page.locator(`#zones .oy-zones[data-layout="${layout}"]`);
    await expect(grid).toHaveCount(1);
    const cards = grid.locator('article.oy-zone');
    expect(await cards.count()).toBeGreaterThanOrEqual(4);
    const named = await grid.locator('article.oy-zone:not(.oy-zone--pending)').count();
    await expect(grid.locator('article.oy-zone--pending')).toHaveCount(Math.max(0, 4 - named));
    // Each named zone's Yoruba name is a heading with its marks.
    for (const heading of await grid.locator('h3.oy-zone-name').all()) {
      await expect(heading).toHaveAttribute('lang', 'yo');
    }
  });

  test('shows the schedule the option asks for, open or behind its toggle, and the plan facts', async ({
    browser,
  }) => {
    // Without JavaScript: the disclosure opens natively.
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/odunde');
    const option = await page.locator('body').getAttribute('data-schedule');
    const section = page.locator('#schedule');
    if (option === 'hidden') {
      await expect(section).toHaveCount(0);
    } else {
      const details = section.locator('details.oy-schedule');
      if ((await details.count()) === 0) {
        // No rows in the Studio (or CI's placeholder project): the registry's Pending line.
        await expect(section.locator('.oy-pend-line')).toBeVisible();
      } else {
        await expect(details).toHaveJSProperty('open', option === 'shown');
        await details.locator('summary').click();
        await expect(details).toHaveJSProperty('open', option !== 'shown');
      }
    }
    const plan = page.locator('#plan');
    const facts = await plan.locator('.oy-fact').count();
    expect(facts > 0 || (await plan.locator('.oy-pend-line').count()) === 1).toBe(true);
    await context.close();
  });

  test('draws the take-part rows with the lead way in first in the markup and one gold action', async ({
    page,
  }) => {
    await page.goto('/odunde');
    const section = page.locator('#take-part');
    await expect(section.locator('h2')).toHaveText('Take part in Odunde');
    const lead = await page.locator('body').getAttribute('data-takepart');
    const labels = await page.locator('body').getAttribute('data-labels');
    const rows = section.locator('.oy-takepart > .oy-path');
    if ((await rows.count()) === 0) {
      // No rows in the Studio (or CI's placeholder project): the registry's Pending line.
      await expect(section.locator('.oy-takepart .oy-pend-line')).toBeVisible();
      await expect(section.locator('.oy-btn--primary')).toHaveCount(0);
    } else {
      await expect(section.locator('.oy-takepart')).toHaveAttribute('data-labels', labels ?? '');
      const ways = await rows.evaluateAll((els) => els.map((el) => el.getAttribute('data-way')));
      if (lead && ways.includes(lead)) expect(ways[0]).toBe(lead);
      expect(new Set(ways).size).toBe(ways.length);
      await expect(section.locator('.oy-btn--primary')).toHaveCount(1);
      // The vendor row carries the edition's terms or the registry's chip, never an invented fee.
      const vendor = rows.and(page.locator('[data-way="vendor"]'));
      if ((await vendor.count()) === 1) {
        const line = await vendor.locator('.oy-path-body p').innerText();
        expect(
          /Applications close|Decisions by|pending: fees, deadline and permit rules/i.test(line),
        ).toBe(true);
      }
    }
    await expect(section.locator('.oy-handoff a[data-give]')).toHaveCount(1);
  });

  test('each take-part button opens its own form and the handoff the Give Dialog, focus returning', async ({
    page,
  }) => {
    await page.goto('/odunde');
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
    const give = section.locator('.oy-handoff a[data-give]');
    await give.scrollIntoViewIfNeeded();
    await give.click();
    const giveDialog = page.locator('dialog#give');
    await expect(giveDialog).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(giveDialog).not.toHaveAttribute('open', '');
    await expect(give).toBeFocused();
  });

  test('past years show the photographs or the placeholder, the credit and the albums link', async ({
    page,
  }) => {
    await page.goto('/odunde');
    const past = page.locator('#past');
    await expect(past.locator('h2')).toHaveText('Odunde in past years');
    if ((await past.locator('.oy-carousel-slide').count()) === 0) {
      await expect(past.locator('.oy-carousel-stage .oy-ph')).toHaveCount(1);
      await expect(past.locator('.oy-credit-line')).toHaveCount(0);
    } else {
      await expect(past.locator('.oy-credit-line')).toContainText('Photographs:');
      const lead = await past.locator('.oy-sec-intro').innerText();
      expect(/pending: the attendance figure|\d/i.test(lead)).toBe(true);
    }
    await expect(past.getByRole('link', { name: 'All Odunde albums' })).toHaveAttribute(
      'href',
      '/gallery',
    );
  });

  test('partners show their chips or the Pending line, then Donate in gold and Sponsor Odunde', async ({
    page,
  }) => {
    await page.goto('/odunde');
    const partners = page.locator('#partners');
    await expect(partners.locator('h2')).toHaveText('Partners and sponsors of Odunde');
    if ((await partners.locator('.oy-partner').count()) === 0) {
      await expect(partners.locator('.oy-pend-line')).toBeVisible();
    }
    await expect(partners.locator('.oy-btn--primary')).toHaveCount(1);
    await expect(partners.locator('.oy-handoff a.oy-btn--primary[data-give]')).toHaveCount(1);
    await expect(partners.locator('.oy-handoff a[data-enquiry="sponsor"]')).toHaveText(
      'Sponsor Odunde',
    );
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
