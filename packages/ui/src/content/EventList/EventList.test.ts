import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './EventList.stories';

const { Default, Pending } = composeStories(stories);

describe('EventList', () => {
  it('lists each event as a row with its date, where and the action', async () => {
    const list = (await renderToBody(Default)).querySelector('ul.oy-list[role="list"]');
    const rows = list?.querySelectorAll('li.oy-lrow--event');
    expect(rows).toHaveLength(2);
    expect(text(rows?.[0]?.querySelector('.oy-lrow-date'))).toBe('[ Month ][ 00 ]');
    expect(text(rows?.[1]?.querySelector('.oy-lrow-where'))).toBe(
      '[ Weekday, time ] • Pending: the venue',
    );
    expect(list?.querySelectorAll('a[data-enquiry="contact"]')).toHaveLength(2);
  });

  it('shows the Pending line with nothing to come', async () => {
    const body = await renderToBody(Pending);
    expect(body.querySelector('ul')).toBeNull();
    expect(text(body.querySelector('.oy-pend-line'))).toContain('the next Collective events');
  });
});
