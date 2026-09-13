# 08: Seats and tables

Labels: design, content
Status: resolved
Blocked by: 07

**What to build:** the seats and tables block on `/gala`: tier cards in columns or rows by `tiers`, the
table tier first when `emphasis` is tables, the featured tier with the gold inset ring and the gold
button. A buy-now tier opens the edition's Eventbrite link in a new tab with its notice, or shows the
Pending chip without it; the table tier opens the `table` enquiry. The Eventbrite link has one source,
the edition (ADR 0024).

- [x] `@oy/ui`: `TicketTierCard` (buy-now with and without a link, enquiry, featured, Pending price and includes) and the tiers block; stories and tests
- [x] `Pages/Gala/Tiers` (columns, rows) and `Pages/Gala/Emphasis` (seats, tables) stories
- [x] `siteSettings.eventbriteUrl`, its registry row, `siteSettingsQuery` field and `PUBLIC_EVENTBRITE_URL` retired; the seed unsets the field; runbook updated (the `.env.example` line is the owner's, wayfinder ticket 36)
- [x] Playwright: seats carry `target="_blank"` and `rel="noopener"` when a link exists; the table tier opens the modal and focus returns

## Comments

12 September 2026. `cards/TicketTierCard` (name as a heading, price, includes, one button: Eventbrite in
a new tab with `rel="noopener"` and "Opens Eventbrite in a new tab." on the card, the chip "the
Eventbrite link" where the button goes without one, the table tier's `table` enquiry with the invoicing
line, the featured ring, chips for a missing price or includes) and `content/TicketTiers` (columns or
rows, the table tier first in the markup under `emphasis: tables`, the gold button on the first
featured tier only, the Pending line with no tiers). The registry gains the tier's price and includes
rows. `siteSettings.eventbriteUrl`, its registry row, the settings query field and
`PUBLIC_EVENTBRITE_URL` are gone, the seed lists the field as retired (no value was stored), and the
runbook says the link lives on the edition. `packages/web/.env.example` still carries an empty
`PUBLIC_EVENTBRITE_URL=` line: the agent's permissions deny that file, so the owner deletes the line.
Gala 2026 holds no tiers, so the live page shows the Pending line; the stories use bracketed placeholder
tiers and Eventbrite's own address as the link stand-in.

