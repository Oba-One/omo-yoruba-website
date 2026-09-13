import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './CardGrid.stories';

const { Three, Two, One, Five, Four, ProgramsFour, ProgramsPairs, Pending, WithNote } =
  composeStories(stories);

describe('CardGrid', () => {
  it('marks the column count and holds the cards', async () => {
    const grid = (await renderToBody(Three)).querySelector('.oy-card-grid');
    expect(grid?.getAttribute('data-columns')).toBe('3');
    expect(grid?.querySelectorAll('.oy-card')).toHaveLength(3);
    expect((await renderToBody(Two)).querySelector('[data-columns="2"] .oy-card')).not.toBeNull();
    expect((await renderToBody(Four)).querySelectorAll('[data-columns="4"] .oy-card')).toHaveLength(
      4,
    );
    expect((await renderToBody(One)).querySelectorAll('[data-columns="1"] .oy-card')).toHaveLength(
      2,
    );
    expect((await renderToBody(Five)).querySelectorAll('[data-columns="5"] .oy-card')).toHaveLength(
      5,
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

  it('closes the grid with its note when the page gives one, and draws no empty note otherwise', async () => {
    const body = await renderToBody(WithNote);
    const note = body.querySelector('.oy-card-grid + p.oy-card-grid-note');
    expect(text(note)).toBe(
      'Each card says who it is for and when it runs, so you can find the right one at a glance.',
    );
    expect((await renderToBody(Four)).querySelector('.oy-card-grid-note')).toBeNull();
  });
});
