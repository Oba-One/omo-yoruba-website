---
name: oy-content-ops
description: Recipes for adding or changing site content through the Sanity MCP server. Use when the owner asks to add a news post, an event edition, an album, a person, an outcome, a governance document, a giving level, or to clear a Pending item.
---

# Content operations

The owner adds content from a Claude Code session through the Sanity MCP server in
`.mcp.json` (OAuth on first use). Shapes come from the schema in `@oy/content`; the decisions
that shaped it are ADR 0013 to ADR 0017. Editor-facing version: `docs/content-ops.md`
(Phase 10). Copy rules: the `oy-voice` skill. The site and the Studio read `development` until
the owner settles the datasets (open-work D3); the seed (`bun seed`) fills it with the confirmed
facts and the photographs. Members edit details and facts; administrators keep site settings, the
Inbox, the Vision tool and the three held-back switches (ADR 0042).

## Before writing

Load the deployed schema with the MCP `get_schema` tool and read the target type. Query for an
existing document first (deterministic ids from the seed: `siteSettings`, `event-odunde-2027`,
`album-odunde-2026`, `program-yoruba-lessons`; slugs for posts and albums) so an edit patches
rather than duplicates. Ids never contain a period.

## Recipes

- **News post**: `newsPost` draft with title, slug, date (the first of the month when only the
  month is known), bilingual kicker (Yoruba with marks, English), summary, image from an existing
  asset or a new upload with `alt`, and tags. No body or author: there is no News page before
  launch, so the Studio hides both (ADR 0042). Run the voice check. Publish, or leave as a draft
  for review.
- **Event edition**: drafts, published on the announce day; no Content Release (ADR 0042). The
  `event` with its kind, dates, venue and what its kind's form shows (`edition-fields.ts`): cost,
  schedule rows and vendor terms for the festival; doors, dress, tickets link and running order for
  the Gala, plus `ticketTier`, `sponsorLevel` and `honoree` documents that each name the Gala
  edition. The page singletons rarely change. Checklist: `/oy-release`.
- **Collective event**: start it from Events, then Collective events, so the kind is set (through the
  Sanity MCP server, set `kind` to `collective` yourself): its title,
  `start` (and `end` when it has one), the one-line summary and `venue.name`. It needs no edition year
  (ADR 0030, ADR 0042), and the form shows nothing else. The Collective page lists it from the moment it is published until it
  ends, or with no end until its start day ends in Los Angeles, nearest first, with "Ask to join" opening
  the contact form. An event without a start never lists, so enter it once the date is set. The venue's
  chip shows until `venue.name` is filled; the To do's Still to add counts the events still to come.
- **Initiative**: Solar Hub and Green Goods are items of the Collective page's own list,
  `collectivePage.initiatives`, in the order the page shows them (ADR 0042). The status line is the pill in the Collective's own words, set
  only from what the owner confirms ("[ How far the project has come ]"); `status`, `serves`, `since` and
  `next` are the four facts, each its own chip while empty.
- **Album**: upload photos, create `album` with a title and slug, the `event` reference for an edition's
  photographs (the one link between them, ADR 0042: its year dates the album, and the edition's page shows
  under past years the first album made that names it and holds a photograph; `date` only when there is no
  edition or the day matters), the cover
  (else the first photograph shows), photos in the order the album page and the Lightbox show them, each with
  `alt` (who, doing what, where) and a caption, the album-level `credit` (a `photographer` document),
  `creditConfirmed` only once the photographer confirms, and a `consentNote` for anything specific to the
  album's faces. A photo sets its own `credit` or `creditNote` only where it differs. Each photo's `_key` is its
  photo address (`/gallery/<slug>?photo=<key>`, ADR 0037): keep the key when replacing an image so shared links
  still open it. The gallery shows an album only with a photograph, newest year first (ADR 0039); an album with
  neither a date nor an edition shows the year's chip.
- **Gallery policy**: `galleryPage.creditsAndConsent` is the owner's own consent and removal policy in plain
  text; the page never drafts it. Removal requests go to `siteSettings.generalEmail`.
