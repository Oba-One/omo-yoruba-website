import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './ActionButton.stories';

const { Default, Give, NewTab, Anchor, Pending, Quiet } = composeStories(stories);

describe('ActionButton', () => {
  it('renders an enquiry action as a modal trigger with the no-JavaScript link', async () => {
    const body = await renderToBody(Default);
    const link = body.querySelector('a.oy-btn');
    expect(link?.getAttribute('href')).toBe('?enquiry=member#enquiry');
    expect(link?.getAttribute('data-enquiry')).toBe('member');
    expect(link?.className.split(' ')).toContain('oy-btn--primary');
    expect(text(link)).toContain('Become a member');
    expect(link?.querySelector('.oy-btn-arrow')).not.toBeNull();
  });

  it('renders a give action as the Give Dialog trigger', async () => {
    const link = (await renderToBody(Give)).querySelector('a.oy-btn');
    expect(link?.getAttribute('href')).toBe('/donate#give');
    expect(link?.hasAttribute('data-give')).toBe(true);
  });

  it('opens an external link in a new tab with noopener, and an anchor as an outline button', async () => {
    const link = (await renderToBody(NewTab)).querySelector('a.oy-btn');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener');
    const anchor = (await renderToBody(Anchor)).querySelector('a.oy-btn');
    expect(anchor?.getAttribute('href')).toBe('#plan');
    expect(anchor?.className.split(' ')).toContain('oy-btn--secondary');
    expect((await renderToBody(Quiet)).querySelector('.oy-btn--quiet')).not.toBeNull();
  });

  it('shows a Pending chip when the action is half filled', async () => {
    const body = await renderToBody(Pending);
    expect(body.querySelector('a.oy-btn')).toBeNull();
    expect(text(body.querySelector('.oy-pend'))).toBe('Pending: which form this button opens');
  });
});
