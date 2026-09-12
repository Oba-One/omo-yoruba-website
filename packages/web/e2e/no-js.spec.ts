import { expect, test } from '@playwright/test';

// Forms work without JavaScript first (ADR 0019): the query opens the modal, a POST with errors
// re-renders the page with status 400, the values kept and the sentences in place. The success
// redirect writes a document, so it runs only when E2E_WRITE is set (docs/runbook.md).
test.use({ javaScriptEnabled: false });

test('the query opens the modal and a posted error keeps the values', async ({ page }) => {
  await page.goto('/?enquiry=vendor');
  const dialog = page.locator('dialog#enquiry');
  await expect(dialog).toHaveAttribute('open', '');
  await expect(page.locator('#enquiry-title')).toHaveText('Apply for a booth at Ọjà Balógun');
  const section = page.locator('section.oy-enquiry[data-kind="vendor"]');
  await expect(section).toBeVisible();
  await section.locator('[name="who"]').fill('A. Example');
  const mail = section.locator('[name="mail"]');
  await mail.fill('stall@example');
  // Enter in a text field is the browser's own submission; a click on the button at 375 fights
  // the sheet's nested scroll containers in Playwright's stability check without JavaScript.
  const [response] = await Promise.all([
    page.waitForResponse((r) => r.request().method() === 'POST'),
    mail.press('Enter'),
  ]);
  expect(response.status()).toBe(400);
  await expect(page.locator('dialog#enquiry')).toHaveAttribute('open', '');
  const reopened = page.locator('section.oy-enquiry[data-kind="vendor"]');
  await expect(reopened.getByRole('alert')).toContainText('We still need a business name.');
  await expect(reopened.locator('#eq-vendor-mail-error')).toHaveText(
    'That email address does not look right. Check it and send again.',
  );
  await expect(reopened.locator('[name="who"]')).toHaveValue('A. Example');
  await expect(reopened.locator('[name="mail"]')).toHaveValue('stall@example');
});

test('a posted newsletter error re-renders the footer with the sentence', async ({ page }) => {
  await page.goto('/');
  const form = page.locator('oy-newsletter');
  const email = form.getByLabel('Email address');
  await email.fill('ade@example');
  const [response] = await Promise.all([
    page.waitForResponse((r) => r.request().method() === 'POST'),
    email.press('Enter'),
  ]);
  expect(response.status()).toBe(400);
  const again = page.locator('oy-newsletter');
  await expect(again.getByRole('alert')).toHaveText(
    'That email address does not look right. Check it and send again.',
  );
  await expect(again.getByLabel('Email address')).toHaveValue('ade@example');
});

test('a successful post redirects to the success block', async ({ page }) => {
  test.skip(!process.env.E2E_WRITE, 'writes a document: run with E2E_WRITE=1 against development');
  await page.goto('/?enquiry=contact');
  const section = page.locator('section.oy-enquiry[data-kind="contact"]');
  await section.locator('[name="name"]').fill('E2E no-JS check');
  await section.locator('[name="mail"]').fill('e2e-nojs@example.org');
  await section.locator('[name="message"]').fill('Sent by the no-JS Playwright spec.');
  await section.locator('[name="mail"]').press('Enter');
  await expect(page).toHaveURL(/\?enquiry=contact&sent=1#enquiry$/);
  const success = page.locator('section.oy-enquiry[data-kind="contact"] [data-success]');
  await expect(success).toBeVisible();
  await expect(success.locator('b')).toHaveText('Ẹ ṣé! ✓ We have your message.');
});
