# Parked facts: a block the launch does not wait for is left out while it is empty

Accepted 21 November 2026. The owner, preparing the site for production: "We need to get rid of all
the pending aspects. Certain aspects we will just hide and remove for now while others we will look to
add details and polish." Eighty Pending notes stood on ten public pages that day. Some name facts the
organization will supply before launch; others name blocks the launch does not wait for.

Amends ADR 0014 (one Pending registry), which had every registered field show its chip until the fix
was published, and ADR 0042 (the To do), which listed every registered row.

## Decision

A registry row can be **parked**: `parked: true` on the row in `packages/content/src/pending.ts`.

- **The To do leaves a parked row out.** `PENDING` and `PRESENCE` hold the asked rows only, so the To do,
  its counts and its query never see a parked one.
- **No chip names a parked fact.** `pendingWhat` and `presenceWhat` answer undefined for a parked row, as
  they do for a field the launch never required.
- **The page leaves the block out while it is empty.** A page view hands a part the registry's wording
  only when the registry asks for the fact. With neither a value nor wording, the view leaves the slot
  out: a row from its list, a cell from its strip, or the whole section when nothing in it is held. The
  chip and the row still never disagree: neither exists.
- **The block shows by itself once it is filled.** Nothing is switched on. A page that draws a section
  under these terms also keeps its neighbours on different grounds when the section is left out.
- **A row returns by losing the property.** A parked row stays beside its neighbours with its wording, so
  asking for the fact again is a one-line change that brings back both the To do row and the chip.
  `PARKED` lists the parked rows; `registerWhat` and `registerPresenceWhat` answer a row's wording
  whether it is asked or parked, which the stories read to keep showing the note a part draws.

A layout option that hides a section (`galaPage.layout.schedule`) stays what it was: the owner's switch
for a section that could be shown. Parking is for a fact nobody is asked for now.

## Parked on 21 November 2026

At the owner's word, from the assessment of that day ("Agree with all besides Our Story"):

| Page | Parked | What a visitor sees while it is empty |
| --- | --- | --- |
| Odunde | a practical fact without its value | Plan your visit lists only the facts it holds |
| Odunde | the next edition's vendor fees, deadline and permit rules | the vendor row without a note |
| Odunde, Impact | the past edition's attendance | no note under Odunde in past years; no Attendance cell on Impact |
| Impact | the past edition's vendors hosted | no Vendors hosted cell |
| Lessons | the levels, and a level without its line | What you learn without the levels list |
| Lessons | the questions, and a question without its answer | no Questions parents ask section |
| Collective | the argument | no Why culture and sustainability sit together section |
| Collective | the one voice | no quote section |
| Collective | the events still to come | no Collective events section, and no "See what is on" in the header |

Our Story is not touched: the owner will supply its details, so its rows stay asked.

## Consequences

- A fact parked here is no longer on anyone's list. The table above is the list of what to ask for
  again; each returns by deleting `parked: true` from its row.
- The only rows that ask a past edition (attendance, vendors hosted) are parked, so the To do's rule for
  past editions has no asked row today. `todoPlan` takes its rows as a second argument, and the tests of
  that rule hand it the parked rows.
- `TakePartBand` draws the vendor terms chip only when the page hands its wording; it had a default.
- The glance strip gains two-cell and one-cell layouts, for a strip that leaves a parked cell out. No
  page drew a strip that short before, so only Impact's civic figures change; the `NoteLink` story's two
  cells now share the width, which moves its Chromatic baseline.
- The Lessons and Collective pages give the sections they draw turns on the two grounds, from white. With
  every section drawn that is each prototype's order. The Collective's initiatives had alternated from
  white whether or not the events showed, which could set two sections side by side on one ground.
- The Collective's take-part lead speaks of "the projects above" only when the page draws a project.
- The page-section stories still show each parked block's Pending state, in the registry's wording, so
  their Chromatic baselines do not move.
- Cultural Exchange's rows (open work E27) can be parked the same way; they are not yet.
