# 13: Retire the Other kind

Labels: infra
Status: resolved
Blocked by: 09

**What to build:** S1's second half (spec Q5). The `other` kind leaves the kind list once no edition holds it.

- [x] Check the dataset; re-file or report any Other edition
- [x] The kind list, TypeGen and tests
- [x] `bun check` green; Playwright unchanged in both data modes

## Comments

26 September 2026. Built on `studio/restructure` (pull request B). Neither dataset holds an event of any
kind but festival, gala and collective (checked with drafts), so nothing moves. `EVENT_KINDS` is the three
kinds, and the machinery that showed a retired kind only on the event holding it leaves the kind field
(the scopes keep it until ticket 14). An event whose stored kind is no longer listed still shows every
input, and publishing it asks for a kind from the list. TypeGen's `Event.kind` is the three kinds.
