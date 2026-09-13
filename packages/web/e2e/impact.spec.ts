import {
  IMPACT_SIX_PENDING,
  PARTNERSHIPS_RESPONDS_PENDING,
  pendingWhat,
  presenceWhat,
} from '@oy/content/pending';
import { expect, test } from '@playwright/test';
import {
  axeViolations,
  expectEnquiryRoundTrip,
  expectNoMockWhileOwed,
  goldSharingAView,
  PLACEHOLDER_PROJECT,
  settle,
} from './helpers';

// Impact in the prototype's order (ROUTES section 4, ADR 0035), each block present whether the Studio holds
// its content or renders Pending: CI runs with a placeholder project, where every read answers null. Every
// figure carries its source line or its chip, and none of the register's inventions (the prototype's
// sources, attendance, learners, outcomes, civic figures, EIN, filings, partners and contact) stands in.

const body = (page: import('@playwright/test').Page, name: string) =>
  page.locator('body').getAttribute(`data-${name}`);

test.describe('the Impact page', () => {
  test('carries its blocks in order, one h1, the options on the body and nothing open', async ({
    page,
  }) => {
    await page.goto('/impact');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    const order = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main > *')).map((el) => el.id),
    );
    const funders = await body(page, 'funders');
    expect(order).toEqual([
      'top',
      'numbers',
      'how',
      'outcomes',
      'civic',
      'voices',
      'photographs',
      'governance',
      ...(funders === 'shown' ? ['funders'] : []),
      'fund',
    ]);
    expect(await body(page, 'stats')).toMatch(/^(four|six)$/);
    expect(await body(page, 'sources')).toMatch(/^(shown|hidden)$/);
    expect(await body(page, 'outcomes')).toMatch(/^(cards|rows)$/);
    await expect(page.locator('.oy-nav[data-page="impact"]')).toHaveCount(1);
  });

  test('gives every headline figure its source line or its chip, or none with sources hidden', async ({
    page,
  }) => {
    await page.goto('/impact');
    const section = page.locator('#numbers');
    await expect(section.locator('h2')).toHaveText('Headline numbers');
    const sources = (await body(page, 'sources')) === 'shown';
    await expect(section.locator('.oy-sec-intro')).toHaveCount(sources ? 1 : 0);
    const figures = section.locator('.oy-stat-grid .oy-stat:not(.oy-stat--owed)');
    if (PLACEHOLDER_PROJECT) {
      await expect(figures).toHaveCount(0);
      await expect(section.locator('.oy-pend-line')).toContainText(
        pendingWhat('impactPage', 'stats[]') ?? '',
      );
    } else {
      const count = await figures.count();
      expect(count).toBeGreaterThanOrEqual(4);
      await expect(section.locator('.oy-stat-grid .oy-source')).toHaveCount(sources ? count : 0);
      if ((await body(page, 'stats')) === 'six') {
        for (const cell of await section.locator('.oy-stat--owed').all()) {
          await expect(cell).toContainText(IMPACT_SIX_PENDING, { ignoreCase: true });
        }
      }
    }
    expectNoMockWhileOwed(await section.innerText(), [
      [
        /Founded 1997, counted to 2026|US Census|hometown association rolls|formally affiliated|festival plan/i,
        pendingWhat('stat', 'source'),
      ],
      [/4,200|137|learners taught/i, IMPACT_SIX_PENDING],
    ]);
  });

  test('names what each program produced, or keeps a place for it, and links each subject to its page', async ({
    page,
  }) => {
    await page.goto('/impact');
    const section = page.locator('#outcomes');
    await expect(section.locator('h2')).toHaveText('What each program produced');
    const cards = section.locator('.oy-outcome');
    expect(await cards.count()).toBeGreaterThanOrEqual(PLACEHOLDER_PROJECT ? 1 : 4);
    for (const card of await cards.all()) {
      const measured = await card.getAttribute('data-measured');
      if (measured === null) await expect(card.locator('.oy-pend')).toHaveCount(1);
    }
    const rows = (await body(page, 'outcomes')) === 'rows';
    await expect(section.locator('.oy-outcome--row')).toHaveCount(rows ? await cards.count() : 0);
    const text = await section.innerText();
    expect(text).not.toMatch(/\bschool\b/i);
    expectNoMockWhileOwed(text, [
      [/137|71 percent|4,200|38 vendors|210|2 sites/i, pendingWhat('impactPage', 'outcomes[]')],
    ]);
    if (!PLACEHOLDER_PROJECT) {
      const hrefs = await section
        .locator('.oy-button-row a')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
      expect(hrefs).toEqual(expect.arrayContaining(['/odunde', '/programs/yoruba-lessons']));
    }
  });

  test('reads the civic cells from the festival, each value or its chip, under an unmarked heading', async ({
    page,
  }) => {
    await page.goto('/impact');
    const section = page.locator('#civic');
    await expect(section.locator('h2')).toHaveText('Odunde as civic infrastructure');
    const labels = (await section.locator('.oy-glance > div > b').allTextContents()).map((label) =>
      label.trim(),
    );
    expect(labels).toEqual(['Attendance', 'Vendors hosted', 'Partners', 'Cost to attend']);
    expectNoMockWhileOwed(await section.innerText(), [
      [/4,200/, pendingWhat('event', 'attendance', 'festival')],
      [/\b38\b|Black-owned/, pendingWhat('event', 'vendorsHosted', 'festival')],
      [/Civic, health, and business/, presenceWhat('partner')?.what],
      [/Every year since 2003/, pendingWhat('event', 'cost', 'festival')],
    ]);
    await expect(section.locator('a[href="/odunde"]')).toContainText('The festival page');
  });

  test('keeps three voices and six photographs with the way to the gallery', async ({ page }) => {
    await page.goto('/impact');
    const voices = page.locator('#voices .oy-quote-card');
    await expect(voices).toHaveCount(3);
    expect(await page.locator('#voices').innerText()).not.toMatch(/Saturday mornings/i);
    const photographs = page.locator('#photographs');
    await expect(photographs.locator('.oy-mosaic[data-count="6"] > *')).toHaveCount(6);
    await expect(photographs.locator('a[href="/gallery"]')).toContainText('Open the gallery');
    if (!PLACEHOLDER_PROJECT) {
      await expect(photographs.locator('figcaption').first()).toContainText('2026');
    }
  });

  test("names what governance does not yet hold, and the footer's link lands on it", async ({
    page,
  }) => {
    await page.goto('/impact#governance');
    const section = page.locator('#governance');
    await expect(section).toBeInViewport();
    await expect(section.locator('h2')).toHaveText('Governance and accountability');
    const cells = (await section.locator('.oy-glance > div > b').allTextContents()).map((label) =>
      label.trim(),
    );
    expect(cells).toEqual(['Tax status', 'EIN', 'Board', 'Financials']);
    await expect(section.locator('.oy-glance > div').first()).toContainText('501(c)(3)');
    await expect(section.locator('.oy-facts dt')).toHaveText([
      'Mailing address',
      'Form 990',
      'Annual report',
      'Audit',
    ]);
    expectNoMockWhileOwed(await section.innerText(), [
      [/95-4612387/, pendingWhat('siteSettings', 'ein')],
      [/Leimert Boulevard/, pendingWhat('siteSettings', 'address')],
      [/March 2027|Filed annually/i, presenceWhat('governanceDoc', 'form990')?.what],
      [/Not yet audited|reviewed by the board/i, presenceWhat('governanceDoc', 'audit')?.what],
      [/Listed in full/, presenceWhat('person', 'board')?.what],
    ]);
  });

  test('lists the partners and funders or names them owed, and hides them by the option', async ({
    page,
  }) => {
    await page.goto('/impact');
    const section = page.locator('#funders');
    if ((await body(page, 'funders')) === 'hidden') {
      await expect(section).toHaveCount(0);
      return;
    }
    await expect(section.locator('h2')).toHaveText('Partners and funders');
    if ((await section.locator('.oy-partners li').count()) === 0) {
      await expect(section.locator('.oy-pend-line')).toContainText(
        presenceWhat('partner')?.what ?? '',
      );
    }
    expectNoMockWhileOwed(await section.innerText(), [
      [
        /LA County Arts|California Arts Council|Council District 8|Kaiser Permanente/,
        presenceWhat('partner')?.what,
      ],
    ]);
  });

  test('closes on the dark band with the partnerships lead, opening the sponsor form', async ({
    page,
  }) => {
    await page.goto('/impact');
    const band = page.locator('#fund');
    await expect(band).toHaveClass(/oy-dark/);
    await expect(band.locator('h2')).toHaveText(/\S/);
    const line = await band.locator('.oy-sec-intro').innerText();
    expect(line).toMatch(/partnerships lead/i);
    expectNoMockWhileOwed(line, [
      [/Adebayo Ogunlesi|within a working day/i, PARTNERSHIPS_RESPONDS_PENDING],
    ]);
    await expect(band.locator('.oy-btn--primary')).toHaveCount(1);
    await expectEnquiryRoundTrip(page, band.locator('a[data-enquiry="sponsor"]'));
  });

  test('keeps one gold action per screen view, and the header opens its two forms', async ({
    page,
  }) => {
    await page.goto('/impact');
    expect(await goldSharingAView(page)).toEqual([]);
    for (const trigger of await page.locator('header#top a[data-enquiry]').all()) {
      await expectEnquiryRoundTrip(page, trigger);
    }
  });

  test('is clean for axe with the page settled', async ({ page }) => {
    await page.goto('/impact');
    await settle(page);
    expect(await axeViolations(page)).toEqual([]);
  });
});
