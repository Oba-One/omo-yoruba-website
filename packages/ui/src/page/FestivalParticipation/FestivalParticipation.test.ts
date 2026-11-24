import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './FestivalParticipation.stories';

const { Default } = composeStories(stories);

describe('FestivalParticipation', () => {
  it('explains all three participation forms with equally weighted entry points', async () => {
    const section = (await renderToBody(Default)).querySelector('#participate');
    expect(section?.getAttribute('aria-labelledby')).toBe('participate-heading');
    expect(text(section?.querySelector('h2'))).toBe('Help make Odunde happen');
    const cards = [...(section?.querySelectorAll('.oy-enquiry-card') ?? [])];
    expect(cards.map((card) => card.getAttribute('data-kind'))).toEqual([
      'sponsor',
      'volunteer',
      'vendor',
    ]);
    for (const [at, label] of ['Become a sponsor', 'Volunteer', 'Apply as a vendor'].entries()) {
      const card = cards[at];
      const kind = card?.getAttribute('data-kind');
      const trigger = card?.querySelector('a[data-enquiry]');
      expect(text(card?.querySelector('.oy-card-body > p')).length).toBeGreaterThan(0);
      expect(trigger?.getAttribute('href')).toBe(`?enquiry=${kind}#enquiry`);
      expect(text(trigger)).toContain(label);
      expect(trigger?.classList.contains('oy-btn--secondary')).toBe(true);
    }
    expect(section?.querySelector('.oy-btn--primary')).toBeNull();
  });
});
