import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Handoff.stories';

const { Default, Quiet, ButtonOnly } = composeStories(stories);

describe('Handoff', () => {
  it('renders the outline button and the line beside it', async () => {
    const line = (await renderToBody(Default)).querySelector('.oy-handoff-line');
    const button = line?.querySelector('a.oy-btn');
    expect(button?.getAttribute('href')).toBe('/gallery');
    expect(button?.className).toContain('oy-btn--secondary');
    expect(text(button)).toContain('Open the photo gallery');
    expect(text(line?.querySelector('.oy-handoff-text'))).toBe(
      'Odunde, the Gala, and the language lessons, year by year.',
    );
  });

  it('takes the quiet variant and stands without a line', async () => {
    expect((await renderToBody(Quiet)).querySelector('.oy-btn--quiet')).not.toBeNull();
    expect((await renderToBody(ButtonOnly)).querySelector('.oy-handoff-text')).toBeNull();
  });
});
