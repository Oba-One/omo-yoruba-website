import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './EntryList.stories';

const { Default, LinePending, Pending } = composeStories(stories);

describe('EntryList', () => {
  it('lists each entry as a row with its title and line', async () => {
    const list = (await renderToBody(Default)).querySelector('ul.oy-list[role="list"]');
    expect(list?.querySelectorAll('li.oy-lrow--entry')).toHaveLength(3);
    expect(text(list?.querySelector('li h3'))).toBe('[ Level 1 ]');
  });

  it("names an entry's owed line, and shows the Pending line with no entries", async () => {
    const first = (await renderToBody(LinePending)).querySelector('li.oy-lrow--entry');
    expect(text(first?.querySelector('p .oy-pend'))).toBe('Pending: what the level covers');
    const body = await renderToBody(Pending);
    expect(body.querySelector('ul')).toBeNull();
    expect(text(body.querySelector('.oy-pend-line'))).toContain('what each level covers');
  });
});
