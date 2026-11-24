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
      /^Source notes explain where each figure comes from/,
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

  it('outcomes: hidden while unconfirmed, then a sourced card or row without empty placeholders', async () => {
    const cards = (await renderToBody(Outcomes.Cards)).querySelector('.oy-home');
    expect(cards?.querySelector('#outcomes')).toBeNull();
    expect(text(cards)).not.toMatch(/The school|71 percent|210|2 sites/);
    expect(text(cards?.querySelector('#civic h2'))).toBe('Odunde as civic infrastructure');
    const rows = (await renderToBody(Outcomes.Rows)).querySelector('#outcomes');
    expect(rows?.querySelectorAll('.oy-outcome--row')).toHaveLength(1);
    const filled = (await renderToBody(Outcomes.WithOutcome)).querySelector('#outcomes');
    expect(filled?.querySelectorAll('.oy-outcome')).toHaveLength(1);
    expect(filled?.querySelector('.oy-pend')).toBeNull();
    expect(filled?.querySelector('.oy-button-row a')?.getAttribute('href')).toBe('/odunde');
    expect(text(filled?.querySelector('.oy-outcome-fig'))).toBe('[ Figure ]');
  });

  it('funders: the Pending line with the ask at its foot, or the ask alone in its own section', async () => {
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
    expect([...(shown?.querySelectorAll('#governance .oy-facts dt') ?? [])].map(text)).toEqual([
      'Mailing address',
      'Form 990-N',
    ]);
    expect(text(shown?.querySelector('#governance .oy-facts'))).not.toMatch(
      /95-4612387|Leimert Boulevard|March 2027/,
    );
    // The ask is a card inside Partners and funders, on the section's own ground: no dark band of its
    // own above the dark footer (ADR 0057). It keeps the anchor `#fund`.
    expect(shown?.querySelector('.oy-section.oy-dark')).toBeNull();
    const ask = shown?.querySelector('#funders .oy-ask-card#fund');
    expect(text(ask?.querySelector('h3'))).toBe('Fund the next year');
    expect(text(ask?.querySelector('.oy-ask-card-copy p'))).toBe(
      'Our partnerships lead answers Pending: how soon the partnerships lead replies',
    );
    expect(ask?.querySelectorAll('.oy-btn--primary')).toHaveLength(1);
    expect(text(ask)).not.toMatch(/Adebayo Ogunlesi/);
    expect(shown?.querySelectorAll('#fund')).toHaveLength(1);
    const hidden = (await renderToBody(Funders.Hidden)).querySelector('.oy-home');
    expect(hidden?.querySelector('#funders')).toBeNull();
    const alone = hidden?.querySelector('section#fund');
    expect(alone?.classList.contains('oy-dark')).toBe(false);
    expect(alone?.getAttribute('aria-labelledby')).toBe('fund-heading');
    expect(text(alone?.querySelector('.oy-ask-card h2#fund-heading'))).toBe('Fund the next year');
    expect(hidden?.querySelectorAll('#fund')).toHaveLength(1);
  });
});
