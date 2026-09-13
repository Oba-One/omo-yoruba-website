import { describe, expect, it } from 'vitest';
import { vendorTermsText } from './vendor-terms';

// Test values only: the development dataset holds no vendor terms.
const fees = '[ First booth size and fee ]\n[ Second booth size and fee ].';

describe('vendorTermsText', () => {
  it('joins the fee lines, writes both dates and adds the permit note', () => {
    expect(
      vendorTermsText({
        fees,
        closeDate: '2027-04-01',
        decisionDate: '2027-04-20',
        permitNote: '[ The permit note ]',
      }),
    ).toEqual({
      text: '[ First booth size and fee ], [ Second booth size and fee ]. Applications close 1 April 2027, decisions by 20 April 2027. [ The permit note ]',
      missing: false,
    });
  });

  it('keeps what is held and flags the chip while the fees or a date is missing', () => {
    expect(vendorTermsText({ fees, closeDate: null, decisionDate: null })).toEqual({
      text: '[ First booth size and fee ], [ Second booth size and fee ].',
      missing: true,
    });
    expect(vendorTermsText({ closeDate: '2027-04-01' })).toEqual({
      text: 'Applications close 1 April 2027.',
      missing: true,
    });
    expect(vendorTermsText({ decisionDate: '2027-04-20', permitNote: ' ' })).toEqual({
      text: 'Decisions by 20 April 2027.',
      missing: true,
    });
    expect(vendorTermsText(null)).toEqual({ text: '', missing: true });
  });
});
