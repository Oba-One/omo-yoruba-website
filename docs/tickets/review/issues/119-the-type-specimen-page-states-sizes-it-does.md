# 119: The type specimen page states sizes it does not render and omits the Yoruba subset faces

Labels: infra
Status: open
Blocked by: none

**Finding** (R119 in `docs/plans/review-alignment-and-quality.md`; Foundations/Type (Type.mdx); minor; docs): The page an owner opens to judge the type says one thing and shows another; the heading values are the owner's open decision D11, so the page should show the tokens and point at it.

**Evidence:** packages/ui/src/foundations/Type.mdx:9-13 ('three subsets (latin, latin-ext and vietnamese)'; 'hero 44 to 64px, H2 32 to 40, H3 20 to 24') vs packages/tokens/src/tokens/typography.css (--text-hero clamp(38px, 5.4vw, 60px), --text-h2 clamp(30px, 3.4vw, 38px), --text-h3 22px), which the specimen below renders, and fonts.css:11-12 (the OY Yoruba faces first, ADR 0026)

**What to build:** Quote the token values and name the open call D11, and add the OY Yoruba faces to the font sentence. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
