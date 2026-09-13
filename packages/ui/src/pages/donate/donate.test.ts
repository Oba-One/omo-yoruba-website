import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as impactStories from './Impact.stories';

const Impact = composeStories(impactStories);

describe('the Donate page-section stories', () => {
  it('impact shown: one gold Give now, the owed Zeffy facts, the door in the row form and every block owed', async () => {
    const root = (await renderToBody(Impact.Shown)).querySelector('.oy-home');
    expect(root?.querySelectorAll('h1')).toHaveLength(1);
    const gold = [...(root?.querySelectorAll('.oy-btn--primary') ?? [])];
    expect(gold.map((button) => text(button))).toEqual(['Give now→']);
    expect(gold[0]?.hasAttribute('data-give')).toBe(true);
    // Give now draws no second button.
    expect(root?.querySelector('#give-now a[data-give]')).toBeNull();
    const facts = [...(root?.querySelectorAll('#give-now .oy-fact') ?? [])].map(
      (fact) => `${text(fact.querySelector('dt'))}: ${text(fact.querySelector('dd'))}`,
    );
    expect(facts).toEqual([
      'Fees: Pending: how your Zeffy form handles this',
      'Receipt: Pending: how your Zeffy form handles this',
      'Monthly: Pending: how your Zeffy form handles this',
      'If the form fails: The dialog offers contact and a mailing address instead.',
    ]);
    expect(
      root?.querySelector('#larger .oy-door-card--row a[data-enquiry="sponsor"]'),
    ).not.toBeNull();
    expect(text(root?.querySelector('#what .oy-pend-line'))).toContain(
      'the preset amounts and what each buys',
    );
    expect(text(root?.querySelector('#other .oy-pend-line'))).toContain(
      'which other ways to give you accept',
    );
    const cells = [...(root?.querySelectorAll('#trust .oy-glance > div') ?? [])];
    expect(cells.map((cell) => text(cell.querySelector('b')))).toEqual([
      'Tax status',
      'EIN',
      'Deductible',
      'Receipt',
    ]);
    expect(root?.querySelector('#trust .oy-handoff a[href="/impact"]')).not.toBeNull();
    // None of the register's inventions: fees, platforms, the EIN, the amounts.
    expect(text(root)).not.toMatch(
      /100%|Benevity|Double the Donation|95-4612387|\$25|\$500|Tunde Bakare/,
    );
  });

  it('with levels: each level an outcome card with its chips; hidden: the block gone', async () => {
    const levels = [
      ...((await renderToBody(Impact.WithLevels)).querySelectorAll('#what .oy-outcome') ?? []),
    ];
    expect(levels.map((level) => text(level.querySelector('.oy-outcome-fig')))).toEqual([
      '[ Amount ]',
      '[ Amount ] a month',
      '[ Amount ]',
    ]);
    expect(text(levels[1]?.querySelector('.oy-source'))).toBe('Pending: where the cost comes from');
    expect(text(levels[2]?.querySelector('p'))).toBe('Pending: what the gift does');
    const hidden = (await renderToBody(Impact.Hidden)).querySelector('.oy-home');
    expect(hidden?.getAttribute('data-impact')).toBe('hidden');
    expect(hidden?.querySelector('#what')).toBeNull();
  });
});
