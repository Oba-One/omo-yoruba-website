import { DOOR_CHIPS } from '@oy/content/doors';
import {
  GENERAL_CONTACT_PENDING,
  GENERAL_RESPONDS_PENDING,
  pendingWhat,
} from '@oy/content/pending';
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

// Get Involved in the prototype's order (ROUTES section 4, ADR 0034), each block present whether the
// Studio holds its content or renders Pending: CI runs with a placeholder project, where every read
// answers null. None of the register's inventions (dues, volunteer roles, booth fees and dates, the mock
// contacts, the mock phone and inbox) stands in for an owed fact.

const CARD_KEYS = ['member', 'volunteer', 'vendor', 'partner'];

test.describe('the Get Involved page', () => {
  test('carries its blocks in order, one h1, the options on the body and nothing open', async ({
    page,
  }) => {
    await page.goto('/get-involved');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    const order = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main > *')).map((el) => el.id),
    );
    const hta = await page.locator('body').getAttribute('data-hta');
    expect(hta).toMatch(/^(shown|hidden)$/);
    expect(order).toEqual(['top', 'doors', ...(hta === 'shown' ? ['associations'] : []), 'talk']);
    await expect(page.locator('header#top.oy-phead--slim')).toHaveCount(1);
    expect(await page.locator('body').getAttribute('data-doors')).toMatch(/^(cards|rows)$/);
    await expect(page.locator('.oy-nav[data-page="involved"]')).toHaveCount(1);
  });

  test('draws the four doors with their chips and anchors, each opening its own form, or names them owed', async ({
    page,
  }) => {
    await page.goto('/get-involved');
    const cards = page.locator('#doors .oy-door-card');
    if (PLACEHOLDER_PROJECT) {
      await expect(cards).toHaveCount(0);
      await expect(page.locator('#doors .oy-pend-line')).toContainText(
        pendingWhat('getInvolvedPage', 'doors[]') ?? '',
      );
      return;
    }
    const ids = await cards.evaluateAll((els) => els.map((el) => el.id));
    // The footer links the member and partner doors by their anchors.
    expect(ids).toEqual(expect.arrayContaining(['member', 'partner']));
    expect(ids.every((id) => CARD_KEYS.includes(id))).toBe(true);
    // The Studio's order, which the seed writes as the prototype draws it.
    if (ids.length === CARD_KEYS.length) expect(ids).toEqual(CARD_KEYS);
    for (const id of ids) {
      const label = page.locator(`#${id} .oy-door-label`);
      await expect(label).toHaveText(DOOR_CHIPS[id as keyof typeof DOOR_CHIPS]);
      // The prototype's 12px kicker, which never grows with a shorter card in its row.
      await expect(label).toHaveCSS('font-size', '12px');
      expect((await label.boundingBox())?.height ?? 0).toBeLessThan(24);
    }
    const rows = (await page.locator('body').getAttribute('data-doors')) === 'rows';
    await expect(page.locator('#doors .oy-door-card--row')).toHaveCount(rows ? ids.length : 0);
    // The give door closes the page instead of taking a card.
    await expect(page.locator('#doors [data-door="give"]')).toHaveCount(0);
    for (const trigger of await page.locator('#doors a[data-enquiry]').all()) {
      await expectEnquiryRoundTrip(page, trigger);
    }
    expectNoMockWhileOwed(await page.locator('#doors').innerText(), [
      [/\$75|\$120|annual meeting|Early booking/i, pendingWhat('door', 'bullets[]')],
      [/second adult|ninety minutes|guardian consent form/i, pendingWhat('door', 'bullets[]')],
      [/\$150|\$275|\$325|1 April|20 April|health permit/i, pendingWhat('door', 'bullets[]')],
      [/\$2,500|\$10,000|within a working day/i, pendingWhat('door', 'bullets[]')],
      [/four thousand|one Saturday in June/i, pendingWhat('door', 'blurb')],
      [/Tunde Bakare/, pendingWhat('door', 'blurb')],
    ]);
  });

  test("lands the footer's door links on their cards, or on the doors' Pending line", async ({
    page,
  }) => {
    await page.goto('/get-involved');
    await page.locator('footer a[href="/get-involved#partner"]').click();
    await expect(page).toHaveURL(/\/get-involved#partner$/);
    if (PLACEHOLDER_PROJECT) {
      // No door, so no anchor: the page still opens on the doors' section and names them owed.
      await expect(page.locator('#partner')).toHaveCount(0);
      await expect(page.locator('#doors .oy-pend-line')).toBeVisible();
      return;
    }
    await expect(page.locator('#partner')).toBeInViewport();
  });

  test('keeps the gold on the header or on the first door, never both', async ({ page }) => {
    await page.goto('/get-involved');
    const headerGold = await page.locator('header#top .oy-btn--primary').count();
    const doorGold = await page.locator('#doors .oy-btn--primary').count();
    expect(headerGold + doorGold).toBeLessThanOrEqual(1);
    if (doorGold === 1) {
      await expect(
        page.locator('#doors .oy-door-card').first().locator('.oy-btn--primary'),
      ).toHaveCount(1);
    }
    expect(await goldSharingAView(page)).toEqual([]);
  });

  test('describes the hometown associations with their count, and lists no name the Studio does not hold', async ({
    page,
  }) => {
    await page.goto('/get-involved');
    const section = page.locator('#associations');
    if ((await page.locator('body').getAttribute('data-hta')) === 'hidden') {
      await expect(section).toHaveCount(0);
      return;
    }
    await expect(section.locator('h2')).toHaveText('Hometown associations');
    const labels = (await section.locator('.oy-glance > div > b').allTextContents()).map((label) =>
      label.trim(),
    );
    expect(labels[0]).toBe('Associations');
    expect(labels.at(-1)).toBe('To connect');
    const listed = await section.locator('.oy-partners li').count();
    expect(labels.includes('Listed publicly')).toBe(listed === 0);
    if (PLACEHOLDER_PROJECT) {
      await expect(section.locator('.oy-split-main .oy-pend')).toContainText(
        pendingWhat('getInvolvedPage', 'hometownAssociations.prose') ?? '',
      );
      await expect(section.locator('.oy-glance')).toContainText(
        pendingWhat('getInvolvedPage', 'hometownAssociations.stat') ?? '',
      );
    } else {
      await expect(section.locator('.oy-glance > div').first()).toContainText('9');
    }
  });

  test('offers a person to talk to: links only for what the settings hold, the contact form and the two boxes', async ({
    page,
  }) => {
    await page.goto('/get-involved');
    const section = page.locator('#talk');
    await expect(section.locator('h2')).toHaveText('Or just talk to someone');
    const facts = section.locator('.oy-split-aside .oy-fact');
    await expect(facts.locator('dt')).toHaveText([
      'Email',
      'Phone',
      'Who answers',
      'Response time',
    ]);
    const call = section.locator('a[href^="tel:"].oy-btn');
    const phoneLink = facts.nth(1).locator('a[href^="tel:"]');
    await expect(call).toHaveCount(await phoneLink.count());
    // A link only for what the settings hold: the email is a mailto: link or its chip, never both.
    const emailOwed = (await facts.nth(0).locator('.oy-pend').count()) === 1;
    await expect(facts.nth(0).locator('a[href^="mailto:"]')).toHaveCount(emailOwed ? 0 : 1);
    await expect(phoneLink).toHaveCount(
      (await facts.nth(1).locator('.oy-pend').count()) === 1 ? 0 : 1,
    );
    if ((await facts.nth(2).locator('.oy-pend').count()) === 1) {
      await expect(facts.nth(2)).toContainText(GENERAL_CONTACT_PENDING, { ignoreCase: true });
    }
    if ((await facts.nth(3).locator('.oy-pend').count()) === 1) {
      await expect(facts.nth(3)).toContainText(GENERAL_RESPONDS_PENDING, { ignoreCase: true });
    }
    expectNoMockWhileOwed(await section.innerText(), [
      [/555-0148/, pendingWhat('siteSettings', 'phone')],
      [/info@omoyoruba/i, pendingWhat('siteSettings', 'generalEmail')],
      [/Folasade Adeyemi/, GENERAL_CONTACT_PENDING],
      [/Three working days/i, GENERAL_RESPONDS_PENDING],
    ]);
    await expectEnquiryRoundTrip(page, section.locator('a[data-enquiry="contact"]'));
    await expect(section.locator('.oy-handoff a[href="/our-story"]')).toContainText('Our Story');
  });

  test('closes with the give door, whose Donate opens the Give Dialog', async ({ page }) => {
    await page.goto('/get-involved');
    const trigger = page.locator('#talk .oy-handoff a[data-give]');
    if (PLACEHOLDER_PROJECT) {
      // No give door, so no closing box: the Our Story box ends the page.
      await expect(trigger).toHaveCount(0);
      await expect(page.locator('#talk .oy-handoff')).toHaveCount(1);
      return;
    }
    await expect(page.locator('#talk .oy-handoff').last()).toContainText(
      'Would rather give than join?',
    );
    await expectGiveRoundTrip(page, trigger);
  });

  test('is clean for axe with the page settled', async ({ page }) => {
    await page.goto('/get-involved');
    await settle(page);
    expect(await axeViolations(page)).toEqual([]);
  });
});
