# What the owner changed after the first showing

Accepted 11 October 2026. The owner showed the site to the organization's members that day and sent
twenty notes from it. These are the ones that change a rule an earlier record or the handoff set. The
owner's words are quoted; the wording of each fix is the build's.

Amends ADR 0024 and ADR 0028 (the festival's zone count), ADR 0029 (the give and updates buttons),
ADR 0042 (which tier carries the gold), ADR 0045 (where a Zeffy dialog scrolls), ADR 0051 (how many
videos an event page shows) and ADR 0053 (the Programs page's fixed card count), each noted there.

## Decision

- **A dialog sits in the middle of the screen and never outgrows it.** "We need to center our
  dialogs/modals forms" and "The donate dialog is too tall". The prototype hung the panel 40px from the top
  and scrolled the scrim, so a long form or Zeffy's frame ran off the screen and carried on into the page
  behind (review ticket R78). The panel is now centred, no taller than the screen less its margin, with its
  head pinned and its body scrolling, as dialog and as bottom sheet, and the page behind is held while a
  dialog is open. A Zeffy frame's floor leaves room for the head and the foot
  (`clamp(320px, 100vh - 300px, 560px)`, where ADR 0045 kept `min(640px, 70vh)`): the floor fits any
  window, and a step taller than the room left scrolls inside the panel, back to its top when it begins
  above the view. The Give Dialog's line about Apple Pay beside the link to Zeffy's own page speaks only
  to phones, so it shows under 720px only; the other dialogs keep their line.
- **A take-part band shows one shape of button.** "Why does take part have 3 different button types looks
  odd". The prototypes drew gold, outline and a text link for the give and updates rows (ADR 0029). Every
  row's button is now the outline, the first row that is neither give nor updates keeps the band's one
  gold, and the buttons of a band share one width. The gift under Odunde's band, which opens the Give
  Dialog as a give row does, is an outline too. A box under a band that leads to another page keeps its
  text link: it is a way on, not one of the band's asks.
- **The festival has three zones.** "the zones which should be three we are missing the Egbe-Ibile section
  that highlights to Yoruba groups and elders. It's also just 3 sections not 4". Ọjà Balógun, Àgbàlá Ọmọde
  and Ẹgbẹ́ Ìbílẹ̀. The registry's count is three, the section's heading counts the zones it draws, and
  the mosaic lays the second and third beside the market. The handoff, ADR 0024 and ADR 0028 said four.
- **A video section fills the width.** "The videos sections on our events pages need to be full width or
  have 2 videos present". An event page shows the first two videos of the past edition's album side by
  side (ADR 0051 showed the first), and a lone video takes the whole column.
- **A lone ticket tier lies across the width.** "Since there is only general admission for the gala we
  need to better design the section showing tickets". One tier is drawn as a ticket: name and price as the
  stub, what it includes beside them, the button at the far end. When that tier sells the seat it carries
  the block's gold whether or not the Studio marks it featured, since no other card can (ADR 0042 gave
  the gold to the first featured tier, which still holds with two tiers or more).
- **Cultural Exchange is off the Programs page.** "it is not active". The page leaves the program out by
  name, card and section, wherever the Studio's order puts it, and the fixed card count (ADR 0053) is
  three, for the three that run.
- **"Enroll", with two Ls**, in every word a visitor reads. The enquiry kind and the way in keep the id
  `enrol`, which is stored in documents and in the `?enquiry=enrol` address; renaming it is a stored-content
  migration nobody asked for.

Smaller layout notes from the same list need no rule: a card grid may centre a short last row (Our
Story's board and staff, the Gala's honorees), a glance strip's cells share their rows so a wrapped
label keeps the values level, and Our Story's Reach us sets its head over both columns with the urgent
line inside the card.

## Consequences

- The Studio's To do still lists Cultural Exchange's owed facts, for a section no page shows, and
  bringing the program back takes a code change. Its rows want parking while the program is off, and the
  Studio wants one switch for whether a program is running (open-work E27).
- A band's give row no longer reads as a quiet aside. The page's gold Donate stays in the nav.
- The Studio must hold the third zone, with its line and its photograph, or the mosaic shows its chip.
- Holding the page behind a dialog relies on `:has()`, and the shared rows and columns on subgrid. A
  browser without them keeps the earlier behaviour: the page can scroll behind the scrim, and a wrapped
  label or a longer button sits as it did.
