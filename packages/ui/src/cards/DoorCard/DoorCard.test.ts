import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './DoorCard.stories';

const { Member, Partner, WithBullets, Pending, WithEdit, GetInvolved, Vendor, Row } =
  composeStories(stories);

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
    expect(card?.querySelector('h3')).toBeNull();
    expect(text(card?.querySelector('p .oy-pend'))).toBe('Pending: the blurb');
    expect(card?.querySelector('a.oy-btn')).toBeNull();
  });

  it('puts the edit attribute on the photo in draft mode', async () => {
    const img = (await renderToBody(WithEdit)).querySelector('img.oy-card-media');
    expect(img?.getAttribute('data-sanity')).toBe(
      'id=door-member;type=door;path=image;base=%2Fadmin',
    );
  });

  it("carries Get Involved's chip above the title and the anchor, and none on the homepage", async () => {
    const card = (await renderToBody(GetInvolved)).querySelector('.oy-card');
    expect(card?.id).toBe('member');
    const label = card?.querySelector('.oy-door-label');
    expect(text(label)).toBe('Membership');
    expect(label?.nextElementSibling?.tagName).toBe('H3');
    expect((await renderToBody(Member)).querySelector('.oy-door-label')).toBeNull();
  });

  it('draws the vendor door with its chip, its button and the chips for what it owes', async () => {
    const card = (await renderToBody(Vendor)).querySelector('.oy-card[data-door="vendor"]');
    expect(text(card?.querySelector('.oy-door-label'))).toBe('Vendors');
    expect(text(card?.querySelector('h3'))).toBe('Sell at Odunde');
    expect([...(card?.querySelectorAll('.oy-pend') ?? [])].map(text)).toEqual([
      'Pending: the blurb',
      'Pending: what this way in asks and gives',
    ]);
    const button = card?.querySelector('a.oy-btn');
    expect(button?.getAttribute('data-enquiry')).toBe('vendor');
    expect(button?.className).toContain('oy-btn--secondary');
  });

  it('lays the card out as a row, the photograph without a fixed height', async () => {
    const card = (await renderToBody(Row)).querySelector('.oy-card');
    expect(card?.classList.contains('oy-door-card--row')).toBe(true);
    expect(card?.querySelector('img.oy-card-media')?.getAttribute('style')).toBeNull();
  });
});
