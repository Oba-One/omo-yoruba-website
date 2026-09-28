# 124: The same small pieces are written several times: visually hidden text five ways, the list reset three times, the native dialog reset three times, tel links three times

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R124 in `docs/plans/review-alignment-and-quality.md`; packages/ui (duplicated styles and helpers); polish; judgement): Baseline duplication, not a bug: the copies differ slightly (two of the five visually hidden rules lack margin and border resets). ADR 0018 accepts duplicated script logic between inline elements, but not these CSS rules and server-side helpers.

**Evidence:** Visually hidden: oy-components.css:872-883 (.oy-visually-hidden), NewsCard.astro:46-54, EnquiryModal.astro:234-242 and NewsletterForm.astro:94-102 (.oy-hidden), Lightbox.astro:708-715; list reset: EntryList.astro:35-40, EventList.astro:45-50, SponsorLevels.astro:49-54; dialog reset: EnquiryModal.astro:191-206, GiveDialog.astro:111-126, SiteNav.astro:114-129; tel digits: SiteFooter.astro:85, EnquiryModal.astro:175, ContactBlock.astro:73; EIN placeholder: SiteFooter.astro:56, GiveDialog.astro:56

**What to build:** Use the tokens' .oy-visually-hidden everywhere, move the list and dialog resets into the tokens, and add a telHref helper beside safeHref. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
