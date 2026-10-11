import { describe, expect, it } from 'vitest';
import { ticketsTrigger } from './tickets';

describe('ticketsTrigger', () => {
  it("opens the Tickets Dialog for a Zeffy ticket form, linking Zeffy's own page for a reader without JavaScript", () => {
    expect(ticketsTrigger('https://www.zeffy.com/embed/ticketing/a-gala')).toEqual({
      attributes: { href: 'https://www.zeffy.com/ticketing/a-gala', 'data-tickets': '' },
      notice: 'Opens the ticket form on this page.',
      dialog: true,
    });
    expect(ticketsTrigger(' https://www.zeffy.com/en-US/embed/ticketing/a-gala ')?.dialog).toBe(
      true,
    );
  });

  it('opens any other link in a new tab, as the Eventbrite link always did', () => {
    expect(ticketsTrigger('https://www.eventbrite.com/e/0')).toEqual({
      attributes: { href: 'https://www.eventbrite.com/e/0', target: '_blank', rel: 'noopener' },
      notice: 'Opens in a new tab.',
      dialog: false,
    });
    // Zeffy's own page is a link like any other: only an embed address is framed, and no notice
    // names a seller the link may not be.
    expect(ticketsTrigger('https://www.zeffy.com/ticketing/a-gala')).toMatchObject({
      notice: 'Opens in a new tab.',
      dialog: false,
    });
    // Any Zeffy embed address is framed, a donation form's too: a frame beats a link to a bare embed.
    expect(ticketsTrigger('https://www.zeffy.com/embed/donation-form/a-form')?.dialog).toBe(true);
  });

  it('answers nothing for a missing or unsafe link, so the card shows its chip', () => {
    for (const value of [undefined, null, '', '   ', 'javascript:alert(1)']) {
      expect(ticketsTrigger(value), String(value)).toBeUndefined();
    }
  });
});
