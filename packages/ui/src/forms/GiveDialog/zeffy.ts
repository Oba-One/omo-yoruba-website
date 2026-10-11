/**
 * The Give Dialog's contract with Zeffy's embedded form (ADR 0045). Zeffy's form posts its state to the page
 * that frames it (`zeffy-embed:connected`, `zeffy-embed:resized` with the form's height,
 * `zeffy-embed:thank-you-page-shown`) only when the iframe's address carries `embed-version=v2` and an
 * `embedId`, and only from Zeffy's origin. That is read from Zeffy's own embed script and one test, not from
 * documentation (`docs/research/online-giving-options.md`). The site's island builds the address here and the
 * dialog renders the origin and the id for its listener, so the two halves name the same form.
 */

/** The one origin the dialog frames (the CSP's `frame-src`) and hears from. */
export const ZEFFY_ORIGIN = 'https://www.zeffy.com';

/** Names the dialog's form in Zeffy's messages. */
export const ZEFFY_EMBED_ID = 'give';

/**
 * What Zeffy's pop-up button code adds to the same embed address (`zeffy-form-link="...?modal=true"`). It tells
 * the form it sits in the pop-up Zeffy's own script draws: in a frame as narrow as the dialog's the form then
 * shows a close button of its own, which posts to that script, and pads its sides. The Give Dialog is the
 * pop-up here and loads no Zeffy script, so an address pasted from that code loses the parameter before it
 * becomes the frame or the page link.
 */
const ZEFFY_POPUP_PARAMETER = 'modal';

/**
 * The iframe's address: the form address `framableSrc` accepted, with the two v2 parameters set through the
 * URL API, so the address keeps its own parameters and fragment, all but the pop-up's.
 */
export function zeffyFrameSrc(form: string): string {
  const url = new URL(form);
  url.searchParams.delete(ZEFFY_POPUP_PARAMETER);
  url.searchParams.set('embed-version', 'v2');
  url.searchParams.set('embedId', ZEFFY_EMBED_ID);
  return url.href;
}

// An embed address as Zeffy's embed code and its sample form write it: `/en-US/embed/donation-form/<slug>`,
// the locale optional.
const EMBED_PATH = /^\/(?:([A-Za-z]{2}-[A-Za-z]{2})\/)?embed\/donation-form\/([^/]+)$/;

/**
 * Zeffy's own page for the same form, where Apple Pay and Google Pay can show (Zeffy never shows them in an
 * embed): the embed address without its `/embed` segment, so
 * `https://www.zeffy.com/en-US/embed/donation-form/<slug>` becomes
 * `https://www.zeffy.com/en-US/donation-form/<slug>`. Any other address answers undefined, and the dialog
 * draws no link.
 */
export function zeffyPageHref(form: string | null | undefined): string | undefined {
  if (!form) return undefined;
  let url: URL;
  try {
    url = new URL(form);
  } catch {
    return undefined;
  }
  const match = url.origin === ZEFFY_ORIGIN ? EMBED_PATH.exec(url.pathname) : null;
  if (!match) return undefined;
  const [, locale, slug] = match;
  url.pathname = locale ? `/${locale}/donation-form/${slug}` : `/donation-form/${slug}`;
  // A page in its own tab is no pop-up. Only an address that carries the parameter is rewritten, so any
  // other keeps its query as it was typed.
  if (url.searchParams.has(ZEFFY_POPUP_PARAMETER)) url.searchParams.delete(ZEFFY_POPUP_PARAMETER);
  return url.href;
}
