# 01: Nine ways in and the take-part row's chip

Labels: content, design
Status: resolved
Blocked by: none

**What to build:** a take-part band can draw every row the program prototypes carry (ADR 0029, spec Q1
and Q14): the ways in grow to nine (enrol, member and updates join the six), a row may name its own chip,
enrol and member open their forms, updates sends the reader to the newsletter form on the same page, and
the three program singletons hold their take-part rows in the Studio with the registry's wording for an
empty or unfinished band. The event pages keep drawing exactly what they drew.

- [x] `@oy/content`: the nine ways in and what each opens; the row's optional chip; `takePart[]` on the
      three program singletons with the unique-way rule; the registry's two take-part rows per singleton;
      TypeGen
- [x] Seed: the spec's nine rows (Q14), filled only where missing
- [x] `@oy/ui`: `TakePartBand` and `PathRow` draw the new ways in with their chips and accents (enrol and
      member on the performer accent, updates on the give accent), the row's chip overriding the default,
      updates quiet like give; the footer's newsletter block carries the anchor the updates button uses;
      stories for the new ways in and the chip; tests
- [x] The event pages' Vitest suites and their take-part Playwright specs stay green

## Comments

13 September 2026. `@oy/content`: `take-part.ts` holds nine ways in; `wayAction` sends `enrol` and
`member` to their enquiry kinds, `give` to the Give Dialog and `updates` to `#subscribe`, the anchor the
footer's newsletter block now carries as the homepage's band already did. `takePartRow` gains `chip`, and
`takePart` sits on `programsPage`, `lessonsPage` and `collectivePage`. The registry's two take-part rows
come from one helper for all five pages. The unused `WAY_INS` re-export in the singletons module went.
TypeGen: the singleton query results are unions over every document type (`*[_id == ...]` does not
narrow by type), now that three more types carry a header and a band; the builders still typecheck.
Seed: the spec's nine rows, written to `development` (3 documents updated). `@oy/ui`: `TakePartBand`
draws the chips Enrol, Membership and Updates, a row's own chip before its way in's, and keeps give and
updates quiet; the tokens give enrol and member the performer accent and updates the give accent. The
Programs, Lessons and Collective stories and tests cover the chips, the forms, the gold and the Updates
link. The Odunde, Gala and homepage Playwright specs passed (44).
