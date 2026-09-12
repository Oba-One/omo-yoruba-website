import { expect, test } from '@playwright/test';

// The elder test at 375: every control a finger can reach has a 44px box (QUALITY.md section 2).
// Inline links in running text are the one exception WCAG allows.
const small = () =>
  Array.from(document.querySelectorAll<HTMLElement>('a, button, input, select, textarea'))
    .filter((el) => el.checkVisibility() && !el.closest('[aria-hidden="true"]'))
    .filter((el) => el.getAttribute('tabindex') !== '-1')
    .filter((el) => !(el.tagName === 'A' && el.closest('p')))
    .map((el) => ({
      el: `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}.${el.className.split(' ')[0] ?? ''}`,
      text: (el.textContent ?? el.getAttribute('aria-label') ?? '').trim().slice(0, 30),
      width: Math.round(el.getBoundingClientRect().width),
      height: Math.round(el.getBoundingClientRect().height),
    }))
    .filter((box) => box.width < 44 || box.height < 44);

test('every visible control on the page and in the open modal is at least 44px', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'measured at 375');
  await page.goto('/');
  expect(await page.evaluate(small)).toEqual([]);
  await page.locator('.oy-enquiry-card[data-kind="vendor"] a[data-enquiry]').click();
  await expect(page.locator('dialog#enquiry')).toHaveAttribute('open', '');
  expect(await page.evaluate(small)).toEqual([]);
});
