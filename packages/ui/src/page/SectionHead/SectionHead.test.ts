import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './SectionHead.stories';

const { Default, WithLink, WithIntro, SingleKicker, NoKicker, NotePending, IntroAndNote, Pending } =
  composeStories(stories);

describe('SectionHead', () => {
  it('renders the swatch, the bilingual kicker and the heading', async () => {
    const body = await renderToBody(Default);
    expect(body.querySelector('.oy-sec-swatch')?.getAttribute('aria-hidden')).toBe('true');
    expect(text(body.querySelector('.oy-kicker'))).toBe('Ohun tí a ń ṣe•What we do');
    expect(text(body.querySelector('h2'))).toBe('Our programs');
    expect(body.querySelector('.oy-sec-link')).toBeNull();
  });

  it('adds the quiet link on the right and the intro under the heading', async () => {
    const link = (await renderToBody(WithLink)).querySelector('a.oy-sec-link');
    expect(link?.getAttribute('href')).toBe('/programs');
    expect(text(link)).toContain('All programs');
    expect(text((await renderToBody(WithIntro)).querySelector('.oy-sec-intro'))).toContain(
      'Families, elders, and vendors',
    );
  });

  it('renders a single English kicker, or none', async () => {
    expect(text((await renderToBody(SingleKicker)).querySelector('.oy-kicker'))).toBe('Stay close');
    expect((await renderToBody(NoKicker)).querySelector('.oy-kicker')).toBeNull();
  });

  it('follows the intro with the note, or the registry chip while it is owed', async () => {
    const owed = (await renderToBody(NotePending)).querySelector('.oy-sec-intro');
    expect(text(owed)).toBe('Pending: the attendance figure');
    expect(owed?.querySelector('.oy-pend')).not.toBeNull();
    expect(text((await renderToBody(IntroAndNote)).querySelector('.oy-sec-intro'))).toBe(
      'Families, elders, and vendors on what this community holds for them. [ A figure and its source ]',
    );
    expect((await renderToBody(Default)).querySelector('.oy-sec-intro')).toBeNull();
  });

  it('marks a missing heading as Pending', async () => {
    expect(text((await renderToBody(Pending)).querySelector('h2 .oy-pend'))).toBe(
      'Pending: the heading',
    );
  });
});
