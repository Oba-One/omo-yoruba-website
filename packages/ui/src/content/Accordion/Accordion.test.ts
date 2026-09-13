import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Accordion.stories';

const { Default, DefaultOpen, Answered, Multi, Pending } = composeStories(stories);

const itemsOf = (body: HTMLElement) => [...body.querySelectorAll('.oy-faq > details.oy-faq-item')];

describe('Accordion', () => {
  it('draws one native disclosure per question in one named group, all closed by default', async () => {
    const body = await renderToBody(Default);
    const items = itemsOf(body);
    expect(items).toHaveLength(5);
    expect(new Set(items.map((item) => item.getAttribute('name')))).toEqual(
      new Set(['faq-default-questions']),
    );
    expect(items.some((item) => item.hasAttribute('open'))).toBe(false);
    const summary = items[0]?.querySelector(':scope > summary.oy-faq-q');
    expect(text(summary?.querySelector('.oy-faq-text'))).toBe('How much does it cost?');
    expect(summary?.querySelector('.oy-faq-mark')?.getAttribute('aria-hidden')).toBe('true');
    // The marks are drawn: neither glyph appears in the markup.
    expect(body.innerHTML).not.toMatch(/[+−]/);
  });

  it("opens onto the registry's chip for an unanswered question, and the answer through Prose", async () => {
    const owed = itemsOf(await renderToBody(Default))[0];
    expect(text(owed?.querySelector('.oy-faq-a .oy-pend'))).toBe('Pending: an answer');
    const answered = itemsOf(await renderToBody(Answered))[0];
    expect(text(answered?.querySelector('.oy-faq-a .oy-prose'))).toBe(
      '[ The answer, in her words ]',
    );
    expect(answered?.querySelector('.oy-faq-a .oy-pend')).toBeNull();
  });

  it('opens the first question only with defaultOpen, and drops the group for multi', async () => {
    const open = itemsOf(await renderToBody(DefaultOpen));
    expect(open.map((item) => item.hasAttribute('open'))).toEqual([
      true,
      false,
      false,
      false,
      false,
    ]);
    const multi = itemsOf(await renderToBody(Multi));
    expect(multi.every((item) => !item.hasAttribute('name'))).toBe(true);
  });

  it('shows the Pending line with no questions', async () => {
    const body = await renderToBody(Pending);
    expect(body.querySelector('.oy-faq')).toBeNull();
    expect(text(body.querySelector('.oy-pend-line'))).toContain('the questions parents ask');
  });
});
