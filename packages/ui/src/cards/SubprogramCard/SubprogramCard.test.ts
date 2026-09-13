import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './SubprogramCard.stories';

const { Default, TwoFacts, Filled, NoPhoto, Bare, Pending } = composeStories(stories);

describe('SubprogramCard', () => {
  it('draws the photograph, the name, the blurb, the facts with their chips and the outline action', async () => {
    const card = (await renderToBody(Default)).querySelector('article.oy-card');
    expect(card?.querySelector('img.oy-card-media')?.getAttribute('style')).toContain(
      'height: 190px',
    );
    const body = card?.querySelector('.oy-card-body.oy-door');
    expect(text(body?.querySelector('h3'))).toBe('Àgbàlá Ọmọde');
    expect(text(body?.querySelector('p'))).toContain("The children's compound.");
    const facts = body?.querySelector('dl.oy-facts[data-columns="1"]');
    expect([...(facts?.querySelectorAll('.oy-fact') ?? [])].map((row) => text(row))).toEqual([
      'AgesPending: ages and what they build',
    ]);
    const action = body?.querySelector('a.oy-btn--secondary');
    expect(action?.getAttribute('href')).toBe('/odunde');
    expect(text(action)).toContain('See it at Odunde');
  });

  it('lists every fact in order, and a value the Studio holds as text', async () => {
    const two = (await renderToBody(TwoFacts)).querySelectorAll('.oy-fact dt');
    expect([...two].map((label) => text(label))).toEqual(['Ages', 'What they build']);
    const filled = (await renderToBody(Filled)).querySelector('.oy-fact dd');
    expect(text(filled)).toBe('[ Value ]');
    expect(
      (await renderToBody(TwoFacts)).querySelector('a.oy-btn')?.getAttribute('data-enquiry'),
    ).toBe('contact');
  });

  it('names the missing photograph, and draws no empty list or button', async () => {
    const card = (await renderToBody(NoPhoto)).querySelector('article.oy-card');
    expect(card?.querySelector('img')).toBeNull();
    expect(card?.querySelector('.oy-ph')?.getAttribute('aria-label')).toBe(
      'Placeholder for a photo of Àgbàlá Ọmọde',
    );
    const bare = (await renderToBody(Bare)).querySelector('article.oy-card');
    expect(bare?.querySelector('dl')).toBeNull();
    expect(bare?.querySelector('.oy-pend-line')).toBeNull();
    expect(bare?.querySelector('a.oy-btn')).toBeNull();
  });

  it('names the photograph and every fact it owes', async () => {
    const card = (await renderToBody(Pending)).querySelector('article.oy-card');
    expect(card?.querySelector('img')).toBeNull();
    expect(text(card?.querySelector('.oy-subprogram-placeholder'))).toContain(
      'a photo of STEM Hub',
    );
    expect(card?.querySelectorAll('.oy-fact .oy-pend')).toHaveLength(2);
  });
});
