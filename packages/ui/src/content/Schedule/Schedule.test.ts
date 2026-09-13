import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Schedule.stories';

const { Shown, Collapsed, RunningOrder, Pending } = composeStories(stories);

describe('Schedule', () => {
  it('sits in an open disclosure with the quiet toggle when shown, closed when collapsed', async () => {
    const shown = (await renderToBody(Shown)).querySelector('details.oy-schedule');
    expect(shown?.hasAttribute('open')).toBe(true);
    expect(shown?.querySelector('summary.oy-btn--quiet')).not.toBeNull();
    expect(shown?.querySelectorAll('ol.oy-sched > li')).toHaveLength(3);
    const collapsed = (await renderToBody(Collapsed)).querySelector('details.oy-schedule');
    expect(collapsed?.hasAttribute('open')).toBe(false);
  });

  it('lists a running order without a toggle, and names the rows it waits for', async () => {
    const order = (await renderToBody(RunningOrder)).querySelector('.oy-schedule');
    expect(order?.tagName).toBe('DIV');
    expect(order?.querySelector('summary')).toBeNull();
    expect(order?.querySelector('.oy-sched-tag')).toBeNull();
    const pending = (await renderToBody(Pending)).querySelector('.oy-schedule');
    expect(text(pending?.querySelector('.oy-pend-line'))).toContain('the rows, times and content');
  });
});
