import { expect, test } from '@playwright/test';
import { albumTiles, NO_SUCH_ALBUM, openEnquiry } from './helpers';

// The elder test at 375: every control a finger can reach has a 44px box (QUALITY.md section 2).
// Inline links in running text are the one exception WCAG allows.
const small = () =>
  Array.from(document.querySelectorAll<HTMLElement>('a, button, input, select, textarea, summary'))
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
  // The member form in every environment: its door locally, the opener in CI (helpers.ts).
  await openEnquiry(page, 'member');
  await expect(page.locator('dialog#enquiry')).toHaveAttribute('open', '');
  expect(await page.evaluate(small)).toEqual([]);
});

test('every visible control on the event, program, trust and gallery pages is at least 44px', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'measured at 375');
  const measured = async (route: string) => {
    await page.goto(route);
    expect(await page.evaluate(small), route).toEqual([]);
  };
  for (const route of [
    '/odunde',
    '/gala',
    '/programs',
    '/programs/yoruba-lessons',
    '/programs/cultural-collective',
    '/get-involved',
    '/impact',
    '/our-story',
    '/donate',
    '/gallery',
  ]) {
    await measured(route);
  }
  // The album the gallery lists first, read while the gallery is on screen (review ticket R136); with none
  // listed, the page the album route answers in its place.
  const [album] = await albumTiles(page);
  await measured(album?.path ?? NO_SUCH_ALBUM);
  if (!album || album.photographs === 0) return;
  // Then its Lightbox, served open on the album's first photograph, so its controls are measured on screen.
  const first = await page
    .locator('.oy-photo-grid a[data-photo]')
    .first()
    .getAttribute('data-photo');
  await page.goto(`${album.path}?photo=${first}`);
  await expect(page.locator('dialog.oy-lightbox')).toHaveAttribute('open', '');
  expect(await page.evaluate(small), 'the Lightbox').toEqual([]);
});
