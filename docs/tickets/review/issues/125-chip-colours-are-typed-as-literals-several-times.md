# 125: Chip colours are typed as literals several times instead of named once

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R125 in `docs/plans/review-alignment-and-quality.md`; packages/tokens (colour literals); polish; judgement): Literals are allowed inside the tokens package, and DESIGN.md records that the chip colours are literals; the issue is repetition, where one missed copy leaves a chip in the old colour.

**Evidence:** packages/tokens/src/oy-components.css:1200, 1223, 2569, 2574, 2580, 2586 (#7a4409, the Pending ink, six times); :682-683 and :775 (#ddefe5 and #1f5c41, the values of --green-150 and --green-700)

**What to build:** Name the Pending chip's colours as tokens and read them in every chip rule; tie the volunteer chip to the green tokens or to its own accent token once D12 settles which. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
