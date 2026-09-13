# 12: Our Story: Reach us and take part

Labels: design, content
Status: resolved
Blocked by: 04, 10

**What to build:** the page's close (spec Q4, Q13). Reach us at `#contact`: the kicker, the heading and
the seeded line, the contact block (email, phone, mailing address, who receives this) and the box to
Impact's governance, beside the contact form's card (gold) with the urgent line only when a phone exists.
Take part: the two seeded rows, member and volunteer, with the lead that counts them.

- [x] `@oy/content`: `storyPage.takePart[]` (seeded) with its registry rows; the query reads the settings
      and the rows; TypeGen
- [x] `packages/web`: the builder carries both sections; the card goes outline if Playwright finds it
      sharing a view with the member row's gold; tested
- [x] Playwright: the contact and member and volunteer round trips, the governance link, one gold per view

## Comments

13 September 2026. Reach us: the kicker, the heading and its seeded line, `ContactBlock part="facts"` (email,
phone, mailing address, "Who receives this" from the general routing contact) and the box to
`/impact#governance`, beside `EnquiryCard` for `contact` with the urgent line only while the settings hold a
phone. Playwright found the card's gold sharing a view with the member row's gold at 375 and 1440, so the
card's trigger is the outline. Take part: the two seeded rows and "Two ways to join in."
