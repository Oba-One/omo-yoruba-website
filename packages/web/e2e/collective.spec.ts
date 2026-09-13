import { pendingWhat, presenceWhat } from '@oy/content/pending';
import { expect, type Page, test } from '@playwright/test';
import {
  axeViolations,
  expectEnquiryRoundTrip,
  expectNoMockWhileOwed,
  goldSharingAView,
  PLACEHOLDER_PROJECT,
  settle,
} from './helpers';

// The Yoruba Cultural Collective in the prototype's order (ROUTES section 4), each block present whether
// the Studio holds its content or renders Pending: CI runs with a placeholder project, where every read
// answers null. Green stays inside the page's main (spec Q12), and none of the register's inventions
// (the argument, the voice, the volunteer skills) stands in for an owed fact.

/** Every colour a green token resolves to, as the browser writes computed colours. */
const greenColours = (page: Page) =>
  page.evaluate(() => {
    const probe = document.createElement('i');
    document.body.append(probe);
    const colours = ['50', '100', '150', '200', '300', '600', '700'].map((step) => {
      probe.style.color = `var(--green-${step})`;
      return getComputedStyle(probe).color;
    });
    probe.remove();
    return colours;
  });

/** The elements outside main that paint a green token, as their tag and class. */
const greenOutsideMain = (page: Page, colours: string[]) =>
  page.evaluate((greens) => {
    const painted = (el: Element) => {
      const style = getComputedStyle(el);
      const values = [
        style.color,
        style.backgroundColor,
        style.borderTopColor,
        style.borderBottomColor,
        style.backgroundImage,
      ];
      return values.some((value) => greens.some((green) => value.includes(green)));
    };
    return Array.from(document.body.querySelectorAll('*'))
      .filter((el) => !el.closest('main') && painted(el))
      .map((el) => `${el.tagName.toLowerCase()}.${el.className}`);
  }, colours);

