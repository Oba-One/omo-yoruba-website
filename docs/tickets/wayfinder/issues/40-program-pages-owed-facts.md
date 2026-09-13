# The program pages' owed facts

Type: task
Status: open
Owner: yes
Labels: content
Phase: 6
Blocked by: 31

## Question

`/programs`, `/programs/yoruba-lessons` and `/programs/cultural-collective` render every fact the Studio
does not hold as its Pending chip or line; the Studio's Pending view lists each one by page. The register
(`19 Mock Content Register.dc.html`) marks the prototypes' versions invented, so none of them stands in.
Before launch they need, in the Studio:

- **Programs hub.**
  - The cadence and ages on each program card. The Lessons card has its cadence ("Online, by
    arrangement"); its ages, and the Collective's, Kids & STEM's and Cultural Exchange's cadence and
    ages, are owed.
  - Kids & STEM: the ages for Àgbàlá Ọmọde and the STEM Hub, and what the STEM Hub builds.
  - Cultural Exchange: what it is, who it is for, the cadence, how to join, a photograph for the section
    and one for its program card.
  - The year strip's whens for Yoruba Language Lessons, Kids & STEM and the Collective ("Year-round",
    "Saturdays" and "Monthly" are invented). Confirm the Lessons row's note, "Online, scheduled with the
    teacher", which the seed has carried since Phase 2 and the spec's list of confirmed notes leaves out.
- **Yoruba Language Lessons.**
  - The teacher: a `person` linked in `lessonsPage.teacher`, with her name, role, short bio and, with her
    consent, a portrait; and her routing contact's email in the site settings (`contacts`, role
    `teacher`).
  - The glance's ages. Confirm the Format fact's note, "Video call", seeded in Phase 2 from the first
    half of the prototype's note.
  - What you learn, in her words; the levels and what each covers; the steps of a lesson; the answers to
    the five questions parents ask.
  - The `enrol` form's success line (Phase 3, `packages/content/src/enquiry-kinds.ts`) says fees are
    "settled after the first lesson", which the register marks invented: confirm the wording or say what
    she prefers.
- **Yoruba Cultural Collective.**
  - Why culture and sustainability sit together, in your words.
  - The one voice: a `testimonial` with context `collective` and permission to name, linked in
    `collectivePage.voice`.
  - For Solar Hub and Green Goods each: the status, the status line, what it is, who it serves, when it
    started, what comes next, and a photograph.
  - The Collective's events once they are dated (the recipe is in `oy-content-ops`).
  - Whether the Collective keeps its own mailing list (`keepsOwnList`, unread today: the Updates row
    points at the site newsletter, ADR 0029).
  - A photograph of the Collective (ticket 31), which the homepage card, the Programs card and this page
    share.
