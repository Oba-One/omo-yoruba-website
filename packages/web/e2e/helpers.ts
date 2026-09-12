import type { Locator, Page } from '@playwright/test';

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
