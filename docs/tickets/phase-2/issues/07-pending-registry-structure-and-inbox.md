# 07: The Pending registry, the Studio structure and the Inbox

Labels: content
Status: resolved
Blocked by: 04, 05, 06

**What to build:** the structure from CONTENT-MODEL section 5 with the singletons pinned first,
the groups Events, Programs, People, Impact, News, Gallery, Inbox (enquiries by kind with the
unhandled ones first, subscribers) and Pending. Pending is driven by the registry in
`pending.ts` (ADR 0014): one list per register row using `!defined(field)` with the wording of what
is missing, a presence pane for types with no documents yet or fewer than expected, and the lint
reports with findings.

- [x] The registry test fails when an entry names a field the schema does not define
- [x] Every register row that maps to a seeded document appears as a Pending list after the seed
- [x] The presence pane lists person, testimonial, partner, ticketTier, sponsorLevel, honoree,
      givingLevel, hometownAssociation, timelineEntry, governanceDoc and the two missing zones
- [x] `pendingWhat(type, field)` returns the same wording the Studio shows

## Comments

11 September 2026. Rows come from `PENDING` and `PRESENCE` in `src/pending.ts`; the presence pane is
`src/studio/pending-pane.tsx`, counting with the drafts perspective. The second and third criteria
are confirmed against the seeded development dataset in tickets 09 and 11.
