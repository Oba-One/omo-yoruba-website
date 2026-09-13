import { describe, expect, it } from 'vitest';
import { ENQUIRY_KINDS } from './enquiry-kinds';
import { isWayIn, NEWSLETTER_ANCHOR, WAY_INS, wayAction } from './take-part';

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

  it('open their own enquiry kind; give opens the Give Dialog and updates the newsletter form', () => {
    for (const way of WAY_INS.filter((way) => way !== 'give' && way !== 'updates')) {
      expect(ENQUIRY_KINDS).toContain(way);
      expect(wayAction(way, 'Label')).toEqual({
        label: 'Label',
        kind: 'enquiry',
        enquiryKind: way,
      });
    }
    expect(wayAction('give', 'Donate')).toEqual({ label: 'Donate', kind: 'give' });
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
