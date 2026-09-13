# Check the program pages in the Studio and on the preview, then merge the Phase 6 pull request

Type: task
Status: open
Owner: yes
Labels: infra
Phase: 6
Blocked by: none

## Question

Phase 6 (the program pages) is pull request https://github.com/Oba-One/omo-yoruba-website/pull/7 from
`phase-6/program-pages`. Before merging:

1. Open `/admin`, the Presentation tool and `/programs`. Click a program card's photograph, a
   sub-program's photograph, the Cultural Exchange chips, a year strip row, a take-part row and the
   `cards`, `inline` and `yearstrip` options: each opens its field. On `/programs/yoruba-lessons` do the
   same for the teacher's card (it opens `teacher` until she is linked), the `lesson`, `portraits` and
   `faq` options and a take-part row. On `/programs/cultural-collective`, for the argument's chip, the
   photograph (it opens the Collective program's image), an initiative's photograph and pills, the
   `initiatives`, `status`, `events` and `green` options, and the voice.
2. Look at the three pages at 375 and 1440 against `10 Programs.dc.html`, `11 Yoruba Language
   School.dc.html` and `12 Yoruba Cultural Collective.dc.html`. ADR 0033 lists what matches and what
   stays different on purpose; the captures are reproducible (`docs/runbook.md`, "Comparing a page with
   its prototype").
3. Decide three things the pages show today:
   - The Programs header's gold "Enrol a learner" is the Studio's action; clear it for the prototype's
     plain header, or keep it (spec Q2).
   - A handoff box on an alternate ground is white, where the Programs prototype's box vanishes into the
     indigo tint (ADR 0033); keep it, or say what the box should be.
   - The status and member-led pills set their words in capitals as the prototype does (ADR 0033).
4. Until this branch deploys, the Studio on `main` does not know the new fields (the take-part rows on
   the program pages, the sub-programs' photographs and facts, the year strip's kinds, `learn`); edit
   the program pages from this pull request's preview.
5. Merge when satisfied. Phase 7 starts from `main` afterwards (`docs/plans/prompt-phase-7.md`).
