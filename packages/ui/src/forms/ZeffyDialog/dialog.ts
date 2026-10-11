import type { EnquiryKind } from '@oy/content/enquiry-kinds';

/** What a Zeffy dialog serves: the embed box, the fallback, or the answer while Organization details hold no form. */
export type ZeffyDialogMode = 'embed' | 'fallback' | 'pending';

/** A Zeffy dialog's own words; the shell (`ZeffyDialog.astro`) draws them. */
export interface ZeffyDialogCopy {
  title: string;
  /** The line under the title: with the form, and with the fallback. */
  lead: { embed: string; fallback: string };
  /** The fallback's heading when the form did not load. */
  heading: string;
  /** The lead and the heading while there is no form yet. A dialog mounted only with its form has none. */
  pending?: { lead: string; heading: string };
  /** Shown in the embed box until the form is ready. */
  loading: string;
  /** The link to Zeffy's own page for the form: the line beside it and its label. */
  page: { note: string; label: string };
  /** The enquiry the fallback hands over to, and its button's label. */
  enquiry: { kind: EnquiryKind; label: string };
}
