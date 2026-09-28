# 15: Sponsor levels at 375 squeeze each level's recognition list into a 72px column beside an empty one

Labels: design, bug
Status: open
Blocked by: none

**Finding** (R15 in `docs/plans/review-alignment-and-quality.md`; /gala (SponsorLevels, packages/tokens); major; rule-conflict): The prototype's mobile rule was written for the event row's 72px date block and also catches sponsor tiers, dropping the recognition list into that date column; the site ported it verbatim. Once the Studio holds sponsor levels (open-work C5), every level on a phone reads a word or two per line beside an empty column, on one of the site's three funnels. The live page shows the Pending line today, so it is latent; verified with the story's fixtures and getComputedStyle. The elder test (readable on a phone) and the Build Brief's 'works at 375px' outrank a prototype that breaks its own mobile layout (the method's known trap).

**Evidence:** packages/tokens/src/oy-components.css:1681-1692 ports the prototype's rule (docs/design/design/oy-components.css:368-371): under 720px .oy-lrow--tier takes grid-template-columns 72px 1fr and only .oy-lrow-tier spans both columns, so ul.oy-incl falls into the 72px column. Measured in Storybook pages-gala-awards--shown at 375: row w=327, ul.oy-incl w=72 (its li 86px wide, one or two words per line), the 1fr column empty. Captures test-results/review/home-events/stories/gala-awards-shown-375-pair.png (site) and test-results/review/home-events/pairs/gala-375-sponsor.png (prototype, same squeeze).

**What to build:** Under 720px give the sponsor tier row a single column, or set .oy-lrow--tier .oy-incl to grid-column 1 / -1, so the recognitions wrap across the row under the level; the event row keeps its 72px date column. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments

**Triage, 27 September 2026:** Ready, latent: it shows once a sponsor level lists its recognitions.
