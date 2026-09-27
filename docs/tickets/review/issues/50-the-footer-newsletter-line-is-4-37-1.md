# 50: The footer newsletter line is 4.37:1 on the indigo footer, under AA for 13.5px text

Labels: design, bug
Status: open
Blocked by: none

**Finding** (R50 in `docs/plans/review-alignment-and-quality.md`; SiteFooter (every route); major; rule-conflict): The Site Footer prototype colours this sentence with the faint on-dark token, which measures just under AA on the indigo 700 footer, so the one line of body text in the footer fails contrast on every page. The rule (AA in every state) outranks the prototype, and the fix is one token. Axe likely misses it because the dot field overlay makes the ground a background image.

**Evidence:** packages/ui/src/navigation/SiteFooter/SiteFooter.astro:209-212 (13.5px, var(--text-on-dark-faint) #8890b5) on the footer ground #1e2a5a (.v2-footer, packages/tokens/src/oy-components.css:392). Pixel-sampled under the text with the dot field (/private/tmp/claude-501/-Users-afo-Code-omo-yoruba/452b50c5-d114-459b-9fb8-3a0945241754/scratchpad/lr/px.mjs): 4.32 to 4.37:1 at 375 and 1440 on /, and 4.33 to 4.37:1 on Site Footer.dc.html. Text: "Once or twice a month. Save-the-dates, program news, and ways to help." Also: scratchpad chrome/footer.mjs at 1440 and 375: .oy-footer-newsletter p color rgb(136,144,181) (--text-on-dark-faint) on the footer's rgb(30,42,90), 4.37:1 at 13.5px regular; the prototype uses the same token (Site Footer.dc.html). chrome/axe.mjs marks the footer's color-contrast as incomplete for 17 nodes (the dot field layer), so the axe and Lighthouse budgets never test it. Code: packages/ui/src/navigation/SiteFooter/SiteFooter.astro:209-213.

**What to build:** Set the newsletter line to var(--text-on-dark-soft) (#c8cde8, 8.7:1), as the trust line already is. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
