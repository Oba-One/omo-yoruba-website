import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Prose.stories';

const { Default, EveryNode, UntrustedLink, Empty } = composeStories(stories);

describe('Prose', () => {
  it('renders the seed paragraphs inside the tokens prose column', async () => {
    const prose = (await renderToBody(Default)).querySelector('.oy-prose');
    expect(prose?.querySelectorAll('p')).toHaveLength(2);
    expect(text(prose?.querySelector('p'))).toMatch(/^Odunde marks the Yoruba new year/);
  });

  // Rendering every style, decorator, annotation and object blockContent declares proves the map
  // keeps up with the schema: an unmapped node throws under Vitest (import.meta.env.DEV).
  it('maps every node the schema allows', async () => {
    const prose = (await renderToBody(EveryNode)).querySelector('.oy-prose');
    expect(prose?.querySelector('p strong')?.textContent).toBe('Yoruba new year');
    expect(prose?.querySelector('p em')?.textContent).toBe('open to the whole neighborhood');
    expect(prose?.querySelector('a.oy-prose-link')?.getAttribute('href')).toBe('/gala');
    expect(text(prose?.querySelector('h3.oy-prose-h3'))).toBe('Four zones, one village');
    expect(text(prose?.querySelector('blockquote.oy-prose-quote em'))).toBe(
      'Àgbájọ ọwọ́ la fi ń sọ̀yà.',
    );
    const pull = prose?.querySelector('figure.oy-prose-pullquote');
    expect(pull?.querySelector('.oy-divider-ayo')).not.toBeNull();
    expect(text(pull?.querySelector('figcaption'))).toBe('Name pending • Vendor, Ọjà Balógun');
    expect(prose?.querySelector('[data-portabletext-unknown]')).toBeNull();
  });

  it('drops a link whose scheme is not trusted and keeps its text', async () => {
    const prose = (await renderToBody(UntrustedLink)).querySelector('.oy-prose');
    expect(prose?.querySelector('a')).toBeNull();
    expect(text(prose?.querySelector('p'))).toBe('The other half of our year is the Gala.');
  });

  it('renders nothing for an empty field', async () => {
    const body = await renderToBody(Empty);
    expect(body.querySelector('.oy-prose')).toBeNull();
  });
});
