# 08: The Collective page: header, green scope, the argument, one voice and take part

Labels: design, content
Status: open
Blocked by: 01

**What to build:** `/programs/cultural-collective` renders from Sanity inside its green scope (spec Q9,
Q12 to Q15): the slim header with "Partner with the Collective" and "See what is on", "Why culture and
sustainability sit together" with the argument or its chip beside the Collective program's photograph,
the one voice as the large quote (initials without permission; the chip and the placeholder without a
testimonial), and "Build with the Collective" with Partner, Skills and Updates and the impact handoff.
Green appears only inside the page's `main`, stronger under `green` strong, from tokens.

- [ ] `@oy/tokens`: the Collective's greens as tokens; the scope's rules on `main` (the slim header and
      alternate grounds under strong, the section swatch green and gold); the member-led pill's AA text
      green
- [ ] `@oy/content`: `collectivePageQuery` (the singleton, the Collective program's photograph, the one
      voice); the header row in the registry; the route map and Presentation (the program reaches the
      page); the `initiatives`, `green`, `status` and `events` option names in the stega filter; TypeGen
- [ ] `@oy/ui`: `PullQuote`'s single large quote with the page's registry wording and slot; stories and
      tests
- [ ] `packages/web`: the Collective builder on the page skeleton, tested; the route with `cachePage`,
      the scope and the edit attributes
- [ ] `Pages/Collective/Green` stories (signal, strong); Playwright: one h1, the nav's Collective
      current, no green outside `main`, the take-part forms and the Updates link reaching the newsletter
      form; axe clean in both strengths

## Comments
