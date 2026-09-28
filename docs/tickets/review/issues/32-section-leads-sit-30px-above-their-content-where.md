# 32: Section leads sit 30px above their content where the prototypes set 22 to 24px, and leads in splits 16px where they set 22

Labels: design, later
Status: open
Blocked by: none

**Finding** (R32 in `docs/plans/review-alignment-and-quality.md`; /impact, /donate, /get-involved, /our-story (SectionHead, Split, Handoff); polish; drift): The prototypes set the gap after a bare heading and lead inline (margin-bottom 22 or 24px) and keep 30px for heads wrapped in .oy-sec-head; SectionHead draws 30px for both, and ADR 0036 recorded only its 12px lead and 6px kicker gap. Each difference is 4 to 8px but it repeats in nine sections, most visibly above the voices, the photographs and Donate's two lists.

**Evidence:** node cap.mjs eval rhythm.js and kids.js at 1440, lead bottom to the next block, site against prototype: Impact voices 30 and 24, photographs 30 and 22, funders 30 and 22; Donate what, other ways and trust 30 and 24; Get Involved talk 16 and 22, its two boxes 20 and 20 against 24 and 14; Our Story Reach us 16 and 22, How it began heading to story 16 and 20, story to facts 22 and 24; Impact's festival link 0 against 10px under its prose; heads with a kicker (numbers, outcomes, governance, larger, staff, take part) match at 30

**What to build:** SectionHead 24px after a kicker-less lead, Split 22px from a lead to what follows, stacked Handoff boxes 24px then 14px, a quiet button 10px under prose; Our Story's founding story at the prototype's 58ch rather than Prose's 66ch once it is written. Size M.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
