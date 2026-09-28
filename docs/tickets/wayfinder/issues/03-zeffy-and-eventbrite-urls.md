# Zeffy embed URL and Eventbrite event URL

Type: task
Status: open
Owner: yes
Labels: content
Phase: 3, 5
Blocked by: none

## Question

Two links, both entered in the Studio; neither is an environment variable.

- **The Zeffy donation form's embed link**, in the site settings (`siteSettings.zeffyEmbedUrl`, kept for
  administrators by ADR 0042). The Give Dialog's server island reads it (ADR 0020). Until it is set,
  every Donate button opens the dialog's Pending answer, "The online giving form is not set up yet.",
  with the other two ways to give (write to us, or send a check to the mailing address) and Contact us
  (open-work D8 asks you to confirm that copy), and Donate's give-now facts stay owed (ticket 42).
- **Each Gala's Eventbrite event link**, on its edition as `ticketsUrl` (ADR 0024). Until an edition
  holds it, each buy-now tier shows "Pending: the Eventbrite link" where its button goes.

Both may stay empty. Open-work C1 (the Zeffy link, Now) and C5 (the Eventbrite link, Launch) track them.

## Comments

12 September 2026 (Phase 5, ticket 08). The question stays with the owner; only where the Eventbrite
answer goes has moved. Each Gala sells through its own Eventbrite event, so the link now lives on the
gala edition as `ticketsUrl` (ADR 0024): `siteSettings.eventbriteUrl` and `PUBLIC_EVENTBRITE_URL` are
retired, and until an edition holds its link each buy-now tier shows "Pending: the Eventbrite link"
where its button goes. The Zeffy half is unchanged.

27 September 2026. Rewritten (open-work H2): the question named `PUBLIC_ZEFFY_EMBED_URL`, which nothing
has read since Phase 3, when the Give Dialog's island began reading the site settings; the variable
leaves the env schema, the runbook and the wizard (open-work E6). The Zeffy link is still owed:
`development`'s site settings hold none (checked 27 September).
