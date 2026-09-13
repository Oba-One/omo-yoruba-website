import AxeBuilder from '@axe-core/playwright';
import { ENQUIRY_SPECS, type EnquiryKind } from '@oy/content/enquiry-kinds';
import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Whether this run reads the placeholder project CI uses, where every Sanity read answers null
 * (`docs/runbook.md`). Seeded runs load the project from `packages/web/.env` inside the server, so the
 * test process sees no such variable.
 */
export const PLACEHOLDER_PROJECT = process.env.PUBLIC_SANITY_PROJECT_ID === 'placeholder';

/** Axe's WCAG 2.1 A and AA violations on the page as it stands: each rule and its first nodes. */
export async function axeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  return results.violations.map((violation) => ({
    id: violation.id,
    nodes: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
  }));
}

/**
 * An enquiry trigger's round trip: the click opens the Enquiry Modal on the trigger's own kind, Escape
 * closes it, and focus returns to the trigger.
 */
export async function expectEnquiryRoundTrip(page: Page, trigger: Locator) {
  const kind = (await trigger.getAttribute('data-enquiry')) as EnquiryKind;
  const dialog = page.locator('dialog#enquiry');
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  await expect(dialog).toHaveAttribute('open', '');
  await expect(page.locator('#enquiry-title')).toHaveText(ENQUIRY_SPECS[kind].title);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(trigger).toBeFocused();
}

/** A layout option as the page root carries it on the body (`data-<name>`). */
export const bodyOption = (page: Page, name: string) =>
  page.locator('body').getAttribute(`data-${name}`);

/** A Give trigger's round trip: the click opens the Give Dialog, Escape closes it, focus returns to it. */
export async function expectGiveRoundTrip(page: Page, trigger: Locator) {
  const dialog = page.locator('dialog#give');
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  await expect(dialog).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(trigger).toBeFocused();
}

/**
 * devalue's flat encoding for a plain object of primitives and nested objects: the root at
 * index 0, every value an index into the array. It is what Astro's action client decodes from
 * an `application/json+devalue` answer, so an intercepted action reads like a real one.
 */
export function encodeActionResult(data: unknown): string {
  const values: unknown[] = [];
  const flatten = (value: unknown): number => {
    const index = values.length;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const holder: Record<string, number> = {};
      values.push(holder);
      for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        holder[key] = flatten(child);
      }
      return index;
    }
    values.push(value);
    return index;
  };
  flatten(data);
  return JSON.stringify(values);
}

export type ActionAnswer = (name: string) => unknown;

/**
 * Answers every action request without touching Sanity (QUALITY.md section 2). `name` is the
 * action path, `enquiry.vendor` or `newsletter`. The delay keeps the busy state on screen long
 * enough to assert on a slow runner.
 */
export async function interceptActions(page: Page, answer: ActionAnswer, delayMs = 800) {
  await page.route('**/_actions/**', async (route) => {
    const name = new URL(route.request().url()).pathname
      .replace(/^\/_actions\//, '')
      .replace(/\/$/, '');
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    await route.fulfill({
      status: 200,
      contentType: 'application/json+devalue',
      body: encodeActionResult(answer(name)),
    });
  });
}

/**
 * Opens the Enquiry Modal on one kind, the same kind in every environment: from the home page's
 * own trigger when it has one (the member and partner doors come from the Studio, the footer's
 * volunteer and contact links are always there), else through the `?enquiry=<kind>` opener, which
 * serves the dialog open. CI builds with a placeholder project, so the doors hold no trigger
 * there. Answers the trigger it clicked, so a spec can check focus returns to it.
 */
export async function openEnquiry(page: Page, kind: string): Promise<Locator | undefined> {
  const trigger = page
    .locator(`main [data-enquiry="${kind}"], footer [data-enquiry="${kind}"]`)
    .first();
  if ((await trigger.count()) === 0) {
    await page.goto(`/?enquiry=${kind}`);
    return undefined;
  }
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  return trigger;
}

/** Waits for every finite animation on the page, so axe reads the settled colours. */
export const settle = (page: Page) =>
  page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  );

/**
 * A prototype's mock value never stands in for a fact the page still owes. Each pair is the mock
 * value and the registry wording of its fact: while the page shows that fact's Pending chip or
 * line, the mock value appears nowhere. Once the Studio holds the fact the chip goes, and the same
 * words may be the confirmed value, so the check stops there.
 */
export function expectNoMockWhileOwed(
  text: string,
  mocks: readonly (readonly [mock: RegExp, what: string | undefined])[],
) {
  for (const [mock, what] of mocks) {
    expect(what, `the registry names the fact behind ${mock}`).toBeDefined();
    const wording = (what as string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const owed = new RegExp(`Pending(?::\\s*|\\s*from you\\s*)${wording}`, 'i');
    if (owed.test(text)) expect(text, `${mock} while "${what}" is owed`).not.toMatch(mock);
  }
}

/**
 * The gold rule (QUALITY section 2): one gold primary action per screen view. Answers each pair of
 * visible gold actions in `main` close enough that one viewport shows both, as their labels; the nav's
 * Donate is sticky and never counted. Empty means the page keeps the rule at this viewport.
 */
export const goldSharingAView = (page: Page) =>
  page.evaluate(() => {
    const height = window.innerHeight;
    const gold = Array.from(document.querySelectorAll<HTMLElement>('main .oy-btn--primary'))
      .filter((el) => el.checkVisibility())
      .map((el) => {
        const box = el.getBoundingClientRect();
        return {
          label: (el.textContent ?? '').replace(/\s+/g, ' ').trim(),
          top: box.top + window.scrollY,
          bottom: box.bottom + window.scrollY,
        };
      })
      .sort((a, b) => a.top - b.top);
    return gold
      .slice(1)
      .map((next, at) => [gold[at], next] as const)
      .filter(([one, other]) => one && other.top - one.bottom < height)
      .map(([one, other]) => `${one?.label} + ${other.label}`);
  });
