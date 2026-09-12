# 08: Seats and tables

Labels: design, content
Status: open
Blocked by: 07

**What to build:** the seats and tables block on `/gala`: tier cards in columns or rows by `tiers`, the
table tier first when `emphasis` is tables, the featured tier with the gold inset ring and the gold
button. A buy-now tier opens the edition's Eventbrite link in a new tab with its notice, or shows the
Pending chip without it; the table tier opens the `table` enquiry. The Eventbrite link has one source,
the edition (ADR 0024).

- [ ] `@oy/ui`: `TicketTierCard` (buy-now with and without a link, enquiry, featured, Pending price and includes) and the tiers block; stories and tests
- [ ] `Pages/Gala/Tiers` (columns, rows) and `Pages/Gala/Emphasis` (seats, tables) stories
- [ ] `siteSettings.eventbriteUrl`, its registry row, `siteSettingsQuery` field and `PUBLIC_EVENTBRITE_URL` retired; the seed unsets the field; runbook and `.env.example` updated
- [ ] Playwright: seats carry `target="_blank"` and `rel="noopener"` when a link exists; the table tier opens the modal and focus returns

## Comments
