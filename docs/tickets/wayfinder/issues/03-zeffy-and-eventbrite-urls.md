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

10 October 2026. The Zeffy half is answered. The owner gave the form's pop-up button code and asked for
Zeffy across the site; its link, without the pop-up's `modal=true`, went into Organization details and was
published that day (`https://www.zeffy.com/embed/donation-form/donate-to-omo-yoruba-of-southern-california`).
Checked on the public site, on the homepage and Donate: the dialog is in its embed mode, its frame carries
the v2 parameters, Zeffy's connected message arrived 1.3 seconds after the dialog opened, the frame took the
height Zeffy reported (542px, over the 538px it starts at in that window), and the link under the form goes
to Zeffy's own page for it. The form itself offers one-time and monthly gifts and says "You'll receive a tax
receipt for making a donation.", which answers the first half of open-work C12's question. Its suggested
amounts are set in Zeffy and changed during the day, so none is recorded here. The three owed facts on Donate
(fees, receipt, monthly) are the owner's to word. The Eventbrite half stays open (C5). Open-work rows
C1 and C12 take this once pull request 35, which edits both, is merged.
