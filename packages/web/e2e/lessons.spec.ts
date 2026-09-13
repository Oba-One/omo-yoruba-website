import { ENQUIRY_SPECS } from '@oy/content/enquiry-kinds';
import { pendingWhat, TEACHER_EMAIL_PENDING } from '@oy/content/pending';
import { expect, test } from '@playwright/test';
import {
  axeViolations,
  expectEnquiryRoundTrip,
  expectNoMockWhileOwed,
  goldSharingAView,
  PLACEHOLDER_PROJECT,
  settle,
} from './helpers';

// Yoruba Language Lessons in the prototype's order (ROUTES section 4), each block present whether the
// Studio holds its content or renders Pending: CI runs with a placeholder project, where every read
// answers null. One teacher, live online: never "School", no terms, no Saturdays, no venue, and none
// of the register's inventions (the fee, the ages, the teacher's name) in place of an owed fact.

test.describe('the Yoruba Language Lessons page', () => {
  test('carries its blocks in order, one h1, the options on the body and nothing open', async ({
    page,
  }) => {
    await page.goto('/programs/yoruba-lessons');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    const order = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main > *')).map((el) => el.id),
    );
    expect(order.slice(0, 4)).toEqual(['top', 'glance', 'teacher', 'learn']);
    const lesson = await page.locator('body').getAttribute('data-lesson');
    expect(order.includes('lesson')).toBe(lesson !== 'hidden');
    expect(order.slice(-2)).toEqual(['faq', 'take-part']);
    expect(order.at(-1)).toBe('take-part');
    await expect(page.locator('header#top.oy-phead--slim')).toHaveCount(1);
    expect(await page.locator('body').getAttribute('data-portraits')).toMatch(/^(shown|hidden)$/);
    // The nav marks Programs as the current section for a program's own page.
    await expect(page.locator('.oy-nav[data-page="school"]')).toHaveCount(1);
  });

  test('never calls the lessons a school, and never invents a term, a Saturday, a fee or an age', async ({
    page,
  }) => {
    await page.goto('/programs/yoruba-lessons');
    const main = await page.locator('main').innerText();
    expect(main).not.toMatch(/\bSchool\b/);
    expect(main).not.toMatch(/Saturday|\bterm\b|12 Sep/i);
    const glance = page.locator('#glance .oy-glance > div');
    if (PLACEHOLDER_PROJECT) {
      // No facts: the band keeps its place with the registry's line.
      await expect(glance).toHaveCount(0);
      await expect(page.locator('#glance .oy-pend-line')).toContainText(
        pendingWhat('lessonsPage', 'glance[]') ?? '',
      );
    } else {
      await expect(glance).toHaveCount(4);
    }
    expectNoMockWhileOwed(main, [
      [/\$180|\$75/, pendingWhat('lessonsPage', 'glance')],
      [/5 to adult/i, pendingWhat('lessonsPage', 'glance')],
      [
        /Yetunde Ojo|Segun Adewale|Bisi Olatunji|Kunle Fashola/,
        pendingWhat('lessonsPage', 'teacher'),
      ],
      [/eleven years|Ibadan/i, pendingWhat('lessonsPage', 'teacher')],
      [/lessons@omoyoruba/i, TEACHER_EMAIL_PENDING],
    ]);
  });

  test("shows the teacher's card and the form's card side by side, with her name or its chip", async ({
    page,
  }) => {
    await page.goto('/programs/yoruba-lessons');
    const section = page.locator('#teacher');
    await expect(section.locator('h2')).toHaveText('One teacher, and you start by writing to her');
    const card = section.locator('.oy-person');
    await expect(card).toHaveCount(1);
    await expect(card.locator('.oy-person-role')).not.toBeEmpty();
    const name = await card.locator('h3').innerText();
    expect(name.trim().length).toBeGreaterThan(0);
    const enquiry = section.locator('.oy-enquiry-card[data-kind="enrol"]');
    await expect(enquiry.locator('h3')).toHaveText(ENQUIRY_SPECS.enrol.title);
    const email = enquiry.locator('.oy-enquiry-card-email');
    await expect(email).toContainText('Or email');
    const link = email.locator('a');
    if ((await link.count()) === 1) await expect(link).toHaveAttribute('href', /^mailto:/);
    else
      await expect(email).toContainText(`Pending: ${TEACHER_EMAIL_PENDING}`, { ignoreCase: true });
  });

  test('teaches what the Studio holds, or names what is owed: the prose, the levels and the lesson', async ({
    page,
  }) => {
    await page.goto('/programs/yoruba-lessons');
    const learn = page.locator('#learn');
    await expect(learn.locator('h2')).toHaveText('What you learn');
    const levels = learn.locator('.oy-list .oy-lrow');
    if ((await levels.count()) === 0) {
      await expect(learn.locator('.oy-pend-line')).toContainText(
        pendingWhat('lessonsPage', 'levels[]') ?? '',
      );
    }
    const text = await learn.innerText();
    expectNoMockWhileOwed(text, [
      [/first words|reading and tone|conversation/i, pendingWhat('lessonsPage', 'levels[]')],
      [/from the first lesson|three tones/i, pendingWhat('lessonsPage', 'learn')],
    ]);
    const lesson = page.locator('#lesson');
    if ((await lesson.count()) === 1) {
      await expect(lesson.locator('h2')).toHaveText('What a lesson looks like');
      const steps = lesson.locator('ol.oy-sched--day li');
      if ((await steps.count()) === 0) {
        await expect(lesson.locator('.oy-pend-line')).toContainText(
          pendingWhat('lessonsPage', 'oneLesson[]') ?? '',
        );
      }
      expectNoMockWhileOwed(await lesson.innerText(), [
        [
          /About an hour|Homework by email|Ten minutes off camera|Nobody leaves without speaking/i,
          pendingWhat('lessonsPage', 'oneLesson[]'),
        ],
      ]);
    }
  });

  test('asks its questions one open at a time with Enter and Space, or names them owed', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/programs/yoruba-lessons');
    const section = page.locator('#faq');
    await expect(section.locator('h2')).toHaveText('Questions parents ask');
    const items = section.locator('details.oy-faq-item');
    const count = await items.count();
    if (count === 0) {
      await expect(section.locator('.oy-pend-line')).toBeVisible();
      return;
    }
    const option = await page.locator('body').getAttribute('data-faq');
    await expect(items.first()).toHaveJSProperty('open', option === 'open');
    for (const item of (await items.all()).slice(1))
      await expect(item).toHaveJSProperty('open', false);
    // Closed rows keep the 44px target (the elder test).
    if (isMobile) {
      for (const summary of await section.locator('summary').all()) {
        expect((await summary.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
      }
    }
    if (count < 2) return;
    const [first, second] = [items.nth(0), items.nth(1)];
    await first.locator('summary').focus();
    if (option !== 'open') await page.keyboard.press('Enter');
    await expect(first).toHaveJSProperty('open', true);
    await expect(first.locator('.oy-faq-a')).toBeVisible();
    await second.locator('summary').focus();
    await page.keyboard.press(' ');
    await expect(second).toHaveJSProperty('open', true);
    await expect(first).toHaveJSProperty('open', false);
    await expect(first.locator('.oy-faq-a')).toBeHidden();
    // Enter closes the open question again, leaving none open.
    await page.keyboard.press('Enter');
    await expect(second).toHaveJSProperty('open', false);
    // An unanswered question opens onto its chip, never an invented answer.
    expectNoMockWhileOwed(await section.innerText(), [
      [
        /settled after the first lesson|no family is turned away|notebook, a pencil|ten minutes with them/i,
        pendingWhat('lessonsPage', 'faq'),
      ],
    ]);
  });

  test('opens the enrol form from the header and from the card, focus returning each time', async ({
    page,
  }) => {
    await page.goto('/programs/yoruba-lessons');
    // The card's trigger is always there; the header's comes from the Studio, so not in the placeholder project.
    const header = page.locator('header#top a[data-enquiry="enrol"]');
    await expect(header).toHaveCount(PLACEHOLDER_PROJECT ? 0 : 1);
    for (const trigger of [
      header,
      page.locator('#teacher .oy-enquiry-card a[data-enquiry="enrol"]'),
    ]) {
      if ((await trigger.count()) === 0) continue;
      await expectEnquiryRoundTrip(page, trigger);
    }
  });

  test('keeps one gold action per screen view', async ({ page }) => {
    await page.goto('/programs/yoruba-lessons');
    expect(await goldSharingAView(page)).toEqual([]);
  });

  test('closes with the take-part rows, each opening its own form, and the programs handoff', async ({
    page,
  }) => {
    await page.goto('/programs/yoruba-lessons');
    const section = page.locator('#take-part');
    await expect(section.locator('h2')).toHaveText('Take part');
    const rows = section.locator('.oy-takepart > .oy-path');
    if ((await rows.count()) === 0) {
      await expect(section.locator('.oy-takepart .oy-pend-line')).toBeVisible();
    } else {
      await expect(section.locator('.oy-btn--primary')).toHaveCount(1);
      for (const trigger of await section.locator('.oy-takepart a[data-enquiry]').all()) {
        await expectEnquiryRoundTrip(page, trigger);
      }
      expectNoMockWhileOwed(await section.innerText(), [
        [/a few hours a month|second adult|\$75 a year/i, pendingWhat('lessonsPage', 'takePart[]')],
      ]);
    }
    await expect(section.locator('.oy-handoff a[href="/programs"]')).toContainText('All programs');
  });

  test('is clean for axe with the page settled', async ({ page }) => {
    await page.goto('/programs/yoruba-lessons');
    await settle(page);
    expect(await axeViolations(page)).toEqual([]);
  });
});
