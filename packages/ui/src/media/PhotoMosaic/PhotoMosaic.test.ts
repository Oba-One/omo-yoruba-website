import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody } from '../../test/stories';
import * as stories from './PhotoMosaic.stories';

const { Seven, Five, Three, Padded, Pending } = composeStories(stories);

describe('PhotoMosaic', () => {
  it('shows as many tiles as the option asks for', async () => {
    const seven = (await renderToBody(Seven)).querySelector('.oy-mosaic');
    expect(seven?.getAttribute('data-count')).toBe('7');
    expect(seven?.querySelectorAll('figure.v2-mo')).toHaveLength(7);
    expect((await renderToBody(Five)).querySelectorAll('[data-count="5"] figure')).toHaveLength(5);
    expect((await renderToBody(Three)).querySelectorAll('[data-count="3"] figure')).toHaveLength(3);
  });

  it('pads missing tiles with the placeholder', async () => {
    const padded = (await renderToBody(Padded)).querySelector('.oy-mosaic');
    expect(padded?.querySelectorAll('img')).toHaveLength(2);
    expect(padded?.querySelectorAll('.oy-ph--adire')).toHaveLength(5);
    expect((await renderToBody(Pending)).querySelectorAll('.oy-ph--adire')).toHaveLength(7);
  });
});