test.describe('the Yoruba Cultural Collective page', () => {
  test('carries its blocks in order inside the collective scope, one h1, nothing open', async ({
    page,
  }) => {
    await page.goto('/programs/cultural-collective');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await expect(page.locator('main#main[data-scope="collective"]')).toHaveCount(1);
    const order = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main > *')).map((el) => el.id),
    );
    expect(order.slice(0, 2)).toEqual(['top', 'why']);
    const events = await page.locator('body').getAttribute('data-events');
    expect(order.includes('events')).toBe(events !== 'hidden');
    if (events !== 'hidden') expect(order[2]).toBe('events');
    expect(order.slice(-2)).toEqual(['voice', 'take-part']);
    await expect(page.locator('header#top.oy-phead--slim')).toHaveCount(1);
    expect(await page.locator('body').getAttribute('data-green')).toMatch(/^(signal|strong)$/);
    // The nav marks Programs as the current section for a program's own page.
    await expect(page.locator('.oy-nav[data-page="collective"]')).toHaveCount(1);
  });

  test('keeps green inside main, at either strength', async ({ page }) => {
    await page.goto('/programs/cultural-collective');
    await settle(page);
    const greens = await greenColours(page);
    expect(await greenOutsideMain(page, greens)).toEqual([]);
    await page.evaluate(() => {
      document.body.dataset.green = 'strong';
    });
    // Strong tints the slim header inside the scope, and still nothing outside it.
    const ground = await page
      .locator('header#top')
      .evaluate((header) => getComputedStyle(header).backgroundColor);
    expect(ground).toBe(greens[0]);
    expect(await greenOutsideMain(page, greens)).toEqual([]);
  });

  test("heads the page with the Studio's heading and actions, the first gold, or the heading's chip", async ({
    page,
  }) => {
    await page.goto('/programs/cultural-collective');
    const header = page.locator('header#top');
    const actions = header.locator('.oy-phead-cta .oy-btn');
    if (PLACEHOLDER_PROJECT) {
      await expect(header.locator('h1')).toContainText(
        pendingWhat('collectivePage', 'header.title') ?? '',
      );
      await expect(actions).toHaveCount(0);
      return;
    }
    // As the seed writes it: "Partner with the Collective" in gold, "See what is on" to the events.
    await expect(header.locator('h1')).toHaveText('Yoruba Cultural Collective');
    await expect(actions.first()).toHaveClass(/oy-btn--primary/);
    const partner = actions.first();
    if (await partner.getAttribute('data-enquiry')) await expectEnquiryRoundTrip(page, partner);
    const events = (await page.locator('body').getAttribute('data-events')) !== 'hidden';
    await expect(header.locator('a[href="#events"]')).toHaveCount(events ? 1 : 0);
  });

  test('sets why culture and sustainability sit together beside the photograph, or their chips', async ({
    page,
  }) => {
    await page.goto('/programs/cultural-collective');
    const why = page.locator('#why');
    await expect(why.locator('h2')).toHaveText('Why culture and sustainability sit together');
    const prose = why.locator('.oy-split-main .oy-prose');
    if ((await prose.count()) === 0) {
      await expect(why.locator('.oy-split-main .oy-pend')).toContainText(
        pendingWhat('collectivePage', 'argument') ?? '',
      );
    }
    await expect(why.locator('.oy-split-aside figure')).toHaveCount(1);
    expectNoMockWhileOwed(await why.innerText(), [
      [
        /about thirty members|farm from the market|without asking permission/i,
        pendingWhat('collectivePage', 'argument'),
      ],
    ]);
  });

  test('lists the Collective events still to come, or names what is owed, each row asking to join', async ({
    page,
  }) => {
    await page.goto('/programs/cultural-collective');
    const section = page.locator('#events');
    if ((await page.locator('body').getAttribute('data-events')) === 'hidden') {
      await expect(section).toHaveCount(0);
      await expect(page.locator('header#top a[href="#events"]')).toHaveCount(0);
      return;
    }
    await expect(section.locator('h2')).toHaveText('Collective events');
    const rows = section.locator('li.oy-lrow--event');
    if ((await rows.count()) === 0) {
      await expect(section.locator('.oy-pend-line')).toContainText(
        presenceWhat('event', 'collective')?.what ?? '',
      );
    }
    // No collective event is dated in either dataset yet, so this loop runs once one is.
    for (const trigger of await rows.locator('a[data-enquiry="contact"]').all()) {
      await expectEnquiryRoundTrip(page, trigger);
    }
    const text = await section.innerText();
    // The prototype's lead and rows are invented (spec Q15, the register).
    expect(text).not.toMatch(/Everyone is welcome/);
    expectNoMockWhileOwed(text, [
      [
        /solar site walk|Black soap and shea|planning 2027|Vision Theatre annex|Twelve places/i,
        presenceWhat('event', 'collective')?.what,
      ],
    ]);
  });

  test('sets each initiative in its own section, each fact its value or its own chip, none invented', async ({
    page,
  }) => {
    await page.goto('/programs/cultural-collective');
    const body = page.locator('body');
    const layout = (await body.getAttribute('data-initiatives')) ?? 'side';
    const statusShown = (await body.getAttribute('data-status')) !== 'hidden';
    const initiatives = page.locator('main > section .cc-init');
    // The seed writes Solar Hub and Green Goods; the placeholder project holds none.
    if (PLACEHOLDER_PROJECT) await expect(initiatives).toHaveCount(0);
    else expect(await initiatives.count()).toBeGreaterThan(0);
    const facts = [
      ['Status', 'status'],
      ['Serves', 'serves'],
      ['Since', 'since'],
      ['Next', 'next'],
    ] as const;
    for (const initiative of await initiatives.all()) {
      await expect(initiative).toHaveAttribute('data-layout', layout);
      await expect(initiative.locator('h2')).toHaveCount(1);
      const status = initiative.locator('.cc-init-pills').locator('.cc-status, .oy-pend');
      await expect(status).toHaveCount(statusShown ? 1 : 0);
      const cells = initiative.locator('.oy-glance--inline > div');
      await expect(cells.locator('b')).toHaveText(facts.map(([label]) => label));
      // Each fact is its value or the chip the registry words for that fact.
      for (const [at, [, field]] of facts.entries()) {
        const chip = cells.nth(at).locator('.oy-pend');
        if ((await chip.count()) > 0) {
          await expect(chip).toContainText(pendingWhat('initiative', field) ?? '');
        } else {
          await expect(cells.nth(at).locator('span')).not.toBeEmpty();
        }
      }
      await expect(initiative.locator('figure')).toHaveCount(1);
    }
    const text = (await initiatives.allInnerTexts()).join('\n');
    expectNoMockWhileOwed(text, [
      [/Piloting since 2024|Planned for 2027/i, pendingWhat('initiative', 'statusLine')],
      [/^(Piloting|Planned)$/m, pendingWhat('initiative', 'status')],
      [/Two community buildings|Vendors and members/i, pendingWhat('initiative', 'serves')],
      [/Design began 2026|^2024$/im, pendingWhat('initiative', 'since')],
      [/A third site in 2027|First goods at Odunde 2027/i, pendingWhat('initiative', 'next')],
      [
        /Rooftop solar|battery storage|black soap|shea butter|cloth bags|Two sites are live/i,
        pendingWhat('initiative', 'blurb'),
      ],
    ]);
  });

  test('gives the one voice as the large quote, or waits for it under its chip', async ({
    page,
  }) => {
    await page.goto('/programs/cultural-collective');
    const figure = page.locator('#voice figure.oy-quote');
    await expect(figure).toHaveCount(1);
    await expect(figure.locator('blockquote')).not.toBeEmpty();
    if ((await figure.getAttribute('data-pending')) === 'true') {
      await expect(figure.locator('.oy-pend').first()).toContainText(
        pendingWhat('collectivePage', 'voice') ?? '',
      );
      await expect(figure.locator('figcaption')).toHaveText(/^Name pending/);
    }
    expectNoMockWhileOwed(await figure.innerText(), [
      [
        /Olumide Ayanwale|did not separate the farm|keeping ourselves/i,
        pendingWhat('collectivePage', 'voice'),
      ],
    ]);
  });

  test('keeps one gold action per screen view', async ({ page }) => {
    await page.goto('/programs/cultural-collective');
    expect(await goldSharingAView(page)).toEqual([]);
  });

  test('builds with the Collective: each form opening, the updates row reaching the newsletter form', async ({
    page,
  }) => {
    await page.goto('/programs/cultural-collective');
    const section = page.locator('#take-part');
    await expect(section.locator('h2')).toHaveText('Build with the Collective');
    const rows = section.locator('.oy-takepart > .oy-path');
    if ((await rows.count()) === 0) {
      await expect(section.locator('.oy-takepart .oy-pend-line')).toBeVisible();
    } else {
      await expect(section.locator('.oy-btn--primary')).toHaveCount(1);
      for (const trigger of await section.locator('.oy-takepart a[data-enquiry]').all()) {
        await expectEnquiryRoundTrip(page, trigger);
      }
      const updates = section.locator('.oy-takepart a[href="#subscribe"]');
      if ((await updates.count()) === 1) {
        await updates.click();
        const form = page.locator('#subscribe');
        await expect(form).toBeInViewport();
        await expect(form.locator('input[type="email"]')).toBeVisible();
      }
      expectNoMockWhileOwed(await section.innerText(), [
        [
          /Engineering, supply, permitting|open to any member who wants in/i,
          pendingWhat('collectivePage', 'takePart[]'),
        ],
      ]);
    }
    await expect(section.locator('.oy-handoff a[href="/impact"]')).toContainText('See our impact');
  });

  test('is clean for axe at both green strengths', async ({ page }) => {
    await page.goto('/programs/cultural-collective');
    await settle(page);
    expect(await axeViolations(page)).toEqual([]);
    await page.evaluate(() => {
      document.body.dataset.green = 'strong';
    });
    expect(await axeViolations(page)).toEqual([]);
  });
});
