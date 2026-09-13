# Zeffy embed URL and Eventbrite event URL

Type: task
Status: open
Owner: yes
Labels: content
Phase: 3, 5
Blocked by: none

## Question

`PUBLIC_ZEFFY_EMBED_URL` powers the Give Dialog (Phase 3); `PUBLIC_EVENTBRITE_URL` powers Gala seats (Phase 5). Both may stay empty; the Give Dialog then shows its fallback and the seats button points at the tiers block with a Pending chip in the Studio.

## Comments

12 September 2026 (Phase 5, ticket 08). The question stays with the owner; only where the Eventbrite
answer goes has moved. Each Gala sells through its own Eventbrite event, so the link now lives on the
gala edition as `ticketsUrl` (ADR 0024): `siteSettings.eventbriteUrl` and `PUBLIC_EVENTBRITE_URL` are
retired, and until an edition holds its link each buy-now tier shows "Pending: the Eventbrite link"
where its button goes. The Zeffy half is unchanged.

