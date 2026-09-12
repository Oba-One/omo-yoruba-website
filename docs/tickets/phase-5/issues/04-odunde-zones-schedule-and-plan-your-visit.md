# 04: The festival day: zones, the schedule and plan your visit

Labels: design
Status: open
Blocked by: 03

**What to build:** the middle of `/odunde`: the zones block (the named zones in order, then
placeholder cards up to the confirmed four, as mosaic, five, grid or list by `zones`), the day hour by
hour (time-led and day-led rows, each tagged with its zone; shown, collapsed as a native disclosure,
or hidden by `schedule`; a Pending line with no rows) and plan your visit (the eight facts with a
Pending chip for each missing value).

- [ ] `@oy/ui`: `ZoneCard` (Yoruba name with marks, translation, line or Pending, photo or placeholder), the zones block with the four layouts and placeholders, `ScheduleRow` (time-led, day-led) and the schedule list, `FactList`; stories and tests
- [ ] `Pages/Odunde/Zones` (mosaic, five, grid, list) and `Pages/Odunde/Schedule` (shown, collapsed, hidden) stories
- [ ] The query and `buildFestivalPage` carry zones, the schedule with zone names and the plan facts; the registry's presence wording for the missing zones
- [ ] Playwright: four zone cards; the collapsed schedule opens without JavaScript; Pending lines when empty

## Comments
