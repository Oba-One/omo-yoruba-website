# QA pass after the first showing, 11 October 2026

The owner showed the site to the members and sent twenty notes "as I do QA". This is the record of what
each became. The rules the notes changed are in ADR 0055.

## The notes, and where each stands

| The owner's note | Stands |
| --- | --- |
| "We need to center our dialogs/modals forms" | done, first pull request |
| "The donate dialog is too tall we should design better" | done, first pull request |
| "Enrol should be Enroll missing an L need to fix across the site" | done: code in the first pull request, the stored button labels published |
| "Why does take part have 3 different button types looks odd" | done, first pull request |
| "Board of directors cards should be centered so bottom row with just 3 should be aligned center" | done, first pull request |
| "the listed publicly wraps to two lines none should be wrapping or if so the text below should still all align on the same level" | done, first pull request: the values stay level |
| "The videos sections on our events pages need to be full width or have 2 videos present" | done, first pull request: two side by side, a lone one fills the width |
| "Since there is only general admission for the gala we need to better design the section showing tickets" | done, first pull request |
| "Reach us section on our story the send us a message block does not look well designed and too much whitespace below it" | done, first pull request |
| Odunde's zones "should be three we are missing the Egbe-Ibile section" | code done, first pull request; the third zone's document, its line and photograph follow the deploy |
| "We should high cultural exchange as a program it is not active" | done, first pull request |
| "Volunteer is missing a photo we should add one on the get involved page" | done: published |
| Quotes from the Odunde videos on the homepage and wherever quotes show | homepage done: published; Impact follows the second pull request, whose page copy names a parent, an elder and a vendor |
| "add myself, temitope, simi ogunleye, joyce and others as staff and volunteers" | the four named are published; the others the notes suggest wait for the owner's word |
| "We need to add the detail for our story do deep research" | published: how it began, the first president, seven dated entries (the timeline itself stays hidden until the owner switches it on) |
| "Odunde we need to fill the missing details" | part published: the 2027 date, free entry, the venue line, two visit facts, the hour-by-hour section hidden; the rest is not in the notes |
| "We need to fill out the pending details on the programs page" | part published: when the lessons and Kids & STEM run; ages, and how often the Collective meets, are not in the notes |
| Add WEFA to Odunde's partners, and give the partners section more detail and links | WEFA published; the section's redesign is the second pull request |
| "The homepage does not have a section highlighting the core events Odunde and End of Year Gala" | second pull request |
| "Fund next year section does not look good with it background similar to the footer", combine it with Partners and funders | second pull request |
| "Programs should be a" | the note was cut off; asked, the owner chose "Skip it for now" |

## First pull request

- The dialog shell (`.oy-modal-scrim`, `.oy-modal`, `.oy-modal-body` in the tokens; `ZeffyDialog.astro`):
  centred, never taller than the screen, head pinned, body scrolling, the page behind held while a
  dialog is open. Review ticket R78 closes with it.
- "Enroll" in the chip, the enquiry kind's title, the page's default actions, the seed and the fixtures. The
  kind and the way in keep the id `enrol`.
- Take-part rows: `canCarryGold` replaces `isQuietWay` in `@oy/content/take-part`; `PathRow` lost its
  `variant` prop; the `column` label style shares its three columns across the rows (subgrid), so the
  buttons of a band have one width. Odunde's gift under the band is an outline.
- `CardGrid` takes `center`, and one count and one gap now drive its columns; Our Story's board and
  staff and the Gala's honorees use it.
- The glance strip's cells share the strip's rows.
- `VideoGrid` fills the width; the event pages show two videos (`PAST_VIDEOS` in `page-skeleton.ts`); a
  still is resolved at 1052 wide.
- `TicketTiers` marks its count; one tier is the full-width ticket and takes the gold when it sells the seat.
- `Split` takes `align="stretch"` and `EnquiryCard` a `note`; Our Story's Reach us uses both.
- Zones: the registry's count is three (`presenceTotal` pads a block to it); `festival-page.ts` words the
  heading from the count; `ZoneGrid` marks how many cards it draws and the mosaic has a three-zone rule;
  the seed revises its own earlier "four" in four places.
- Programs: Cultural Exchange is left out by name (`NOT_RUNNING` in `programs-page.ts`), and
  `FIXED_LAYOUTS.programsPage.cards` is `three`.

## Published

Through the Sanity connector, each as a draft made from the published revision (or a new draft), then
published with the draft's own revision. The owner's answers through the question tool are quoted.

