import AxeBuilder from '@axe-core/playwright';
import { ENQUIRY_SPECS, type EnquiryKind } from '@oy/content/enquiry-kinds';
import { pendingWhat, presenceWhat } from '@oy/content/pending';
import { expect, test } from './fixtures';
import { expectNoMockWhileOwed, galleryHeld, settle } from './helpers';

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
      'participate',
      'about-festival',
      'zones',
      ...(schedule === 'hidden' ? [] : ['schedule']),
      'plan',
      'take-part',
      'past',
      'partners',
    ];
    expect(order.slice(0, expected.length)).toEqual(expected);
    const participation = page.locator('#participate');
    await expect(participation.locator('.oy-enquiry-card')).toHaveCount(3);
    await expect(participation.locator('.oy-btn--secondary')).toHaveCount(3);
    await expect(participation.locator('.oy-btn--primary')).toHaveCount(0);
    const sizes = await participation.locator('a[data-enquiry]').evaluateAll((links) =>
      links.map((link) => ({
        fontSize: getComputedStyle(link).fontSize,
        height: link.getBoundingClientRect().height,
      })),
    );
    for (const size of sizes) {
      expect(size.fontSize).toBe(sizes[0]?.fontSize);
      expect(size.height).toBeGreaterThanOrEqual(44);
    }
    const grounds = await page
      .locator('main > section')
      .evaluateAll((sections) =>
        sections.map((section) => section.classList.contains('oy-section--alt')),
      );
    for (let at = 1; at < grounds.length; at++) {
      expect(grounds[at], `sections ${at - 1} and ${at} have distinct grounds`).not.toBe(
        grounds[at - 1],
      );
    }
    const phead = await page.locator('body').getAttribute('data-phead');
    expect(phead).toMatch(/^(photo|slim)$/);
    await expect(page.locator(`header#top.oy-phead--${phead}`)).toHaveCount(1);
    const takePart = page
      .locator('header#top')
      .getByRole('link', { name: 'Take part in Odunde', exact: true });
    await expect(takePart).toHaveAttribute('href', '#participate');
    await takePart.click();
    await expect(page).toHaveURL(/\/odunde#participate$/);
    await expect(participation.getByRole('heading', { level: 2 })).toBeInViewport();
    // The nav marks Events as the current section (the dropdown trigger hides under 880px).
    await expect(page.locator('.oy-nav-drop[data-current="true"]')).toHaveCount(1);
  });

  for (const [kind, label] of [
    ['sponsor', 'Become a sponsor'],
    ['volunteer', 'Volunteer'],
    ['vendor', 'Apply as a vendor'],
  ] as const) {
    test(`the early ${kind} card opens its form and returns focus on cancel`, async ({ page }) => {
      await page.goto('/odunde');
      const trigger = page.locator('#participate').getByRole('link', { name: label, exact: true });
      await trigger.click();
      const dialog = page.locator('dialog#enquiry');
      await expect(dialog).toHaveAttribute('open', '');
      await expect(dialog).toHaveAttribute('data-kind', kind);
      await expect(page.locator('#enquiry-title')).toHaveText(ENQUIRY_SPECS[kind].title);
      const form = dialog.locator(`form[data-kind="${kind}"]`);
      await expect(form).toBeVisible();
      await expect(page.locator(`#eq-${kind}-${ENQUIRY_SPECS[kind].fields[0]?.id}`)).toBeFocused();
      await expect(form.locator('.oy-form-help')).toContainText('Rather speak to a person?');
      await form.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(dialog).not.toHaveAttribute('open', '');
      await expect(trigger).toBeFocused();
    });
  }

  test('shows the Studio facts or the registry chips, never an invented one', async ({ page }) => {
    await page.goto('/odunde');
    const glance = page.locator('#glance .oy-glance > div');
    const cells = await glance.count();
    for (const label of ['Date', 'Where', 'Cost']) {
      await expect(page.locator('#glance b', { hasText: label })).toHaveCount(1);
    }
    // The hours are parked (ADR 0058): the Time cell is drawn once the edition holds its end, and no
    // chip stands in for it before.
    const time = page.locator('#glance .oy-glance > div', {
      has: page.locator('b', { hasText: /^Time$/ }),
    });
    const timed = await time.count();
    expect(timed).toBeLessThanOrEqual(1);
    await expect(time.locator('.oy-pend')).toHaveCount(0);
    expect(cells).toBeGreaterThanOrEqual(3 + timed);
    expect(cells).toBeLessThanOrEqual(5);
    const header = await page.locator('header#top').innerText();
    const seeded = header.includes('Odunde Festival');
    expect(seeded || /pending: the page heading/i.test(header)).toBe(true);
    // The prototype's mock facts (docs/design/design/19 Mock Content Register) never fill a gap.
    expectNoMockWhileOwed(await page.locator('main').innerText(), [
      [/12 June 2027/i, pendingWhat('event', 'start', 'festival')],
      [/Free entry/i, pendingWhat('event', 'cost', 'festival')],
      [/43rd Place/i, pendingWhat('event', 'venue.line', 'festival')],
      [/since 2003/i, pendingWhat('festivalPage', 'whatItIs')],
      [/within a working day|from \$2,500/i, pendingWhat('festivalPage', 'takePart[]')],
    ]);
    await expect(page.locator('#about-festival h2')).toHaveText('What Odunde is');
  });

  test('draws a card for each of the festival zones, the named ones first, and names the owed ones', async ({
    page,
  }) => {
    await page.goto('/odunde');
    const layout = await page.locator('body').getAttribute('data-zones');
    const grid = page.locator(`#zones .oy-zones[data-layout="${layout}"]`);
    await expect(grid).toHaveCount(1);
    const cards = grid.locator('article.oy-zone');
    // The number of zones the festival has is the registry's (three since 11 October 2026).
    const expected = presenceWhat('zone')?.minimum ?? 0;
    expect(await cards.count()).toBeGreaterThanOrEqual(expected);
    const named = await grid.locator('article.oy-zone:not(.oy-zone--pending)').count();
    await expect(grid.locator('article.oy-zone--pending')).toHaveCount(
      Math.max(0, expected - named),
    );
    // Each named zone's Yoruba name is a heading with its marks.
    for (const heading of await grid.locator('h3.oy-zone-name').all()) {
      await expect(heading).toHaveAttribute('lang', 'yo');
    }
    if (layout === 'mosaic' && (page.viewportSize()?.width ?? 0) <= 560) {
      const frames = await grid.locator('.oy-zone-media').evaluateAll((elements) =>
        elements.map((element) => {
          const { width, height } = element.getBoundingClientRect();
          return { width, height };
        }),
      );
      expect(frames.length).toBeGreaterThan(0);
      for (const frame of frames) {
        expect(Math.abs(frame.width - frames[0].width)).toBeLessThan(1);
        expect(Math.abs(frame.height - frames[0].height)).toBeLessThan(1);
        expect(frame.width / frame.height).toBeCloseTo(4 / 3, 2);
      }
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

  test("draws the take-part rows in the Studio's order with one gold action on the first working row", async ({
    page,
  }) => {
    await page.goto('/odunde');
    const section = page.locator('#take-part');
    await expect(section.locator('h2')).toHaveText('Take part in Odunde');
    const labels = await page.locator('body').getAttribute('data-labels');
    const rows = section.locator('.oy-takepart > .oy-path');
    if ((await rows.count()) === 0) {
      // No rows in the Studio (or CI's placeholder project): the registry's Pending line.
      await expect(section.locator('.oy-takepart .oy-pend-line')).toBeVisible();
      await expect(section.locator('.oy-btn--primary')).toHaveCount(0);
    } else {
      await expect(section.locator('.oy-takepart')).toHaveAttribute('data-labels', labels ?? '');
      const ways = await rows.evaluateAll((els) => els.map((el) => el.getAttribute('data-way')));
      expect(new Set(ways).size).toBe(ways.length);
      await expect(section.locator('.oy-btn--primary')).toHaveCount(1);
      // No option reorders the rows (ADR 0042): the first button in the markup that is neither the give
      // row's nor the updates row's is the gold one, and no button in the section is a text link (ADR 0056).
      await expect(
        section
          .locator(
            '.oy-takepart > .oy-path:not([data-way="give"]):not([data-way="updates"]) .oy-btn',
          )
          .first(),
      ).toHaveClass(/oy-btn--primary/);
      await expect(section.locator('.oy-btn--quiet')).toHaveCount(0);
      // The vendor terms are parked (ADR 0058): the vendor row's line carries the edition's terms once
      // the Studio holds them, and no chip in their place before.
      const vendor = rows.and(page.locator('[data-way="vendor"]'));
      if ((await vendor.count()) === 1) {
        await expect(vendor.locator('.oy-path-body p .oy-pend')).toHaveCount(0);
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
    if (await galleryHeld(page)) {
      // Held (ADR 0043): the words and the attendance stay; no photograph, credit or way to the albums.
      await expect(past.locator('.oy-carousel')).toHaveCount(0);
      await expect(past.locator('.oy-credit-line')).toHaveCount(0);
      await expect(past.getByRole('link', { name: 'All Odunde albums' })).toHaveCount(0);
      return;
    }
    if ((await past.locator('.oy-carousel-slide').count()) === 0) {
      await expect(past.locator('.oy-carousel-stage .oy-ph')).toHaveCount(1);
      await expect(past.locator('.oy-credit-line')).toHaveCount(0);
    } else {
      await expect(past.locator('.oy-section-inner > .oy-credit-line')).toContainText(
        'Photographs:',
      );
      // The album's credit links out only to its photographer's own page (ADR 0046).
      const creditLink = past.locator('.oy-section-inner > .oy-credit-line a');
      if ((await creditLink.count()) > 0) {
        await expect(creditLink).toHaveAttribute('href', /^https:\/\//);
      }
      // The attendance is parked (ADR 0058): the head gives the figure once the Studio holds it, and
      // never a chip in its place.
      await expect(past.locator('.oy-sec-head .oy-pend')).toHaveCount(0);
    }
    await expect(past.getByRole('link', { name: 'All Odunde albums' })).toHaveAttribute(
      'href',
      '/gallery',
    );
  });

  test('partners show their cards or the Pending line, then Donate in gold and Sponsor Odunde', async ({
    page,
  }) => {
    await page.goto('/odunde');
    const partners = page.locator('#partners');
    await expect(partners.locator('h2')).toHaveText('Partners and sponsors of Odunde');
    const cards = partners.locator('.oy-partner-card');
    if ((await cards.count()) === 0) {
      await expect(partners.locator('.oy-pend-line')).toBeVisible();
    }
    // Each partner is a card by name; one with a site links out to it (ADR 0057).
    for (const card of await cards.all()) {
      await expect(card.locator('h3')).toHaveText(/\S/);
      for (const link of await card.locator('a').all()) {
        await expect(link).toHaveAttribute('href', /^https?:\/\//);
        await expect(link).toHaveAttribute('rel', /noopener/);
      }
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
