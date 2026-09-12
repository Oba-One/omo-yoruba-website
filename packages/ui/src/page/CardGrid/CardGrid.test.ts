import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody } from '../../test/stories';
import * as stories from './CardGrid.stories';

const { Three, Two, Four, ProgramsFour, ProgramsPairs, Pending } = composeStories(stories);

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

  it('arranges the program cards four across, three or in pairs', async () => {
    expect(
      (await renderToBody(ProgramsFour)).querySelectorAll('[data-columns="4"] [data-program]'),
    ).toHaveLength(4);
    expect(
      (await renderToBody(ProgramsPairs)).querySelectorAll('[data-columns="2"] [data-program]'),
    ).toHaveLength(4);
    expect((await renderToBody(Pending)).querySelectorAll('.oy-card .oy-pend')).toHaveLength(3);
  });
});
