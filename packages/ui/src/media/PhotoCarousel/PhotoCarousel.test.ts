import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './PhotoCarousel.stories';

const { Default, Gala, OnePhoto, Pending } = composeStories(stories);

describe('PhotoCarousel', () => {
  it('is a named group with the carousel role description and a polite slide region', async () => {
    const body = await renderToBody(Default);
    const host = body.querySelector('oy-photo-carousel');
    expect(host?.getAttribute('role')).toBe('group');
    expect(host?.getAttribute('aria-roledescription')).toBe('carousel');
    expect(host?.getAttribute('aria-label')).toBe('Odunde in past years');
    expect(host?.hasAttribute('data-ready')).toBe(false);
    const region = body.querySelector('#carousel-default-slides');
    expect(region?.getAttribute('aria-live')).toBe('polite');
    expect(region?.getAttribute('aria-atomic')).toBe('false');
  });

  it('shows the first photograph and hides the rest, each panel labelled by its tab', async () => {
    const body = await renderToBody(Default);
    const panels = [...body.querySelectorAll('[role="tabpanel"]')];
    expect(panels).toHaveLength(8);
    expect(panels[0]?.hasAttribute('hidden')).toBe(false);
    expect(panels[0]?.getAttribute('data-active')).toBe('true');
    expect(panels.slice(1).every((panel) => panel.hasAttribute('hidden'))).toBe(true);
    const tabs = [...body.querySelectorAll('[role="tablist"] [role="tab"]')];
    expect(body.querySelector('[role="tablist"]')?.getAttribute('aria-label')).toBe(
      'Choose a photo',
    );
    expect(tabs).toHaveLength(8);
    panels.forEach((panel, at) => {
      expect(panel.getAttribute('aria-labelledby')).toBe(tabs[at]?.id);
      expect(tabs[at]?.getAttribute('aria-controls')).toBe(panel.id);
      expect(tabs[at]?.getAttribute('aria-label')).toBe(`Photo ${at + 1}`);
      expect(panel.getAttribute('data-position')).toBe(`${at + 1} of 8`);
    });
    expect(tabs[0]?.getAttribute('aria-selected')).toBe('true');
    expect(tabs[0]?.hasAttribute('tabindex')).toBe(false);
    expect(tabs.slice(1).every((tab) => tab.getAttribute('tabindex') === '-1')).toBe(true);
    expect(tabs.slice(1).every((tab) => tab.getAttribute('aria-selected') === 'false')).toBe(true);
  });

  it('names the buttons, points them at the slides and draws no glyph chevrons', async () => {
    const body = await renderToBody(Default);
    const prev = body.querySelector('button[data-prev]');
    const next = body.querySelector('button[data-next]');
    expect(prev?.getAttribute('aria-label')).toBe('Previous photo');
    expect(next?.getAttribute('aria-label')).toBe('Next photo');
    expect(prev?.getAttribute('aria-controls')).toBe('carousel-default-slides');
    expect(body.innerHTML).not.toMatch(/[‹›]/);
  });

  it('loads every photograph lazily with its alt, sizes and caption, the first caption shown', async () => {
    const body = await renderToBody(Default);
    const images = [...body.querySelectorAll('.oy-carousel-slide img')];
    expect(images).toHaveLength(8);
    for (const img of images) {
      expect(img.getAttribute('loading')).toBe('lazy');
      expect(img.getAttribute('decoding')).toBe('async');
      expect(img.getAttribute('alt')).toBeTruthy();
    }
    expect(images[0]?.getAttribute('alt')).toBe(
      'An elder in white with a green sash high-fives a toddler on the painted plaza',
    );
    const captions = [...body.querySelectorAll('.oy-carousel-cap > p')];
    expect(captions).toHaveLength(8);
    expect(captions[0]?.getAttribute('data-active')).toBe('true');
    expect(captions.slice(1).some((caption) => caption.hasAttribute('data-active'))).toBe(false);
    expect(text(body.querySelector('.oy-carousel-count'))).toBe('1 of 8');
  });

  it('counts the Gala album', async () => {
    const body = await renderToBody(Gala);
    expect(body.querySelectorAll('[role="tab"]')).toHaveLength(6);
    expect(text(body.querySelector('.oy-carousel-count'))).toBe('1 of 6');
    expect(body.querySelector('oy-photo-carousel')?.getAttribute('aria-label')).toBe('Past galas');
  });

  it('ships the element script with two photographs or more, and none without a carousel', async () => {
    const script = (await renderToBody(Default)).querySelector('script');
    expect(script?.textContent).toContain("customElements.define(\n      'oy-photo-carousel'");
    expect(script?.textContent).toContain("document.readyState === 'loading'");
    expect((await renderToBody(OnePhoto)).querySelector('script')).toBeNull();
    expect((await renderToBody(Pending)).querySelector('script')).toBeNull();
  });

  it('frames one photograph as a figure with no controls', async () => {
    const body = await renderToBody(OnePhoto);
    expect(body.querySelector('oy-photo-carousel')).toBeNull();
    const figure = body.querySelector('figure.oy-carousel');
    expect(figure?.querySelector('img')?.getAttribute('loading')).toBe('lazy');
    expect(figure?.querySelector('figcaption')).not.toBeNull();
    expect(figure?.querySelector('button, [role]')).toBeNull();
  });

  it('names what the Studio owes when there are no photographs', async () => {
    const body = await renderToBody(Pending);
    expect(body.querySelector('oy-photo-carousel')).toBeNull();
    const placeholder = body.querySelector('.oy-carousel-stage .oy-ph');
    expect(placeholder?.getAttribute('aria-label')).toBe(
      'Placeholder for the albums of past editions',
    );
  });
});
