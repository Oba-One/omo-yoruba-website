import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Disclosure.stories';

const { Default, Closed } = composeStories(stories);

describe('Disclosure', () => {
  it('keeps the head outside the details and the body inside, open by the prop', async () => {
    const root = (await renderToBody(Default)).querySelector('.oy-disclosure');
    expect(root?.querySelector(':scope > .oy-disclosure-head h2')?.textContent).toContain(
      'Kids & STEM',
    );
    const details = root?.querySelector(':scope > details');
    expect(details?.hasAttribute('open')).toBe(true);
    expect(details?.querySelector('.oy-disclosure-body .oy-prose')).not.toBeNull();
    const closed = (await renderToBody(Closed)).querySelector('.oy-disclosure > details');
    expect(closed?.hasAttribute('open')).toBe(false);
  });

  it("names the toggle by what it does and the section's name", async () => {
    const summary = (await renderToBody(Default)).querySelector('details > summary');
    expect(summary?.className).toContain('oy-btn--quiet');
    expect(text(summary?.querySelector('.oy-disclosure-hide'))).toBe('Hide details');
    expect(text(summary?.querySelector('.oy-disclosure-show'))).toBe('Show details');
    expect(text(summary?.querySelector('.oy-visually-hidden'))).toBe('about Kids & STEM');
  });
});
