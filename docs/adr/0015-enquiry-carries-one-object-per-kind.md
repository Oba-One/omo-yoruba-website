# An enquiry carries one read-only object per kind, generated from the spec

Decided with the owner on 11 September 2026 (Phase 2 grill). The spec's single untyped
`payload` object gave the Studio nothing readable and TypeGen nothing precise, and field ids
collide across kinds (`age` is a select for volunteers and free text for enrol). So the
`enquiry` document has `kind` plus one object field per kind (`sponsor`, `performer`, `table`,
`member`, `volunteer`, `enrol`, `vendor`, `contact`), each generated from
`enquiry-kinds.ts` (ADR 0007), shown only when `kind` matches and read-only, beside
`submittedAt`, `source`, `notifiedAt`, `notifyError`, `handled` and `notes`. There are eight
kinds: the newsletter writes a `subscriber` document (ADR 0004), never an enquiry. The Studio
cannot create an enquiry; the owner can delete one.

## Consequences

- The Astro Action for a kind writes `{ kind, [kind]: fields }`; the notify function reads the
  fields for that kind from the spec, so a field added once is stored, shown and emailed.
- `notifyError` exists so a failed send is visible in the Inbox instead of lost.