- "Enroll a learner" on `programsPage` (its take-part row) and on `program-yoruba-lessons` (its card's
  action). `programsPage.layout.cards` was set to `three` in the same write; the runtime reads the fixed
  value instead (ADR 0053), so the stored one changes nothing.
- `door-volunteer.image`: two women arranging white flowers at Odunde 2026, from the album, used nowhere
  else.
- Six voices from the Odunde 2026 highlights film (`voice-odunde-2026-*`), each as the two transcripts of
  10 October agree on it, unnamed, with the relation "Organizer, in the Odunde 2026 film". Three are on
  the homepage, whose intro now says where they come from. Names, and each person's yes to being named,
  are the owner's to add.
- `partner-wefa`: a sponsor of Odunde, linked to its site.
- Four people in the volunteers group, the four the owner named, each with the role and one line the
  Drive notes support.
- `storyPage`: how it began, in three paragraphs drawn from the organization's own words (a 2025 deck of
  the owner's and the old site), the first president as the first-year fact, and seven dated entries
  from 2017 to 2026 after the presidents already listed. The timeline's switch stays hidden.
- Odunde 2027, "Publish date and free entry": `event-odunde-2027` starts on Saturday 5 June 2027, with
  "Free entry" and the 2026 venue line. The stored start time is 10am, the 2026 one, which shows nowhere
  until the edition has an end time. "Hide it for now": `festivalPage.layout.schedule` is `hidden`.
- The three-zone wording: `festivalPage.header.line`, its first paragraph, `event-odunde-2027.summary`
  and `stat-zones`.
- Two plan-your-visit facts: the plaza's corner, and the Metro K Line's Leimert Park station beside it.
- `program-kids-stem.cadence` "At Odunde, each June", and the year strip's "All year" for the lessons
  and "June" for Kids & STEM.

## Checked

- The branch on a local server against the real dataset, at 1440 wide: Our Story (board, Reach us),
  Get Involved (the associations strip), the Gala's seats, the Programs page's take-part band, Odunde's
  zones and past years.
- The three dialogs at 1440 by 800, 1280 by 640 and 375 by 740: the contact form centred, the vendor form
  filling the screen less its margin with its body scrolling, the bottom sheet on a phone.
- The real donation form in the built-in browser at 1280 by 800: the dialog was 705px tall, centred, the
  form ready, with the frame at its floor of 500px. The pane was hidden, so Zeffy's own height message
  never arrived there. Its first step measured 542px on the live site that morning: at that height the
  dialog is 747px in an 800px window, whole with 5px to spare, and in a 660px window the body scrolls
  about 135px under the pinned head.
- The seeded browser tests on desktop and phone sizes for the pages touched, with two new tests for the
  dialog shell.

## What the Drive notes hold, and what they contradict

Read on 11 October for the open notes above: the planning document, the master sheet, every weekly sync
from 18 March to 10 June 2026 and the retro. Phone numbers, addresses and the names of people the site
does not list stay out of this repository.

- Odunde 2026: Saturday 6 June, Leimert Park Plaza, free. Planned for 10 to 5; the program was really
  under way about 1pm. 206 people had registered the day before. No vendor paid a fee. The retro of
  10 June chose Saturday 5 June 2027 for the next one; the park was not yet reserved.
- Not in the notes: the day's attendance, the final vendor count, the lessons' fee, format and ages, the
  STEM Hub's ages, membership dues, anything about the Gala, any description of Cultural Exchange.
- The site says nine hometown associations (Get Involved, Impact's figure). The notes support no number:
  the team expected "max four" groups at the festival, and the retro names one that clearly came.
- The Collective page presents Solar Hub and Green Goods as the Collective's projects. In the notes the
  first is another organization's hub and the second another group's application, shown at an information
  booth; on 2 September the organizers said the Collective had no initiatives of its own at the moment.
- The California Attorney General registry status was still "To confirm" in the owner's tracker on
  2 October. The site must not say "in good standing" before the printout is in hand.

## Left

- The second pull request: the homepage's section for the two events, partners as cards with a line
  each, Impact's partners and its closing ask in one section, and Impact's voices.
- After the first pull request deploys: the third zone's document and the three zones' lines.
- For the owner: names for the six voices; whether the other organizers the notes name join the list;
  whether the timeline shows; the founders and the earliest photograph; the festival's hours, parking,
  accessibility and vendor terms for 2027; ages for each program; how often the Collective meets.
- The Studio's To do still asks for Cultural Exchange's facts (open-work E27).
