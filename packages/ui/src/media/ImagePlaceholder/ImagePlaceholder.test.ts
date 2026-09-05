import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody } from '../../test/stories';
import * as stories from './ImagePlaceholder.stories';

const { Default, AdireFill, Portrait, Pending, OnDark } = composeStories(stories);

describe('ImagePlaceholder', () => {
  it('is an image with a name, an indigo fill and a 4 to 3 ratio by default', async () => {
    const body = await renderToBody(Default);
    const box = body.querySelector('.oy-ph');
    expect(box?.getAttribute('role')).toBe('img');
    expect(box?.getAttribute('aria-label')).toBe('Placeholder for the zone photo');
    expect(box?.classList.contains('oy-ph--indigo')).toBe(true);
    expect(box?.getAttribute('style')).toContain('--ph-aspect: 4 / 3');
    expect(box?.querySelector('span')?.textContent).toBe('[ the zone photo ]');
  });

  it('takes a tone and an aspect ratio', async () => {
    expect((await renderToBody(AdireFill)).querySelector('.oy-ph.oy-ph--adire')).not.toBeNull();
    const portrait = await renderToBody(Portrait);
    expect(portrait.querySelector('.oy-ph')?.getAttribute('style')).toContain('--ph-aspect: 4 / 5');
  });

  it('lets the Pending chip replace the caption through the slot, with its own label', async () => {
    const body = await renderToBody(Pending);
    const box = body.querySelector('.oy-ph');
    expect(box?.getAttribute('aria-label')).toBe('Pending: a portrait of the teacher');
    expect(box?.querySelector('.oy-pend')?.textContent).toBe('Pending: a portrait of the teacher');
    expect(body.textContent).not.toContain('[ a portrait of the teacher ]');
  });

  it('sits inside the dark scope in the OnDark story', async () => {
    const body = await renderToBody(OnDark);
    expect(body.querySelector('.oy-dark .oy-ph--terra')).not.toBeNull();
  });
});
