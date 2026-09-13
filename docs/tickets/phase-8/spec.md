# Phase 8 spec: the gallery

Written 13 September 2026 from the Phase 8 prompt (`docs/plans/prompt-phase-8.md`), ROUTES sections 1, 3, 4
and 5, CONTENT-MODEL for `album`, `photographer`, `galleryPage` and `oyImage`, the COMPONENT-MAP, ADRs 0018,
0020, 0027 and 0035, `docs/design/design/18 Photo Gallery.dc.html` (the fidelity bar at 375 and 1440, in its
mosaic, album and viewer states), the gallery wireframe in `06 Site Wireframes.dc.html`, the photo gallery row
of `07 Interaction Inventory.dc.html`, `19 Mock Content Register.dc.html`, the Build Brief's polish passes and
QUALITY sections 2 and 3, and the grill on the gallery seam. The owner accepted every recommendation in one
round (Q1 to Q17); each answer below is theirs. Decisions marked "session" were made without a question, as
the consequence of an answer or of a repo rule.

## Facts the grill stood on

- `development` holds three albums, none with a `date`, each with `creditConfirmed: false`: Odunde 2026 (43
  photographs, the 2026 festival edition, Red Carpet Media), End-of-Year Gala 2025 (6, the 2025 gala edition,
  Members and volunteers) and Summer camp (19, no edition, Omo Yorùbá archive). Every photograph's caption is
  the register's description, the same text as its alt. Photograph keys are the file names
  (`odunde-2026-kid-playing-with-elder`). No photographer has a URL, no photograph its own credit.
- The prototype's fourth album, Àgbàlá Ọmọde, reuses Odunde photographs under invented captions and was never
  seeded; its "Summer camp at Citrus College" names a place the register does not confirm.
