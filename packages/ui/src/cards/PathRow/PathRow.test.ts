import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './PathRow.stories';

const { Member, Partner, Pending } = composeStories(stories);

describe('PathRow', () => {
  it('renders the chip, the copy and the gold enquiry trigger for the member door', async () => {
    const row = (await renderToBody(Member)).querySelector('.oy-path[data-door="member"]');
    expect(text(row?.querySelector('.oy-path-chip'))).toBe('Membership');
    expect(row?.getAttribute('data-accent')).toBe('performer');
    expect(text(row?.querySelector('.oy-path-body h3'))).toBe('Become a member');
    const button = row?.querySelector('a.oy-btn');
    expect(button?.className).toContain('oy-btn--primary');
    expect(button?.getAttribute('data-enquiry')).toBe('member');
  });

  it('accents the partner row as the sponsor way in with the outline trigger', async () => {
    const row = (await renderToBody(Partner)).querySelector('.oy-path');
    expect(row?.getAttribute('data-accent')).toBe('sponsor');
    expect(text(row?.querySelector('.oy-path-chip'))).toBe('Partnership');
    expect(row?.querySelector('a.oy-btn')?.className).toContain('oy-btn--secondary');
  });

  it('names what is missing for an empty door', async () => {
    const row = (await renderToBody(Pending)).querySelector('.oy-path');
    expect(text(row?.querySelector('.oy-path-chip .oy-pend'))).toBe('Pending: the way in');
    expect(row?.querySelector('h3')).toBeNull();
    expect(text(row?.querySelector('p .oy-pend'))).toBe('Pending: the blurb');
    expect(row?.querySelector('a.oy-btn')).toBeNull();
  });
});
