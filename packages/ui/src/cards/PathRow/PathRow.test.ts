import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './PathRow.stories';

const { Member, Partner, Volunteer, Give, Pending, TakePartRow, Quiet, TakePartRowPending } =
  composeStories(stories);

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

  it('labels the volunteer and give rows with the prototype chips', async () => {
    const volunteer = (await renderToBody(Volunteer)).querySelector('.oy-path');
    expect(text(volunteer?.querySelector('.oy-path-chip'))).toBe('Volunteer');
    expect(volunteer?.getAttribute('data-accent')).toBe('volunteer');
    const give = (await renderToBody(Give)).querySelector('.oy-path');
    expect(text(give?.querySelector('.oy-path-chip'))).toBe('Give');
    expect(give?.getAttribute('data-accent')).toBe('give');
    expect(give?.querySelector('[data-give]')).not.toBeNull();
  });

  it('names what is missing for an empty door', async () => {
    const row = (await renderToBody(Pending)).querySelector('.oy-path');
    expect(text(row?.querySelector('.oy-path-chip .oy-pend'))).toBe('Pending: the way in');
    expect(row?.querySelector('h3')).toBeNull();
    expect(text(row?.querySelector('p .oy-pend'))).toBe('Pending: the blurb');
    expect(row?.querySelector('a.oy-btn')).toBeNull();
  });

  it('draws a take-part row from its own way in, chip, title, line and action', async () => {
    const row = (await renderToBody(TakePartRow)).querySelector('.oy-path');
    expect(row?.getAttribute('data-way')).toBe('vendor');
    expect(row?.getAttribute('data-accent')).toBe('vendor');
    expect(row?.hasAttribute('data-door')).toBe(false);
    expect(text(row?.querySelector('.oy-path-chip'))).toBe('Vendors');
    expect(text(row?.querySelector('h3'))).toBe('Sell at Ọjà Balógun');
    expect(text(row?.querySelector('p'))).toBe('A booth is held once the fee is paid.');
    const button = row?.querySelector('a.oy-btn');
    expect(button?.className).toContain('oy-btn--primary');
    expect(button?.getAttribute('data-enquiry')).toBe('vendor');
  });

  it('gives the give row the quiet action that opens the Give Dialog', async () => {
    const button = (await renderToBody(Quiet)).querySelector('.oy-path a.oy-btn');
    expect(button?.className).toContain('oy-btn--quiet');
    expect(button?.hasAttribute('data-give')).toBe(true);
    expect(text(button)).toContain('Donate');
  });

  it('puts the registry chip where an unfinished row misses its title and button', async () => {
    const row = (await renderToBody(TakePartRowPending)).querySelector('.oy-path');
    const chip = 'Pending: a way in, its title or its button label';
    expect(text(row?.querySelector('h3 .oy-pend'))).toBe(chip);
    expect(row?.querySelector('a.oy-btn')).toBeNull();
    expect(text(row?.querySelector(':scope > .oy-pend'))).toBe(chip);
  });
});
