# Create the Sanity webhook after Phase 4

Type: task
Status: open
Owner: yes
Labels: infra
Phase: 4
Blocked by: none

## Question

Once `/api/revalidate` is deployed, create the webhook in Sanity Manage (POST on create, update and delete; secret `SANITY_WEBHOOK_SECRET`; projection with `_type` and slug). The last stage of `scripts/setup-wizard.sh` walks through it.

## Comments

27 September 2026 (open-work H1, H7). Ticket 26 is closed and its call joins this one (open-work E1):
prove that a publish purges a page, with the runbook's check against the public host. A webhook
already exists, created on 13 September after that day's hosting session had found none:
`purge-site-cache`, a POST to `https://omo-yoruba-khaki.vercel.app/api/revalidate` for `development`,
the stand-in host and the dataset the site reads. Its one delivery, at 22:37 UTC on 13 September,
answered 200, so it signs with the site's `SANITY_WEBHOOK_SECRET`. What is left: the purge check after
the next publish, and moving the webhook's URL and dataset when D2 or D3 changes them. Its triggers,
filter and projection were not read (`docs/runbook.md`, Hosting today).
- 10 October 2026: the purge is proven (open-work E1; the runbook's Hosting today has the timings).
  A publish showed on the live page about five seconds later. Two things are left for the owner in
  sanity.io/manage, which is why this stays open: `purge-site-cache` is not limited to publishes (it
  delivered after each of five draft writes with nothing published), and a second webhook,
  `purge-site-cache2`, posts to the bare domain, which only redirects, and its log is empty.
