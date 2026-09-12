# 07: The home page composes the blocks from Sanity

Labels: infra
Status: open
Blocked by: 01, 06

**What to build:** `/` in `packages/web` reads the homepage query through `loadQuery`, picks the
lead event with the season rule, fills the layout defaults, and arranges the hero, the stat strip,
the event band, the programs, the member voices, the news, the year in the life, raise your hand and
the newsletter placement with the library parts. The layout takes the body data attributes the
options drive, the newsletter placement and the page description. Every image is a Sanity CDN URL
with a srcset. The Enquiry Modal and the Give Dialog keep opening from the real doors. The Playwright
suite opens the forms from the real triggers and stays green.

- [ ] `/` renders every block from the development dataset with Pending chips for the empty fields and nothing invented
- [ ] Each layout value changes the page as the prototype's tweak does
- [ ] The Phase 3 suite and the new homepage specs pass at 375 and 1440 with axe clean
