# 19: See it at Odunde lands at the top of the festival page, not at the zones the prototype links

Labels: design, later
Status: open
Blocked by: none

**Finding** (R19 in `docs/plans/review-alignment-and-quality.md`; /programs, Kids & STEM (packages/content seed); polish; drift): The card is about Àgbàlá Ọmọde, which is one of the festival's zones; the prototype sends the reader to it, the site to the festival's header, more than a screen above. The action is a Studio field, so the owner can change it directly as well.

**Evidence:** packages/content/scripts/seed-data.ts:652 cta('See it at Odunde', 'url', '/odunde'); prototype 10 Programs.dc.html:118 links 08 Odunde Festival.dc.html#zones; /odunde renders id="zones" (checked in the served HTML).

**What to build:** Seed '/odunde#zones' in a seed revision and change the stored action in the Studio. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
