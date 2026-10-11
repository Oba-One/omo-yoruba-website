/**
 * The site's contract with Zeffy's embedded forms (ADR 0045, ADR 0050). Zeffy's form posts its state to the
 * page that frames it (`zeffy-embed:connected`, `zeffy-embed:resized` with the form's height,
 * `zeffy-embed:thank-you-page-shown`) only when the iframe's address carries `embed-version=v2` and an
 * `embedId`, and only from Zeffy's origin. That is read from Zeffy's own embed script, the form's own code
 * and tests, not from documentation (`docs/research/online-giving-options.md`). The site builds each frame's
 * address here and each dialog renders the origin and its form's key for its listener, so the two halves name
 * the same form.
 */

/** The one origin the dialogs frame (the CSP's `frame-src`) and hear from. */
export const ZEFFY_ORIGIN = 'https://www.zeffy.com';

/**
 * The site's Zeffy forms: the donation form in the Give Dialog and the membership form in the Join Dialog.
 * A form's key names its dialog (`dialog#give`), its triggers (`data-give`), its hash (`#give`), its track
 * events (`give_opened`) and the form itself in Zeffy's messages (`embedId=give`).
 */
export const ZEFFY_FORMS = ['give', 'join'] as const;
export type ZeffyForm = (typeof ZEFFY_FORMS)[number];

/**
 * What Zeffy's pop-up button code adds to the same embed address (`zeffy-form-link="...?modal=true"`). It tells
 * the form it sits in the pop-up Zeffy's own script draws: in a frame as narrow as a dialog's the form then
 * shows a close button of its own, which posts to that script, and pads its sides. The site's dialog is the
 * pop-up here and loads no Zeffy script, so an address pasted from that code loses the parameter before it
 * becomes the frame or the page link.
 */
const ZEFFY_POPUP_PARAMETER = 'modal';

/**
 * A form's iframe address: the address `framableSrc` accepted, with the two v2 parameters set through the URL
 * API, the form's key as its id, so the address keeps its own parameters and fragment, all but the pop-up's.
 */
export function zeffyFrameSrc(address: string, form: ZeffyForm): string {
  const url = new URL(address);
  url.searchParams.delete(ZEFFY_POPUP_PARAMETER);
  url.searchParams.set('embed-version', 'v2');
  url.searchParams.set('embedId', form);
  return url.href;
}

// An embed address as Zeffy's embed codes and its sample form write it: `/en-US/embed/donation-form/<slug>`
// for a donation form, `/embed/ticketing/<slug>` for a ticketing form (a membership form is one), the locale
// optional.
const EMBED_PATH = /^\/(?:([A-Za-z]{2}-[A-Za-z]{2})\/)?embed\/(donation-form|ticketing)\/([^/]+)$/;

/**
 * Zeffy's own page for the same form (for a gift, where Apple Pay and Google Pay can show: Zeffy never shows
 * them in an embed): the embed address without its `/embed` segment, so
 * `https://www.zeffy.com/en-US/embed/donation-form/<slug>` becomes
 * `https://www.zeffy.com/en-US/donation-form/<slug>`, and a ticketing form's the same way. Any other address
 * answers undefined, and the dialog draws no link.
 */
export function zeffyPageHref(address: string | null | undefined): string | undefined {
  if (!address) return undefined;
  let url: URL;
  try {
    url = new URL(address);
  } catch {
    return undefined;
  }
  const match = url.origin === ZEFFY_ORIGIN ? EMBED_PATH.exec(url.pathname) : null;
  if (!match) return undefined;
  const [, locale, kind, slug] = match;
  url.pathname = `${locale ? `/${locale}` : ''}/${kind}/${slug}`;
  // A page in its own tab is no pop-up. Only an address that carries the parameter is rewritten, so any
  // other keeps its query as it was typed.
  if (url.searchParams.has(ZEFFY_POPUP_PARAMETER)) url.searchParams.delete(ZEFFY_POPUP_PARAMETER);
  return url.href;
}
