# 03: Hero, EventBand and StatStrip

Labels: design
Status: resolved
Blocked by: 02

**What to build:** `Hero` (photo with scrim, the breathing photo when motion is on, kicker, H1, sub,
the blessing line, one primary and the secondary actions), `EventBand` (the festival and gala frames
with chevron rows, stripe seams and motif columns, one event at a time, Pending chips for a missing
date or venue, Pending for no event) and `StatStrip` (four and six figures, with and without source
lines, the corner dot fields, Pending for a missing figure).

- [x] Stories: hero with motion on and off and Pending; both band frames and Pending; strips of four and six with and without sources and Pending
- [x] Every Yoruba word carries its marks and the kicker test string renders at 12px
- [x] `bun run test` passes in `@oy/ui`

## Comments

12 September 2026. `page/Hero` (motion on and off, Pending for the photo and the heading, the
blessing line), `bands/EventBand` (both frames from the tokens' band classes so the theme flows
through; the kicker and button copy keyed by kind; `pendingWhat` with the kind filter so the Gala
says "the date" and the festival "the date and hours"; the date written in words in Los Angeles
time), `page/StatStrip` (four and six, sources, the corner fields, the Pending line).
