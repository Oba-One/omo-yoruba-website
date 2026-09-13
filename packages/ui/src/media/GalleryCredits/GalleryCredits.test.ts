import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './GalleryCredits.stories';

const { Default, Pending } = composeStories(stories);

const rows = (body: Element) =>
  [...body.querySelectorAll('#credit .oy-fact')].map(
    (fact) => `${text(fact.querySelector('dt'))}: ${text(fact.querySelector('dd'))}`,
  );

describe('GalleryCredits', () => {
  it('closes a page on the alternate ground, its heading naming the section, with a quiet way to ask', async () => {
    const body = await renderToBody(Pending);
    const section = body.querySelector('section#credit');
    expect(section?.getAttribute('aria-labelledby')).toBe('credit-heading');
    expect(text(section?.querySelector('h2#credit-heading'))).toBe(
      'Photography credit and permissions',
    );
    const ask = section?.querySelector('a[data-enquiry="contact"]');
    expect(text(ask)).toContain('Send a message');
    expect(ask?.classList.contains('oy-btn--primary')).toBe(false);
  });

  it("names the policy and the inbox owed with the registry's chips", async () => {
    expect(rows(await renderToBody(Pending))).toEqual([
      'Credits: Given with each album, and with a photograph where it differs.',
      'Consent policy: Pending: your photo consent and removal policy',
      'Removal requests: Pending: the general inbox',
    ]);
  });

  it("shows the Studio's words once it holds them", async () => {
    expect(rows(await renderToBody(Default))).toEqual([
      'Credits: Given with each album, and with a photograph where it differs.',
      'Consent policy: [ How you ask permission, and how a photograph comes down ]',
      'Removal requests: [ The general inbox ]',
    ]);
  });
});
