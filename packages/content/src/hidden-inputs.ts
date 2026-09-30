import { EDITION_FIELDS, editionFieldShown } from './edition-fields';

/**
 * The inputs the Studio hides (ADR 0042): for good, kept for a later use (the sharing image for link
 * previews) or carried by a shared object that shows them
 * elsewhere (the header photo, a photograph's own credit); and on an event, the inputs its kind's pages
 * never read (`edition-fields.ts`). The content-lint function skips what this module names, so the
 * wording to check never names an input nobody can open; the schema reads its page-dependent rules
 * (the header photo, a photograph's credit), and a test holds the schema's fixed `hidden` inputs to it.
 * A plain module with no Sanity import, so the function's bundle carries it.
 */

/** The pages that draw a photo band; every other header is slim. */
export const headerPhotoShown = (documentType: string | undefined) =>
  documentType === 'festivalPage' || documentType === 'galaPage';

/** A photograph's own credit shows only on an album's photographs; the album's credit covers the rest. */
export const photoCreditShown = (documentType: string | undefined, firstField: unknown) =>
  documentType === 'album' && firstField === 'photos';

const PHOTO_CREDIT_FIELDS: ReadonlySet<string> = new Set([
  'credit',
  'creditNote',
  'creditConfirmed',
]);

/**
 * Whether a stored value sits in an input nobody can open on a document of this type. `fields` are the
 * path's field names with the list keys left out: `['header', 'image', 'alt']`, `['photos', 'creditNote']`.
 */
export function hiddenForGood(documentType: string, fields: readonly string[]): boolean {
  const [first, second] = fields;
  if (fields.some((field, at) => field === 'ogImage' && fields[at - 1] === 'seo')) return true;
  if (first === 'header' && second === 'image' && !headerPhotoShown(documentType)) return true;
  // Both of the rest sit inside an object, never at the top of a document: a sourced figure's
  // `asOf` (no page dates a figure), and a photograph's credit (an album's own credit shows).
  const last = fields.at(-1);
  if (fields.length < 2 || last === undefined) return false;
  return (
    last === 'asOf' || (PHOTO_CREDIT_FIELDS.has(last) && !photoCreditShown(documentType, first))
  );
}

/** Whether the form hides the input a stored value sits in on this document, for good or by its kind. */
export function hiddenOn(
  document: { _type: string; kind?: unknown },
  fields: readonly string[],
): boolean {
  if (hiddenForGood(document._type, fields)) return true;
  if (document._type !== 'event') return false;
  const kind = typeof document.kind === 'string' ? document.kind : undefined;
  return EDITION_FIELDS.some(
    (field) =>
      !editionFieldShown(kind, field) && field.split('.').every((step, at) => fields[at] === step),
  );
}
