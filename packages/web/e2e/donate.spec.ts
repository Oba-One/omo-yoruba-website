import { pendingWhat } from '@oy/content/pending';
import { expect, test } from '@playwright/test';
import {
  axeViolations,
  expectEnquiryRoundTrip,
  expectGiveRoundTrip,
  expectNoMockWhileOwed,
  goldSharingAView,
  PLACEHOLDER_PROJECT,
  settle,
} from './helpers';

// Donate in the prototype's order (ROUTES section 4, ADR 0034, ADR 0035), each block present whether the
// Studio holds its content or renders Pending: CI runs with a placeholder project, where every read answers
// null. One decision at the top: the header's gold Give now. None of the register's inventions (Zeffy's fee
// and receipt claims, the preset amounts and what they buy, the platforms, the EIN) stands in.

const ZEFFY_PENDING = pendingWhat('donatePage', 'giveNow.facts');

test.describe('the Donate page', () => {
  test('carries its blocks in order, one h1, the option on the body and nothing open', async ({
    page,
  }) => {
    await page.goto('/donate');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    const order = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main > *')).map((el) => el.id),
    );
    const impact = await page.locator('body').getAttribute('data-impact');
    expect(impact).toMatch(/^(shown|hidden)$/);
    expect(order).toEqual([
      'top',
      'give-now',
      'larger',
      ...(impact === 'shown' ? ['what'] : []),
      'other',
      'trust',
    ]);
    // The section never takes the dialog's id, so `#give` opens the dialog alone.
    await expect(page.locator('[id="give"]')).toHaveCount(1);
  });

  test("keeps one gold action, the header's Give now, which opens the Give Dialog", async ({
    page,
  }) => {
    await page.goto('/donate');
    const gold = page.locator('main .oy-btn--primary');
    if (PLACEHOLDER_PROJECT) {
      // The header's actions come from the Studio: the placeholder project draws none.
      await expect(gold).toHaveCount(0);
      return;
    }
    await expect(gold).toHaveCount(1);
    const trigger = page.locator('header#top a[data-give]');
    await expect(trigger).toContainText('Give now');
    await expectGiveRoundTrip(page, trigger);
    await expectEnquiryRoundTrip(page, page.locator('header#top a[data-enquiry="sponsor"]'));
  });

  test('opens the Give Dialog on load at /donate#give', async ({ page }) => {
    await page.goto('/donate#give');
    await expect(page.locator('dialog#give')).toHaveAttribute('open', '');
  });

  test('lists the give-now facts, the ones the Zeffy form decides owed, and draws no second button', async ({
    page,
  }) => {
    await page.goto('/donate');
    const section = page.locator('#give-now');
    await expect(section.locator('h2')).toHaveText(/\S/);
    await expect(section.locator('a[data-give], .oy-btn')).toHaveCount(0);
    const facts = section.locator('.oy-fact');
    if (PLACEHOLDER_PROJECT) {
      await expect(facts).toHaveCount(0);
    } else {
      await expect(facts.locator('dt')).toHaveText([
        'Fees',
        'Receipt',
        'Monthly',
        'If the form fails',
      ]);
      await expect(facts.last()).toContainText(
        'The dialog offers contact and a mailing address instead.',
      );
    }
    expectNoMockWhileOwed(await section.innerText(), [
      [/100%|None\. 100%|Emailed by Zeffy|visible from the start|optional tip/i, ZEFFY_PENDING],
    ]);
  });

  test('offers the doors for organizations, outline, each opening its form, or names them owed', async ({
    page,
  }) => {
    await page.goto('/donate');
    const section = page.locator('#larger');
    const doors = section.locator('.oy-door-card');
    if ((await doors.count()) === 0) {
      await expect(section.locator('.oy-pend-line')).toContainText(
        pendingWhat('donatePage', 'largerScale.doors[]') ?? '',
      );
      return;
    }
    await expect(section.locator('.oy-btn--primary')).toHaveCount(0);
    if ((await doors.count()) === 1)
      await expect(section.locator('.oy-door-card--row')).toHaveCount(1);
    for (const trigger of await section.locator('a[data-enquiry]').all()) {
      await expectEnquiryRoundTrip(page, trigger);
    }
    expect(await section.innerText()).not.toMatch(/Three levels from \$2,500|Restricted gifts/);
  });

  test('says what a gift does from the giving levels, or names them owed, by the option', async ({
    page,
  }) => {
    await page.goto('/donate');
    const section = page.locator('#what');
    if ((await page.locator('body').getAttribute('data-impact')) === 'hidden') {
      await expect(section).toHaveCount(0);
      return;
    }
    await expect(section.locator('h2')).toHaveText('What your gift does');
    if ((await section.locator('.oy-outcome').count()) === 0) {
      await expect(section.locator('.oy-pend-line')).toContainText(
        pendingWhat('donatePage', 'whatYourGiftDoes[]') ?? '',
      );
    }
    expectNoMockWhileOwed(await section.innerText(), [
      [
        /\$25|\$100|\$500|books and workbook|half a term|one zone at Odunde/i,
        pendingWhat('donatePage', 'whatYourGiftDoes[]'),
      ],
    ]);
  });

  test('lists the other ways to give or names them owed, with no platform or EIN invented', async ({
    page,
  }) => {
    await page.goto('/donate');
    const section = page.locator('#other');
    await expect(section.locator('h2')).toHaveText('Other ways to give');
    if ((await section.locator('.oy-lrow').count()) === 0) {
      await expect(section.locator('.oy-pend-line')).toContainText(
        pendingWhat('donatePage', 'otherWays[]') ?? '',
      );
    }
    expectNoMockWhileOwed(await section.innerText(), [
      [
        /Benevity|Double the Donation|Tents, chairs|Tunde Bakare|95-4612387|Leimert Boulevard/,
        pendingWhat('donatePage', 'otherWays[]'),
      ],
    ]);
  });

  test('states the tax status and what the settings hold, with the way to Impact', async ({
    page,
  }) => {
    await page.goto('/donate');
    const section = page.locator('#trust');
    const labels = (await section.locator('.oy-glance > div > b').allTextContents()).map((label) =>
      label.trim(),
    );
    expect(labels.slice(0, 3)).toEqual(['Tax status', 'EIN', 'Deductible']);
    await expect(section.locator('.oy-glance > div').first()).toContainText('501(c)(3)');
    expectNoMockWhileOwed(await section.innerText(), [
      [/95-4612387/, pendingWhat('siteSettings', 'ein')],
      [/Sent by Zeffy on completion/, ZEFFY_PENDING],
    ]);
    await expect(section.locator('.oy-handoff a[href="/impact"]')).toContainText('See our impact');
  });

  test('keeps one gold action per screen view', async ({ page }) => {
    await page.goto('/donate');
    expect(await goldSharingAView(page)).toEqual([]);
  });

  test('is clean for axe with the page settled', async ({ page }) => {
    await page.goto('/donate');
    await settle(page);
    expect(await axeViolations(page)).toEqual([]);
  });
});
