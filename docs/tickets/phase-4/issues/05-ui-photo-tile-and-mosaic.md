# 05: PhotoTile and the year-in-the-life mosaic

Labels: design
Status: resolved
Blocked by: 02

**What to build:** `PhotoTile` (caption over the scrim, Yoruba first with the gold dot, square
corners, no zoom; the placeholder with the dot field when the photo is missing) and `PhotoMosaic`,
the seven, five and three tile arrangements from the prototype, which hides extra tiles and pads
missing ones with placeholders.

- [x] Stories: seven, five and three tiles, and Pending
- [x] Captions keep their marks; the placeholder names the missing photograph
- [x] `bun run test` passes in `@oy/ui`

## Comments

12 September 2026. `media/PhotoTile` (the caption split on the dot so the Yoruba half carries
`lang="yo"` and the dot reads gold) and `media/PhotoMosaic` (the prototype's seven, five and
three arrangements ported from its page CSS, extra tiles dropped, missing ones padded).
