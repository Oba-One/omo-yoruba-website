import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody } from '../../test/stories';
import * as stories from './Divider.stories';

const { Default, Thin, Ayo, Ornament, Seam, OnDark } = composeStories(stories);

describe('Divider', () => {
  it('draws the aṣọ òkè stripe by default, hidden from assistive technology', async () => {
    const body = await renderToBody(Default);
    const divider = body.querySelector('.oy-divider-asoke');
    expect(divider?.getAttribute('aria-hidden')).toBe('true');
    expect(divider?.classList.contains('oy-divider-asoke--thin')).toBe(false);
  });

  it('has a thin form', async () => {
    const body = await renderToBody(Thin);
    expect(body.querySelector('.oy-divider-asoke.oy-divider-asoke--thin')).not.toBeNull();
  });

  it('draws the ayo row as three dots', async () => {
    const body = await renderToBody(Ayo);
    const row = body.querySelector('.oy-divider-ayo');
    expect(row?.getAttribute('aria-hidden')).toBe('true');
    expect(row?.querySelectorAll('i')).toHaveLength(3);
  });

  it('draws the ornament as a decorative block', async () => {
    const body = await renderToBody(Ornament);
    expect(body.querySelector('.oy-divider-ornament')?.getAttribute('aria-hidden')).toBe('true');
    expect(body.querySelector('.oy-divider-asoke')).toBeNull();
  });

  it('draws the seam as a decorative band of its own', async () => {
    const body = await renderToBody(Seam);
    expect(body.querySelector('.oy-seam')?.getAttribute('aria-hidden')).toBe('true');
    expect(body.querySelector('.oy-divider-asoke')).toBeNull();
  });

  it('puts the ayo row inside the dark scope in the OnDark story', async () => {
    const body = await renderToBody(OnDark);
    expect(body.querySelector('.oy-dark .oy-divider-ayo')).not.toBeNull();
  });
});
