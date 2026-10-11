import { ENQUIRY_KINDS, ENQUIRY_SPECS, successCopy } from '@oy/content/enquiry-kinds';
import { expect, test } from '@playwright/test';
import { interceptActions, openEnquiry, settle } from './helpers';

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

// The panel never outgrows the screen (ADR 0056, review ticket R78): a short form sits in the middle of it, a long
// one fills it and scrolls inside, and the page behind does not move however far the wheel turns.
test('a dialog sits in the middle of the screen, a long form scrolls inside it and the page stays put', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/');
  const dialog = page.locator('dialog#enquiry');
  const panel = dialog.locator('.oy-modal');
  const body = dialog.locator('.oy-modal-body');
  const margins = async () => {
    const box = await panel.boundingBox();
    if (!box) throw new Error('the panel is not drawn');
    return { top: box.y, bottom: 768 - box.y - box.height };
  };

  await openEnquiry(page, 'contact');
  await expect(dialog).toHaveAttribute('open', '');
  const short = await margins();
  expect(short.top).toBeGreaterThan(24);
  expect(Math.abs(short.top - short.bottom)).toBeLessThanOrEqual(2);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toHaveAttribute('open', '');

  await openEnquiry(page, 'vendor');
  await expect(dialog).toHaveAttribute('open', '');
  const long = await margins();
  expect(long.top).toBeGreaterThanOrEqual(0);
  expect(long.bottom).toBeGreaterThanOrEqual(0);
  expect(await body.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
  const behind = await page.evaluate(() => window.scrollY);
  await body.hover();
  await page.mouse.wheel(0, 3000);
  await expect.poll(() => body.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  await page.mouse.wheel(0, 3000);
  await page.mouse.wheel(0, 3000);
  expect(await page.evaluate(() => window.scrollY)).toBe(behind);
  // The close button stays in reach: the head does not scroll away with the form.
  await expect(dialog.locator('.oy-modal-close')).toBeInViewport();
  // The page is held while the dialog is open: a wheel over the head, which does not scroll, or over
  // the scrim beside the panel moves nothing behind them.
  await dialog.locator('.oy-modal-head h2').hover();
  await page.mouse.wheel(0, 3000);
  await page.mouse.move(40, 384);
  await page.mouse.wheel(0, 3000);
  expect(await page.evaluate(() => window.scrollY)).toBe(behind);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toHaveAttribute('open', '');
  // Closed, the page scrolls again.
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(behind);
});

test('under 720px a dialog is a bottom sheet that fits the screen, its head in reach while the form scrolls', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'The bottom sheet runs in the mobile project.');
  const size = page.viewportSize();
  if (!size) throw new Error('the mobile project sets a viewport');
  await page.goto('/?enquiry=vendor');
  const dialog = page.locator('dialog#enquiry');
  await expect(dialog).toHaveAttribute('open', '');
  // The sheet slides up as it opens: measure it at rest.
  await settle(page);
  const box = await dialog.locator('.oy-modal').boundingBox();
  if (!box) throw new Error('the sheet is not drawn');
  // The sheet rests on the bottom edge and leaves the top of the page in view.
  expect(Math.abs(box.y + box.height - size.height)).toBeLessThanOrEqual(1);
  expect(box.y).toBeGreaterThan(0);
  const body = dialog.locator('.oy-modal-body');
  expect(await body.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
  await body.evaluate((el) => el.scrollTo(0, el.scrollHeight));
  await expect(dialog.locator('.oy-modal-close')).toBeInViewport();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

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
