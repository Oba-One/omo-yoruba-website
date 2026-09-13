import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody } from '../../test/stories';
import * as stories from './Section.stories';

const { Default, Alt, Paper, Batik, Narrow, Dark } = composeStories(stories);

describe('Section', () => {
  it('wraps the content at the content width and labels the section by its heading', async () => {
    const section = (await renderToBody(Default)).querySelector('section.oy-section');
    expect(section?.getAttribute('aria-labelledby')).toBe('voices-h');
    expect(section?.querySelector('.oy-wrap h2#voices-h')).not.toBeNull();
    expect(section?.querySelector('.oy-pattern')).toBeNull();
  });

  it('takes the tint, the paper ground and the textures', async () => {
    expect((await renderToBody(Alt)).querySelector('.oy-section--alt')).not.toBeNull();
    expect((await renderToBody(Paper)).querySelector('.oy-section--paper')).not.toBeNull();
    const batik = (await renderToBody(Batik)).querySelector('.oy-section--textured');
    expect(batik?.querySelector('.oy-pattern--batik')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('narrows the wrap to 900px when asked', async () => {
    const narrow = (await renderToBody(Narrow)).querySelector('section');
    expect(narrow?.classList.contains('oy-section--narrow')).toBe(true);
    expect((await renderToBody(Default)).querySelector('section.oy-section--narrow')).toBeNull();
  });

  it('draws the dark band in the dark scope with its drifting dot field', async () => {
    const section = (await renderToBody(Dark)).querySelector('section.oy-section');
    expect(section?.classList.contains('oy-section--dark')).toBe(true);
    expect(section?.classList.contains('oy-dark')).toBe(true);
    expect(
      section?.querySelector(':scope > .v2-dots.v2-dots--drift')?.getAttribute('aria-hidden'),
    ).toBe('true');
  });
});
