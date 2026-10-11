import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './AskCard.stories';

const { Default, Whole, SectionHeading, Bare } = composeStories(stories);

describe('AskCard', () => {
  it('draws the kicker, the heading and the line, with one gold button and the outline beside it', async () => {
    const card = (await renderToBody(Default)).querySelector('aside.oy-ask-card');
    expect(card?.id).toBe('fund');
    expect(card?.getAttribute('aria-labelledby')).toBe('fund-heading');
    expect(text(card?.querySelector('.oy-kicker'))).toContain('The year ahead');
    expect(text(card?.querySelector('h3#fund-heading'))).toBe('Fund the next year');
    const buttons = [...(card?.querySelectorAll('.oy-ask-card-actions a.oy-btn') ?? [])];
    expect(buttons.map((button) => button.getAttribute('data-enquiry'))).toEqual([
      'sponsor',
      'contact',
    ]);
    expect(buttons[0]?.className).toContain('oy-btn--primary');
    expect(buttons[1]?.className).toContain('oy-btn--secondary');
    expect(card?.querySelectorAll('.oy-btn--primary')).toHaveLength(1);
  });

  it("puts the registry's chip after the line while a fact in it is owed, and none once it is whole", async () => {
    const owed = (await renderToBody(Default)).querySelector('.oy-ask-card-copy p');
    expect(text(owed)).toBe(
      'Our partnerships lead answers Pending: how soon the partnerships lead replies',
    );
    const whole = (await renderToBody(Whole)).querySelector('.oy-ask-card-copy');
    expect(whole?.querySelector('.oy-pend')).toBeNull();
    expect(text(whole?.querySelector('p'))).toBe(
      '[ Name ], our partnerships lead, answers [ how soon ].',
    );
  });

  it("takes the section's heading level and id where it stands alone", async () => {
    const card = (await renderToBody(SectionHeading)).querySelector('.oy-ask-card');
    expect(card?.hasAttribute('id')).toBe(false);
    expect(card?.getAttribute('aria-labelledby')).toBe('fund-heading');
    expect(text(card?.querySelector('h2#fund-heading'))).toBe('Fund the next year');
    expect(card?.querySelector('h3')).toBeNull();
  });

  it('stands with a heading and one button alone', async () => {
    const card = (await renderToBody(Bare)).querySelector('.oy-ask-card');
    expect(card?.querySelector('.oy-kicker')).toBeNull();
    expect(card?.querySelector('.oy-ask-card-copy p')).toBeNull();
    expect(card?.querySelectorAll('a.oy-btn')).toHaveLength(1);
  });
});
