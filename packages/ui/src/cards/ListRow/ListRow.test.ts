import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './ListRow.stories';

const { SponsorTier, Pending, Entry, EntryPending } = composeStories(stories);

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

  it('draws an entry: the title as a heading and its line, one column without a date or action', async () => {
    const row = (await renderToBody(Entry)).querySelector('li.oy-lrow.oy-lrow--entry');
    expect(row?.classList.contains('oy-lrow--plain')).toBe(true);
    expect(row?.querySelector('.oy-lrow-date')).toBeNull();
    expect(text(row?.querySelector('.oy-lrow-body h3'))).toBe('[ The first level ]');
    expect(text(row?.querySelector('.oy-lrow-body p'))).toBe('[ What the level covers ]');
    expect(row?.querySelector('a.oy-btn')).toBeNull();
    const owed = (await renderToBody(EntryPending)).querySelector('li.oy-lrow--entry');
    expect(text(owed?.querySelector('.oy-lrow-body p .oy-pend'))).toBe(
      'Pending: what the level covers',
    );
  });
});
