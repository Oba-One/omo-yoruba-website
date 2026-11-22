# Page forms focus on content

Amended by ADR 0056: the Programs page's fixed card count is three, which leaves Cultural Exchange off the page.

Accepted 11 October 2026. The owner found too many fields on each page and approved
the [CMS simplification review](../plans/handoff-cms-simplification-review.md).
This amends ADR 0006 and ADR 0042: the Studio keeps editorial choices, while code
owns settled presentation and ordinary page actions.

## Decision

- All eleven page forms open on Content. Supporting introductions, search and
  sharing overrides, and the remaining section and promotion switches live under
  Advanced. Heading and kicker fields, homepage campaign buttons and custom
  take-part wording start collapsed.
- `editing-defaults.ts` fixes 22 presentation choices at their effective published
  values, checked against the existing Gallery draft. The runtime ignores old
  stored alternatives. The homepage keeps seven photographs and up to four
  figures; Impact keeps up to four figures; Our Story shows short biographies.
  Corresponding array limits and hidden full-bio inputs keep the form honest.
- Ordinary header actions come from the same module. Edition ticket addresses,
  membership routing and enquiry destinations keep their existing authorities.
  Homepage campaign buttons remain editable. Take-part rows need a way in and
  their own descriptive line; titles, button wording and optional chips have
  page-specific defaults with collapsed overrides. Existing overrides are kept.
- Gala supporting introductions move to Advanced. Seats copy follows whether
  the edition actually opens an embedded ticket form. A custom seats introduction
  remains editorial copy and must be checked when the ticket provider changes. Sponsor and honoree copy
  have reviewed defaults. No unconfirmed monthly-giving or receipt claim becomes
  a fixed default.
- Lessons uses `lessonDetails` and Donate uses `paymentDetails`, with named values
  and optional notes. Labels and order are fixed. Unknown values stay empty and
  remain in Pending. Queries normalize both the old rows and new objects during
  rollout; the receipt is identified by a stable key.
- An edition opens its details and related albums; Gala editions also open their
  ticket tiers and honorees. New items there inherit that edition reference.
  Existing general lists remain available. Buying and display options on a
  ticket tier start collapsed, preserving future table enquiries.
- Album credit and consent come before the photographs. Individual credit
  exceptions start collapsed. Alt text, credit confirmation and consent remain
  explicit; the three administrator publishing decisions retain their access rules.

## Stored content and rollout

Legacy layout, action, full-bio and fact-row fields stay hidden and read-only in
the schema for compatibility with existing drafts. This change does not publish,
discard or rewrite those drafts. They are not retired fields yet.

`named-facts` moves only the published Lessons and Donate fact rows into the
named objects. It preserves values and notes, refuses unknown or duplicate
labels and competing new values, checks revisions, and blocks affected drafts.
Rehearse it on an export, deploy the compatible code, then apply it through the
existing migration runner. Its snapshot supports rollback. Do not manually patch
stored content or restore old code while only the new facts exist.

The Pending registry names the new inputs and no longer asks for defaulted row
wording or a retired six-figure layout. Hidden-input handling suppresses old
content-lint paths. Fixed presentation choices have no click-to-edit targets.

## Tradeoffs

An editor now needs a code change for a different presentation or ordinary
header action. This is intentional: the owner prioritized a manageable form.
The component variants remain available to developers. Historical fields can be
removed in a later migration after the owner has resolved the existing drafts.
