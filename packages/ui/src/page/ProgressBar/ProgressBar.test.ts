import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody } from '../../test/stories';
import * as stories from './ProgressBar.stories';

const { Default, Loading } = composeStories(stories);

describe('ProgressBar', () => {
  it('is decorative and idle by default', async () => {
    const bar = (await renderToBody(Default)).querySelector('.oy-progress');
    expect(bar?.getAttribute('aria-hidden')).toBe('true');
    expect(bar?.hasAttribute('data-loading')).toBe(false);
  });

  it('renders the loading state for the story', async () => {
    const bar = (await renderToBody(Loading)).querySelector('.oy-progress');
    expect(bar?.getAttribute('data-loading')).toBe('true');
  });
});