- **Person**: `person` with `group` (board, staff, volunteer; none for the teacher) and `order`, the `role`, the short
  bio and, for Our Story's `bios` option, the full bio; portrait optional (the no-portrait card is a real
  design, and a photograph never stands in for someone named). Our Story lists the board by order, then
  the staff and volunteers together; Impact's board cell counts the board. The teacher is the `person`
  `lessonsPage.teacher` picks, in no group and listed on the Lessons page only; her email there is the
  `teacher` routing contact's.
- **Outcome**: an item of Impact's own list, `impactPage.outcomes`, in order (ADR 0042): a `program` or an
  event page (`kind` festival or gala), never both, with the `figure` (the number, what it counts and its
  source) once something is measured, or the plain statement of what is being measured this year. Impact shows
  the four subjects its prototype names (Language Lessons, the festival, Kids & STEM, the Collective) and
  keeps a chip in each one no outcome fills. A figure without its source shows the source chip.
- **Governance document**: a `governanceDoc` with its `kind` (Form 990, annual report, audit), the `year`
  and the `file`, or with no file a `note` saying when it comes ("Copies on request"). Impact reads the
  newest of each kind; the EIN and the mailing address come from `siteSettings`.
- **Giving level**: an item of Donate's own list, `donatePage.whatYourGiftDoes`, in order (ADR 0042), with the
  `amount` as shown ("$25"), `what` it pays for (it gets checked, so it must be true), `frequency` (once or
  monthly, which adds "a month") and the `source` of the cost; Donate shows them under its `impact` option. Only amounts the owner's Zeffy form offers.
- **Other way to give**: a row in `donatePage.otherWays` with its `kind` (by check, employer matching,
  in-kind goods, donor-advised fund, another way), its `title`, one line (`blurb`) and a practical `detail`.
  A check row adds the mailing address and the matching and fund rows the EIN and legal name from
  `siteSettings`, each the chip while the settings hold nothing; add only the ways the owner accepts.
- **Timeline entry**: an item of Our Story's own list, `storyPage.timeline`, in order (ADR 0042), with the
  `year` ("2003", "1998 to 2002", "Today"), one line and `milestone` for the founding and today. The page's
  `timeline` switch stays hidden until the owner confirms the entries; only an administrator changes it.
- **Routing contact** (administrators): `siteSettings.contacts[]`, one entry per role with name, email, phone and
  the response line the success copy uses ("within five working days"). The `general` contact answers
  on Get Involved and Our Story; `partnerships` closes Impact.
- **Clear pending**: open the To do in the Studio (rows come from `packages/content/src/pending.ts`,
  grouped by the page that shows them; members see only the rows they can act on, and the site
  settings rows sit under Organization details for administrators), open a row, fill the field and
  publish; the row leaves the To do, and the chip leaves the site after the purge. Still to add
  rows clear when enough documents exist. Through the Sanity MCP server there is no To do: query
  the row's filter (`pendingFilter` in `pending.ts`) with the drafts perspective, and for a row with
  an `edition` keep only the documents of the edition its page shows (`'next'`: the next festival
  or Gala edition still to come, or the Collective's dated events still to come; `'past'`: the
  newest past edition whose album has photographs, as `lead-event.ts` reads them). An event is its
  own edition; a ticket tier or sponsor level names one in `event`, and a sponsor level naming none
  shows every year.
- **Enquiries** (administrators): the Inbox lists them by kind, unhandled first; tick `handled` and add notes. They hold personal data and stay out of search. A row
  with `notifyError` did not reach its email; fix the routing contact and the function retries
  on the next create only, so forward it by hand.

## Rules

- Never invent a figure, price, date, name or quote. If the owner asks for copy, draft it in
  the voice and leave the document as a draft for their review.
- Every image with a picture gets `alt` and a caption. Credits live on albums: the album's `credit`,
  and a photograph's own only where it differs (no other image shows one). Mark `creditConfirmed`
  only on the owner's word.
- Agent Actions (Generate, Transform) are opt-in and owner-triggered; use them for alt text
  drafts and Yoruba kicker suggestions only, never on publish.
- After publishing, the webhook purges the cache (Phase 4); confirm the change on the site
  within a minute. If it does not appear, see `docs/runbook.md` (purge).
