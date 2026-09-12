import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './DoorCard.stories';

const { Member, Partner, WithBullets, Pending } = composeStories(stories);

describe('DoorCard', () => {
  it('renders the member door with its photo, copy and the gold enquiry trigger', async () => {
    const card = (await renderToBody(Member)).querySelector('.oy-card[data-door="member"]');
    expect(card?.querySelector('img.oy-card-media')?.getAttribute('style')).toBe('height: 190px');
    expect(card?.querySelector('.oy-card-body.oy-door')).not.toBeNull();
    expect(text(card?.querySelector('h3'))).toBe('Become a member');
    expect(text(card?.querySelector('p'))).toContain('Members carry the lessons');
    const button = card?.querySelector('a.oy-btn');
    expect(button?.className).toContain('oy-btn--primary');
    expect(button?.getAttribute('data-enquiry')).toBe('member');
    expect(button?.getAttribute('href')).toBe('?enquiry=member#enquiry');
    expect(card?.querySelector('.oy-door-bullets')).toBeNull();
  });

  it('renders the partner door with the outline sponsor trigger', async () => {
    const button = (await renderToBody(Partner)).querySelector('a.oy-btn');
    expect(button?.className).toContain('oy-btn--secondary');
    expect(button?.getAttribute('data-enquiry')).toBe('sponsor');
  });

  it('shows the registry chip in place of missing bullets when the page asks for them', async () => {
    const card = (await renderToBody(WithBullets)).querySelector('.oy-card');
    expect(text(card?.querySelector('.oy-pend'))).toBe('Pending: what this way in asks and gives');
  });

  it('names the placeholder and the missing copy for a bare door', async () => {
    const card = (await renderToBody(Pending)).querySelector('.oy-card');
    expect(card?.querySelector('.oy-ph')?.getAttribute('aria-label')).toBe(
      'Placeholder for a photo for this door',
    );
    expect(text(card?.querySelector('h3 .oy-pend'))).toBe('Pending: the door title');
    expect(card?.querySelector('a.oy-btn')).toBeNull();
  });
});
