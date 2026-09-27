# 09: Àgbàlá Ọmọde is 'The children's yard' on the zone card but 'the children's compound' in the Kids & STEM blurb and the Odunde glance

Labels: content, later
Status: open
Blocked by: none

**Finding** (R09 in `docs/plans/review-alignment-and-quality.md`; /, /odunde (seeded copy); polish; content): The prototype calls the zone 'The children's compound'; the seed followed the confirmed facts on the zone card but kept the prototype's word in two other strings, so /odunde names the same place two ways a screen apart.

**Evidence:** packages/content/scripts/seed-data.ts:279 zone name 'The children's yard'; :246 program blurb 'Àgbàlá Ọmọde, the children's compound, and the STEM Hub.' (homepage card); :512 festival glance note 'Children's compound on site' (/odunde). docs/design/CONTENT-MODEL.md section 1 (confirmed facts), CONTEXT.md (Zone) and the oy-voice glossary say 'the children's yard'. Captures test-results/review/home-events/pairs/odunde-1440-glance.png and odunde-1440-zones.png.

**What to build:** Use the confirmed 'children's yard' in the blurb and the glance note through a SeedRevision and the same edit in the Studio (the Programs hub's copy at seed-data.ts:636 and :644 too). Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
