/**
 * The festival edition's vendor terms as the sentence the vendor take-part row adds to its line
 * (ADR 0025): the booth fees joined into one sentence, when applications close and when decisions
 * come ("Applications close 1 April 2027, decisions by 20 April 2027."), then the permit note as
 * written. `missing` says the registry's chip follows, while the fees or either date is not held,
 * the fields the Studio's Pending row checks.
 */
import { dayMonthYear } from './edition-dates';
import { withoutClosingPunctuation } from './sentence';

export interface VendorTermsLike {
  /** One line per booth size, as the Studio holds them. */
  fees?: string | null;
  /** Calendar dates, `2027-04-01`. */
  closeDate?: string | null;
  decisionDate?: string | null;
  permitNote?: string | null;
}

/** A fee line without its closing punctuation, so the lines join into one sentence. */
const bare = (line: string) => withoutClosingPunctuation(line.trim());

export function vendorTermsText(terms: VendorTermsLike | null | undefined): {
  text: string;
  missing: boolean;
} {
  const fees = (terms?.fees ?? '').split('\n').map(bare).filter(Boolean);
  const close = dayMonthYear(terms?.closeDate);
  const decision = dayMonthYear(terms?.decisionDate);
  const dates =
    close && decision
      ? `Applications close ${close}, decisions by ${decision}.`
      : close
        ? `Applications close ${close}.`
        : decision
          ? `Decisions by ${decision}.`
          : undefined;
  const text = [
    fees.length > 0 ? `${fees.join(', ')}.` : undefined,
    dates,
    terms?.permitNote?.trim(),
  ]
    .filter(Boolean)
    .join(' ');
  return { text, missing: fees.length === 0 || !close || !decision };
}
