import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './ProgramCard.stories';

const { Default, Collective, NoPhoto, Pending, WithEdit, When, WhenPending } =
  composeStories(stories);

describe('ProgramCard', () => {
  it('renders the photo, the name, the blurb and the quiet action from the Studio', async () => {
    const card = (await renderToBody(Default)).querySelector('.oy-card');
    expect(card?.classList.contains('v2-prog--school')).toBe(true);
    expect(card?.querySelector('img.oy-card-media')).not.toBeNull();
    expect(text(card?.querySelector('h3'))).toBe('Yoruba Language Lessons');
    expect(text(card?.querySelector('p'))).toContain('Speaking, reading, and tone marks');
    const link = card?.querySelector('a.oy-btn--quiet');
    expect(link?.getAttribute('href')).toBe('/programs/yoruba-lessons');
    expect(text(link)).toContain('Enrol a learner');
    expect(card?.querySelector('.v2-rule')).not.toBeNull();
  });

  it('marks the Collective card, with its interim photograph', async () => {
    const card = (await renderToBody(Collective)).querySelector('.oy-card');
    expect(card?.getAttribute('data-program')).toBe('collective');
    expect(card?.classList.contains('v2-prog--collective')).toBe(true);
    expect(card?.querySelector('img.oy-card-media')).not.toBeNull();
  });

  it('names the missing photograph', async () => {
    const card = (await renderToBody(NoPhoto)).querySelector('.oy-card');
    expect(card?.querySelector('img')).toBeNull();
    expect(card?.querySelector('.oy-ph')?.getAttribute('aria-label')).toBe(
      'Placeholder for a photo of Yoruba Cultural Collective',
    );
  });

  it('shows the registry chip for a missing blurb and no link without an action', async () => {
    const card = (await renderToBody(Pending)).querySelector('.oy-card');
    expect(text(card?.querySelector('p .oy-pend'))).toBe('Pending: what the program is');
    expect(card?.querySelector('a.oy-btn--quiet')).toBeNull();
  });

  it('puts the edit attribute on the photo in draft mode', async () => {
    const img = (await renderToBody(WithEdit)).querySelector('img.oy-card-media');
    expect(img?.getAttribute('data-sanity')).toContain('type=program;path=image');
  });

  it('leads with the cadence and the ages on the Programs hub, each its chip while owed', async () => {
    const card = (await renderToBody(When)).querySelector('.oy-card');
    const when = card?.querySelector('.oy-card-body > .pg-when');
    expect([...(when?.children ?? [])].map((cell) => text(cell))).toEqual([
      'Online, by arrangement',
      'Pending: the ages',
    ]);
    // The line sits above the name, which stays the card's one heading.
    expect(when?.nextElementSibling?.tagName).toBe('H3');
    expect(card?.querySelectorAll('h3')).toHaveLength(1);
    expect(card?.querySelector('img.oy-card-media')?.getAttribute('style')).toContain(
      'height: 160px',
    );

    const exchange = (await renderToBody(WhenPending)).querySelector('.oy-card');
    expect(
      [...(exchange?.querySelectorAll('.pg-when > *') ?? [])].map((cell) => text(cell)),
    ).toEqual(['Pending: the cadence', 'Pending: the ages']);
    expect(exchange?.querySelector('a.oy-btn--quiet')?.getAttribute('href')).toBe('#exchange');
  });

  it('leaves the when line off the homepage card', async () => {
    const card = (await renderToBody(Default)).querySelector('.oy-card');
    expect(card?.querySelector('.pg-when')).toBeNull();
  });
});
