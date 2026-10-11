import { safeHref } from '../../core/ActionButton/action';
import { zeffyPageHref } from '../../forms/ZeffyDialog/zeffy';

/** What a Get tickets button carries: its link's attributes, the line beside it, and what it opens. */
export interface TicketsTrigger {
  attributes: {
    href: string;
    'data-tickets'?: '';
    target?: '_blank';
    rel?: 'noopener';
  };
  /** The one-line notice of where the button leads. */
  notice: string;
  /** The edition's ticket link is a Zeffy form, which opens on the page (ADR 0052). */
  dialog: boolean;
}

/**
 * The trigger for an edition's ticket link (ADR 0024, ADR 0052), the one place that decides what a Get
 * tickets button does: the tier cards, the seats block and the Gala page's dialog all ask here. A Zeffy
 * form's embed address opens in the Tickets Dialog: the button carries `data-tickets`, and its link, for a
 * reader without JavaScript, goes to Zeffy's own page for the form. Any other link (Eventbrite, or Zeffy's
 * own page) opens in a new tab. A missing link, or one the Studio's URL rule never saw, answers undefined
 * and the caller shows the registry's chip.
 */
export function ticketsTrigger(ticketsUrl: string | null | undefined): TicketsTrigger | undefined {
  const page = zeffyPageHref(ticketsUrl?.trim());
  if (page) {
    return {
      attributes: { href: page, 'data-tickets': '' },
      notice: 'Opens the ticket form on this page.',
      dialog: true,
    };
  }
  const href = safeHref(ticketsUrl);
  if (!href) return undefined;
  return {
    attributes: { href, target: '_blank', rel: 'noopener' },
    notice: 'Opens in a new tab.',
    dialog: false,
  };
}
