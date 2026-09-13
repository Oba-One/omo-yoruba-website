import { describe, expect, it } from 'vitest';
import { ENQUIRY_KINDS } from './enquiry-kinds';
import { isWayIn, WAY_INS, wayAction } from './take-part';

describe('ways in', () => {
  it('open their own enquiry kind, and give opens the Give Dialog', () => {
    for (const way of WAY_INS.filter((way) => way !== 'give')) {
      expect(ENQUIRY_KINDS).toContain(way);
      expect(wayAction(way, 'Label')).toEqual({
        label: 'Label',
        kind: 'enquiry',
        enquiryKind: way,
      });
    }
    expect(wayAction('give', 'Donate')).toEqual({ label: 'Donate', kind: 'give' });
  });

  it('take no action without a label, and know their own names', () => {
    expect(wayAction('vendor', '  ')).toBeUndefined();
    expect(wayAction('vendor', null)).toBeUndefined();
    expect(isWayIn('table')).toBe(true);
    expect(isWayIn('member')).toBe(false);
  });
});
