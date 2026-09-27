# 33: The closing band's heading sits 12px higher than the prototype's and its line is smaller and dimmer

Labels: design, later
Status: open
Blocked by: none

**Finding** (R33 in `docs/plans/review-alignment-and-quality.md`; /impact; polish; drift): ADR 0036 dropped the band's swatch to match the prototype but kept SectionHead's light-ground spacing and intro colour. The band is Impact's last ask, so its heading and sentence are what a funder reads beside the gold Sponsor or partner.

**Evidence:** node cap.mjs eval kids.js and measure on #fund at 1440: site kicker 88, h2 113 (6px under the kicker), line 17px rgb(200, 205, 232), buttons 30px under the line; prototype kicker 93 in a 27px line box, h2 125 (margin-top 10px), line 17.5px rgba(255, 255, 255, 0.86) at 58ch, buttons 28px under (14 Impact.dc.html:249-252); same pattern at 375 (73 against 85)

**What to build:** On the dark band give SectionHead the prototype's 10px kicker gap and draw the line at 17.5px in white at 86 percent. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
