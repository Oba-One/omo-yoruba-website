import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Pending.stories';

const { Default, Unnamed, Line, BlockGold, OnDark } = composeStories(stories);

describe('Pending', () => {
  it('names the missing item in the chip', async () => {
    const body = await renderToBody(Default);
    expect(body.querySelector('span.oy-pend')?.textContent).toBe('Pending: 2027 date');
  });

  it('reads Pending alone when nothing names it', async () => {
    const body = await renderToBody(Unnamed);
    expect(body.querySelector('.oy-pend')?.textContent).toBe('Pending');
  });

  it('renders the Pending from you line with its sentence', async () => {
    const body = await renderToBody(Line);
    const line = body.querySelector('p.oy-pend-line');
    expect(line?.querySelector('b')?.textContent).toBe('Pending from you');
    expect(text(line)).toContain('The named contact who follows this up');
  });

  it('renders the block as a captioned placeholder with the dot fill in the chosen tone', async () => {
    const body = await renderToBody(BlockGold);
    const block = body.querySelector('.oy-ph.oy-ph--gold');
    expect(block?.getAttribute('role')).toBe('img');
    expect(block?.getAttribute('aria-label')).toBe('Pending: the gala photo');
    expect(block?.getAttribute('style')).toContain('--ph-aspect: 1 / 1');
    expect(block?.querySelector('.oy-pend')?.textContent).toBe('Pending: the gala photo');
  });

  it('sits inside the dark scope in the OnDark story', async () => {
    const body = await renderToBody(OnDark);
    expect(body.querySelector('.oy-dark .oy-pend')).not.toBeNull();
  });
});
