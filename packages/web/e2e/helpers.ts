import type { Page } from '@playwright/test';

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

export type ActionAnswer = (name: string, posted: Record<string, string>) => unknown;

/**
 * Answers every action request without touching Sanity (QUALITY.md section 2). `name` is the
 * action path, `enquiry.vendor` or `newsletter`; the posted form fields come along. A small
 * delay keeps the busy state observable.
 */
export async function interceptActions(page: Page, answer: ActionAnswer, delayMs = 350) {
  await page.route('**/_actions/**', async (route) => {
    const request = route.request();
    const name = new URL(request.url()).pathname.replace(/^\/_actions\//, '').replace(/\/$/, '');
    const posted: Record<string, string> = {};
    const body = request.postData() ?? '';
    // Multipart bodies carry each field as a part; read the plain ones.
    for (const match of body.matchAll(/name="([^"]+)"\r?\n\r?\n([^\r\n]*)/g)) {
      posted[match[1] as string] = match[2] as string;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    await route.fulfill({
      status: 200,
      contentType: 'application/json+devalue',
      body: encodeActionResult(answer(name, posted)),
    });
  });
}
