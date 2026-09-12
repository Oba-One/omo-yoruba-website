import { expect, test } from '@playwright/test';
import { interceptActions } from './helpers';

test('the newsletter form names the problem, keeps the address, then thanks in place', async ({
  page,
}) => {
  await interceptActions(page, (name) => {
    expect(name).toBe('newsletter');
    return {
      ok: true,
      title: 'Ẹ ṣé! ✓',
      body: 'Ẹ ṣé. You are on the list. The next note goes out with the festival save-the-date.',
    };
  });
  await page.goto('/');
  const form = page.locator('oy-newsletter');
  const input = form.getByLabel('Email address');
  const submit = form.locator('button[type="submit"]');
  await expect(submit).toHaveText('Subscribe');
  await submit.scrollIntoViewIfNeeded();
  await submit.click();
  await expect(form.getByRole('alert')).toHaveText('We still need an email address.');
  await expect(input).toBeFocused();
  await input.fill('ade@example');
  await submit.click();
  await expect(form.getByRole('alert')).toHaveText(
    'That email address does not look right. Check it and send again.',
  );
  await expect(input).toHaveValue('ade@example');
  await input.fill('ade@example.org');
  await submit.click();
  await expect(submit).toHaveText('Sending...');
  await expect(form.getByRole('button', { name: 'Ẹ ṣé! ✓' })).toBeVisible();
  await expect(form.locator('.oy-signup-done')).toBeVisible();
  await expect(form.locator('.oy-signup-done')).toContainText('You are on the list');
});
