import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './FactList.stories';

const { Default, Mixed, Pending, OneColumn } = composeStories(stories);

describe('FactList', () => {
  it('pairs each label with its fact or the chip, in a description list', async () => {
    const list = (await renderToBody(Default)).querySelector('dl.oy-facts');
    const rows = Array.from(list?.querySelectorAll('.oy-fact') ?? []);
    expect(rows).toHaveLength(8);
    expect(text(rows[0]?.querySelector('dt'))).toBe('Getting there');
    expect(text(rows[0]?.querySelector('dd .oy-pend'))).toBe('Pending: a practical fact');
    const mixed = (await renderToBody(Mixed)).querySelector('dl.oy-facts .oy-fact dd');
    expect(text(mixed)).toBe('Leimert Park');
  });

  it('renders the Pending line without facts', async () => {
    const body = await renderToBody(Pending);
    expect(body.querySelector('dl')).toBeNull();
    expect(text(body.querySelector('.oy-pend-line'))).toContain('the eight practical facts');
  });

  it('lays the facts in one column when asked, and in two by default', async () => {
    const one = (await renderToBody(OneColumn)).querySelector('dl.oy-facts');
    expect(one?.getAttribute('data-columns')).toBe('1');
    expect(text(one?.querySelector('.oy-fact dd .oy-pend'))).toBe(
      'Pending: ages and what they build',
    );
    const two = (await renderToBody(Default)).querySelector('dl.oy-facts');
    expect(two?.hasAttribute('data-columns')).toBe(false);
  });
});
