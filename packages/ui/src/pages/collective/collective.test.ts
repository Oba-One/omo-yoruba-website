import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as green from './Green.stories';

const Green = composeStories(green);

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
});
