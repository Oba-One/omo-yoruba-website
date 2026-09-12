# 07: The home page composes the blocks from Sanity

Labels: infra
Status: resolved
Blocked by: 01, 06

**What to build:** `/` in `packages/web` reads the homepage query through `loadQuery`, picks the
lead event with the season rule, fills the layout defaults, and arranges the hero, the stat strip,
the event band, the programs, the member voices, the news, the year in the life, raise your hand and
the newsletter placement with the library parts. The layout takes the body data attributes the
options drive, the newsletter placement and the page description. Every image is a Sanity CDN URL
with a srcset. The Enquiry Modal and the Give Dialog keep opening from the real doors. The Playwright
suite opens the forms from the real triggers and stays green.

- [x] `/` renders every block from the development dataset with Pending chips for the empty fields and nothing invented
- [x] Each layout value changes the page as the prototype's tweak does
- [x] The Phase 3 suite and the new homepage specs pass at 375 and 1440 with axe clean

## Comments

12 September 2026. `packages/web/src/pages/index.astro` composes the blocks from
`buildHomepage` (`src/lib/sanity/homepage.ts`, a pure view model with its own tests) over the
one query; `SiteLayout` takes `root` (the body data attributes), `newsletter` (the band placement)
and `description`. Checked in the browser against `development` at 1440 and 375: every block in
the prototype's order, the seeded photographs, Pending chips for the date, the venue, the
Cultural Exchange blurb, the three voices and the settings. The Playwright suite opens the forms
from the real doors and the footer, and from the `?enquiry=<kind>` opener for the four kinds the
page has no trigger for (the served-open modal now focuses its first field as the trigger path
does); 54 pass, 6 skip by design, axe clean at both widths after the tint contrast fix. News
cards carry no link until the News page exists (wayfinder ticket 08).
