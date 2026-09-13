import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Split.stories';

const { Default, Person } = composeStories(stories);

describe('Split', () => {
  it('puts the copy first and the aside second inside the tokens split', async () => {
    const split = (await renderToBody(Default)).querySelector('.oy-split');
    expect(text(split?.children[0])).toMatch(/^The copy column/);
    expect(text(split?.children[1])).toMatch(/^The aside/);
  });

  it('marks the person shape, and none by default', async () => {
    expect(
      (await renderToBody(Person)).querySelector('.oy-split')?.getAttribute('data-shape'),
    ).toBe('person');
    expect(
      (await renderToBody(Default)).querySelector('.oy-split')?.hasAttribute('data-shape'),
    ).toBe(false);
  });
});
