import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './PartnerRow.stories';

const { Chips, Linked, Logos, Pending } = composeStories(stories);

describe('PartnerRow', () => {
  it('lists each partner as a text chip', async () => {
    const list = (await renderToBody(Chips)).querySelector('ul.oy-partners');
    const chips = [...(list?.querySelectorAll('li > span.oy-partner') ?? [])];
    expect(chips.map((chip) => text(chip))).toEqual([
      '[ Partner name ]',
      '[ Funder name ]',
      '[ Sponsor name ]',
    ]);
  });

  it('links a partner with a site and draws a logo with the name as its alt', async () => {
    const link = (await renderToBody(Linked)).querySelector('a.oy-partner');
    expect(link?.getAttribute('href')).toBe('https://example.org');
    const logo = (await renderToBody(Logos)).querySelector('.oy-partner--logo img.oy-partner-logo');
    expect(logo?.getAttribute('alt')).toBe('[ Partner name ]');
    expect(logo?.getAttribute('loading')).toBe('lazy');
  });

  it('shows the registry line with no partners', async () => {
    const body = await renderToBody(Pending);
    expect(body.querySelector('ul.oy-partners')).toBeNull();
    const line = body.querySelector('.oy-partner-row .oy-pend-line');
    expect(text(line)).toContain('partner and funder names');
  });
});
