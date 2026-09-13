import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './PersonCard.stories';

const { NoPortrait, Portrait, Compact, Pending, BioPending, RoleAndBioPending, FullBio } =
  composeStories(stories);

describe('PersonCard', () => {
  it('draws the woven tick without a portrait, then the role, the name and the bio', async () => {
    const card = (await renderToBody(NoPortrait)).querySelector('article.oy-person');
    expect(card?.classList.contains('oy-person--nophoto')).toBe(true);
    expect(card?.querySelector('img')).toBeNull();
    expect(text(card?.querySelector('.oy-person-role'))).toBe('This year');
    expect(text(card?.querySelector('h3.oy-person-name'))).toBe("[ This year's honoree ]");
    expect(text(card?.querySelector('.oy-person-bio'))).toBe('[ One line on why ]');
  });

  it('puts the portrait above with its alt, lazily', async () => {
    const card = (await renderToBody(Portrait)).querySelector('article.oy-person');
    expect(card?.classList.contains('oy-person--nophoto')).toBe(false);
    const img = card?.querySelector('.oy-person-media img');
    expect(img?.getAttribute('alt')).toBeTruthy();
    expect(img?.getAttribute('loading')).toBe('lazy');
  });

  it('tightens the compact card and names a missing name', async () => {
    expect(
      (await renderToBody(Compact)).querySelector('article.oy-person.oy-person--compact'),
    ).not.toBeNull();
    const owed = (await renderToBody(Pending)).querySelector('article.oy-person');
    expect(text(owed?.querySelector('h3 .oy-pend'))).toBe('Pending: the name');
    // No bio and no wording: nothing drawn where the page does not ask.
    expect(owed?.querySelector('.oy-person-bio')).toBeNull();
    const bio = (await renderToBody(BioPending)).querySelector('article.oy-person .oy-person-bio');
    expect(text(bio?.querySelector('.oy-pend'))).toBe("Pending: the teacher's short bio");
  });

  it('asks for a missing role and short bio where the page names them', async () => {
    const card = (await renderToBody(RoleAndBioPending)).querySelector('.oy-person');
    expect(text(card?.querySelector('.oy-person-role .oy-pend'))).toBe('Pending: the role');
    expect(text(card?.querySelector('.oy-person-bio .oy-pend'))).toBe('Pending: a short bio');
  });

  it('adds the full bio under the short one when the page asks for full bios', async () => {
    const card = (await renderToBody(FullBio)).querySelector('.oy-person');
    const bios = [...(card?.querySelectorAll('.oy-person-bio') ?? [])];
    expect(bios.map((bio) => text(bio))).toEqual(['[ A short bio ]', '[ The full bio ]']);
    expect(bios[1]?.classList.contains('oy-person-bio--full')).toBe(true);
    // The role and name stay above: the card keeps one heading.
    expect(card?.querySelectorAll('h3')).toHaveLength(1);
  });
});
