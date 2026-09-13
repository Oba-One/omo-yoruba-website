# 08: The Collective page: header, green scope, the argument, one voice and take part

Labels: design, content
Status: resolved
Blocked by: 01

**What to build:** `/programs/cultural-collective` renders from Sanity inside its green scope (spec Q9,
Q12 to Q15): the slim header with "Partner with the Collective" and "See what is on", "Why culture and
sustainability sit together" with the argument or its chip beside the Collective program's photograph,
the one voice as the large quote (initials without permission; the chip and the placeholder without a
testimonial), and "Build with the Collective" with Partner, Skills and Updates and the impact handoff.
Green appears only inside the page's `main`, stronger under `green` strong, from tokens.

- [x] `@oy/tokens`: the Collective's greens as tokens; the scope's rules on `main` (the slim header and
      alternate grounds under strong, the section swatch green and gold); the member-led pill's AA text
      green
- [x] `@oy/content`: `collectivePageQuery` (the singleton, the Collective program's photograph, the one
      voice); the header row in the registry; the route map and Presentation (the program reaches the
      page); the `initiatives`, `green`, `status` and `events` option names in the stega filter; TypeGen
- [x] `@oy/ui`: `PullQuote`'s single large quote with the page's registry wording and slot; stories and
      tests
- [x] `packages/web`: the Collective builder on the page skeleton, tested; the route with `cachePage`,
      the scope and the edit attributes
- [x] `Pages/Collective/Green` stories (signal, strong); Playwright: one h1, the nav's Collective
      current, no green outside `main`, the take-part forms and the Updates link reaching the newsletter
      form; axe clean in both strengths

## Comments

13 September 2026. `@oy/tokens`: the Collective's tints and text green as tokens (`--green-50` to
`--green-300`, `--green-700`), the scope's rules under `[data-scope="collective"]` (the status and
member-led pills; under `green` strong the slim header, the alternate grounds and the green and gold
swatch). Axe found the kicker's terra-600 at 4.42:1 on the strong tint, so kickers on those grounds take
terra-700 (ticket 12's ADR records the departure). `@oy/content`: `collectivePageQuery` (the singleton, the
Collective program's photograph with its id for click-to-edit, the one voice); the program and the
collective testimonial reach the page in the route map and Presentation; the four option names in the
stega filter; `COLLECTIVE_VOICE_SLOT`. `@oy/ui`: `PullQuote` `single` (the tokens' `.oy-quote` figure, not
a card, 760px as drawn) with the page's registry wording; `PageRoot` `scope` for the stories.
`packages/web`: `buildCollectivePage` on the skeleton (the argument or its chip beside the photograph or
its placeholder, the voice or its slot, the counted lead "The projects above are led by members. Three
ways to join them."), the route with `main` in the scope and the green option's edit attribute.
`Pages/Collective/Green` (signal, strong). Playwright: 16 passed seeded and 16 with the placeholder
project, with no green token painted outside `main` at either strength and the Updates link landing on
the newsletter form. The header's "See what is on" points at `#events`, which ticket 10 draws.
