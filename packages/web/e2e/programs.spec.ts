import { pendingWhat } from '@oy/content/pending';
import { expect, test } from '@playwright/test';
import {
  axeViolations,
  expectEnquiryRoundTrip,
  expectNoMockWhileOwed,
  goldSharingAView,
  PLACEHOLDER_PROJECT,
  settle,
} from './helpers';

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
      await kids.locator('.oy-disclosure > details').evaluate((el) => {
        (el as HTMLDetailsElement).open = true;
      });
      // Each sub-program fact is its value or the chip the registry words for it.
      for (const value of await kids.locator('.oy-fact dd').all()) {
        const chip = value.locator('.oy-pend');
        if ((await chip.count()) > 0) {
          await expect(chip).toContainText(
            pendingWhat('programsPage', 'kidsStem.subprograms') ?? '',
          );
        } else {
          await expect(value).not.toBeEmpty();
        }
      }
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
    if (PLACEHOLDER_PROJECT) {
      await expect(cells).toHaveCount(0);
      await expect(section.locator('.oy-pend-line')).toContainText(
        pendingWhat('programsPage', 'yearStrip[]') ?? '',
      );
    } else {
      // The seed's five rows: the Lessons, Odunde, the Gala, Kids & STEM and the Collective.
      await expect(cells).toHaveCount(5);
      for (const cell of await cells.all()) {
        const chip = cell.locator('b .oy-pend, b.oy-pend');
        if ((await chip.count()) > 0) {
          await expect(chip).toContainText(pendingWhat('programsPage', 'yearStrip') ?? '');
        } else {
          await expect(cell.locator('b')).not.toBeEmpty();
        }
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
    const triggers = await section.locator('.oy-takepart a[data-enquiry]').all();
    const give = section.locator('.oy-takepart a[data-give]');
    if (triggers.length === 0 && (await give.count()) === 0) {
      // The placeholder project holds no rows: the band names what it waits for, and nothing opens.
      await expect(section.locator('.oy-takepart .oy-pend-line')).toContainText(
        pendingWhat('programsPage', 'takePart[]') ?? '',
      );
      return;
    }
    for (const trigger of triggers) await expectEnquiryRoundTrip(page, trigger);
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
    expect(await axeViolations(page)).toEqual([]);
  });
});
