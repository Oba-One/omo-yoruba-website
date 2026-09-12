# Newsletter provider

Type: grilling
Status: resolved
Owner: yes
Labels: content
Phase: 3
Blocked by: none

## Question

The design stores subscribers in Sanity and nothing sends. Which provider, if any, sends the newsletter? Default until named: `subscriber` documents plus a later export. Naming one changes the Phase 3 newsletter action (write to Sanity and forward, or forward only).

## Recommendation (11 September 2026, Phase 3, waiting for the owner's yes)

Keep `subscriber` documents and send nothing. The footer form posts to a `newsletter` Astro
Action that validates the address, drops a duplicate silently (the same address twice reads as a
success, no second document), writes `{ email, subscribedAt, source }` and answers with the
success label. The Inbox lists subscribers newest first with an "exported" mark, so a later
provider import is a filter on `exportedAt == null`. No provider key, no third-party script, no
consent copy beyond the blurb, and the form keeps working when a provider is chosen later: the
action gains a forward step, nothing else moves.

## Answer

Resolved 11 September 2026 with the owner (Phase 3 grill): `subscriber` documents, nothing sends.
The footer form posts to the `newsletter` Astro Action, which validates the address, answers
success for a repeat address without a second document, writes `{ email, subscribedAt, source }`
and returns the label "Ẹ ṣé! ✓" (ticket 23). The Inbox lists subscribers newest first with the
`exportedAt` mark for a later provider import. Naming a provider later adds a forward step to
the action and nothing else moves (ADR 0019).
