import AxeBuilder from '@axe-core/playwright';
import { ENQUIRY_SPECS, type EnquiryKind } from '@oy/content/enquiry-kinds';
import { pendingWhat } from '@oy/content/pending';
import { expect, test } from '@playwright/test';
import { expectNoMockWhileOwed, goldSharingAView, settle } from './helpers';

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
    const cards = await page.locator('body').getAttribute('data-cards');
    expect(order[0]).toBe('top');
    expect(order[1]).toBe('four');
    expect(order.at(-1)).toBe('take-part');
    // The inline programs follow the cards; `three` takes the fourth program's section with its card.
    const inline = order.slice(2, order.indexOf('take-part')).filter((id) => id !== 'year');
    if (cards === 'three') expect(inline.length).toBeLessThanOrEqual(1);
    else expect(inline).toEqual(['kids', 'exchange']);
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

  test('opens and closes the inline programs with Enter and Space, starting as the option says', async ({
    page,
  }) => {
    await page.goto('/programs');
    const open = (await page.locator('body').getAttribute('data-inline')) === 'expanded';
    for (const id of ['kids', 'exchange']) {
      const details = page.locator(`#${id} .oy-disclosure > details`);
      if ((await details.count()) === 0) continue;
      await expect(details).toHaveJSProperty('open', open);
      const toggle = details.locator('summary');
      await expect(toggle).toContainText(open ? 'Hide details' : 'Show details');
      await toggle.focus();
      await page.keyboard.press('Enter');
      await expect(details).toHaveJSProperty('open', !open);
      await page.keyboard.press(' ');
      await expect(details).toHaveJSProperty('open', open);
    }
  });

  test('keeps the inline programs working without JavaScript, each owed fact named', async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/programs');
    const exchange = page.locator('#exchange');
    if ((await exchange.count()) === 1) {
      const details = exchange.locator('.oy-disclosure > details');
      const before = await details.evaluate((el) => (el as HTMLDetailsElement).open);
      await details.locator('summary').click();
      await expect(details).toHaveJSProperty('open', !before);
      if (!before) await details.locator('summary').click();
      await details.evaluate((el) => {
        (el as HTMLDetailsElement).open = true;
      });
      const facts = exchange.locator('.oy-fact');
      await expect(facts).toHaveCount(3);
      for (const [label, field] of [
        ['Who it is for', 'culturalExchange.eligibility'],
        ['Cadence', 'culturalExchange.cadence'],
        ['How to join', 'culturalExchange.howToJoin'],
      ] as const) {
        const cell = facts.filter({ hasText: label }).locator('dd');
        const value = await cell.innerText();
        const chip = `pending: ${pendingWhat('programsPage', field)}`;
        expect(value.toLowerCase() === chip || !/^pending/i.test(value), label).toBe(true);
      }
      // The register's inventions for the exchange (docs/design/design/19 Mock Content Register).
      expectNoMockWhileOwed(await exchange.innerText(), [
        [/16 and over|16\+/i, pendingWhat('programsPage', 'culturalExchange.eligibility')],
        [
          /twice a year|spring and summer/i,
          pendingWhat('programsPage', 'culturalExchange.cadence'),
        ],
        [/applications each January/i, pendingWhat('programsPage', 'culturalExchange.howToJoin')],
        [/Ọ̀yọ́ State|Oyo State/i, pendingWhat('programsPage', 'culturalExchange.blurb')],
      ]);
    }
    const kids = page.locator('#kids');
    if ((await kids.count()) === 1) {
      expectNoMockWhileOwed(await kids.innerText(), [
        [
          /4 to 10|10 to 14|Saturdays|robotics|solar kits|coding club/i,
          pendingWhat('programsPage', 'kidsStem.subprograms'),
        ],
      ]);
    }
    await context.close();
  });

  test('shows when things run as the option says, each when or its chip, never an invented cadence', async ({
    page,
  }) => {
    await page.goto('/programs');
    const option = await page.locator('body').getAttribute('data-yearstrip');
    const section = page.locator('#year');
    if (option === 'hidden') {
      await expect(section).toHaveCount(0);
      return;
    }
    await expect(section.locator('h2')).toHaveText('When things run');
    const cells = section.locator('.oy-year > div');
    if ((await cells.count()) === 0) {
      await expect(section.locator('.oy-pend-line')).toBeVisible();
    } else {
      for (const cell of await cells.all()) {
        const when = await cell.locator('b').innerText();
        expect(when.trim().length).toBeGreaterThan(0);
        await expect(cell.locator('strong')).toHaveCount(1);
      }
      // An event row is named by its page, never by an edition's year.
      expect(await section.locator('.oy-year strong').allInnerTexts()).not.toContainEqual(
        expect.stringMatching(/20\d\d/),
      );
    }
    expectNoMockWhileOwed(await section.innerText(), [
      [/Year-round|Saturdays|Monthly|Date pending/i, pendingWhat('programsPage', 'yearStrip')],
    ]);
    await expect(section.locator('.oy-handoff a[href="/impact"]')).toContainText('See our impact');
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

  test('keeps one gold action per screen view', async ({ page }) => {
    await page.goto('/programs');
    expect(await goldSharingAView(page)).toEqual([]);
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
