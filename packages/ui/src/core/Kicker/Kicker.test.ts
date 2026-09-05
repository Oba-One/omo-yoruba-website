import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Kicker.stories';

const { Default, YorubaOnly, Diacritics, AsParagraph, Pending, OnDark } = composeStories(stories);

describe('Kicker', () => {
  it('renders Yoruba first, the dot hidden from assistive technology, then English', async () => {
    const body = await renderToBody(Default);
    const kicker = body.querySelector('.oy-kicker');
    expect(kicker?.tagName).toBe('SPAN');
    expect([...(kicker?.children ?? [])].map((c) => text(c))).toEqual(['Ẹ káàbọ̀', '•', 'Welcome']);
    expect(body.querySelector('[lang="yo"]')?.textContent).toBe('Ẹ káàbọ̀');
    expect(body.querySelector('.oy-kicker-dot')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('stands alone with one half and no dot', async () => {
    const body = await renderToBody(YorubaOnly);
    expect(body.querySelector('.oy-kicker-dot')).toBeNull();
    expect(text(body.querySelector('.oy-kicker'))).toBe('Ẹ káàbọ̀');
  });

  it('keeps every mark of the test string', async () => {
    const body = await renderToBody(Diacritics);
    expect(body.querySelector('[lang="yo"]')?.textContent).toBe(
      'Ẹ káàbọ̀ sí Ọjà Balógun, Àgbàlá Ọmọde àti Ẹgbẹ́ Ìbílẹ̀. Odún dé! Ẹ ṣeun.',
    );
  });

  it('can be a paragraph', async () => {
    const body = await renderToBody(AsParagraph);
    expect(body.querySelector('p.oy-kicker')).not.toBeNull();
  });

  it('renders a Pending chip that names the kicker when both halves are empty', async () => {
    const body = await renderToBody(Pending);
    expect(body.querySelector('.oy-kicker')).toBeNull();
    expect(body.querySelector('.oy-pend')?.textContent).toBe('Pending: section kicker');
  });

  it('sits inside the dark scope in the OnDark story', async () => {
    const body = await renderToBody(OnDark);
    expect(body.querySelector('.oy-dark .oy-kicker')).not.toBeNull();
  });
});
