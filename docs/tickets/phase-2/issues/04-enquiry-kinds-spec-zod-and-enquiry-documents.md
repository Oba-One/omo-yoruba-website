# 04: The enquiry kinds spec, its Zod schemas and the enquiry and subscriber documents

Labels: content
Status: resolved
Blocked by: 03

**What to build:** `enquiry-kinds.ts` as the one description of the eight kinds ported from the
prototype's FORMS object (title, blurb, fields with labels, options and error phrases, submit
label, success copy as a template with contact and response slots, foot notes, the kind to role
map), the Zod schema derived from it, and the `enquiry` document generated from it with one
read-only object per kind, `submittedAt`, `source`, `notifiedAt`, `notifyError`, `handled`,
`notes`, plus `subscriber`. No name, price, date or phone number lives in the spec.

- [x] Tests assert every kind has a title, blurb, submit label, success copy, at least one required
      field with an error phrase, an email field and a role; ids are unique within a kind
- [x] `successCopy(kind, contact)` renders with a full routing contact and with an empty one
- [x] The Zod schema rejects a missing required field with that field's phrase and accepts a
      valid payload for every kind
- [x] The Studio shows only the matching object for an enquiry's kind, read-only, and offers no
      "new enquiry" in the create menu

## Comments

11 September 2026. Ported from FORMS with the mock facts removed: the membership and booth size
options lost their prices, the vendor blurb lost its dates, the permit hint lost the county rule,
the performer copy says "in the spring", and every named person and response time became a
template slot filled from the routing contact (ADR 0016). The Studio checks in the last criterion
run in ticket 09.
