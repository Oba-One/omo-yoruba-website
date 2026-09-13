import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody } from '../../test/stories';
import * as stories from './PageRoot.stories';

const { Default, Treatment, Scope } = composeStories(stories);

describe('PageRoot', () => {
  it('carries the theme, the card texture and one data attribute per option', async () => {
    const root = (await renderToBody(Default)).querySelector('.oy-home');
    expect(root?.getAttribute('data-theme')).toBe('adire');
    expect(root?.getAttribute('data-card')).toBe('grain-dots');
    expect(root?.getAttribute('data-phead')).toBe('photo');
    expect(root?.getAttribute('data-schedule')).toBe('shown');
    const warm = (await renderToBody(Treatment)).querySelector('.oy-home');
    expect(warm?.getAttribute('data-treatment')).toBe('warm');
    expect(warm?.hasAttribute('data-phead')).toBe(false);
  });

  it('wraps the sections in a scope when the page has one, as the site marks its main', async () => {
    const root = (await renderToBody(Scope)).querySelector('.oy-home');
    expect(root?.getAttribute('data-green')).toBe('strong');
    const scope = root?.querySelector(':scope > [data-scope="collective"]');
    expect(scope).toBeInstanceOf(HTMLElement);
    expect(scope?.querySelector('p')).toBeInstanceOf(HTMLElement);
    expect((await renderToBody(Default)).querySelector('[data-scope]')).toBeNull();
  });
});
