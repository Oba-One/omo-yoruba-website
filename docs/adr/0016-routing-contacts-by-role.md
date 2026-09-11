# Routing contacts are entries by role; success copy is a template filled from them

Decided with the owner on 11 September 2026 (Phase 2 grill). The FORMS prototype named people
("Folasade Adeyemi will call") and response times, and the register marks both as mock. So
`siteSettings.contacts[]` holds one entry per role (membership, volunteers, partnerships,
vendors, performers, tables, teacher, general) with a name, an email, a phone and a response
line, and `enquiry-kinds.ts` maps each kind to one role. The success copy in the spec is a
template with `{contact}` and `{responds}` slots; with a full entry it names the person and
the time, with an empty one it names the role and drops the time clause. The notify function
sends to the entry for the kind's role, then the general entry, then the general email.

## Consequences

- No name, address, phone or response time lives in code; wayfinder ticket 02 fills the entries.
- The spec keeps no prices or dates either: select options name the choice, the figures come
  from the Studio.
