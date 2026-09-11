# 07: The Pending registry, the Studio structure and the Inbox

Labels: content
Status: open
Blocked by: 04, 05, 06

**What to build:** the structure from CONTENT-MODEL section 5 with the singletons pinned first,
the groups Events, Programs, People, Impact, News, Gallery, Inbox (enquiries by kind with the
unhandled ones first, subscribers) and Pending. Pending is driven by the registry in
`pending.ts` (ADR 0014): one list per register row using `!defined(field)` with the wording of what
is missing, a presence pane for types with no documents yet or fewer than expected, and the lint
reports with findings.

- [ ] The registry test fails when an entry names a field the schema does not define
- [ ] Every register row that maps to a seeded document appears as a Pending list after the seed
- [ ] The presence pane lists person, testimonial, partner, ticketTier, sponsorLevel, honoree,
      givingLevel, hometownAssociation, timelineEntry, governanceDoc and the two missing zones
- [ ] `pendingWhat(type, field)` returns the same wording the Studio shows
