import { describe, expect, it } from 'vitest';
import { partnerKind, partnerKindRank } from './partners';

describe('partner kinds', () => {
  it('reads a stored kind, and refuses a value the list does not hold', () => {
    expect(partnerKind(' sponsor ')).toBe('sponsor');
    expect(partnerKind('patron')).toBeUndefined();
    expect(partnerKind(null)).toBeUndefined();
  });

  it('ranks funders first, then partners, then sponsors, and an unknown kind last', () => {
    const stored = ['sponsor', null, 'partner', 'funder', 'patron'];
    expect([...stored].sort((a, b) => partnerKindRank(a) - partnerKindRank(b))).toEqual([
      'funder',
      'partner',
      'sponsor',
      null,
      'patron',
    ]);
  });
});
