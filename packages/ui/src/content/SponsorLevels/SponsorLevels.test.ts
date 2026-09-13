import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './SponsorLevels.stories';

const { Levels, Pending } = composeStories(stories);

describe('SponsorLevels', () => {
  it('lists the levels in order as sponsor tier rows', async () => {
    const list = (await renderToBody(Levels)).querySelector('ul.oy-list');
    const names = [...(list?.querySelectorAll(':scope > li.oy-lrow--tier h3') ?? [])].map((h) =>
      text(h),
    );
    expect(names).toEqual(['[ The first level ]', '[ The second level ]']);
  });

  it('shows the Pending line with no levels', async () => {
    const body = await renderToBody(Pending);
    expect(body.querySelector('ul.oy-list')).toBeNull();
    expect(text(body.querySelector('.oy-levels-owed .oy-pend-line'))).toContain(
      'level names and amounts',
    );
  });
});
