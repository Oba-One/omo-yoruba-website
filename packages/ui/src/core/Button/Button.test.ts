import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Button.stories';

const {
  Default,
  Secondary,
  Quiet,
  Small,
  AsLink,
  Disabled,
  DisabledLink,
  Busy,
  Diacritics,
  OnDarkSecondary,
} = composeStories(stories);

describe('Button', () => {
  it('is a gold primary button by default', async () => {
    const body = await renderToBody(Default);
    const button = body.querySelector('button');
    expect(button?.getAttribute('type')).toBe('button');
    expect(button?.className.split(' ')).toEqual(['oy-btn', 'oy-btn--primary']);
    expect(text(button)).toBe('Become a member');
    expect(body.querySelector('.oy-btn-arrow')).toBeNull();
  });

  it('carries the variant and size classes from the design system', async () => {
    expect((await renderToBody(Secondary)).querySelector('.oy-btn--secondary')).not.toBeNull();
    const small = await renderToBody(Small);
    expect(small.querySelector('.oy-btn--primary.oy-btn--sm')).not.toBeNull();
  });

  it('draws the quiet arrow hidden from assistive technology', async () => {
    const body = await renderToBody(Quiet);
    expect(body.querySelector('.oy-btn--quiet')).not.toBeNull();
    const arrow = body.querySelector('.oy-btn-arrow');
    expect(arrow?.getAttribute('aria-hidden')).toBe('true');
    expect(text(arrow)).toBe('→');
  });

  it('renders a link when href is set', async () => {
    const body = await renderToBody(AsLink);
    expect(body.querySelector('a.oy-btn')?.getAttribute('href')).toBe('/get-involved');
    expect(body.querySelector('button')).toBeNull();
  });

  it('disables a button with the disabled attribute', async () => {
    const body = await renderToBody(Disabled);
    expect(body.querySelector('button')?.hasAttribute('disabled')).toBe(true);
  });

  it('drops the href from a disabled link so it cannot be followed', async () => {
    const body = await renderToBody(DisabledLink);
    const link = body.querySelector('a.oy-btn');
    expect(link?.hasAttribute('href')).toBe(false);
    expect(link?.getAttribute('aria-disabled')).toBe('true');
    expect(link?.getAttribute('role')).toBe('link');
    expect(text(link)).toBe('Sold out');
  });

  it('reads Sending... while busy and keeps focus by not using the disabled attribute', async () => {
    const body = await renderToBody(Busy);
    const button = body.querySelector('button');
    expect(text(button)).toBe('Sending...');
    expect(button?.getAttribute('aria-busy')).toBe('true');
    expect(button?.getAttribute('aria-disabled')).toBe('true');
    expect(button?.hasAttribute('disabled')).toBe(false);
  });

  it('keeps every mark of the test string as its label', async () => {
    const body = await renderToBody(Diacritics);
    expect(text(body.querySelector('button'))).toBe(
      'Ẹ káàbọ̀ sí Ọjà Balógun, Àgbàlá Ọmọde àti Ẹgbẹ́ Ìbílẹ̀. Odún dé! Ẹ ṣeun.',
    );
  });

  it('renders the outline inside the dark scope in the OnDark stories', async () => {
    const body = await renderToBody(OnDarkSecondary);
    expect(body.querySelector('.oy-dark .oy-btn--secondary')).not.toBeNull();
    expect(text(body.querySelector('.oy-btn'))).toBe('Apply as a vendor');
  });
});
