# QA pass after the first showing, 11 October 2026

The owner showed the site to the members and sent twenty notes "as I do QA". This is the record of what
each became. The rules the notes changed are in ADR 0056, and the three sections the notes added in
ADR 0057. (ADR 0056 merged as 0055 in pull request 51 and was renumbered in the second pull request: the
hero photographs' record took 0055 the same afternoon.)

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
| Odunde's zones "should be three we are missing the Egbe-Ibile section" | done: code in the first pull request; the third zone published once it deployed, with a line and a photograph for each zone |
| "We should high cultural exchange as a program it is not active" | done, first pull request |
| "Volunteer is missing a photo we should add one on the get involved page" | done: published |
| Quotes from the Odunde videos on the homepage and wherever quotes show | done: published, the homepage's three first and Impact's three once the second pull request was live, since Impact's line promised "a parent, an elder, and a vendor" until then |
| "add myself, temitope, simi ogunleye, joyce and others as staff and volunteers" | the four named are published; the others the notes suggest wait for the owner's word |
| "We need to add the detail for our story do deep research" | published: how it began, the first president, seven dated entries (the timeline itself stays hidden until the owner switches it on) |
| "Odunde we need to fill the missing details" | part published: the 2027 date, free entry, the venue line, two visit facts, the hour-by-hour section hidden; the rest is not in the notes |
| "We need to fill out the pending details on the programs page" | part published: when the lessons and Kids & STEM run; ages, and how often the Collective meets, are not in the notes |
| Add WEFA to Odunde's partners, and give the partners section more detail and links | WEFA published; the cards are done, second pull request; a line, a link and a logo for each partner are the organization's to add |
| "The homepage does not have a section highlighting the core events Odunde and End of Year Gala" | done, second pull request |
| "Fund next year section does not look good with it background similar to the footer", combine it with Partners and funders | done, second pull request |
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

## Second pull request

Three parts the handoff does not draw (ADR 0057), each a component in `@oy/ui` with its story and test.

- `EventCard` and the homepage's section under the band, "Our two celebrations": the festival and the
  Gala side by side, each card the event page's own header (photograph, kicker, heading, line) with the
  next edition's day and venue and a quiet link. The homepage query reads the two page singletons'
  headers, so `TYPE_ROUTES` sends a publish of either page to the homepage too, and the Studio lists
  the homepage as a second place each page shows.
- `PartnerCards` on Odunde and Impact: what the partner is to us, its name, one line, a link worded by
  its site's address, the logo when there is one. Three across, two on a tablet, a short last row in
  the middle. The partner gained one optional field, `line` ("What they do with us"). `PartnerRow`
  stays for a list of names alone.
- `AskCard`: Impact's "Fund the next year" as a card at the foot of Partners and funders, on the
  section's own ground, keeping the anchor `#fund`. With the partners hidden it stands alone in its
  section. No dark band sits on the dark footer any more.
- Impact's voices say "What people say about the work, in their own words."
- The first batch's record is renumbered to ADR 0056, with every reference the first pull request added.

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
- The zones, once the first pull request was live: `zone-egbe-ibile` (Ẹgbẹ́ Ìbílẹ̀, "The hometown
  associations", third in order) with the line "Where the Yoruba hometown associations and the elders
  gather.", which says no more than the owner's note does, and a photograph from the Odunde 2026 album;
  a line for the market and for the children's yard, each from what its own photograph shows.
- `programsPage.header.line` now ends "Kids & STEM is described in full below.", where it said "The
  rest are described in full below." with one program left under the cards. The seed keeps the earlier
  sentence; it leaves a stored line alone.

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
- The second pull request: `bun check` (1,250 tests in 171 files); by eye at 375, 700, 820 and 1440
  wide, the three new sections on the homepage, Impact and Odunde against the real dataset; and the
  whole browser suite against the real dataset, 340 tests on desktop and phone sizes: 322 passed, 14
  skipped as the suite intends, and two tests failed at both sizes. One was this change's: the event
  card's heading and placeholder rules had the card base's own specificity, so the homepage stood 5px
  taller (9px on a phone) after an in-site navigation than on a fresh load, where the router adds a
  page's styles after the ones it holds. The rules now name the card twice. The other was the Donate
  spec pinning the fourth give-now fact's sentence, which the organization reworded that day; the
  seeded check now asks only that the fact says something. Both pass on a rerun with the homepage spec.

## After the second pull request

Pull request 52 merged at 4:39pm on 11 October and was live within two minutes.

- Published once it was live: `impactPage.voices`, three of the film's voices (the plaza, on display,
  the third one), unnamed like the homepage's three. The live site then showed 82 Pending notes, where
  it showed 117 that morning; the homepage shows none.
- The two private pages the owner keeps (the showing's checklist and the list of what the site still
  needs) were brought up to date from the live pages.
- The third pull request, from the second one's review, which the merge did not wait for:
  - `Section`'s comment and story and the trust query's comment no longer say Impact closes on a dark
    band. `Handoff`'s stories draw the Odunde gift as the outline it has been since ADR 0056, say
    "join them", and gained the quiet link in a box that the Gala uses.
  - `PartnerCards` words a link only from an http or https address. `safeHref` also passes `mailto:`,
    `tel:` and a path on this site, so a `mailto://` form with a host had drawn a link.
  - The festival card's link reads "See Odunde": the glossary asks for the festival by its name.
  - `SectionHead` lost `swatch`, which no page has used since Impact's dark band went.
  - `AskCard` is a plain block, where it was an `aside`: alone in its section it had been a second
    landmark with the section's own name.
  - One list of partner kinds, `@oy/content/partners`: the Studio's choices, Impact's order and the
    card's kicker read it, where the schema, the loader and the component each kept their own.
  - Checked with `bun check` (1,252 tests in 172 files) and, against the real dataset, the homepage,
    Impact, Odunde, Gala and navigation specs on desktop and phone sizes (82 tests).
  - Left as it is: Impact's civic block links "The festival page" under a heading that names Odunde.
    The words are the prototype's; the glossary's Avoid would have them name the festival.

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

- A line, a link and a logo for each partner's card. Three lines the notes support were put to the
  owner on 11 October and are saved at their word, so that no draft sat in the Studio before a showing:
  STEMnetics, "Our partner for the STEM Hub at Odunde."; the Association of Moremi Women, "Keeps its own
  tent and information booth at Odunde."; Red Carpet Films, "Films and photographs our events.", with
  the YouTube channel its photographer credit already links to.
- For the owner: names for the six voices; whether the other organizers the notes name join the list;
  whether the timeline shows; the founders and the earliest photograph; the festival's hours, parking,
  accessibility and vendor terms for 2027; ages for each program; how often the Collective meets.
- The Studio's To do still asks for Cultural Exchange's facts (open-work E27).
