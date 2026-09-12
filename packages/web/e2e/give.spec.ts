import { expect, test } from '@playwright/test';

// While the settings hold no Zeffy URL (wayfinder ticket 03) the dialog opens in its pending
// mode: the Pending chip, the check line, Contact us, no Try again. Once the URL is set the
// embed box mounts the island's iframe instead. The timed fallback is covered by the GiveDialog
// stories' play functions.
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
  const mode = await page.locator('oy-give-dialog').getAttribute('data-mode');
  if (mode === 'pending') {
    await expect(dialog.locator('[data-embed] .oy-pend')).toHaveText('Pending: the Zeffy link');
    await expect(dialog.locator('[data-heading]')).toHaveText(
      'The online giving form is not set up yet.',
    );
    await expect(dialog.locator('[data-retry]')).toHaveCount(0);
  } else {
    await expect(dialog.locator('[data-mount] iframe')).toHaveCount(1);
  }
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
