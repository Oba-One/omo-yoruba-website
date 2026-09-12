import { expect, test } from '@playwright/test';

// The settings hold no Zeffy URL yet (wayfinder ticket 03), so the dialog opens in its pending
// mode: the check line, Contact us, no Try again. The embed and the timed fallback are covered
// by the GiveDialog stories' play functions.
test('a Donate trigger opens the Give Dialog, Escape closes it and focus returns', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  const trigger = isMobile
    ? page.locator('footer a[data-give]')
    : page.locator('.oy-nav a[data-give]').first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.locator('dialog#give');
  await expect(dialog).toHaveAttribute('open', '');
  await expect(page.locator('#give-title')).toHaveText('Give to Omo Yorùbá');
  await expect(page.locator('oy-give-dialog')).toHaveAttribute('data-mode', 'pending');
  await expect(dialog.locator('[data-heading]')).toHaveText(
    'The online giving form is not set up yet.',
  );
  await expect(dialog.locator('[data-retry]')).toHaveCount(0);
  await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(trigger).toBeFocused();
});

test('#give opens the dialog on load and closing strips the hash', async ({ page }) => {
  await page.goto('/#give');
  const dialog = page.locator('dialog#give');
  await expect(dialog).toHaveAttribute('open', '');
  await expect(page.locator('dialog#enquiry')).not.toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('');
});

test('Contact us in the fallback hands over to the contact enquiry', async ({ page }) => {
  await page.goto('/#give');
  const give = page.locator('dialog#give');
  await expect(give).toHaveAttribute('open', '');
  await give.locator('a[data-enquiry="contact"]').click();
  await expect(give).not.toHaveAttribute('open', '');
  await expect(page.locator('dialog#enquiry')).toHaveAttribute('open', '');
  await expect(page.locator('#enquiry-title')).toHaveText('Send us a message');
});
