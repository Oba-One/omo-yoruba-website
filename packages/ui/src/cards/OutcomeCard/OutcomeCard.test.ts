import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './OutcomeCard.stories';

const { WithFigure, SourcePending, Statement, Pending, GivingLevel, SourcesHidden, Row } =
  composeStories(stories);

const card = async (story: Parameters<typeof renderToBody>[0]) =>
  (await renderToBody(story)).querySelector('article.oy-outcome');

describe('OutcomeCard', () => {
  it('draws the subject, the figure, what it counts and its source line', async () => {
    const outcome = await card(WithFigure);
    expect(text(outcome?.querySelector('h3'))).toBe('Odunde Festival');
    expect(text(outcome?.querySelector('.oy-outcome-fig'))).toBe('[ Figure ]');
    expect(text(outcome?.querySelector('p'))).toBe(
      '[ What the figure counts, and for which year ]',
    );
    expect(text(outcome?.querySelector('.oy-source'))).toBe('[ How it was counted ]');
    expect(outcome?.getAttribute('data-measured')).toBe('figure');
  });

  it("asks for a figure's missing source where the line goes", async () => {
    expect(text((await card(SourcePending))?.querySelector('.oy-source .oy-pend'))).toBe(
      'Pending: a source line under the figure',
    );
  });

  it('draws a plain statement alone, with no figure or source line', async () => {
    const outcome = await card(Statement);
    expect(outcome?.querySelector('.oy-outcome-fig')).toBeNull();
    expect(outcome?.querySelector('.oy-source')).toBeNull();
    expect(text(outcome?.querySelector('p'))).toBe('[ What is being measured this year ]');
    expect(outcome?.getAttribute('data-measured')).toBe('statement');
  });

  it('names what a card with neither figure nor statement waits for', async () => {
    const outcome = await card(Pending);
    expect(text(outcome?.querySelector('h3'))).toBe('Kids & STEM');
    expect(text(outcome?.querySelector('p .oy-pend'))).toBe(
      'Pending: participation figures per program',
    );
    expect(outcome?.hasAttribute('data-measured')).toBe(false);
  });

  it('draws a giving level without a heading, and no source line when sources are hidden', async () => {
    const level = await card(GivingLevel);
    expect(level?.querySelector('h3')).toBeNull();
    expect(text(level?.querySelector('.oy-outcome-fig'))).toBe('[ Amount ]');
    expect((await card(SourcesHidden))?.querySelector('.oy-source')).toBeNull();
  });

  it('lays the card out as a row', async () => {
    expect((await card(Row))?.classList.contains('oy-outcome--row')).toBe(true);
  });
});
