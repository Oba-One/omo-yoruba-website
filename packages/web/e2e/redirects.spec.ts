import { expect, test } from './fixtures';

// The old site's addresses (docs/redirects.md, ADR 0061): each answers 301 to its successor, with or without
// the trailing slash the old site wrote, and a visitor following one lands on that page.
test.describe('the old site addresses', () => {
  test('answer 301 to their successors, with or without the trailing slash', async ({
    request,
  }) => {
    const cases = [
      ['/about-us/', '/our-story'],
      ['/about-us', '/our-story'],
      ['/executives/', '/our-story#board'],
      ['/yoruba-language-school/', '/programs/yoruba-lessons'],
      ['/membership/', '/get-involved'],
      ['/event/gala-night-2022/', '/gala'],
      ['/rsvp-form/', '/odunde'],
      ['/tag/talking-drum/', '/'],
    ] as const;
    for (const [old, successor] of cases) {
      const response = await request.get(old, { maxRedirects: 0 });
      expect(response.status(), old).toBe(301);
      expect(new URL(response.headers().location ?? '', 'http://x').href, old).toBe(
        new URL(successor, 'http://x').href,
      );
    }
  });

  test("leave this site's own Donate page and what the 404 page answers alone", async ({
    request,
  }) => {
    expect((await request.get('/donate/', { maxRedirects: 0 })).status()).not.toBe(301);
    const forum = await request.get('/oysocal-forum/topic/introductions/', { maxRedirects: 0 });
    expect(forum.status()).toBe(404);
  });

  test("bring a visitor's browser to the successor's address", async ({ page }) => {
    await page.goto('/our-programs/');
    await expect(page).toHaveURL(/\/programs$/);
  });
});
