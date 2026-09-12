# 05: The take-part band from the singleton's rows

Labels: design, content
Status: open
Blocked by: 03

**What to build:** `/odunde` closes with the take-part band drawn from `festivalPage.takePart[]` (ADR
0025): each row's chip and accent by way in, its title, line and button, the first row gold, the
vendor row carrying the edition's vendor terms with Pending chips, the label style by `labels`, and the
vendor or sponsor row first by `takepart` in the markup; then the give handoff. Each button opens its
enquiry kind or the Give Dialog.

- [ ] `@oy/content`: the `takePartRow` object and `takePart` on both event singletons (unique ways in), `takePartOrder` retired, registry rows; TypeGen
- [ ] Seed: the rows of the spec's table on both singletons; `takePartOrder` unset
- [ ] `@oy/ui`: `PathRow` takes a row (chip, accent, title, line, action, and a quiet variant) and the homepage keeps working; `TakePartBand` (rows, labels, lead way, gold on the first row, quiet give, vendor terms); stories and tests
- [ ] `Pages/Odunde/Takepart` (vendor, sponsor) and `Pages/Odunde/Labels` (column, none, kicker) stories
- [ ] Playwright: the order follows the option in the DOM, one gold per band, each kind opens its form and focus returns

## Comments
