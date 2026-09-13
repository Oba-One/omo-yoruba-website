import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Timeline.stories';

const { Milestones, Plain, Pending } = composeStories(stories);

describe('Timeline', () => {
  it('lists each year and its line, the milestones marked apart', async () => {
    const list = (await renderToBody(Milestones)).querySelector('ol.oy-timeline');
    const items = [...(list?.querySelectorAll('li') ?? [])];
    expect(
      items.map((item) => [text(item.querySelector('b')), text(item.querySelector('p'))]),
    ).toEqual([
      ['[ Year ]', '[ The founding, in one line ]'],
      ['[ Year to year ]', '[ What happened across these years ]'],
      ['[ Year ]', '[ What happened that year ]'],
      ['[ Today ]', '[ Where the work stands now ]'],
    ]);
    expect(items.map((item) => item.classList.contains('oy-timeline-major'))).toEqual([
      true,
      false,
      false,
      true,
    ]);
    expect(list?.querySelector('h2, h3, h4')).toBeNull();
  });

  it('marks no milestone when none is set, and names the entries owed when there are none', async () => {
    expect((await renderToBody(Plain)).querySelectorAll('.oy-timeline-major')).toHaveLength(0);
    const empty = await renderToBody(Pending);
    expect(empty.querySelector('ol.oy-timeline')).toBeNull();
    expect(text(empty.querySelector('.oy-pend-line'))).toContain('the dated entries');
  });
});
