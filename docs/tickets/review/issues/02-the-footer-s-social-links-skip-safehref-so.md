# 02: The footer's social links skip safeHref, so a javascript: or schemeless URL from the settings renders on every page

Labels: bug
Status: resolved
Blocked by: none

**Finding** (R02 in `docs/plans/review-alignment-and-quality.md`; SiteFooter; blocker; correctness): The schema's url rule runs only in the Studio, and ADR 0042 records that an Editor can change site settings through the API or the MCP; with the CSP still report-only (ADR 0011) a javascript: URL would run on click from every page's footer, and a schemeless value such as instagram.com/x becomes a broken relative link. A network value outside the four draws no icon and no aria-label, leaving an empty, nameless link. The library's own rule (action.ts) says a Studio value is checked again wherever it becomes a link; the footer is the one place that does not.

**Evidence:** packages/ui/src/navigation/SiteFooter/SiteFooter.astro:64-67 (filters socials for truthiness only), :105 (<a href={social.url}>), :69-74 (NETWORK_NAMES lookup); safeHref contract at packages/ui/src/core/ActionButton/action.ts:27-36; every other Studio link runs it: PartnerRow.astro:44, FactList.astro:47, GlanceCell.astro:15, ProseLink.astro:14, TicketTierCard.astro:54, EnquiryCard.astro:51; PartnerRow.stories.ts:43 proves the guard with javascript:alert(1), SiteFooter has no such case

**What to build:** Render a social link only when safeHref(social.url) answers and the network is one of NETWORK_NAMES; add a story and a test with a javascript: URL and an unknown network. Size S.

- [x] The fix, with a test that fails before it where the behaviour can be tested
- [x] `bun check` green; Playwright in both data modes where a page changes

## Comments

**Triage, 27 September 2026:** Fixed in pull request 17. The footer renders a social link only with a safe address and a known network, with a story and a test.
