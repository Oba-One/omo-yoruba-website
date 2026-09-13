import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './YearStrip.stories';

const { Default, Filled, Four, Pending } = composeStories(stories);

const cellsOf = (body: HTMLElement) => [...body.querySelectorAll('.oy-year > div')];

describe('YearStrip', () => {
  it('draws a column per row: the mark, the when or its chip, the name and the note', async () => {
    const body = await renderToBody(Default);
    expect(body.querySelector('.oy-year')?.getAttribute('data-cols')).toBe('5');
    const cells = cellsOf(body);
    expect(cells).toHaveLength(5);
    expect(cells.map((cell) => text(cell.querySelector('b')))).toEqual([
      'Pending: when it runs',
      'June',
      'Nov or Dec',
      'Pending: when it runs',
      'Pending: when it runs',
    ]);
    expect(cells.map((cell) => text(cell.querySelector('strong')))).toEqual([
      'Yoruba Language Lessons',
      'Odunde Festival',
      'End-of-Year Gala',
      'Kids & STEM',
      'Yoruba Cultural Collective',
    ]);
    expect(cells[0]?.querySelector('.oy-year-mark')?.getAttribute('aria-hidden')).toBe('true');
    // A row without a note draws no empty line.
    expect(cells[2]?.querySelector(':scope > span')).toBeNull();
    expect(text(cells[3]?.querySelector(':scope > span'))).toBe(
      'Àgbàlá Ọmọde runs at the festival',
    );
  });

  it('shows every when the Studio holds, and matches the columns to the rows', async () => {
    const filled = cellsOf(await renderToBody(Filled));
    expect(filled.some((cell) => cell.querySelector('.oy-pend'))).toBe(false);
    expect((await renderToBody(Four)).querySelector('.oy-year')?.getAttribute('data-cols')).toBe(
      '4',
    );
  });

  it('renders the Pending line with no rows', async () => {
    const body = await renderToBody(Pending);
    expect(body.querySelector('.oy-year')).toBeNull();
    expect(text(body.querySelector('.oy-pend-line'))).toContain('when each program runs');
  });
});
