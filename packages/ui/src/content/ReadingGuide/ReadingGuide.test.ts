import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody } from '../../test/stories';
import * as stories from './ReadingGuide.stories';

const { Default } = composeStories(stories);

describe('ReadingGuide', () => {
  it('links each task to a heading in the reading column', async () => {
    const body = await renderToBody(Default);
    const nav = body.querySelector('nav[aria-label="Guide contents"]');
    const links = nav?.querySelectorAll('a') ?? [];
    expect(links).toHaveLength(2);
    for (const link of links) {
      const heading = body.querySelector(link.getAttribute('href') as string);
      expect(heading?.textContent).toBe(link.textContent);
    }
    expect(body.querySelector('main article h1')?.textContent).toBe('Your guide to Studio');
  });
});
