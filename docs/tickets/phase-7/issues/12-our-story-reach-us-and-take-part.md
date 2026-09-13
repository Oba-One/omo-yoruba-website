# 12: Our Story: Reach us and take part

Labels: design, content
Status: open
Blocked by: 04, 10

**What to build:** the page's close (spec Q4, Q13). Reach us at `#contact`: the kicker, the heading and
the seeded line, the contact block (email, phone, mailing address, who receives this) and the box to
Impact's governance, beside the contact form's card (gold) with the urgent line only when a phone exists.
Take part: the two seeded rows, member and volunteer, with the lead that counts them.

- [ ] `@oy/content`: `storyPage.takePart[]` (seeded) with its registry rows; the query reads the settings
      and the rows; TypeGen
- [ ] `packages/web`: the builder carries both sections; the card goes outline if Playwright finds it
      sharing a view with the member row's gold; tested
- [ ] Playwright: the contact and member and volunteer round trips, the governance link, one gold per view

## Comments
