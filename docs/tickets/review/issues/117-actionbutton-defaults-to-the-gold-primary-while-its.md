# 117: ActionButton defaults to the gold primary while its docstring, story and the component map say outline by default

Labels: infra
Status: open
Blocked by: none

**Finding** (R117 in `docs/plans/review-alignment-and-quality.md`; ActionButton; minor; docs): Every current caller passes a variant, so nothing is gold by accident today, but the next caller that trusts the docs gets a second gold action on the view. Verified with git grep over ui and web callers.

**Evidence:** packages/ui/src/core/ActionButton/ActionButton.astro:22 (variant = 'primary') vs :5-7 ('outline by default, a page passes primary once per view'); docs/design/COMPONENT-MAP.md:33; ActionButton.stories.ts:18 ('Outline by default'), whose meta also passes variant: 'primary'

**What to build:** Make the default secondary, which every document describes, and keep passing primary explicitly where the gold goes. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
