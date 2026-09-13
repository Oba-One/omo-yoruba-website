# 07: The FAQ accordion

Labels: design
Status: open
Blocked by: 05

**What to build:** "Questions parents ask" on `/programs/yoruba-lessons` as an accordion (spec Q8): the
page's questions in order, one open at a time, every closed row a 44px target, the mark drawn in CSS,
each answer through `Prose` or the chip "an answer", all closed by default and the first open under
`faq` open; usable by keyboard and without JavaScript. The component serves any later page that grows
questions: single and multi open.

- [ ] Research: `docs/research/phase-6-faq-accordion.md` (native `details` with a shared name against the
      APG accordion, support, heading order, find in page, testing); no library
- [ ] `@oy/ui`: `Accordion` (single, multi, open by default, Pending answer), stories for every variant
      and a play function driving the keyboard; tests of the initial markup
- [ ] `@oy/content` and `packages/web`: the query reads the questions and answers; the builder carries
      them, the counted lead and the option; tested
- [ ] `Pages/Lessons/Faq` stories (closed, open); Playwright: one open at a time, Enter and Space toggle,
      the closed rows' 44px, nothing but the first open under `open`; axe clean

## Comments
