import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import { initialsOf } from './initials';
import * as stories from './PullQuote.stories';

const { Default, Initials, Pending } = composeStories(stories);

describe('PullQuote', () => {
  it('renders the ayo row, the quote and the caption on a figure card', async () => {
    const figure = (await renderToBody(Default)).querySelector('figure.oy-card');
    expect(figure?.querySelector('.oy-divider-ayo')).not.toBeNull();
    expect(text(figure?.querySelector('blockquote'))).toContain('Two or three sentences');
    expect(text(figure?.querySelector('figcaption'))).toBe('A. B. • Parent, Language Lessons');
    expect(figure?.hasAttribute('data-pending')).toBe(false);
  });

  it('shows initials only without permission to name', async () => {
    const caption = (await renderToBody(Initials)).querySelector('figcaption');
    expect(text(caption)).toBe('A. B. • Parent, Language Lessons');
    expect(initialsOf('Adé Bákàrè')).toBe('A. B.');
    expect(initialsOf('Ọlá')).toBe('Ọ.');
  });

  it('renders the Pending card with the registry wording when there is no voice', async () => {
    const figure = (await renderToBody(Pending)).querySelector('figure.oy-card');
    expect(figure?.getAttribute('data-pending')).toBe('true');
    expect(text(figure?.querySelector('blockquote .oy-pend'))).toBe('Pending: member voices');
    expect(text(figure?.querySelector('figcaption'))).toBe('Name pending');
  });
});
