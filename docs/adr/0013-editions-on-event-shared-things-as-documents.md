# Per-edition facts live on the event; shared things are documents; page-owned things stay inline

Decided with the owner on 11 September 2026 (Phase 2 grill). `docs/design/CONTENT-MODEL.md`
put the festival's and the Gala's dates, hours, venue, cost, dress, running order, tiers and
vendor terms on the page singletons. Every one of those facts changes with the edition and is
exactly what a seasonal Content Release stages, so the `event` document carries `start`,
`end`, `doors`, `venue`, `cost`, `dress`, `schedule[]`, `vendorTerms` (festival kind) and
`ticketsUrl`; the glance strip derives from the current edition; the page singletons keep
their intros, layout options, one `primaryAction` and an optional `extraFacts[]`.

The same session settled the placement rule for everything else: a thing is a document when it
is shown on more than one page or per edition (`stat`, `door`, `governanceDoc`, `testimonial`,
`partner`, `givingLevel`), and inline when one page owns it (the Lessons FAQ, the Impact
"how we work" text). The spec's duplicates went: no inline `stats[]`, no `stat.placement`, no
`faq` document, no `impactPage.governance` block.

## Consequences

- `oy-release` edits one `event` document per edition; the page singletons rarely change.
- Pages reference `stat` and `door` documents in order; the homepage, Get Involved and Donate
  share the four doors.
- Derived fields are not stored: `program.hasPage`, `event.status` and `person.contactVia` do
  not exist; the site derives them (a page reference, the dates, the routing contacts).
- Album credits sit on the album (`credit`, `creditConfirmed`, `consentNote`) and apply to every
  photo; a photo carries its own credit only when it differs.
