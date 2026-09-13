import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './ListRow.stories';

const { SponsorTier, Pending } = composeStories(stories);

describe('ListRow', () => {
  it('draws the sponsor tier: name as a heading, the amount and the ticked recognition', async () => {
    const row = (await renderToBody(SponsorTier)).querySelector('li.oy-lrow.oy-lrow--tier');
    expect(text(row?.querySelector('.oy-lrow-tier h3 b'))).toBe('[ The first level ]');
    expect(text(row?.querySelector('.oy-lrow-tier span'))).toBe('[ Amount ]');
    expect(row?.querySelectorAll('ul.oy-incl li')).toHaveLength(2);
  });

  it('names the amount and the recognition the Studio still owes', async () => {
    const row = (await renderToBody(Pending)).querySelector('li.oy-lrow');
    expect(text(row?.querySelector('.oy-lrow-tier span .oy-pend'))).toBe('Pending: the amount');
    expect(row?.querySelector('ul.oy-incl')).toBeNull();
    expect(text(row?.querySelector('.oy-lrow-owed .oy-pend'))).toBe(
      'Pending: what the level recognizes',
    );
  });
});