- `galleryPage` holds the seeded header (Àwòrán • Photographs, "Photographs", the prototype's line) and the
  layout defaults (`open: viewer`, `captions: always`, `state: built`); `creditsAndConsent` (Portable Text)
  and `intro` are empty and nothing draws `intro`. The settings hold no general inbox and no routing contact.
- The documents disagreed on one point. AGENTS.md and ROUTES section 3 allow one URL-driven open, `#give`;
  ROUTES section 1 and QUALITY section 2 say `?photo=<key>` opens the Lightbox, and QUALITY section 2 also
  asserts no dialog open on load except `#give`. ADR 0019 already renders the Enquiry Modal open for
  `?enquiry=<kind>`, the no-JavaScript trigger.
- The site runs Astro's ClientRouter (7.3.1). On Back or Forward between two history entries it owns, it
  re-fetches the page and cross-fades, even when only the query changed; it ignores entries whose state is
  `null`. (Found while building ticket 04: cancelling its `astro:before-preparation` makes it load the page in
  full, so ADR 0037 keeps the router out through a guard in the layout's head instead.)
- The prototype's copy the register would mark invented: the soon sentence (the gallery waits for Red Carpet
  Media to "deliver the 2026 set", which the dataset already holds), the credits summary ("Many festival sets
  are by Red Carpet Media"), the consent policy (signs at every entrance, written consent at registration) and
  the old domain's inbox.
- The gallery stays out of the nav (the wireframe: "Gallery is reached from News & Events and from the two event
  pages, never from the nav"); the homepage, the event pages and Impact link to `/gallery`.

## The design tree, answered

**Q1. A shared photograph's address.** The address opens the Lightbox. The server renders the album page with
the Lightbox open on that photograph; its previous, next and close are links, so it works without JavaScript,
and the script makes it modal. It is the second URL-driven exception beside `#give`, for the same reason: the
address is the visitor asking for that photograph. Entry pop-ups and scroll or exit prompts stay banned.
AGENTS.md carries the exception; the handoff documents stay as written and ADR 0037 records which line wins
(session: AGENTS.md keeps `docs/design` read-only, so ROUTES section 3 and QUALITY section 2 are not edited).

**Q2. Back, Forward and closing.** Opening from a photograph pushes one history entry (`?photo=<key>`). Moving
with the arrows, the buttons or a swipe replaces that entry, so Back never steps through photographs. Back
closes the Lightbox and Forward reopens it on the photograph it showed, with no cross-fade and no refetch.
Closing with ×, Escape or a click on the dark background goes back one entry when the Lightbox pushed one; on a
page that arrived with `?photo=` it replaces the address with the album's instead, so closing never leaves the
page. Focus returns to the tile of the photograph on screen when it closed, scrolled into view.

**Q3. Swipe (wayfinder ticket 37).** One gesture on the Lightbox and the photo carousel: touch and pen only, a
sideways travel of at least 40px that is longer than the vertical, ignored while the page is pinch-zoomed so a
zoomed reader can still pan. The buttons stay (WCAG 2.5.1) and vertical scrolling is untouched. Ticket 37's
other four answers stay the owner's.

**Q4. Opening an album (`open`).** `viewer` stays the default. Under `viewer` a tile links to its album's first
photograph (`/gallery/odunde-2026?photo=<first key>`): the album page arrives with the Lightbox on photograph 1,
closing it shows the album's photographs, and Back returns to `/gallery`. Under `grid` a tile links to the
album page. The option changes only where the tiles link.

**Q5. Album order and the year.** An album's year is its own date's year, else its edition's. `/gallery` orders
the albums newest year first, albums with no year after the dated ones, ties by title: Odunde 2026 leads, then
End-of-Year Gala 2025, then Summer camp. The registry's "the year of the album" narrows to albums with neither
a date nor an edition's year, so only the summer camp asks. No seed change.

**Q6. The mosaic.** Three albums fill a block: the lead two columns by two rows, the second and third each two
columns wide, stacked beside it. Four or more follow the prototype (the lead two by two, the fourth two
columns wide, then single tiles). One album spans the width; two sit as halves. Under 900px two columns with
the lead across both; under 560px one column. The port's grid densities (two, three and four across) are
`AlbumTile` stories, not a Studio option.

**Q7. What a tile shows.** The cover (the album's cover, else its first photograph, framed by its hotspot),
the title (26px on the lead, 19px on the rest) and one line: the year and the count, "2026 • 43 photographs",
leaving the year out when the title already carries it ("Odunde 2026" over "43 photographs"). An album with
no year reads "19 photographs" with the chip "the year of the album". No credit on the tile. The whole tile
is one link; its border turns gold on hover, and nothing lifts or zooms.

**Q8. The captions option.** `captions` governs the album tiles' title lines on `/gallery` and the photograph
captions on album pages. `hover` hides them only where the pointer can hover, and shows them on hover and on
keyboard focus; a phone always shows them. Default `always`.

**Q9. The album page.** The slim header: the gallery's kicker (Àwòrán • Photographs), the album's title as the
h1, and the year and the count as its facts line (the year's chip where it is owed). Under it a quiet "All
albums" link to `/gallery` (← is outside the glyph set) and, when the album belongs to an edition, a quiet link
to that event's page; the credit line ("Photographs: Red Carpet Media" with its chip until confirmed) and the
album's consent note under it when written; the photographs; then the credit and permissions section
`/gallery` closes with. No gold action. The prototype's "Each album has its own address, so a recap post can
link straight to it" is a note to the designer and stays out.

**Q10. The photographs.** The prototype's grid, three across at 200px (two under 900px, one under 600px):
each photograph a `PhotoTile` with its caption over the scrim, the whole tile a link to its `?photo=`
address. Every photograph in album order, lazy after the first row, no pagination. While a caption and its
alt are the same text, a screen reader hears it once.

**Q11. The Lightbox's look.** The prototype's layout at 1440 under ADR 0027's answers: drawn chevrons, "1 of
43" not uppercase, a 0.2s fade that reduced motion removes. The whole photograph always shows, fitted to the
frame, never cropped. Under 720px the photograph takes the full width, and previous, next and the count sit in
the bar under it. × stays at the top right at 44px or more.

**Q12. What the Lightbox says.** The bar carries the caption, then "Photographs:" and the credit (the
photograph's own credit when it has one, else the album's) with its chip while unconfirmed, then the count.
The dialog is named for the album; each change announces the count and the caption; a photograph that fails to
load shows its caption in the frame. Opening announces `lightbox_opened`.

**Q13. Photography credit and permissions.** Both routes close with the section on the alternate ground: the
prototype's heading ("Photography credit and permissions") and lead ("These photographs show real people,
including children. Here is how we credit them, how we ask permission, and how to ask for a photograph to be
removed."), then three rows. Credits: "Given with each album, and with a photograph where it differs." Consent
policy: the owner's wording from `creditsAndConsent`, or its chip; the field becomes plain text. Removal
requests: the general inbox as an email link, or its chip; and a quiet "Send a message" opening `contact`.

**Q14. The soon state.** `soon` keeps the header and the credit and permissions section, and replaces the
mosaic with "The albums are being prepared. Until then, the Odunde and Gala pages carry their own
photographs." and quiet links to both pages. Under `built` with no album holding a photograph, the albums
section shows the registry's Pending line "the photo albums". Album pages render under either state.
`galleryPage.intro` retires.

**Q15. The gallery's header line.** A seed revision (ADR 0035) moves the seeded line to "Odunde, the Gala and
the summer camp. Open an album and start looking.", naming the albums that exist; the owed-facts ticket asks
for the owner's own words.

**Q16. Empty and broken cases.** An album with no photographs stays off `/gallery`, and its own page shows the
Pending line "the photographs" (a new registry row). A missing cover falls back to the first photograph. A
`?photo=` key the album does not hold renders the album page with nothing open. An unknown album slug is a 404.

**Q17. One name.** "Lightbox" in the glossary and every document. The `open` option keeps its value `viewer`
(ADR 0006), with a Studio description saying it opens the Lightbox on the album's first photograph. The
glossary gains Album, Cover, Photo credit, Consent note and Photo address.

## Further decisions (session)

### Content model

- `galleryPage.creditsAndConsent` becomes a plain text field (nothing is stored in it in either dataset).
- `galleryPage.intro` retires: out of the schema and in `RETIRED_FIELDS`, so a re-run unsets it wherever it
  is stored.
- The `album.date` description says an empty date takes the edition's year; the `open`, `captions` and `state`
  options gain descriptions (the Lightbox on the first photograph; titles on the gallery and captions on album
  pages, on hover only where a pointer hovers; `soon` hides the albums behind one sentence).
- The seed writes the new header line and revises the stored one (`buildRevisions`), and nothing else: no
  date, no album, no caption, no credit.

### The registry

- The album's year becomes a condition row, `!defined(date) && !defined(event->edition)`, "the year of the
  album", its wording a named constant.
- New: `album.photos[]` ("the photographs", Gallery, album); a photograph's own credit left unconfirmed, a
  condition row ("a photograph's own credit to confirm", a named constant).
- The album presence row counts albums with at least one photograph, as the gallery and past years show them.
- Unchanged: the album credit row ("photographer credit to confirm"), `galleryPage.creditsAndConsent` ("your
  photo consent and removal policy") and the settings' general inbox ("the general inbox").

### Queries and routes

- `galleryPageQuery`: `*[_type == "galleryPage" && _id == "galleryPage"][0]` with the header, the actions,
  `creditsAndConsent`, the layout and SEO; every album with a photograph (title, slug, date, the edition's year
  and kind, the cover, the first photograph, the count); and the settings' general inbox.
- `albumPageQuery($slug)`: the album by slug with its credit and confirmation, consent note, edition (year and
  kind) and every photograph (asset, hotspot, crop, alt, caption, its own credit and confirmation); the gallery
  singleton's kicker, `creditsAndConsent` and `captions` option; the settings' general inbox.
- Images project the asset reference, the hotspot and the crop (ADR 0022). Keys, slugs and the `?photo=` value
  are cleaned of stega before they become an href or a comparison.
- The route map: `galleryPage` reaches `/gallery/[album]` too, and `event` reaches both gallery routes (an
  album's year and its edition's page come from the edition). `cachePage(Astro, route, { draft, failed })` on
  both routes; the album page tags `album`, `photographer`, `galleryPage`, `event` and `siteSettings` through
  the map.
- The album route: a read that answers no album is a 404 (an empty response, so a later 404 page renders in
  its place); a failed read answers 503 with the page's Pending form and is never cached.
- Edit attributes on each option's container (the mosaic for `open` and `captions`, the albums section for
  `state`), on every cover and every photograph (`photos[_key=="…"]`) and on the credit line.

### Layout options

Names and values from `packages/content/src/layout-options.ts`, the first the default: `open` viewer, grid;
`captions` always, hover; `state` built, soon. Each reaches the body as a data attribute.

### Components

In `@oy/ui` with stories and tests, each variant a story and each empty state Pending:

- New: `AlbumTile` (the cover, the title, the line with its chip, lead and tile sizes) with `AlbumGrid` (the
  mosaic by count, the grid at two, three or four across, the captions option, the Pending line); `PhotoGrid`
  (the album page's photographs as linked `PhotoTile`s, the captions option, the Pending line); `Lightbox`, the
  inline `oy-lightbox` element (ADR 0018, ADR 0027): a `<dialog>`, every photograph a hidden figure with its
  caption and credit in the markup, the controls links without JavaScript, `data-ready` once wired, play
  functions that wait for it and drive the keyboard.
- Extended: `PhotoTile` (a link around the figure, the hover-only caption), `PhotoCarousel` (swipe).
- Reused as they are: `PageHeader`, `Section`, `SectionHead`, `Split`, `FactList`, `CreditLine`, `Button`,
  `Pending`.
- One page-section story per option under `Pages/Gallery` (Open, Captions, State), in `PageRoot`, on fixtures
  of the register's photographs with their captions as the dataset holds them, the bracketed placeholder form
  for owed copy and Pending states only: no dates, even as ISO strings.

## Proof

Playwright and axe on both routes at 375 and 1440 in both data modes (`PLACEHOLDER_PROJECT`), every test
asserting something in both, `expectNoMockWhileOwed` holding the register's inventions (the prototype's
consent rows, the soon sentence, "Citrus College", the old inbox), `axeViolations` with the Lightbox open too;
the photo address and history (open, Back, Forward, a shared link, closing a shared link), the keyboard, the
backdrop, focus return, a synthetic swipe on the Lightbox and the carousel, the no-JavaScript Lightbox; the
routes in the 44px targets sweep and the heading-order check; the earlier suites green with `--workers=1`.
Both routes and the open Lightbox compared with the prototype at 375 and 1440 before the code review, with an
ADR for where a repo rule outranks it. The routes appended to `lighthouserc.cjs`, lhci on the local production
build against QUALITY section 3, watching LCP and the image sizes. `bun check`, `bun run build` and the
Storybook build pass.
