import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './ProgramCard.stories';

const { Default, Collective, Pending } = composeStories(stories);

describe('ProgramCard', () => {
  it('renders the photo, the name, the blurb and the quiet action from the Studio', async () => {
    const card = (await renderToBody(Default)).querySelector('.oy-card');
    expect(card?.classList.contains('v2-prog--school')).toBe(true);
    expect(card?.querySelector('img.oy-card-media')).not.toBeNull();
    expect(text(card?.querySelector('h3'))).toBe('Yoruba Language Lessons');
    expect(text(card?.querySelector('p'))).toContain('Speaking, reading, and tone marks');
    const link = card?.querySelector('a.oy-btn--quiet');
    expect(link?.getAttribute('href')).toBe('/programs/yoruba-lessons');
    expect(text(link)).toContain('Enrol a learner');
    expect(card?.querySelector('.v2-rule')).not.toBeNull();
  });

  it('names the missing photograph and marks the Collective card', async () => {
    const card = (await renderToBody(Collective)).querySelector('.oy-card');
    expect(card?.getAttribute('data-program')).toBe('collective');
    expect(card?.classList.contains('v2-prog--collective')).toBe(true);
    expect(card?.querySelector('img')).toBeNull();
    expect(card?.querySelector('.oy-ph')?.getAttribute('aria-label')).toBe(
      'Placeholder for a photo of Yoruba Cultural Collective',
    );
  });

  it('shows the registry chip for a missing blurb and a hub link for a missing action', async () => {
    const card = (await renderToBody(Pending)).querySelector('.oy-card');
    expect(text(card?.querySelector('p .oy-pend'))).toBe('Pending: what the program is');
    const link = card?.querySelector('a.oy-btn--quiet');
    expect(link?.getAttribute('href')).toBe('/programs#cultural-exchange');
    expect(text(link)).toContain('See the program');
  });
});
