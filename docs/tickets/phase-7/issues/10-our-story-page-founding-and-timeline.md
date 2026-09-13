# 10: Our Story: the page, how it began and the timeline

Labels: design, content
Status: resolved
Blocked by: 01

**What to build:** `/our-story` renders from Sanity with its slim header, how it began (the founding story
or its chip, the founding facts with the owed ones as chips, the placeholder for the earliest photograph;
spec Q10) and the timeline (spec Q11): each entry's year and line, milestones apart, hidden by default,
the Pending line when shown with none.

- [x] `@oy/content`: `storyPage.foundingFacts[]` (seeded), `storyPage.foundingImage`; `timelineEntry` with
      a required line and `milestone`, `title` and `image` retired; registry rows; the header action's
      revision; `storyPageQuery`; TypeGen
- [x] `@oy/ui`: `Timeline` with its Pending line; stories and tests
- [x] `packages/web`: the builder and the route with `cachePage`; tested
- [x] `Pages/OurStory/Timeline` (hidden, shown); Playwright: no founder's name, first-year fact or dated
      entry the Studio does not hold, the timeline by its option

## Comments

13 September 2026. `@oy/content`: `storyPage.foundingFacts[]` (seeded: Founded "1997, Los Angeles", the
Founders label, Status "501(c)(3) nonprofit", the First year label), `foundingImage`, `takePart[]` and the
seeded `staffIntro`; `timelineEntry` is its year, a required line (`blurb`) and `milestone`; registry rows for
the photograph (the placeholder's wording), the facts and a fact without its value, and the take-part
rows; the header action's revision (`bun seed`: 1 earlier seed value revised); `storyPageQuery` (the board
and the staff and volunteers by group and order, the teacher never among them). `@oy/ui`: `Timeline`
(`ol.oy-timeline`, a milestone's terracotta dot, entries without a year or line left out, the Pending line).
`packages/web`: `buildStoryPage` (tested, 7 cases) and the route. `Pages/OurStory/Timeline` (hidden, shown,
shown with no entries). Playwright for the whole page: seeded 16 passed, placeholder project 16 passed.
