import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody } from '../../test/stories';
import * as stories from './HomeRoot.stories';

const { Default, Subtle } = composeStories(stories);

describe('HomeRoot', () => {
  it('carries the defaults of the options as data attributes', async () => {
    const root = (await renderToBody(Default)).querySelector('.oy-home');
    expect(root?.getAttribute('data-card')).toBe('grain-dots');
    // The site's default theme, which sets the band and alternate section surfaces.
    expect(root?.getAttribute('data-theme')).toBe('adire');
    expect(root?.getAttribute('data-highlight')).toBe('festival');
    expect(root?.getAttribute('data-pattern')).toBe('rich');
    expect(root?.getAttribute('data-motion')).toBe('true');
    expect(root?.hasAttribute('data-season')).toBe(false);
  });

  it('writes the chosen values, motion off as false', async () => {
    const root = (await renderToBody(Subtle)).querySelector('.oy-home');
    expect(root?.getAttribute('data-pattern')).toBe('subtle');
    expect(root?.getAttribute('data-motion')).toBe('false');
    expect(root?.getAttribute('data-highlight')).toBe('collective');
  });
});
