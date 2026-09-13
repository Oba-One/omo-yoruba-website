import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import { initialsOf } from './initials';
import * as stories from './PullQuote.stories';

const { Default, Initials, Waiting, Pending, Single, SingleWaiting } = composeStories(stories);

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

  it('waits in the prototype placeholder form for its slot', async () => {
    const figure = (await renderToBody(Waiting)).querySelector('figure.oy-card');
    expect(figure?.getAttribute('data-pending')).toBe('true');
    // The registry's chip stays above the prototype's placeholder (ADR 0014).
    expect(text(figure?.querySelector('.oy-pend'))).toBe('Pending: member voices');
    expect(text(figure?.querySelector('blockquote'))).toBe(
      '[ Quote from a Language Lessons parent, two or three sentences on what the lessons changed at home. ]',
    );
    expect(text(figure?.querySelector('figcaption'))).toBe(
      'Name pending • Parent, Language Lessons',
    );
  });

  it('renders the Pending card with the registry wording when there is no voice', async () => {
    const figure = (await renderToBody(Pending)).querySelector('figure.oy-card');
    expect(figure?.getAttribute('data-pending')).toBe('true');
    expect(text(figure?.querySelector('blockquote .oy-pend'))).toBe('Pending: member voices');
    expect(text(figure?.querySelector('figcaption'))).toBe('Name pending');
  });

  it('draws the single large quote as a figure of its own, not a card', async () => {
    const figure = (await renderToBody(Single)).querySelector('figure.oy-quote');
    expect(figure?.classList.contains('oy-card')).toBe(false);
    expect(figure?.querySelector(':scope > .oy-divider-ayo')).not.toBeNull();
    expect(text(figure?.querySelector('blockquote'))).toContain('Two or three sentences');
    expect(text(figure?.querySelector('figcaption'))).toBe(
      'A. B. • Member, Yoruba Cultural Collective',
    );
  });

  it("waits in its slot under the page's own chip", async () => {
    const figure = (await renderToBody(SingleWaiting)).querySelector('figure.oy-quote');
    expect(figure?.getAttribute('data-pending')).toBe('true');
    expect(text(figure?.querySelector('.oy-pend'))).toBe('Pending: the quote and who said it');
    expect(text(figure?.querySelector('blockquote'))).toMatch(
      /^\[ Quote from a member of the Collective/,
    );
    expect(text(figure?.querySelector('figcaption'))).toBe(
      'Name pending • Member, Yoruba Cultural Collective',
    );
  });
});
