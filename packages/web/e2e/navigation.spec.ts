import { expect, type Page, test } from '@playwright/test';
import { draftSessionValue } from '../src/lib/sanity/draft-session';
import { DRAFT_SESSION_COOKIE, PERSPECTIVE_COOKIE } from '../src/lib/sanity/preview';
import { PLACEHOLDER_PROJECT, READ_TOKEN, settle } from './helpers';

// A page reached through the nav (the ClientRouter's swap) must behave as a fresh load (ADR 0041):
// the document stays the footer's height with nothing outside the body; the persisted dialogs still
// win a click on their triggers although every swap disconnects and connects them again (their
// document listeners register once, at definition); an open dialog stays modal across a swap on
// both persist paths (Chromium moves the element with moveBefore and keeps the top layer, Safari
// and Firefox re-insert it and lose it); and closing a dialog keeps the router's history state.
// Reproduced on 25 September 2026 on the public host in Chromium: a footer trigger after a
// client-side arrival both opened the modal and navigated.

interface Counters {
  vt: number;
  prep: number;
  swaps: number;
  loads: number;
}
type Instrumented = Window & { __oy?: Counters };

/** Counts view transitions and the router's lifecycle events, installed before the router's module runs. */
const COUNTERS = () => {
  const counters: Counters = { vt: 0, prep: 0, swaps: 0, loads: 0 };
  (window as Instrumented).__oy = counters;
  const original = document.startViewTransition?.bind(document);
  if (original) {
    document.startViewTransition = ((update: Parameters<typeof original>[0]) => {
      counters.vt += 1;
      return original(update);
    }) as typeof document.startViewTransition;
  }
  document.addEventListener('astro:before-preparation', () => {
    counters.prep += 1;
  });
  document.addEventListener('astro:after-swap', () => {
    counters.swaps += 1;
  });
  document.addEventListener('astro:page-load', () => {
    counters.loads += 1;
  });
};

/** Hides moveBefore, so the router re-inserts the persisted dialogs the way Safari and Firefox do. */
const WITHOUT_MOVE_BEFORE = () => {
  Object.defineProperty(Element.prototype, 'moveBefore', { value: undefined, configurable: true });
};

const VARIANTS = [
  { name: 'moved with moveBefore', init: undefined },
  { name: 're-inserted without moveBefore', init: WITHOUT_MOVE_BEFORE },
];

const counters = (page: Page) => page.evaluate(() => (window as Instrumented).__oy);

/** The tallest static page in both data modes (12142px seeded at 1024 wide), so the arrival drops the most height. */
const FROM = '/impact';

/**
 * A goto that survives the dev server's first load: Vite optimizes the dependencies it discovers
 * there and reloads the page once, which aborts a navigation in flight (each engine words the
 * abort differently).
 */
async function visit(page: Page, route: string) {
  try {
    await page.goto(route);
  } catch (error) {
    if (!/abort|cancel|interrupted/i.test(String(error))) throw error;
    await page.goto(route);
  }
}

