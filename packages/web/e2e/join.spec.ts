import { expect, test } from '@playwright/test';

// The Join Dialog (ADR 0050) is on a page only while Organization details hold the membership form's
// address. Without it (CI's placeholder content, or a dataset that holds none) `#join` opens nothing and a
// membership button opens the member enquiry. With it `#join` opens the dialog around the form's frame,
// whose address names the form `join`, the Give Dialog stays closed, and closing strips the hash. A
// membership button opening the dialog is covered by the JoinDialog stories and element tests: no button on
// the site opens the membership form until the owner points one at it (open-work D28).
test('#join opens the Join Dialog on load once Organization details hold the membership form', async ({
  page,
}) => {
  // The test reads the frame's address, never the form: Zeffy's requests stay unanswered. The dialog opens
  // while the page parses and its frame rides the page, so the page's load event waits for the frame, which
  // never answers here: the test goes on from the parsed document.
  await page.route('https://www.zeffy.com/**', () => {});
  await page.goto('/#join', { waitUntil: 'domcontentloaded' });
  const give = page.locator('dialog#give');
  const join = page.locator('dialog#join');
  if ((await page.locator('oy-zeffy-dialog[data-form="join"]').count()) === 0) {
    await expect(join).toHaveCount(0);
    await expect(give).not.toHaveAttribute('open', '');
    return;
  }
  await expect(join).toHaveAttribute('open', '');
  await expect(page.locator('#join-title')).toHaveText('Become a member');
  await expect(give).not.toHaveAttribute('open', '');
  const frame = join.locator('[data-mount] iframe');
  await expect(frame).toHaveCount(1);
  const src = new URL((await frame.getAttribute('src')) ?? '');
  expect(src.origin).toBe('https://www.zeffy.com');
  expect(src.searchParams.get('embed-version')).toBe('v2');
  expect(src.searchParams.get('embedId')).toBe('join');
  // Nothing in the dialog's own words names a price: the form shows the membership.
  await expect(join).not.toContainText('$');
  // Opened by its hash, the dialog itself holds the focus, as the Give Dialog does for `#give`.
  await expect
    .poll(() =>
      page.evaluate(() =>
        Boolean(document.querySelector('dialog#join')?.contains(document.activeElement)),
      ),
    )
    .toBe(true);
  await page.keyboard.press('Escape');
  await expect(join).not.toHaveAttribute('open', '');
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('');
});

test('a membership button opens the member enquiry while there is no Join Dialog to open', async ({
  page,
}) => {
  await page.goto('/');
  test.skip(
    (await page.locator('oy-zeffy-dialog[data-form="join"]').count()) > 0,
    'Organization details hold the membership form: the button opens the Join Dialog',
  );
  // The attributes `resolveAction` gives a `join` action (pinned in action.test.ts). The dialogs are
  // persisted across the router's swaps, so the link must skip the router for the modal to render open.
  await page.evaluate(() => {
    const trigger = document.createElement('a');
    trigger.href = '?enquiry=member#enquiry';
    trigger.setAttribute('data-join', '');
    trigger.setAttribute('data-astro-reload', '');
    trigger.textContent = 'Become a member';
    trigger.id = 'join-probe';
    document.querySelector('main')?.prepend(trigger);
  });
  await page.locator('#join-probe').click();
  await expect(page.locator('dialog#enquiry')).toHaveAttribute('open', '');
  await expect(page.locator('#enquiry-title')).toHaveText('Become a member');
});
