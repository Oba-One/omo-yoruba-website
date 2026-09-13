import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as green from './Green.stories';
import * as initiatives from './Initiatives.stories';
import * as status from './Status.stories';

const Green = composeStories(green);
const Initiatives = composeStories(initiatives);
const Status = composeStories(status);

describe('the Collective page-section stories', () => {
  it('green: the sections inside the collective scope, signal or strong on the root', async () => {
    const signal = (await renderToBody(Green.Signal)).querySelector('.oy-home');
    expect(signal?.getAttribute('data-green')).toBe('signal');
    const scope = signal?.querySelector(':scope > [data-scope="collective"]');
    expect(scope).toBeInstanceOf(HTMLElement);
    expect(scope?.querySelectorAll('h1')).toHaveLength(1);
    expect(scope?.querySelectorAll('.oy-sec-swatch')).toHaveLength(2);
    const strong = (await renderToBody(Green.Strong)).querySelector('.oy-home');
    expect(strong?.getAttribute('data-green')).toBe('strong');
    expect(strong?.querySelector('[data-scope="collective"] .oy-phead--slim')).toBeInstanceOf(
      HTMLElement,
    );
  });

  it("why: the argument's chip beside the Collective program's photograph", async () => {
    const why = (await renderToBody(Green.Signal)).querySelector('#why');
    expect(text(why?.querySelector('h2'))).toBe('Why culture and sustainability sit together');
    expect(text(why?.querySelector('.oy-split-main .oy-pend'))).toBe(
      'Pending: why culture and sustainability sit together, in your words',
    );
    expect(why?.querySelector('.oy-split-aside img')).toBeInstanceOf(HTMLElement);
  });

  it('voice: the large quote waiting in its slot under the chip', async () => {
    const figure = (await renderToBody(Green.Signal)).querySelector('#voice figure.oy-quote');
    expect(text(figure?.querySelector('.oy-pend'))).toBe('Pending: the quote and who said it');
    expect(text(figure?.querySelector('figcaption'))).toBe(
      'Name pending • Member, Yoruba Cultural Collective',
    );
  });

  it('take part: Partner, Skills and Updates, the updates row reaching the newsletter form', async () => {
    const band = (await renderToBody(Green.Signal)).querySelector('#take-part');
    expect(text(band?.querySelector('.oy-sec-intro'))).toBe(
      'The projects above are led by members. Three ways to join them.',
    );
    expect([...(band?.querySelectorAll('.oy-path-chip') ?? [])].map(text)).toEqual([
      'Partner',
      'Skills',
      'Updates',
    ]);
    const subscribe = [...(band?.querySelectorAll('.oy-path a') ?? [])].find((link) =>
      text(link)?.startsWith('Subscribe'),
    );
    expect(subscribe?.getAttribute('href')).toBe('#subscribe');
    expect(band?.querySelectorAll('.oy-btn--primary')).toHaveLength(1);
    expect(band?.querySelector('.oy-handoff a')?.getAttribute('href')).toBe('/impact');
  });

  it('initiatives: Solar Hub then Green Goods on alternating grounds, beside or above their photographs', async () => {
    const side = (await renderToBody(Initiatives.Side)).querySelector('.oy-home');
    expect(side?.getAttribute('data-initiatives')).toBe('side');
    const sections = [...(side?.querySelectorAll('section') ?? [])].slice(0, 2);
    expect(sections.map((section) => section.id)).toEqual(['solar-hub', 'green-goods']);
    expect(sections[1]?.classList.contains('oy-section--alt')).toBe(true);
    expect(sections.map((section) => text(section.querySelector('h2')))).toEqual([
      'Solar Hub',
      'Green Goods',
    ]);
    expect(sections[0]?.querySelector('.cc-init')?.getAttribute('data-layout')).toBe('side');
    // Green Goods as the seed leaves it: every fact under its own chip.
    expect(sections[1]?.querySelectorAll('.oy-glance--inline .oy-pend')).toHaveLength(4);
    const stacked = (await renderToBody(Initiatives.Stacked)).querySelector(
      '#green-goods .cc-init',
    );
    expect(stacked?.getAttribute('data-layout')).toBe('stacked');
  });

  it('status: the pill or its chip above each name, or neither when hidden', async () => {
    const shown = (await renderToBody(Status.Shown)).querySelector('.oy-home');
    expect(text(shown?.querySelector('#solar-hub .cc-status'))).toBe('[ Status line ]');
    expect(text(shown?.querySelector('#green-goods .cc-init-pills .oy-pend'))).toBe(
      'Pending: the status line',
    );
    const hidden = (await renderToBody(Status.Hidden)).querySelector('.oy-home');
    expect(hidden?.getAttribute('data-status')).toBe('hidden');
    expect(hidden?.querySelectorAll('.cc-status, .cc-init-pills .oy-pend')).toHaveLength(0);
    expect(hidden?.querySelectorAll('.cc-memberled')).toHaveLength(2);
  });
});
