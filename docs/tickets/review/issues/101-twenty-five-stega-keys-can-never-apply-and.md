# 101: Twenty-five stega keys can never apply, and the site cleans the same keys again by hand

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R101 in `docs/plans/review-alignment-and-quality.md`; packages/content (stega filter); polish; consistency): Two mechanisms keep layout values clean and the list reads as if both were needed, so a reader cannot tell which keys matter, and a text field later named like a layout option would lose click-to-edit (the reason Get Involved's doors left the list). I checked every value the site compares or turns into a link: each is clean through the list, the client's own denylist, or its URL and date checks.

**Evidence:** packages/content/src/stega.ts:29-52: every layout option name (season through events) is already kept clean by the parent rule at :60, and scope (:26) is only filtered on, never projected; the comment at :8-9 still says the layout names are needed. The builders strip stega from the list's keys again: packages/web/src/lib/sanity/get-involved-page.ts:42 (door.key), donate-page.ts:102 (frequency), impact-page.ts:80 (outcome.kind) and :324-325 (partner.kind), collective-page.ts:102 (status), album-page.ts:65 (edition.kind), while docs/adr/0022-images-from-asset-references-and-stega-logic-keys.md:11-12 says no page cleans strings by hand.

**What to build:** Trim the list to the discriminators and the mailto and tel settings, update the comment, and either drop the redundant cleanText calls on those keys or amend ADR 0022 to say the builders clean them as a second guard. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
