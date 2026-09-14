# 02: AlbumTile and AlbumGrid

Labels: design
Status: resolved
Blocked by: none

**What to build:** the gallery's album tiles in `@oy/ui` (spec Q6 to Q8). A tile is one link: the cover framed
by its hotspot, the title and its line with the year's chip where owed, the border turning gold on hover with
nothing lifting or zooming. The grid lays tiles out as the prototype's mosaic (the lead two by two, three
albums as a clean block, four or more as the prototype) or at two, three or four across, with titles always
shown or on hover only where a pointer hovers, and the Pending line when there are no albums.

- [x] `AlbumTile` (`media/`): lead and tile sizes, placeholder without a cover, the chip in the line, `edit`
- [x] `AlbumGrid` (`media/`): `mosaic` by count (1, 2, 3, 4 and more) with the prototype's breakpoints, `grid` at
      2, 3 and 4 across (the port's densities), `captions` always or hover, the Pending line, `edit`
- [x] Stories for each variant and state (one, two, three, four and five albums; each density; hover; Pending;
      375 and 1440); tests on the markup
- [x] The component map row

## Comments

13 September 2026. `AlbumTile` (`media/`) is one link with the port's `.oy-album` scrim and border: the cover
with an empty alt (the heading names the link), the title as a heading (`heading`, h2 by default; 26px when
`size="lead"`), and one line in the dark scope, the year and the count joined by the gold dot, or the count with
the chip after it. The port sets every span in `.oy-album-meta` as a block, so the line's parts and the chip carry
their own rules. `AlbumGrid` (`media/`) is a list: `mosaic` by `data-count` (1, 2, 3, `many`), the lead two by two,
three albums as the lead and two wide tiles, the fourth wide from four, two columns under 900px with the lead across
both, one under 560px; `grid` uses the port's `.oy-albums` densities; `captions="hover"` hides the titles under
`@media (hover: hover)` until hover or `:focus-visible`; the first cover is eager with `fetchpriority="high"`; no
albums is the Pending line. Stories: the tile's default, lead, year, owed year, placeholder and hover; the grid's
three, one, two, four and five albums (the placeholder album beyond the three), 375, the three densities, hover and
Pending. Tests: 10. The component map's row describes both. Chromatic baselines wait for the owner.
