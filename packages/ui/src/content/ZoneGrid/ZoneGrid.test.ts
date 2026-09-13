import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './ZoneGrid.stories';

const { Mosaic, Five, Grid, List, Pending } = composeStories(stories);

describe('ZoneGrid', () => {
  it('draws the named zones in order, then placeholders up to the confirmed four', async () => {
    const grid = (await renderToBody(Mosaic)).querySelector('.oy-zones');
    expect(grid?.getAttribute('data-layout')).toBe('mosaic');
    const cards = Array.from(grid?.querySelectorAll('article.oy-zone') ?? []);
    expect(cards).toHaveLength(4);
    expect(cards.map((card) => text(card.querySelector('h3')) ?? null)).toEqual([
      'Ọjà Balógun',
      'Àgbàlá Ọmọde',
      null,
      null,
    ]);
    expect(cards.slice(2).every((card) => card.classList.contains('oy-zone--pending'))).toBe(true);
  });

  it('passes the layout to the tokens for five, grid and list', async () => {
    for (const [story, layout] of [
      [Five, 'five'],
      [Grid, 'grid'],
      [List, 'list'],
    ] as const) {
      const grid = (await renderToBody(story)).querySelector('.oy-zones');
      expect(grid?.getAttribute('data-layout')).toBe(layout);
    }
  });

  it('renders four placeholders when no zone exists', async () => {
    const grid = (await renderToBody(Pending)).querySelector('.oy-zones');
    expect(grid?.querySelectorAll('article.oy-zone--pending')).toHaveLength(4);
  });
});
