# 12: The teacher from the Lessons page's pick

Labels: infra
Status: resolved
Blocked by: 09

**What to build:** S13 (spec Q9). `teacher` leaves the person groups and the group becomes optional.

- [x] Person groups: board, staff, volunteer; the group optional with a description
- [x] The Presentation resolver; the recipe; tests
- [x] Migration `teacher-group`
- [x] `bun check` green; Playwright unchanged in both data modes

## Comments

26 September 2026. Built on `studio/restructure` (pull request B). Neither dataset has a person in the
teacher group, and neither Lessons page picks a teacher yet, so the migration has nothing to move today;
it takes a teacher-group person out of the group once the Lessons page picks her, and reports one it does
not pick for the owner. The group is optional, its help says the teacher belongs in none, and the
Presentation tool leads a person in a group with Our Story and anyone else with the Lessons page (a
location resolver reads the person's own fields, not the page that picks her). The registry already asked
for the teacher through the Lessons page's pick, so no row changed.
