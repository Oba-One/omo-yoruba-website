import { expect, test } from '@playwright/test';

// The Tickets Dialog (ADR 0051) is on the Gala page only while the next edition's ticket link is a Zeffy
// ticket form. Without one (CI's placeholder content, an Eventbrite link, or no link) `#tickets` opens
// nothing. With one, the seats block's Get tickets button opens the dialog around the form's frame, whose
// address names the form `tickets`, Escape closes it and focus returns to the button; `#tickets` opens it
// on load.
test('Get tickets opens the Tickets Dialog once the edition holds a Zeffy ticket form', async ({
  page,
}) => {
  // The test reads the frame's address, never the form: Zeffy's requests stay unanswered.
  await page.route('https://www.zeffy.com/**', () => {});
  await page.goto('/gala');
  const dialog = page.locator('dialog#tickets');
  const trigger = page.locator('#seats a[data-tickets]').first();
  if ((await page.locator('oy-zeffy-dialog[data-form="tickets"]').count()) === 0) {
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toHaveCount(0);
    return;
  }
  await expect(page.locator('oy-zeffy-dialog[data-form="tickets"]')).toHaveAttribute(
    'data-ready',
    'true',
  );
  await expect(trigger).toHaveAttribute(
    'href',
    /^https:\/\/www\.zeffy\.com\/(?:[A-Za-z-]+\/)?ticketing\//,
  );
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  await expect(dialog).toHaveAttribute('open', '');
  await expect(page.locator('#tickets-title')).toHaveText('Gala tickets');
  await expect(page.locator('dialog#give')).not.toHaveAttribute('open', '');
  const frame = dialog.locator('[data-mount] iframe');
  await expect(frame).toHaveCount(1);
  const src = new URL((await frame.getAttribute('src')) ?? '');
  expect(src.origin).toBe('https://www.zeffy.com');
  expect(src.searchParams.get('embed-version')).toBe('v2');
  expect(src.searchParams.get('embedId')).toBe('tickets');
  await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(trigger).toBeFocused();
});

test('#tickets opens the Tickets Dialog on load and closing strips the hash', async ({ page }) => {
  await page.route('https://www.zeffy.com/**', () => {});
  // The dialog opens while the page parses and its frame rides the page, so the load event waits for the
  // frame, which never answers here: the test goes on from the parsed document.
  await page.goto('/gala#tickets', { waitUntil: 'domcontentloaded' });
  const dialog = page.locator('dialog#tickets');
  test.skip(
    (await page.locator('oy-zeffy-dialog[data-form="tickets"]').count()) === 0,
    'The next edition holds no Zeffy ticket form',
  );
  await expect(dialog).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('');
});
