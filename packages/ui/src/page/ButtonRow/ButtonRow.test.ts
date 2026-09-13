import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody } from '../../test/stories';
import * as stories from './ButtonRow.stories';

const { Default } = composeStories(stories);

describe('ButtonRow', () => {
  it('holds the buttons it is given, in order', async () => {
    const row = (await renderToBody(Default)).querySelector('.oy-button-row');
    const links = Array.from(row?.querySelectorAll('a.oy-btn--quiet') ?? []);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/impact', '/gala']);
  });
});
