# 05: EnquiryCard and the EnquiryModal with the eight field sets and five states

Labels: design
Status: open
Blocked by: 02

**What to build:** `EnquiryCard` in `@oy/ui/forms`: the card that explains a form before opening
it (title, what it asks, how long, what happens next, the trigger button). `EnquiryModal`: the
one native dialog shell holding eight forms generated from `enquiry-kinds.ts`, only the active
kind visible, each form posting to its action with `novalidate`, a honeypot, the `source` path,
the summary slot, the fields through `Field`, the foot note, the submit and cancel buttons and
the human fallback. Five states: empty, filled, submitting (busy button), success (the success
block replaces the fields, the close button takes focus), error (summary with `role="alert"`,
each field named, values kept). Dialog on desktop, bottom sheet under 720px, Escape and scrim
click close, focus returns to the trigger. Server-rendered open state for `?enquiry=<kind>`
and for a posted result. The inline custom element opens from any `[data-enquiry]` trigger,
pre-validates with the spec's sentences, submits through the action, and renders the result
(ADR 0018, ADR 0019).

- [ ] Stories: one per kind (empty), Filled, Submitting, Success, Error, the bottom sheet at 375, with a full routing contact and with an empty one
- [ ] `play`: a trigger opens the modal for its kind and focus lands on the first field; an empty submit shows the summary and the field sentences without a request and keeps a typed value; Escape closes and focus returns to the trigger
- [ ] Vitest: eight forms exist with the spec's fields, ids are unique across kinds, the success copy uses `successCopy` and the foot `footCopy`, the honeypot is hidden from assistive technology and not in the tab order
- [ ] No copy in the component beyond the fallback sentence and the button labels the spec lacks
