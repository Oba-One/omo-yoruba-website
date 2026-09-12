import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody } from '../../test/stories';
import * as stories from './PathRows.stories';

const { Column, Kicker, Pending } = composeStories(stories);

describe('PathRows', () => {
  it('stacks the rows inside the take-part column with the label style', async () => {
    const stack = (await renderToBody(Column)).querySelector('.oy-takepart');
    expect(stack?.getAttribute('data-labels')).toBe('column');
    expect(stack?.querySelectorAll('.oy-path')).toHaveLength(2);
    expect(stack?.querySelectorAll('.oy-btn--primary')).toHaveLength(1);
    expect((await renderToBody(Kicker)).querySelector('[data-labels="kicker"]')).not.toBeNull();
    expect((await renderToBody(Pending)).querySelectorAll('.oy-path .oy-pend')).toHaveLength(4);
  });
});
