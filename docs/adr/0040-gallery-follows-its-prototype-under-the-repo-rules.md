# The gallery follows its prototype, except where a repo rule or the owner's answer outranks it

Decided on 13 September 2026 (Phase 8, ticket 07), after comparing `/gallery`, `/gallery/odunde-2026` and the
Lightbox served open on its first photograph with `18 Photo Gallery.dc.html` in its mosaic, album and viewer
states at 375 and 1440 (captures at a device pixel ratio of 1 in `test-results/phase8-compare/`, the prototype
served by the `design` entry of `.claude/launch.json`). The pages keep the prototype's slim header, its mosaic
geometry to the pixel at 1440 (the header 300px, the albums 88px below it, the lead 518 by 436px, the tiles 210px
rows with 16px gaps, the credit section on the tint at the same offset), its album grid (three across at 200px,
337px wide, the 20px gaps, one column at 375), the Lightbox's overlay, × and button sizes and the photograph up to
1080px with the buttons 18px beside it, and the credit and permissions split. One difference was fixed: the
Lightbox's previous and next sat at the viewport's edges, and now sit beside the photograph as the prototype's
centred row draws them. What stays different follows a rule or the owner's answer:

- **Content the Studio does not hold is Pending.** The prototype's fourth album (Àgbàlá Ọmọde, Odunde photographs
  under invented captions), "Summer camp at Citrus College", "Archive • year to confirm", the soon sentence's
  delivery of the 2026 set, the credits summary, both consent rows and the old domain's inbox are the register's
  inventions: the page shows three albums, the year's chip, the page's own soon sentence, and the chips for the
  owner's policy and the general inbox (ADR 0039).
- **Captions are the dataset's.** The prototype's short captions ("Ẹgbẹ́ Ìbílẹ̀ • Odunde 2026") are not in the
  register; the tiles and the Lightbox carry the register's descriptions until the owner confirms captions
  (wayfinder ticket 09), so the Lightbox's bar runs to two or three lines where the prototype's runs to one.
- **The grill's answers.** A tile's line leaves out a year its title names and carries no credit (Q7); three
  albums fill the block as the lead and two wide tiles (Q6); the album's title is the page's h1 in the header,
  where the prototype sets it as an h2 beside "← All albums" (Q9, and ← is outside the glyph set); the Lightbox
  shows the whole photograph where the prototype crops to 3:2, and under 720px moves previous, next and the count
  under the caption where the prototype leaves the photograph 247px wide between them (Q11); the count reads "1
  of 43", not uppercase (ADR 0027).
- **The prototype's note to the designer stays out:** "Each album has its own address, so a recap post can link
  straight to it."

Not taken as intent: the prototype's album titles render at 13px, because its runtime wraps every interpolated
string in `span.sc-interp`, which the port's `.oy-album-meta span` rule sets at 13px; its CSS asks 19px, and 26px
for the lead, and the site draws those. At 375 the credit section's rows sit 16px lower than the prototype's, the
section head's margin inside `Split` that every page carries.

## Considered options

- Match the prototype pixel for pixel, its fourth album, short captions and consent rows included: rejected, as in
  ADR 0028, ADR 0033 and ADR 0036; a family would read invented captions and a consent promise no one made.
- Crop the Lightbox's photograph to the prototype's 3:2 frame: rejected (Q11); a viewer asked to see a photograph
  whole, and a portrait photograph would lose its subject.
- Keep the buttons at the viewport's edges, as first built: rejected once measured; the prototype's centred row
  sets them beside the photograph, and a reader's pointer travels less.
- Draw the album titles at the runtime's 13px: rejected; the prototype's own CSS asks 19px and 26px.

## Consequences

- The captures are reproducible from the runbook's comparison section, which now names the runtime's
  `sc-interp` trap.
- When the owner confirms short captions (ticket 09), the Lightbox's bar returns to the prototype's one line.
