import { describe, expect, it } from 'vitest';
import { ENQUIRY_KINDS } from './enquiry-kinds';
import {
  canCarryGold,
  isWayIn,
  NEWSLETTER_ANCHOR,
  WAY_CHIPS,
  WAY_INS,
  wayAction,
} from './take-part';

describe('ways in', () => {
  it('are the nine a take-part band can draw', () => {
    expect(WAY_INS).toEqual([
      'vendor',
      'sponsor',
      'performer',
      'volunteer',
      'table',
      'give',
      'enrol',
      'member',
      'updates',
    ]);
  });

  it('open their own enquiry kind, but for give, member and updates', () => {
    const nonEnquiryWays = ['give', 'member', 'updates'];
    for (const way of WAY_INS.filter((way) => !nonEnquiryWays.includes(way))) {
      expect(ENQUIRY_KINDS).toContain(way);
      expect(wayAction(way, 'Label')).toEqual({
        label: 'Label',
        kind: 'enquiry',
        enquiryKind: way,
      });
    }
    expect(wayAction('give', 'Donate')).toEqual({ label: 'Donate', kind: 'give' });
    // The membership form; the member enquiry stays a kind, as the form its trigger falls back to.
    expect(wayAction('member', 'Become a member')).toEqual({
      label: 'Become a member',
      kind: 'join',
    });
    expect(ENQUIRY_KINDS).toContain('member');
    expect(wayAction('updates', 'Subscribe')).toEqual({
      label: 'Subscribe',
      kind: 'anchor',
      href: NEWSLETTER_ANCHOR,
    });
    expect(NEWSLETTER_ANCHOR).toBe('#subscribe');
  });

  it('take no action without a label, and know their own names', () => {
    expect(wayAction('vendor', '  ')).toBeUndefined();
    expect(wayAction('updates', null)).toBeUndefined();
    expect(isWayIn('table')).toBe(true);
    expect(isWayIn('member')).toBe(true);
    expect(isWayIn('door')).toBe(false);
  });
});

describe('the chips and the ways that may carry the gold', () => {
  it('names a chip for every way in, and never gives give or updates the gold', () => {
    expect(Object.keys(WAY_CHIPS).sort()).toEqual([...WAY_INS].sort());
    expect(WAY_CHIPS.enrol).toBe('Enroll');
    expect(WAY_CHIPS.member).toBe('Membership');
    expect(WAY_INS.filter((way) => !canCarryGold(way))).toEqual(['give', 'updates']);
    expect(canCarryGold(undefined)).toBe(false);
  });
});
