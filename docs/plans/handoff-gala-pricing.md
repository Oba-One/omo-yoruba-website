# Gala pricing from Zeffy, 11 October 2026

The Gala's confirmed pricing and description are published. The remaining
content needs the owner's facts: doors-opening time, dress code, a timed
running order, and honoree or award details. Do not infer doors-opening time
from the event's start time.

## Source and published content

The owner asked to fill pricing and other confirmed details from the live
Zeffy form and report what is missing. The primary source was read in a browser:
`https://www.zeffy.com/en-US/ticketing/end-of-the-year-gala-2`.
Its full description and attached flyer were checked.

- One ticket is offered: General Admission, $100, with access to the full
  program and all main activities. No couple or table ticket was added.
- The form shows 28 November, 5pm to 11pm PST, at 4501 Casa Loma Ave,
  Yorba Linda, CA 92886. Its flyer names Yorba Linda Community Center.
  These agree with the existing 2026 Gala edition in Sanity: start
  `2026-11-29T01:00:00.000Z`, end `2026-11-29T07:00:00.000Z`. Date,
  timestamps and venue were preserved.
- The description confirms traditional food, music, dance, recognition and
  fellowship, supporting language learning, cultural education and community
  events. It gives no timed program, dress code, separate arrival time,
  award categories or honoree names.

Sanity project `qsya7q8x`, dataset `development`, workspace `omo-yoruba`.
The exact deployed schema `_.schemas.omo-yoruba` was read for `ticketTier`,
`event` and `galaPage`. No schema or application code changed.

Published through the Sanity connector, after checking that neither the event
nor the Gala page had an existing draft:

- Created `ticket-gala-2026-general-admission`, type `ticketTier`, referencing
  `event-gala-2026`. Name `General admission`, price `$100`, includes
  `Access to the full program and all main activities.`, variant `buyNow`,
  order 1, featured false.
- Filled `event-gala-2026.summary` with the confirmed time and activities.
  Edition-specific times stay on the edition.
- Updated `galaPage.eveningIntro` to describe the confirmed activities and
  cultural programs. This shared page copy contains no edition-specific date
  or time.

The event and page patches were guarded by their published revision. All
three new drafts were inspected, then published with their exact draft
revisions. Their resulting published revision is
`iQgLS0xVuk0Q8VkO2Rfa3j`. A raw query confirms none of these three drafts
remains, there is one published tier for Gala 2026, and no honoree for it.
The existing Odunde album and Gallery drafts were not edited.

## Proof and remaining work

The live Gala page shows Seats from $100 in its header and glance strip,
the General admission card, its inclusion text, and the revised evening
description. The ticket card opens the existing Tickets Dialog. The first
request received the previous cached page; the next reload showed the new
content, matching the runbook's cache behavior.

`PLAYWRIGHT_TEST_BASE_URL=https://www.omoyorubasocal.org bun e2e -- gala.spec.ts tickets.spec.ts --workers=1`
passed all 20 desktop and mobile checks, including the ticket dialog, page
structure, tier links, focus restoration and axe in both treatments.
No ticket was selected or purchased, and no form data was submitted.

The four remaining Gala Pending areas are:

- `event-gala-2026.doors`: when guests may enter. The 5pm event start does
  not establish an earlier or identical doors-opening time.
- `event-gala-2026.dress`: the dress code.
- `event-gala-2026.schedule`: program items and their times.
- Gala `honoree` documents: who is recognized and for what, or the owner's
  decision on whether the public awards section should be shown.

No other launch requirements were guessed from the ticket form. The earlier
video and ticket-form setup is recorded in `handoff-sanity-video-tickets.md`.
This handoff is local and uncommitted; the owner's existing handoff edits
remain unchanged.

## Open-work tracking

Updated `open-work.md` on 11 October to mark the Gala pricing and ticket
setup complete. D9 and D31 are done, reflecting the live seats-only setup,
Zeffy Tickets Dialog and revised seats intro. C5 remains open for doors-opening
time, dress code, the timed running order, and honoree and recognition details.
The awards decision in D10 remains open. The checklist links the pricing
and ticket setup handoffs for proof.

Validation: `bun lint` and `git diff --check` passed. This tracking update
changes documentation only.
