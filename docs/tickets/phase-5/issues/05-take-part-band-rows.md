# 05: The take-part band from the singleton's rows

Labels: design, content
Status: resolved
Blocked by: 03

**What to build:** `/odunde` closes with the take-part band drawn from `festivalPage.takePart[]` (ADR
0025): each row's chip and accent by way in, its title, line and button, the first row gold, the
vendor row carrying the edition's vendor terms with Pending chips, the label style by `labels`, and the
vendor or sponsor row first by `takepart` in the markup; then the give handoff. Each button opens its
enquiry kind or the Give Dialog.

- [x] `@oy/content`: the `takePartRow` object and `takePart` on both event singletons (unique ways in), `takePartOrder` retired, registry rows; TypeGen
- [x] Seed: the rows of the spec's table on both singletons; `takePartOrder` unset
- [x] `@oy/ui`: `PathRow` takes a row (chip, accent, title, line, action, and a quiet variant) and the homepage keeps working; `TakePartBand` (rows, labels, lead way, gold on the first row, quiet give, vendor terms); stories and tests
- [x] `Pages/Odunde/Takepart` (vendor, sponsor) and `Pages/Odunde/Labels` (column, none, kicker) stories
- [x] Playwright: the order follows the option in the DOM, one gold per band, each kind opens its form and focus returns

## Comments

12 September 2026. `@oy/content`: `take-part.ts` holds the six ways in and what each opens (its
enquiry kind, or the Give Dialog for `give`), so the schema, the seed and the site read one list;
`takePartRow` (way in, title, one line, button label) on both singletons with a unique-way rule; the
registry rows "the ways in" and "a way in, its title or its button label". The seed wrote the spec's
eight rows to the development dataset, filled the festival figure and unset `takePartOrder`
(`RETIRED_FIELDS`; the Eventbrite field joins it in ticket 08, when the schema drops it). `@oy/ui`:
`PathRow` takes a door as before or a take-part row's own way in, chip, title, line and action, with a
`variant` for the quiet give action and the registry chip where an unfinished row misses its title or
button; `page/TakePartBand` (the rows in the tokens' column, the lead way in moved up in the markup,
gold on the first working row, the vendor terms as one sentence from `vendorTermsText` with the
registry chip while the fees or either date is missing); `Handoff` gains the tinted box with up to two
buttons, whose quiet button deepens to terracotta 700 on the tint (axe found terracotta 600 at 4.3:1).
The page counts its rows for the intro ("Four ways in."). No fee, date or level appears: the vendor
row shows "Pending: fees, deadline and permit rules" until the 2027 edition holds its terms.

