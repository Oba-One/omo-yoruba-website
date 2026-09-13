# Check the event pages in the Studio and on the preview, then merge the Phase 5 pull request

Type: task
Status: open
Owner: yes
Labels: infra
Phase: 5
Blocked by: none

## Question

Phase 5 (the Odunde and Gala pages) is the pull request from `phase-5/event-pages` (link in
`docs/plans/handoff-phase-5.md`). Before merging:

1. Open `/admin`, the Presentation tool and `/odunde`. Click the header photograph, a zone card, a
   take-part row, the take-part and labels options (the band and the section) and the past years
   carousel (the album): each opens its field. Do the same on `/gala` for the treatment (the header),
   the tiers and emphasis options, the running order and a take-part row.
2. Look at both pages at 375 and 1440 against `08 Odunde Festival.dc.html` and `09 End-of-Year
   Gala.dc.html`; ADR 0028 lists what matches and what stays different on purpose, and the captures
   are reproducible (`docs/runbook.md`, "Comparing a page with its prototype").
3. Delete the empty `PUBLIC_EVENTBRITE_URL=` line from `packages/web/.env.example`, and the variable
   from Vercel if it was ever set: the Eventbrite link now lives on each gala edition (ADR 0024). The
   agent's permissions deny that file.
4. Switch the Gala page's Awards option to hidden in the Studio if the Gala gives no awards this year
   (the development dataset keeps the `shown` the seed stored; ticket 06).
