import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as phead from './Phead.stories';

const Phead = composeStories(phead);

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
});
