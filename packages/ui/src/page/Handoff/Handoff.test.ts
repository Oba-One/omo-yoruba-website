import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Handoff.stories';

const { Default, Quiet, ButtonOnly, Box, BoxTwoButtons, BoxPending } = composeStories(stories);

describe('Handoff', () => {
  it('renders the outline button and the line beside it', async () => {
    const line = (await renderToBody(Default)).querySelector('.oy-handoff-line');
    const button = line?.querySelector('a.oy-btn');
    expect(button?.getAttribute('href')).toBe('/gallery');
    expect(button?.className).toContain('oy-btn--secondary');
    expect(text(button)).toContain('Open the photo gallery');
    expect(text(line?.querySelector('.oy-handoff-text'))).toBe(
      'Odunde, the Gala, and the language lessons, year by year.',
    );
  });

  it('takes the quiet variant and stands without a line', async () => {
    expect((await renderToBody(Quiet)).querySelector('.oy-btn--quiet')).not.toBeNull();
    expect((await renderToBody(ButtonOnly)).querySelector('.oy-handoff-text')).toBeNull();
  });

  it('draws the box with the line first and the quiet Donate after it', async () => {
    const box = (await renderToBody(Box)).querySelector('.oy-handoff');
    expect(text(box?.querySelector('p.oy-handoff-say'))).toBe(
      'Too small to sponsor, but want the day to happen? A gift does the same work.',
    );
    const buttons = box?.querySelectorAll('.oy-handoff-actions a.oy-btn');
    expect(buttons).toHaveLength(1);
    expect(buttons?.[0]?.className).toContain('oy-btn--quiet');
    expect(buttons?.[0]?.hasAttribute('data-give')).toBe(true);
  });

  it('adds the second button as the outline without an arrow', async () => {
    const buttons = (await renderToBody(BoxTwoButtons)).querySelectorAll('.oy-handoff a.oy-btn');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]?.className).toContain('oy-btn--primary');
    expect(buttons[1]?.className).toContain('oy-btn--secondary');
    expect(buttons[1]?.getAttribute('data-enquiry')).toBe('sponsor');
    expect(buttons[1]?.querySelector('.oy-btn-arrow')).toBeNull();
  });

  it("puts the registry's chip in the box's line while that fact is owed", async () => {
    const box = (await renderToBody(BoxPending)).querySelector('.oy-handoff');
    expect(text(box?.querySelector('p.oy-handoff-say .oy-pend'))).toBe('Pending: the blurb');
    expect(box?.querySelector('a[data-give]')).not.toBeNull();
  });
});
