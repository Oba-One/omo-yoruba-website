# 04: The festival day: zones, the schedule and plan your visit

Labels: design
Status: resolved
Blocked by: 03

**What to build:** the middle of `/odunde`: the zones block (the named zones in order, then
placeholder cards up to the confirmed four, as mosaic, five, grid or list by `zones`), the day hour by
hour (time-led and day-led rows, each tagged with its zone; shown, collapsed as a native disclosure,
or hidden by `schedule`; a Pending line with no rows) and plan your visit (the eight facts with a
Pending chip for each missing value).

- [x] `@oy/ui`: `ZoneCard` (Yoruba name with marks, translation, line or Pending, photo or placeholder), the zones block with the four layouts and placeholders, `ScheduleRow` (time-led, day-led) and the schedule list, `FactList`; stories and tests
- [x] `Pages/Odunde/Zones` (mosaic, five, grid, list) and `Pages/Odunde/Schedule` (shown, collapsed, hidden) stories
- [x] The query and `buildFestivalPage` carry zones, the schedule with zone names and the plan facts; the registry's presence wording for the missing zones
- [x] Playwright: four zone cards; the collapsed schedule opens without JavaScript; Pending lines when empty

## Comments

12 September 2026. `cards/ZoneCard` (the Yoruba name as an `h3` with `lang="yo"`, the translation
above it, the line or its chip, a placeholder card for an owed zone), `content/ZoneGrid` (the four
layouts through the tokens, placeholders up to the presence row's four, whose wording is now "the
unnamed zones" so it holds for any count), `content/ScheduleRow` and `content/Schedule` (an ordered
list; the festival's sits in a native `details` whose quiet summary reads Hide or Show, open when the
option is shown, closed when collapsed), `content/FactList` (a description list). The prototypes
invent every schedule row, so the stories use bracketed placeholder rows, the prototypes' own form for
owed copy. Two fixes to the ported CSS: a Pending chip inside `.oy-fact` kept the row's 15.5px ink
type (added to the chip's own rule), and the four-zone mosaic rule outranked the narrow-screen reset,
cutting the mosaic into slivers at 375, a bug the prototype has too. The collapsed schedule's
behaviour is proven in the stories; the dataset holds no rows, so Playwright checks the Pending line
and exercises the disclosure only when rows exist.
