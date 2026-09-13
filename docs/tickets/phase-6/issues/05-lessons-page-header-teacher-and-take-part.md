# 05: The Lessons page: header, glance, the teacher and take part

Labels: design, content
Status: open
Blocked by: 01

**What to build:** `/programs/yoruba-lessons` renders from Sanity (spec Q6 to Q9): the slim header with
the gold "Write to the teacher", the glance of four facts, the teacher section (her card with the woven
tick, "Teacher" and the chip before she is linked; her name, role, bio and portrait by `portraits` after)
beside the `enrol` enquiry card with her email or its chip, and the take-part band with the page's rows
and the programs handoff. Never "School" in display text; no terms, Saturdays or venue.

- [ ] `@oy/content`: `lessonsPageQuery` (the singleton, the teacher and her routing contact);
      `lessonsPage.voices` retires; the registry's header row, the glance row reworded, the teacher and
      the teacher's email rows; the route map and Presentation (a lessons testimonial leads with the
      homepage); the `email` key in the stega filter; TypeGen
- [ ] Seed: `voices` unset where stored
- [ ] `@oy/ui`: `PersonCard` before a teacher is linked; the enquiry card beside it with the email line;
      stories and tests
- [ ] `packages/web`: the Lessons builder on the page skeleton, tested; the route with `cachePage` and
      the edit attributes; one gold action per screen view (the card's button outline if it shares a view
      with the header's)
- [ ] `Pages/Lessons/Portraits` stories (shown, hidden); Playwright: one h1, the nav's Lessons current,
      the enrol form from the header and the card with focus returning, the take-part forms; axe clean

## Comments
