import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as cards from './Cards.stories';

const Cards = composeStories(cards);

describe('the Programs page-section stories', () => {
  it('cards: the option on the root, the columns, the cards and the one heading', async () => {
    for (const [story, option, columns, count] of [
      [Cards.Four, 'four', '4', 4],
      [Cards.Three, 'three', '3', 3],
      [Cards.Pairs, 'pairs', '2', 4],
    ] as const) {
      const root = (await renderToBody(story)).querySelector('.oy-home');
      expect(root?.getAttribute('data-cards')).toBe(option);
      expect(root?.querySelectorAll('h1')).toHaveLength(1);
      expect(root?.querySelector('header.oy-phead--slim')).not.toBeNull();
      const grid = root?.querySelector('#four .oy-card-grid');
      expect(grid?.getAttribute('data-columns')).toBe(columns);
      expect(grid?.querySelectorAll('[data-program]')).toHaveLength(count);
      // The hidden heading keeps the cards' h3s from following the h1 directly.
      expect(text(root?.querySelector('#four h2.oy-visually-hidden'))).toBe('The programs');
    }
  });

  it('closes with the take-part band: enrol in gold, the give row quiet', async () => {
    const root = (await renderToBody(Cards.Four)).querySelector('#take-part');
    expect(text(root?.querySelector('h2'))).toBe('Take part');
    expect(root?.querySelectorAll('.oy-path')).toHaveLength(3);
    expect(root?.querySelector('.oy-path[data-way="enrol"] .oy-btn--primary')).not.toBeNull();
    expect(root?.querySelector('.oy-path[data-way="give"] .oy-btn--quiet')).not.toBeNull();
  });
});
