import { GENERAL_CONTACT_PENDING, pendingWhat, presenceWhat } from '@oy/content/pending';
import { expect, test } from '@playwright/test';
import {
  axeViolations,
  expectEnquiryRoundTrip,
  expectNoMockWhileOwed,
  goldSharingAView,
  PLACEHOLDER_PROJECT,
  settle,
} from './helpers';

// Our Story in the prototype's order (ROUTES section 4, ADR 0035), each block present whether the Studio
// holds its content or renders Pending: CI runs with a placeholder project, where every read answers null.
// None of the register's inventions (the founders, the church hall, the first year, the timeline's dates,
// the nine names and bios, the mock address and contact) stands in for an owed fact.

const body = (page: import('@playwright/test').Page, name: string) =>
  page.locator('body').getAttribute(`data-${name}`);

test.describe('the Our Story page', () => {
  test('carries its blocks in order, one h1, the options on the body and nothing open', async ({
    page,
  }) => {
    await page.goto('/our-story');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    const order = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main > *')).map((el) => el.id),
    );
    const timeline = await body(page, 'timeline');
    expect(timeline).toMatch(/^(hidden|shown)$/);
    expect(order).toEqual([
      'top',
      'origin',
      ...(timeline === 'shown' ? ['timeline'] : []),
      'board',
      'staff',
      'contact',
      'take-part',
    ]);
    expect(await body(page, 'bios')).toMatch(/^(short|full)$/);
    expect(await body(page, 'portraits')).toMatch(/^(shown|hidden)$/);
    await expect(page.locator('.oy-nav[data-page="about"]')).toHaveCount(1);
  });

  test('tells how it began with the confirmed facts, and invents no founder, place or first year', async ({
    page,
  }) => {
    await page.goto('/our-story');
    const section = page.locator('#origin');
    await expect(section.locator('h2')).toHaveText('How it began, 1997');
    const facts = section.locator('.oy-fact');
    if (PLACEHOLDER_PROJECT) {
      await expect(facts).toHaveCount(0);
      await expect(section.locator('.oy-pend-line')).toContainText(
        pendingWhat('storyPage', 'foundingFacts[]') ?? '',
      );
    } else {
      await expect(facts.locator('dt')).toHaveText(['Founded', 'Founders', 'Status', 'First year']);
      await expect(facts.first()).toContainText('1997, Los Angeles');
    }
    const text = await section.innerText();
    expectNoMockWhileOwed(text, [
      [/Crenshaw|Thirty-one people|borrowed blackboard/i, pendingWhat('storyPage', 'founding')],
      [/Balogun|Sofolahan|with 29 others|Nine children/, pendingWhat('storyPage', 'foundingFacts')],
    ]);
    // The earliest photograph is owed: never the summer camp captioned as the founding years.
    expect(text).not.toMatch(/before Odunde|Citrus College/);
  });

  test('keeps the timeline by its option, each entry or its Pending line', async ({ page }) => {
    await page.goto('/our-story');
    const section = page.locator('#timeline');
    if ((await body(page, 'timeline')) !== 'shown') {
      await expect(section).toHaveCount(0);
      return;
    }
    await expect(section.locator('h2')).toHaveText('1997 to now');
    if ((await section.locator('ol.oy-timeline li').count()) === 0) {
      await expect(section.locator('.oy-pend-line')).toContainText(
        presenceWhat('timelineEntry')?.what ?? '',
      );
    }
  });

  test('lists the board and the staff and volunteers, or names each group owed, never a head teacher', async ({
    page,
  }) => {
    await page.goto('/our-story');
    const board = page.locator('#board');
    await expect(board.locator('h2')).toHaveText('Board of directors');
    if ((await board.locator('.oy-person').count()) === 0) {
      await expect(board.locator('.oy-pend-line')).toContainText(
        presenceWhat('person', 'board')?.what ?? '',
      );
    }
    const staff = page.locator('#staff');
    await expect(staff.locator('h2')).toHaveText('Staff and volunteers');
    if ((await staff.locator('.oy-person').count()) === 0) {
      await expect(staff.locator('.oy-pend-line')).toContainText(
        presenceWhat('person', 'staff')?.what ?? '',
      );
    }
    await expect(
      staff.locator('.oy-handoff a[href="/programs/yoruba-lessons#teacher"]'),
    ).toContainText('The teacher');
    const text = `${await board.innerText()} ${await staff.innerText()}`;
    expect(text).not.toMatch(/Head teacher/i);
    expectNoMockWhileOwed(text, [
      [
        /Adekunle|Aduke|Folasade|Olumide|Tunde Bakare|Yetunde|Bisi Olatunji|Adebayo|Ronke/,
        presenceWhat('person', 'board')?.what,
      ],
    ]);
    if ((await body(page, 'portraits')) === 'hidden') {
      await expect(page.locator('#board .oy-person-media, #staff .oy-person-media')).toHaveCount(0);
    }
  });

  test('offers the ways to reach us beside the contact form, and the governance box to Impact', async ({
    page,
  }) => {
    await page.goto('/our-story');
    const section = page.locator('#contact');
    await expect(section.locator('h2')).toHaveText(/\S/);
    const facts = section.locator('.oy-fact');
    await expect(facts.locator('dt')).toHaveText([
      'Email',
      'Phone',
      'Mailing address',
      'Who receives this',
    ]);
    if ((await facts.nth(3).locator('.oy-pend').count()) === 1) {
      await expect(facts.nth(3)).toContainText(GENERAL_CONTACT_PENDING, { ignoreCase: true });
    }
    const phone = await facts.nth(1).locator('a[href^="tel:"]').count();
    await expect(section.getByText('If it is urgent, calling reaches a person')).toHaveCount(phone);
    expectNoMockWhileOwed(await section.innerText(), [
      [/555-0148/, pendingWhat('siteSettings', 'phone')],
      [/Leimert Boulevard/, pendingWhat('siteSettings', 'address')],
      [/Folasade Adeyemi|treasurer and membership/i, GENERAL_CONTACT_PENDING],
    ]);
    await expectEnquiryRoundTrip(
      page,
      section.locator('.oy-enquiry-card a[data-enquiry="contact"]'),
    );
    await expect(section.locator('.oy-handoff a[href="/impact#governance"]')).toContainText(
      'Impact',
    );
  });

  test('closes with the member and volunteer rows, each opening its own form', async ({ page }) => {
    await page.goto('/our-story');
    const section = page.locator('#take-part');
    await expect(section.locator('h2')).toHaveText('Take part');
    const rows = section.locator('.oy-takepart > .oy-path');
    if ((await rows.count()) === 0) {
      await expect(section.locator('.oy-takepart .oy-pend-line')).toBeVisible();
      return;
    }
    expect(await section.innerText()).not.toMatch(/a say in what gets built/i);
    // The prototype's chips, the volunteer door's own rather than the way in's "Volunteers".
    await expect(rows.locator('.oy-path-chip')).toHaveText(['Membership', 'Volunteer']);
    for (const trigger of await section.locator('.oy-takepart a[data-enquiry]').all()) {
      await expectEnquiryRoundTrip(page, trigger);
    }
  });

  test('keeps one gold action per screen view', async ({ page }) => {
    await page.goto('/our-story');
    expect(await goldSharingAView(page)).toEqual([]);
  });

  test('is clean for axe with the page settled', async ({ page }) => {
    await page.goto('/our-story');
    await settle(page);
    expect(await axeViolations(page)).toEqual([]);
  });
});
