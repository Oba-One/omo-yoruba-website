# 07: The FAQ accordion

Labels: design
Status: resolved
Blocked by: 05

**What to build:** "Questions parents ask" on `/programs/yoruba-lessons` as an accordion (spec Q8): the
page's questions in order, one open at a time, every closed row a 44px target, the mark drawn in CSS,
each answer through `Prose` or the chip "an answer", all closed by default and the first open under
`faq` open; usable by keyboard and without JavaScript. The component serves any later page that grows
questions: single and multi open.

- [x] Research: `docs/research/phase-6-faq-accordion.md` (native `details` with a shared name against the
      APG accordion, support, heading order, find in page, testing); no library
- [x] `@oy/ui`: `Accordion` (single, multi, open by default, Pending answer), stories for every variant
      and a play function driving the keyboard; tests of the initial markup
- [x] `@oy/content` and `packages/web`: the query reads the questions and answers; the builder carries
      them, the counted lead and the option; tested
- [x] `Pages/Lessons/Faq` stories (closed, open); Playwright: one open at a time, Enter and Space toggle,
      the closed rows' 44px, nothing but the first open under `open`; axe clean

## Comments

13 September 2026. Research: `docs/research/phase-6-faq-accordion.md` (the HTML Standard's exclusive
`details`, browser-compat-data, APG, WCAG 2.2, Playwright, axe and Storybook's user-event read at the
source): native `details` sharing a `name`, questions as plain text, no script; ADR 0032 records the
choice against ADR 0018's custom elements. `@oy/ui`: `Accordion` (single by the group, `multi` without it,
`defaultOpen` on the first, the chip for an unanswered question, `Prose` for an answer, the Pending line
for none; the plus and minus drawn as borders in the text colour, which forced colours keep), stories for
every variant with click and Tab play functions (synthetic Enter and Space cannot toggle a native
summary). `packages/web`: the query reads the questions and answers; the builder counts them for the
lead ("The five we hear most often.") and starts the first open under `faq` open; the page draws the
section after the lesson. `Pages/Lessons/Faq` (closed, open). Playwright: 18 passed seeded and 18 with
the placeholder project, with real Enter and Space closing the other question, the closed rows' 44px at
375 and none of the register's answers in place of a chip.
