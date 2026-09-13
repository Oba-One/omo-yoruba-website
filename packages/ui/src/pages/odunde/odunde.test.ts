import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as phead from './Phead.stories';
import * as schedule from './Schedule.stories';
import * as zones from './Zones.stories';

const Phead = composeStories(phead);
const Zones = composeStories(zones);
const Schedule = composeStories(schedule);

describe('the Odunde page-section stories', () => {
  it('phead: the photo band or the slim header, with the glance and What Odunde is under it', async () => {
    const photo = (await renderToBody(Phead.Photo)).querySelector('.oy-home');
    expect(photo?.getAttribute('data-phead')).toBe('photo');
    expect(photo?.querySelector('header.oy-phead--photo')).not.toBeNull();
    expect(photo?.querySelectorAll('h1')).toHaveLength(1);
    expect(photo?.querySelectorAll('#glance .oy-glance > div')).toHaveLength(5);
    const about = photo?.querySelector('#about-festival');
    expect(text(about?.querySelector('h2'))).toBe('What Odunde is');
    expect(about?.querySelectorAll('.oy-prose p')).toHaveLength(2);
    expect(about?.querySelector('.oy-split-aside figure.oy-photo-tile--figure')).not.toBeNull();
    const slim = (await renderToBody(Phead.Slim)).querySelector('.oy-home');
    expect(slim?.getAttribute('data-phead')).toBe('slim');
    expect(slim?.querySelector('header.oy-phead--slim')).not.toBeNull();
    expect(slim?.querySelector('header.oy-phead--photo')).toBeNull();
  });

  it('zones: the option on the root and the block, four cards with the owed zones as placeholders', async () => {
    for (const [story, layout] of [
      [Zones.Mosaic, 'mosaic'],
      [Zones.Five, 'five'],
      [Zones.Grid, 'grid'],
      [Zones.List, 'list'],
    ] as const) {
      const root = (await renderToBody(story)).querySelector('.oy-home');
      expect(root?.getAttribute('data-zones')).toBe(layout);
      expect(root?.querySelector('#zones .oy-zones')?.getAttribute('data-layout')).toBe(layout);
      expect(root?.querySelectorAll('#zones article.oy-zone')).toHaveLength(4);
    }
  });

  it('schedule: open or closed behind the toggle, or gone with plan your visit next', async () => {
    const shown = (await renderToBody(Schedule.Shown)).querySelector('.oy-home');
    expect(shown?.querySelector('#schedule details')?.hasAttribute('open')).toBe(true);
    expect(shown?.querySelectorAll('#plan .oy-fact')).toHaveLength(8);
    const collapsed = (await renderToBody(Schedule.Collapsed)).querySelector('.oy-home');
    expect(collapsed?.querySelector('#schedule details')?.hasAttribute('open')).toBe(false);
    const hidden = (await renderToBody(Schedule.Hidden)).querySelector('.oy-home');
    expect(hidden?.querySelector('#schedule')).toBeNull();
    expect(text(hidden?.querySelector('#plan h2'))).toBe('Plan your visit');
  });
});
