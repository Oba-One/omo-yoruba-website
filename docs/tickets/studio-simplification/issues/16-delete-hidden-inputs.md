# 16: Delete the hidden inputs with no planned use

Labels: infra
Status: open
Blocked by: 09, 11

**What to build:** S2's second half (spec Q3). Delete by migration what ticket 03 hid, except the sharing image, the post body and the shared-object fields.

| Hidden in part 4 | Fate in part 5 |
| --- | --- |
| `event.heroImage` | Deleted; two editions hold one today |
| `collectivePage.keepsOwnList` | Deleted |
| `initiative.proceedsReturn` | Deleted |
| `door.order` | Deleted |
| `galaPage.extraFacts` | Deleted; the edition fills all five glance facts |
| `siteSettings.logo`, `siteSettings.wordmarkLine2`, `siteSettings.footerBlurb` | Deleted |
| `photographer.url` | Deleted |
| `stat.asOf` | Deleted |
| `initiative.order`, `timelineEntry.order`, `outcome.order`, `givingLevel.order` | Go with the page lists (ticket 10): the list's own order replaces them |
| `seo.ogImage` | Stays hidden until link previews (Phase 9) |
| `newsPost.body`, `newsPost.author` | Stay hidden for a later News page (D22) |
| `pageHeader.image` outside the Odunde and Gala pages, the `oyImage` credit fields outside album photographs, `sourcedFigure.asOf` | Stay hidden: fields of shared objects, which other places use |

- [ ] `RETIRED_FIELDS` entries; the seed; the queries that still fetch them
- [ ] The `retired-fields` migration
- [ ] `bun check` green; Playwright unchanged in both data modes

## Comments
