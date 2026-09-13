import AxeBuilder from '@axe-core/playwright';
import { ENQUIRY_SPECS, type EnquiryKind } from '@oy/content/enquiry-kinds';
import { pendingWhat } from '@oy/content/pending';
import { expect, type Page, test } from '@playwright/test';
import { expectNoMockWhileOwed, goldSharingAView, settle } from './helpers';

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

const axeViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  return results.violations.map((violation) => ({
    id: violation.id,
    nodes: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
  }));
};

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

  test("opens the sponsor form from the header's gold action and points the second at the events", async ({
    page,
  }) => {
    await page.goto('/programs/cultural-collective');
    const actions = page.locator('header#top .oy-phead-cta .oy-btn');
    const count = await actions.count();
    if (count === 0) return;
    if (count > 1) await expect(actions.nth(1)).toHaveAttribute('href', '#events');
    const partner = page.locator('header#top a.oy-btn--primary[data-enquiry="sponsor"]');
    if ((await partner.count()) === 1) {
      await partner.click();
      const dialog = page.locator('dialog#enquiry');
      await expect(dialog).toHaveAttribute('open', '');
      await expect(page.locator('#enquiry-title')).toHaveText(ENQUIRY_SPECS.sponsor.title);
      await page.keyboard.press('Escape');
      await expect(dialog).not.toHaveAttribute('open', '');
      await expect(partner).toBeFocused();
    }
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

  test('sets each initiative in its own section, every owed fact under its chip and none invented', async ({
    page,
  }) => {
    await page.goto('/programs/cultural-collective');
    const body = page.locator('body');
    const layout = (await body.getAttribute('data-initiatives')) ?? 'side';
    const statusShown = (await body.getAttribute('data-status')) !== 'hidden';
    const initiatives = page.locator('main > section > .cc-init');
    for (const initiative of await initiatives.all()) {
      await expect(initiative).toHaveAttribute('data-layout', layout);
      await expect(initiative.locator('h2')).toHaveCount(1);
      const status = initiative.locator('.cc-init-pills').locator('.cc-status, .oy-pend');
      await expect(status).toHaveCount(statusShown ? 1 : 0);
      await expect(initiative.locator('.oy-glance--inline b')).toHaveText([
        'Status',
        'Serves',
        'Since',
        'Next',
      ]);
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
      const dialog = page.locator('dialog#enquiry');
      for (const trigger of await section.locator('.oy-takepart a[data-enquiry]').all()) {
        const kind = (await trigger.getAttribute('data-enquiry')) as EnquiryKind;
        await trigger.scrollIntoViewIfNeeded();
        await trigger.click();
        await expect(dialog).toHaveAttribute('open', '');
        await expect(page.locator('#enquiry-title')).toHaveText(ENQUIRY_SPECS[kind].title);
        await page.keyboard.press('Escape');
        await expect(trigger).toBeFocused();
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
