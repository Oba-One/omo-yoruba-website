# 64: H3 sizes run 18 to 26px across the site, outside AGENTS.md's 20 to 24

Labels: design
Status: open
Blocked by: none

**Finding** (R64 in `docs/plans/review-alignment-and-quality.md`; Type scale across components (H3); minor; rule-conflict): Each component is consistent with itself across pages, but the H3 level carries six sizes and two faces, and four of them sit outside the documented range. The prototypes set these sizes, and AGENTS.md outranks the handoff, so either the sizes or the rule should change. D11 covers the phone sizes of the hero and H2 only.

**Evidence:** test-results/review/site/measure-all.json headings at 1440 and 375: take-part row titles h3 18px in the body face, weight 700, ink (19 rows on Odunde, Gala, Programs, Lessons, Collective, Our Story); person name 18px; outcome titles 19px weight 600; zone names 19px and the lead zone 26px; card titles 20px and 21px are in range. Source: the prototype CSS (docs/design/design/_ds/.../css/components.css:75, oy-components.css:144, :147, :299, :478), ported as is. Also: Measured at 375 and 1440 (/private/tmp/claude-501/-Users-afo-Code-omo-yoruba/452b50c5-d114-459b-9fb8-3a0945241754/scratchpad/lr/rules/*.json): .oy-path-body h3 18px Source Sans 700 on /odunde, /gala, /programs, /programs/yoruba-lessons, /programs/cultural-collective, /our-story (the canvas path row is the same); .oy-outcome h3 19px (/impact); non-lead .oy-zone-name h3 19px, line height 1.2 (/odunde); .oy-album-title h2 19px, line height 1.2 (/gallery, ADR 0040 took the prototype's sizes); the homepage event band h2 30px at 1440 (02 Homepage.dc.html sets 30px).

**What to build:** Either raise the take-part titles, person names, outcome and small zone titles to the 20px floor, or record in AGENTS.md that component titles form their own tier; the owner chooses, as with D11. Size M. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
