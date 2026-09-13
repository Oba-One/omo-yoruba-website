import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Split.stories';

const { Default } = composeStories(stories);

describe('Split', () => {
  it('puts the copy first and the aside second inside the tokens split', async () => {
    const split = (await renderToBody(Default)).querySelector('.oy-split');
    expect(text(split?.children[0])).toMatch(/^The copy column/);
    expect(text(split?.children[1])).toMatch(/^The aside/);
  });
});
