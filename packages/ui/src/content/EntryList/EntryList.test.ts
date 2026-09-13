import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './EntryList.stories';

const { Default, LinePending, Pending, WithDetail } = composeStories(stories);

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

  it("sets each row's detail under its line, with the chip for what the detail still owes", async () => {
    const rows = (await renderToBody(WithDetail)).querySelectorAll('.oy-lrow');
    expect(text(rows[0]?.querySelector('.oy-lrow-where'))).toBe('[ The mailing address ]');
    const fund = rows[1]?.querySelector('.oy-lrow-where');
    expect(text(fund)).toBe('Our legal name is Omo Yorùbá of Southern California. Pending: EIN');
    expect((await renderToBody(Default)).querySelector('.oy-lrow-where')).toBeNull();
  });
});
