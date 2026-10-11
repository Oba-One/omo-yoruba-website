import { expect, type Page, test } from '@playwright/test';
import { PLACEHOLDER_PROJECT } from './helpers';

// An album's video plays from YouTube only when a visitor presses play (ADR 0050): the page asks nothing of YouTube
// or Google and holds no frame until then, and the press swaps YouTube's no-cookie player in for the play link.
// The spec reads whichever page shows a video in the dataset it runs against, found by the gallery's own links to
// its album pages and then the two event pages' past years, and skips where none does: CI's placeholder project,
// and a seeded dataset until the owner publishes the first video. It asserts on the frame element, never on what
// YouTube answers: the player's address is answered here, so the run needs no network.

const EVENT_PAGES = ['/odunde', '/gala'];
const PLACEHOLDER = 'the CI placeholder project reads no dataset, so no page shows a video';
const NO_VIDEO =
  'no album page the gallery links to, and neither event page, shows a video: none is published in this dataset yet, or the gallery holds the albums';
const YOUTUBE_OR_GOOGLE = /youtu|ytimg|googlevideo|google|gstatic/i;

/** The album pages the gallery links to, by its own tiles' addresses with any photo address left off. */
async function albumPages(page: Page): Promise<string[]> {
  const html = await (await page.request.get('/gallery')).text();
  const links = [...html.matchAll(/href="(\/gallery\/[^"?#/]+)[?#"]/g)].map((link) => link[1]);
  return [...new Set(links)] as string[];
}

test('a video asks nothing of YouTube until its play link is pressed, then frames the no-cookie player', async ({
  page,
}) => {
  test.skip(PLACEHOLDER_PROJECT, PLACEHOLDER);
  let route: string | undefined;
  for (const candidate of [...(await albumPages(page)), ...EVENT_PAGES]) {
    const html = await (await page.request.get(candidate)).text();
    if (/<oy-video[\s>]/.test(html)) {
      route = candidate;
      break;
    }
  }
  test.skip(route === undefined, NO_VIDEO);

  const requested: string[] = [];
  page.on('request', (request) => requested.push(new URL(request.url()).hostname));
  await page.goto(route as string);
  const video = page.locator('oy-video').first();
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute('data-ready', 'true');

  // On load: no YouTube frame, no request to YouTube or Google, and a link that names the video.
  await expect(page.locator('iframe[src*="youtu"]')).toHaveCount(0);
  await expect(video.locator('iframe')).toHaveCount(0);
  expect(requested.filter((host) => YOUTUBE_OR_GOOGLE.test(host))).toEqual([]);
  const link = video.getByRole('link', { name: /^Play video: / });
  await expect(link).toHaveAttribute('href', /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/);
  const embed = await video.getAttribute('data-embed');
  expect(embed).toMatch(
    /^https:\/\/www\.youtube-nocookie\.com\/embed\/[\w-]{11}\?autoplay=1&rel=0$/,
  );

  // The press: the player's frame takes the link's place, on the address the tile carried, and holds focus.
  await page.route('https://www.youtube-nocookie.com/**', (answer) =>
    answer.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Player</title>' }),
  );
  await link.click();
  const frame = video.locator('iframe');
  await expect(frame).toHaveCount(1);
  await expect(frame).toHaveAttribute('src', embed as string);
  await expect(frame).toHaveAttribute('title', /\S/);
  await expect(frame).toBeFocused();
  await expect(video).toHaveAttribute('data-playing', 'true');
  await expect(video.getByRole('link')).toHaveCount(0);
  // Any other video on the page still waits for its own press.
  await expect(page.locator('oy-video iframe')).toHaveCount(1);
});
