# 05: The Lessons page: header, glance, the teacher and take part

Labels: design, content
Status: resolved
Blocked by: 01

**What to build:** `/programs/yoruba-lessons` renders from Sanity (spec Q6 to Q9): the slim header with
the gold "Write to the teacher", the glance of four facts, the teacher section (her card with the woven
tick, "Teacher" and the chip before she is linked; her name, role, bio and portrait by `portraits` after)
beside the `enrol` enquiry card with her email or its chip, and the take-part band with the page's rows
and the programs handoff. Never "School" in display text; no terms, Saturdays or venue.

- [x] `@oy/content`: `lessonsPageQuery` (the singleton, the teacher and her routing contact);
      `lessonsPage.voices` retires; the registry's header row, the glance row reworded, the teacher and
      the teacher's email rows; the route map and Presentation (a lessons testimonial leads with the
      homepage); the `email` key in the stega filter; TypeGen
- [x] Seed: `voices` unset where stored
- [x] `@oy/ui`: `PersonCard` before a teacher is linked; the enquiry card beside it with the email line;
      stories and tests
- [x] `packages/web`: the Lessons builder on the page skeleton, tested; the route with `cachePage` and
      the edit attributes; one gold action per screen view (the card's button outline if it shares a view
      with the header's)
- [x] `Pages/Lessons/Portraits` stories (shown, hidden); Playwright: one h1, the nav's Lessons current,
      the enrol form from the header and the card with focus returning, the take-part forms; axe clean

## Comments

13 September 2026. `@oy/content`: `lessonsPageQuery` reads the teacher with her portrait and short bio
and her routing contact's email from the settings; `lessonsPage.voices` and its registry row retired
(the testimonial presence row now names the homepage, Impact and the Collective); the glance row reads
"a glance fact", the teacher row "the teacher's name and bio", and a settings row lists "the teacher's
email" while her routing contact holds none. A testimonial no longer reaches the Lessons route, and a
lessons testimonial leads with the homepage in Presentation; the Lessons options and a contact's `email`
join the stega filter. `packages/web`: `buildLessonsPage` (five tests): the woven tick, "Teacher" and the
chip before she is linked, her portrait only while `portraits` is shown. The route draws the header, the
glance, the teacher beside the `enrol` enquiry card and the take-part band with the programs handoff.
The prototype's second gold "Write to the teacher" shares a 1440 view with the header's (447px and
1075px down a 900px view), so the card's trigger is the outline, as spec Q7 allowed. `@oy/ui`:
`EnquiryCard` offers an address beside its trigger (a `mailto:` link through `safeHref`, or the chip);
`Split` gains the `person` shape (320px beside the rest, stacking under 860px); `Pages/Lessons/Portraits`
(pending, shown, hidden). Playwright `lessons.spec.ts`: 16 passed seeded and 16 with the placeholder
project, including "never School, no term, no Saturday" and a new `goldSharingAView` helper, which the
Programs spec also runs now.
