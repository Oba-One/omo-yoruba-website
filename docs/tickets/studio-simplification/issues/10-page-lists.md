# 10: Outcomes, timeline, giving levels and initiatives on their pages

Labels: infra
Status: resolved
Blocked by: 07, 09

**What to build:** S14 (spec Q11). The four types become lists on the one page that shows each; the migration moves the two initiatives.

- [x] Four document types become objects; the queries read both shapes for one deploy
- [x] Click-to-edit through `_key` paths; the registry rows on the page lists (a `list` pointer; see the comment)
- [x] Routes, lint types, the Blueprint filter, the seed and tests
- [x] Migration `inline-lists`; the follow-up that drops the old reads waits for the migration day
- [x] `bun check` green; Playwright unchanged in both data modes

## Comments

26 September 2026. Built on `studio/restructure` (pull request B). `initiative`, `outcome`, `timelineEntry`
and `givingLevel` are object types held in `collectivePage.initiatives`, `impactPage.outcomes`,
`storyPage.timeline` and `donatePage.whatYourGiftDoes`; their `order` and `proceedsReturn` fields do not
come along, since the list keeps the order and no page read the other. The four queries read an item as a
reference or as the object itself (`...coalesce(@->, @){...}`, checked with groq-js), so the site shows the
same content before and after the migration; a follow-up after the migration day drops the reference
reading. The builders key the items by `_key` and point click-to-edit at the page
(`initiatives[_key=="..."].image`).

The registry keeps each row's item type and gains a `list` pointer (`{ page, field }`) instead of page-list
field paths: the site and the specs ask for these chips by item type in about twenty places
(`pendingWhat('initiative', 'status')`), and the pointer leaves every one of them alone. `pendingFilter`
asks the page whether any item lacks the field (`count(initiatives[!defined(status)]) > 0`), a row's
`filter` narrows the items, and the To do opens the page. The presence rows for outcomes and giving levels
went, since the pages' own rows already ask for an empty list, and the timeline's became a row on Our
Story's list (`pendingWhat('storyPage', 'timeline[]')`). The route map, the Presentation locations, the lint
function's types and its Blueprint filter no longer name the four types; the sidebar opens Impact beside
its governance filings only; the seed writes the two initiatives into the Collective's list under the keys
its references had. `inline-lists` moves each listed document into its page's list in place, under the
same key, then deletes it; a listed document that is missing, or one no page lists, is left to the owner.
On `development` the dry run moves the two initiatives and deletes their documents.
