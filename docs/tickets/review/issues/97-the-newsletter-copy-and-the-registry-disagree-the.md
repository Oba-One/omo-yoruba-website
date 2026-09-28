# 97: The newsletter copy and the registry disagree: the README promises a blurb chip that never shows, and the title shows a chip the To do never lists

Labels: infra
Status: open
Blocked by: none

**Finding** (R97 in `docs/plans/review-alignment-and-quality.md`; packages/content (Pending registry, README); minor; docs): AGENTS.md says every required-for-launch field is registered, and ADR 0014 says chip and row never disagree. Both fields are seeded, so nothing shows today; once an administrator clears the title, the footer on every page shows a chip that no To do row asks for.

**Evidence:** packages/content/README.md:80-83 says siteSettings.newsletterBlurb renders Pending while empty, but packages/ui/src/navigation/SiteFooter/SiteFooter.astro:142 and packages/ui/src/bands/NewsletterBand/NewsletterBand.astro:48 draw nothing for an empty blurb; the title draws <Pending what="the newsletter title" /> with its own wording (SiteFooter.astro:140, NewsletterBand.astro:47), and packages/content/src/pending.ts has no row for either field.

**What to build:** Add a registry row for newsletterTitle (Footer: the newsletter title) and have both components read it through pendingWhat; correct the README line, or add a blurb row and chip if the blurb is owed. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
