import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody } from '../../test/stories';
import * as stories from './CardGrid.stories';

const { Three, Two, Four } = composeStories(stories);

describe('CardGrid', () => {
  it('marks the column count and holds the cards', async () => {
    const grid = (await renderToBody(Three)).querySelector('.oy-card-grid');
    expect(grid?.getAttribute('data-columns')).toBe('3');
    expect(grid?.querySelectorAll('.oy-card')).toHaveLength(3);
    expect((await renderToBody(Two)).querySelector('[data-columns="2"] .oy-card')).not.toBeNull();
    expect((await renderToBody(Four)).querySelectorAll('[data-columns="4"] .oy-card')).toHaveLength(
      4,
    );
  });
});
