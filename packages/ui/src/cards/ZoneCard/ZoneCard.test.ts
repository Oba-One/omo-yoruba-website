import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './ZoneCard.stories';

const { Default, NoPhoto, Pending } = composeStories(stories);

describe('ZoneCard', () => {
  it('shows the translation, the Yoruba name as a heading and the chip for the owed line', async () => {
    const card = (await renderToBody(Default)).querySelector('article.oy-zone');
    expect(card?.getAttribute('data-zone')).toBe('zone-oja-balogun');
    expect(text(card?.querySelector('.oy-zone-tr'))).toBe('The market');
    const name = card?.querySelector('h3.oy-zone-name');
    expect(text(name)).toBe('Ọjà Balógun');
    expect(name?.getAttribute('lang')).toBe('yo');
    expect(text(card?.querySelector('.oy-zone-line .oy-pend'))).toBe(
      'Pending: the zone description',
    );
    expect(card?.querySelector('.oy-zone-media img')?.getAttribute('loading')).toBe('lazy');
  });

  it('names a missing photograph and a missing zone', async () => {
    const photo = (await renderToBody(NoPhoto)).querySelector('.oy-zone-media .oy-ph');
    expect(photo?.getAttribute('aria-label')).toBe('Placeholder for a photograph of Ọjà Balógun');
    const owed = (await renderToBody(Pending)).querySelector('article.oy-zone--pending');
    expect(owed?.querySelector('h3')).toBeNull();
    expect(text(owed?.querySelector('.oy-pend'))).toBe('Pending: the unnamed zones');
  });
});
