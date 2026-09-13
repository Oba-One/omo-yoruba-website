# 02: AlbumTile and AlbumGrid

Labels: design
Status: open
Blocked by: none

**What to build:** the gallery's album tiles in `@oy/ui` (spec Q6 to Q8). A tile is one link: the cover framed
by its hotspot, the title and its line with the year's chip where owed, the border turning gold on hover with
nothing lifting or zooming. The grid lays tiles out as the prototype's mosaic (the lead two by two, three
albums as a clean block, four or more as the prototype) or at two, three or four across, with titles always
shown or on hover only where a pointer hovers, and the Pending line when there are no albums.

- [ ] `AlbumTile` (`media/`): lead and tile sizes, placeholder without a cover, the chip in the line, `edit`
- [ ] `AlbumGrid` (`media/`): `mosaic` by count (1, 2, 3, 4 and more) with the prototype's breakpoints, `grid` at
      2, 3 and 4 across (the port's densities), `captions` always or hover, the Pending line, `edit`
- [ ] Stories for each variant and state (one, two, three, four and five albums; each density; hover; Pending;
      375 and 1440); tests on the markup
- [ ] The component map row
