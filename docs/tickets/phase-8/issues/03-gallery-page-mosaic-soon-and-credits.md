# 03: /gallery: the albums, the soon state, and photography credit and permissions

Labels: design, content
Status: open
Blocked by: 01, 02

**What to build:** `/gallery` renders from Sanity (spec Q4 to Q8, Q13 to Q15): the slim header, the albums in
the mosaic newest year first with each tile linking to its album's first photo address (`open: viewer`) or its
page (`grid`), and the credit and permissions section every gallery route closes with (the prototype's heading
and lead, the Credits row, the owner's consent policy or its chip, the general inbox or its chip with a quiet
"Send a message"). `soon` replaces the albums with the sentence and links to both event pages; no album with a
photograph shows the Pending line.

- [ ] `packages/web`: `buildGalleryPage` (tested: order, lines, hrefs by option, soon, Pending, the section's
      rows, edit attributes), the route with `cachePage`, the layout options on the body
- [ ] The credit and permissions section composed from library parts, shared with the album page
- [ ] `@oy/ui`: page-section stories `Pages/Gallery/Open`, `Captions` and `State` in `PageRoot`, with fixtures of
      the register's photographs and Pending states only; the section's story
- [ ] Playwright on `/gallery` at 375 and 1440 in both data modes: one h1, nothing open on load, the albums in
      order with their lines and hrefs (seeded) or the Pending line (placeholder), the section's chips, no
      prototype invention while owed