/** A client-side arrival at / from another page, through the nav's logo link. */
async function arriveHome(page: Page, from: string) {
  await visit(page, from);
  await page
    .getByRole('link', { name: /Omo Yorùbá/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).not.toHaveAttribute('data-loading', 'true');
  await expect(page.locator('oy-enquiry-modal')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('oy-give-dialog')).toHaveAttribute('data-ready', 'true');
}

interface Sample {
  height: number;
  y: number;
  footerBottom: number;
  outsideBody: number;
  overlays: number;
  attrs: string[];
  open: number;
  counters?: Counters;
  /** The element whose box reaches lowest, named only when something sits below the footer. */
  lowest: string;
}

/** Scrolls to the bottom, then reads the page twenty times over two seconds. */
async function sampleBottom(page: Page): Promise<Sample[]> {
  await settle(page);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(300);
  return page.evaluate(async () => {
    const samples: Sample[] = [];
    for (let i = 0; i < 20; i += 1) {
      const footer = document.querySelector('footer.oy-footer');
      const root = document.documentElement;
      const height = root.scrollHeight;
      const footerBottom = footer
        ? Math.round(footer.getBoundingClientRect().bottom + window.scrollY)
        : -1;
      let lowest = 'nothing';
      if (Math.abs(height - footerBottom) > 1) {
        let bottom = 0;
        for (const element of document.querySelectorAll('body *, html > :not(head):not(body) *')) {
          const box = element.getBoundingClientRect();
          const reach = Math.round(box.bottom + window.scrollY);
          if (box.height === 0 || reach <= bottom) continue;
          bottom = reach;
          lowest = `${element.tagName.toLowerCase()}.${String(element.className).slice(0, 40)} at ${reach}`;
        }
      }
      const counters = (window as Instrumented).__oy;
      samples.push({
        height,
        y: Math.round(window.scrollY),
        footerBottom,
        outsideBody: document.querySelectorAll('html > :not(head):not(body)').length,
        overlays: document.querySelectorAll('sanity-visual-editing').length,
        attrs: ['data-astro-transition', 'data-astro-transition-fallback', 'data-loading'].filter(
          (name) => root.hasAttribute(name),
        ),
        open: document.querySelectorAll('dialog[open]').length,
        counters: counters ? { ...counters } : undefined,
        lowest,
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return samples;
  });
}

/** Nothing moves: the height, the scroll position, the router's counters; nothing sits below the footer. */
function expectSteady(samples: Sample[], where: string) {
  const first = samples[0];
  for (const sample of samples) {
    expect(sample.height, `${where}: the document height moved`).toBe(first.height);
    expect(sample.y, `${where}: the scroll position moved`).toBe(first.y);
    expect(
      Math.abs(sample.height - sample.footerBottom),
      `${where}: something sits below the footer (lowest: ${sample.lowest})`,
    ).toBeLessThanOrEqual(1);
    expect(sample.attrs, `${where}: a transition attribute stayed on html`).toEqual([]);
    expect(sample.open, `${where}: a dialog is open`).toBe(0);
    expect(sample.outsideBody, `${where}: something joined html`).toBe(first.outsideBody);
    expect(sample.overlays, `${where}: the overlay count moved`).toBe(first.overlays);
    expect(sample.counters, `${where}: the router moved`).toEqual(first.counters);
  }
}

test("arriving at / through the nav, the page stays the footer's height with nothing outside it", async ({
  page,
}) => {
  await page.addInitScript(COUNTERS);
  await arriveHome(page, FROM);
  const arrived = await sampleBottom(page);
  expectSteady(arrived, 'after the swap');
  expect(arrived[0].counters?.prep, 'one preparation').toBe(1);
  expect(arrived[0].counters?.swaps, 'one swap').toBe(1);
  expect(arrived[0].counters?.vt, 'at most one view transition').toBeLessThanOrEqual(1);
  expect(arrived[0].outsideBody, 'nothing but head and body under html').toBe(0);
  await page.goto('/');
  const fresh = await sampleBottom(page);
  expectSteady(fresh, 'on a fresh load');
  expect(
    Math.abs(fresh[0].height - arrived[0].height),
    'the same height as a fresh load',
  ).toBeLessThanOrEqual(2);
});

const TRIGGERS = [
  ['footer a[data-enquiry="contact"]', 'enquiry'],
  ['footer a[data-give]', 'give'],
] as const;

const isModal = (page: Page, id: string) =>
  page.locator(`dialog#${id}`).evaluate((el) => el.matches(':modal'));

for (const variant of VARIANTS) {
  test(`a footer trigger after a client-side arrival opens its dialog and nothing else, ${variant.name}`, async ({
    page,
  }) => {
    await page.addInitScript(COUNTERS);
    if (variant.init) await page.addInitScript(variant.init);
    await arriveHome(page, FROM);
    const before = await counters(page);
    for (const [selector, id] of TRIGGERS) {
      const trigger = page.locator(selector);
      const dialog = page.locator(`dialog#${id}`);
      await trigger.scrollIntoViewIfNeeded();
      await trigger.click();
      await expect(dialog).toHaveAttribute('open', '');
      // The router prepares a navigation in the click itself, so the counters already tell.
      expect(await counters(page), 'the router did not move').toEqual(before);
      await expect(page).toHaveURL(/\/$/);
      expect(await isModal(page, id), 'the dialog is modal').toBe(true);
      await expect(page.locator('dialog[open]')).toHaveCount(1);
      await page.keyboard.press('Escape');
      await expect(dialog).not.toHaveAttribute('open', '');
      await expect(trigger).toBeFocused();
    }
  });

  test(`an open dialog stays modal across a swap, ${variant.name}`, async ({ page }) => {
    await page.addInitScript(COUNTERS);
    if (variant.init) await page.addInitScript(variant.init);
    await arriveHome(page, FROM);
    const trigger = page.locator('footer a[data-give]');
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    const dialog = page.locator('dialog#give');
    await expect(dialog).toHaveAttribute('open', '');
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`${FROM}$`));
    await expect(page.locator('oy-give-dialog')).toHaveAttribute('data-ready', 'true');
    await expect(dialog).toHaveAttribute('open', '');
    expect(await isModal(page, 'give'), 'still modal after the swap').toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toHaveAttribute('open', '');
  });
}

test("closing a dialog opened by its address keeps the router's history state", async ({
  page,
}) => {
  const index = () =>
    page.evaluate(() => (window.history.state as { index?: number } | null)?.index);
  await page.goto('/#give');
  const give = page.locator('dialog#give');
  await expect(give).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(give).not.toHaveAttribute('open', '');
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('');
  expect(await index(), 'the entry keeps its index after #give closes').toBe(0);
  await page.goto('/?enquiry=contact');
  const enquiry = page.locator('dialog#enquiry');
  await expect(enquiry).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(enquiry).not.toHaveAttribute('open', '');
  await expect.poll(() => page.evaluate(() => window.location.search)).toBe('');
  expect(await index(), 'the entry keeps its index after the opener closes').toBe(0);
});

// Draft mode has no router (ADR 0041): the arrival is a full load, the overlay mounts once, and
// nothing sits below the footer. Seeded runs against the local server only: without the read token
// no page mounts the overlay, and a deployed host may hold another token or answer from its cache.
const DEPLOYED = Boolean(process.env.PLAYWRIGHT_TEST_BASE_URL);

test('in draft mode the arrival is a full load and the overlay is mounted once', async ({
  page,
  baseURL,
}) => {
  test.skip(
    PLACEHOLDER_PROJECT || !READ_TOKEN || DEPLOYED,
    'draft mode needs the read token and the local server (seeded runs only)',
  );
  await page.context().addCookies([
    { name: PERSPECTIVE_COOKIE, value: 'drafts', url: baseURL as string },
    {
      name: DRAFT_SESSION_COOKIE,
      value: draftSessionValue(READ_TOKEN as string, Date.now()),
      url: baseURL as string,
      httpOnly: true,
    },
  ]);
  await page.addInitScript(COUNTERS);
  await visit(page, FROM);
  // The layout renders the overlay's island only in draft mode, so its presence proves the signed
  // session was accepted; a refused session fails here rather than skipping (ADR 0044).
  await expect(page.locator('astro-island')).toHaveCount(1);
  await expect(page.locator('sanity-visual-editing')).toHaveCount(1);
  await expect(page.locator('meta[name="astro-view-transitions-enabled"]')).toHaveCount(0);
  await arriveHome(page, FROM);
  await expect(page.locator('sanity-visual-editing')).toHaveCount(1);
  await expect(page.locator('astro-island')).toHaveCount(1);
  const arrived = await sampleBottom(page);
  expectSteady(arrived, 'in draft mode after the arrival');
  expect(arrived[0].counters, 'a full load, no swap').toEqual({
    vt: 0,
    prep: 0,
    swaps: 0,
    loads: 0,
  });
  expect(arrived[0].outsideBody, 'the overlay host alone sits outside the body').toBe(1);
});

// Anyone can set the perspective cookie by hand (review R03): without the session the enable route
// signs, the page reads as published, so no overlay mounts and the router stays. Seeded runs only, where
// the token would otherwise read drafts.
test('a perspective cookie set by hand, without the session, reads as published', async ({
  page,
  baseURL,
}) => {
  // Worth running against a deployed host too: a hand-set cookie must read as published there.
  test.skip(
    PLACEHOLDER_PROJECT || !READ_TOKEN,
    'only the read token could read drafts (seeded runs only)',
  );
  await page.context().addCookies([
    { name: PERSPECTIVE_COOKIE, value: 'drafts', url: baseURL as string },
    { name: DRAFT_SESSION_COOKIE, value: 'forged', url: baseURL as string },
  ]);
  // A fresh query string misses any CDN copy, so the server itself answers, as in the attack (ADR 0044).
  await visit(page, `${FROM}?forged=${Date.now()}`);
  await expect(page.locator('meta[name="astro-view-transitions-enabled"]')).toHaveCount(1);
  await expect(page.locator('astro-island')).toHaveCount(0);
  await expect(page.locator('sanity-visual-editing')).toHaveCount(0);
});
