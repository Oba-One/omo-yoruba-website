import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as fundersStories from './Funders.stories';
import * as outcomesStories from './Outcomes.stories';
import * as sourcesStories from './Sources.stories';
import * as statsStories from './Stats.stories';

const Stats = composeStories(statsStories);
const Sources = composeStories(sourcesStories);
const Outcomes = composeStories(outcomesStories);
const Funders = composeStories(fundersStories);

describe('the Impact page-section stories', () => {
  it('stats: four figures in the framed grid, or six with the two cells that wait', async () => {
    const four = (await renderToBody(Stats.Four)).querySelector('.oy-home');
    expect(four?.querySelectorAll('h1')).toHaveLength(1);
    expect(four?.querySelector('#numbers .oy-stat-grid')?.getAttribute('data-columns')).toBe('4');
    expect(four?.querySelectorAll('#numbers .oy-stat')).toHaveLength(4);
    const six = (await renderToBody(Stats.Six)).querySelector('#numbers');
    expect(six?.querySelectorAll('.oy-stat--owed')).toHaveLength(2);
    // No invented figure stands in: the prototype's attendance and learners are not drawn.
    expect(text(six)).not.toMatch(/4,200|137/);
  });

  it('sources: the source lines and the lead that promises them, or neither', async () => {
    const shown = (await renderToBody(Sources.Shown)).querySelector('.oy-home');
    expect(text(shown?.querySelector('#numbers .oy-sec-intro'))).toMatch(
      /^Every number carries a source line/,
    );
    expect(shown?.querySelectorAll('#numbers .oy-source')).toHaveLength(4);
    expect(text(shown?.querySelector('#outcomes .oy-outcome .oy-source'))).toBe(
      '[ How it was counted ]',
    );
    const hidden = (await renderToBody(Sources.Hidden)).querySelector('.oy-home');
    expect(hidden?.getAttribute('data-sources')).toBe('hidden');
    expect(hidden?.querySelector('#numbers .oy-sec-intro')).toBeNull();
    expect(hidden?.querySelectorAll('.oy-source')).toHaveLength(0);
  });

  it('outcomes: the four slots named in the prototype order, as cards or rows, with their links', async () => {
    const cards = (await renderToBody(Outcomes.Cards)).querySelector('.oy-home');
    const slots = [...(cards?.querySelectorAll('#outcomes .oy-outcome') ?? [])];
    expect(slots.map((slot) => text(slot.querySelector('h3')))).toEqual([
      'Yoruba Language Lessons',
      'Odunde Festival',
      'Kids & STEM',
      'Yoruba Cultural Collective',
    ]);
    expect(slots.map((slot) => text(slot.querySelector('.oy-pend')))).toEqual(
      Array(4).fill('Pending: participation figures per program'),
    );
    expect(
      [...(cards?.querySelectorAll('#outcomes .oy-button-row a') ?? [])].map((a) =>
        a.getAttribute('href'),
      ),
    ).toEqual([
      '/programs/yoruba-lessons',
      '/odunde',
      '/programs#kids',
      '/programs/cultural-collective',
    ]);
    expect(text(cards)).not.toMatch(/The school|71 percent|210|2 sites/);
    expect(text(cards?.querySelector('#civic h2'))).toBe('Odunde as civic infrastructure');
    const rows = (await renderToBody(Outcomes.Rows)).querySelector('#outcomes');
    expect(rows?.querySelectorAll('.oy-outcome--row')).toHaveLength(4);
    const filled = (await renderToBody(Outcomes.WithOutcome)).querySelector('#outcomes');
    expect(filled?.querySelectorAll('.oy-outcome')).toHaveLength(4);
    expect(text(filled?.querySelector('.oy-outcome-fig'))).toBe('[ Figure ]');
  });

  it('funders: the Pending line or the section gone, then governance owed and the dark band', async () => {
    const shown = (await renderToBody(Funders.Shown)).querySelector('.oy-home');
    expect(text(shown?.querySelector('#funders .oy-pend-line'))).toContain(
      'partner and funder names',
    );
    expect(shown?.querySelectorAll('#voices .oy-quote-card')).toHaveLength(3);
    expect(shown?.querySelectorAll('#photographs .oy-mosaic[data-count="6"] figure')).toHaveLength(
      6,
    );
    const cells = [...(shown?.querySelectorAll('#governance .oy-glance > div') ?? [])];
    expect(cells.map((cell) => text(cell.querySelector('b')))).toEqual([
      'Tax status',
      'EIN',
      'Board',
      'Financials',
    ]);
    expect(text(shown?.querySelector('#governance .oy-facts'))).not.toMatch(
      /95-4612387|Leimert Boulevard|March 2027/,
    );
    const band = shown?.querySelector('#fund');
    expect(band?.classList.contains('oy-dark')).toBe(true);
    expect(text(band?.querySelector('.oy-sec-intro'))).toBe(
      'Our partnerships lead answers Pending: how soon the partnerships lead replies',
    );
    expect(band?.querySelectorAll('.oy-btn--primary')).toHaveLength(1);
    expect(text(band)).not.toMatch(/Adebayo Ogunlesi/);
    const hidden = (await renderToBody(Funders.Hidden)).querySelector('.oy-home');
    expect(hidden?.querySelector('#funders')).toBeNull();
    expect(hidden?.querySelector('#fund')).not.toBeNull();
  });
});
