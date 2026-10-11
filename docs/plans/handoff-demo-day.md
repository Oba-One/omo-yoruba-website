# Demo-day pass, 11 October 2026

The owner asked to finish the site for a showing to the members that day. Everything a visitor meets
was read back from the live site after the last change. What is left needs facts only the organization
holds, listed at the end.

## Merged

- Pull request 45 (`2ce765c`): the homepage's Gala button reads "Tickets" unless the lead edition lists
  a table tier (`offersTable`, ADR 0052), and the member guide links the Studio on
  `https://www.omoyorubasocal.org/admin`. The runbook's Hosting today and open-work D2 hold the
  readings behind that link.
- Pull request 46: a take-part row's member way opens the Join Dialog, as the member door does
  (`wayAction`, ADR 0050). Our Story's and the Lessons page's rows change; the footer's link does not.

## Published

Through the Sanity connector, each as a draft made from the published revision, read back, then
published with the draft's own revision. The owner's words are quoted.

- `homepage.hero.image`: the procession led by the gángan drummer, an Odunde 2026 original, with
  `crop.top` 0.15 and the hotspot at 0.34, 0.2. "OPtion one is fine but mobile you only see the ceiling
  so we need to better position that image, the 2nd option can be used for Odunde".
- `festivalPage.header.image`: the elders at the market table, `crop.top` 0.205, hotspot 0.66, 0.21.
  The crop clears the banner above them, so its alt text no longer names the sign.
- `zone-oja-balogun.image`: the vendor tents with drums, so the Odunde page does not show the market
  table twice (the owner's yes to "Market zone photograph").
- `creditConfirmed` on nine albums: both cultural fairs, the galas of 2022 to 2024, the parties of
  2014, 2015 and 2018 and the 2017 reception. Asked whether Red Carpet Films took them: "Yes, all
  nine". The summer camp's credit stays unconfirmed.
- `galleryPage.header.line`: "Odunde, the end-of-year galas, the cultural fairs and the summer camp,
  back to 2014. Open an album and start looking."
- `album-summer-camp`: the draft that waited since 10 October, one caption's marks.
- `galaPage.layout.awards`: `hidden`, until the owner decides whether the Gala gives awards (D10).

## What a phone shows of a hero photograph

At 760px and under, the scrim of the homepage hero and of a photo page header is nearly clear over the
top sixth and opaque from about two thirds down, and the photograph covers the tall box by its height.
So a phone shows the top third of a landscape photograph and about a third of its width. Heads that sit
lower than that need `crop.top`; the hotspot's x then chooses which third of the width shows, and its y
only matters on wider screens. The framing was tried in the live page before it was saved, by swapping
the image for the CDN's `rect=` crop in a browser at 375, 430, 820 and 1440 wide.

A phone also draws the photograph about three times wider than the `sizes="100vw"` it asks for, so it
is soft there (open-work E26).

## Checked

- The live site, before and after the day's changes: the twelve routes and the twelve albums at 375 and
  1440 wide. Every page answered 200 with no console error, no sideways overflow and no broken image;
  492 internal links answered 200; `#give`, `#join` and `#tickets` each opened its dialog around the
  right form address. The first request after a publish got the old copy once, as the runbook says.
- The three Zeffy forms in the built-in browser: each dialog reached `data-state="ready"`, and the
  ticket form showed General Admission at $100. Nothing was bought or submitted.
- `bun check`, 1,222 tests, on both pull requests. Against the real dataset: `our-story`, `lessons` and
  `join` (38 tests) with the new `expectJoinRoundTrip`, and `programs`, `collective`, `home`,
  `get-involved`, `a11y` and `navigation` (107 tests).
- Both pull requests were reviewed on the standards and spec axes before their commits.

Pending notes on the pages fell from 483 to 137: 121 across the eleven pages and 16 on the summer camp
album.

## For the owner

Two private pages, shared from their own Share menu:

- The member showcase checklist, updated to this state with the finished rows ticked.
- "What the website still needs": every Pending note by page, the Gala first, to hand round.

## Left

- The Gala: when doors open, the dress code, the running order, and the honorees (C5, D10).
- Membership dues, each role's contact and response line, and the Donate page's three lines on fees,
  receipts and monthly giving (C1, C12).
- The officers' names, published on 9 October for a later look (C11).
- The summer camp album's year and photographer (C3).
- The organization's mailbox, and the temporary routing of enquiry emails (D16).
- Four test enquiries of 12 September still sit in the Inbox (H6).
- The walkthrough with a member's Editor account (E8).
- The main checkout holds uncommitted files: the owner's own edits to two handoffs and one new
  handoff, and seven handoffs, a research note, screenshots and six open-work rows left by other
  sessions on 10 and 11 October. Local `main` is behind `origin/main` and cannot fast-forward over
  them. This pass left them as they were.
