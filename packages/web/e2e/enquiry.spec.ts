import { ENQUIRY_KINDS, ENQUIRY_SPECS, successCopy } from '@oy/content/enquiry-kinds';
import { expect, test } from '@playwright/test';
import { interceptActions, openEnquiry } from './helpers';

// Every kind: open from a real trigger where the home page has one (the member and partner
// doors, the footer's volunteer and contact links) and from the `?enquiry=<kind>` opener where it
// has none, an empty submit names what is missing and keeps what was typed, a filled submit
// shows Sending... then the success block with Close focused, Escape closes and focus returns
// to the trigger. The action is intercepted (helpers.ts).
for (const kind of ENQUIRY_KINDS) {
  const spec = ENQUIRY_SPECS[kind];
  const required = spec.fields.filter((field) => field.required);
  const kept =
    spec.fields.find(
      (field) => field.kind === 'text' && !field.required && field.type !== 'email',
    ) ?? required[0];

  test(`${kind}: the five states from a real trigger or the opener`, async ({ page }) => {
    await interceptActions(page, (name) => {
      expect(name).toBe(`enquiry.${kind}`);
      return { ok: true, ...successCopy(kind) };
    });
    await page.goto('/');
    const trigger = await openEnquiry(page, kind);
    const dialog = page.locator('dialog#enquiry');
    const section = page.locator(`section.oy-enquiry[data-kind="${kind}"]`);
    await expect(dialog).toHaveAttribute('open', '');
    await expect(page.locator('#enquiry-title')).toHaveText(spec.title);
    await expect(section.locator(`[name="${spec.fields[0]?.id}"]`)).toBeFocused();

    if (kept) await section.locator(`[name="${kept.id}"]`).fill('Kept as typed');
    const submit = section.locator('button[type="submit"]');
    await expect(submit).toHaveText(spec.submit);
    await submit.click();
    const alert = section.getByRole('alert');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('Nothing you typed has been cleared.');
    for (const field of required) {
      if (field.id === kept?.id) continue;
      await expect(section.locator(`#eq-${kind}-${field.id}-error`)).toHaveText(
        `We still need ${field.req ?? field.label.toLowerCase()}.`,
      );
      await expect(section.locator(`[name="${field.id}"]`)).toHaveAttribute('aria-invalid', 'true');
    }
    if (kept) await expect(section.locator(`[name="${kept.id}"]`)).toHaveValue('Kept as typed');

    for (const field of required) {
      await section
        .locator(`[name="${field.id}"]`)
        .fill(field.type === 'email' ? 'ade@example.org' : 'A. Example');
    }
    await submit.click();
    await expect(submit).toHaveAttribute('aria-busy', 'true');
    await expect(submit).toHaveText('Sending...');
    const success = section.locator('[data-success]');
    await expect(success).toBeVisible();
    await expect(success.locator('b')).toHaveText(spec.ok);
    await expect(success.locator('p')).toHaveText(successCopy(kind).body);
    await expect(success.getByRole('button', { name: 'Close' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(dialog).not.toHaveAttribute('open', '');
    if (trigger) await expect(trigger).toBeFocused();
  });
}

test('the footer Contact link opens the contact kind and the scrim click closes it', async ({
  page,
}) => {
  await page.goto('/');
  const trigger = page.locator('footer a[data-enquiry="contact"]');
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.locator('dialog#enquiry');
  await expect(dialog).toHaveAttribute('open', '');
  await expect(page.locator('#enquiry-title')).toHaveText('Send us a message');
  await page.mouse.click(5, 5);
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(trigger).toBeFocused();
});
