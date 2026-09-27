# Studio simplification spec

Written 26 September 2026 from the decisions session with the owner (the weeks 1 and 2 plan, part 1, D6),
open-work section 3 (S1 to S15), the four-week plan's principles for the Studio, `docs/design/CONTENT-MODEL.md`,
ADRs 0006, 0013, 0014, 0025, 0035 and 0039, and a read of the Studio, the schema and the live `development`
dataset on 26 September. Each answer below is the owner's; lines marked "session" follow from an answer or
from a principle. ADR 0042 records the decisions; the tickets in `issues/` build them.

## Facts the decisions stood on

- A member sees 36 document types (20 of them in the Create menu), 44 layout options and a Pending view of 135
  rows. Against the seed, 66 rows open an empty list and 11 are site settings rows a member cannot publish.
- Only site settings and the Inbox check the role (`isAdministrator` in `studio/document-options.ts`), and only
  in the interface. A member reaches site settings through its Pending rows and the Presentation tool, and can
  read enquiries and subscribers through the Vision tool and global search.
- About 15 inputs change nothing on the site: the event hero image, the slim pages' header photo, the sharing
  image, photo credits outside albums, five `order` fields, the News page, `keepsOwnList`, `proceedsReturn`,
  the Gala's extra glance facts, the settings' logo, second wordmark line and footer text, the news post body
  and author, the photographer's link, and a Gala edition's cost and attendance.
- 12 descriptions carry ADR or ticket numbers and about 10 more use developer words; 58 choice lists show raw
  code values; date inputs read `YYYY-MM-DD`, previews are day first or ISO, and times show in the browser's
  zone while the site reads the Los Angeles day.
- The live dataset on 26 September: 128 published documents and no drafts; 2 initiatives; 4 editions, none of
  kind `other`; both edition albums name their edition and match the edition's own link; the festival page's
  `takepart` is `vendor` and its rows start with the vendor; the Gala's `emphasis` is `seats`; the homepage's
  `highlight` is `festival` and its `season` is `auto`; no `leadEvent`.

## Decisions

- **Q1 Roles (D4).** Members are Editors. Administrators keep site settings (the EIN, address, phone, general
  inbox and social links, the routing contacts, Zeffy, analytics and theme), the Inbox and the Vision tool.
  The owner's rule: members edit details and facts; administrators keep security and settings with drastic
  effects. Splitting the settings so members edit the public facts (S15) is dropped.
- **Q2 Held-back switches (S10).** Three layout options publish content held back for an owner decision and are
  read-only for members: the gallery's `state` (photo consent, D5), Our Story's `timeline` (D21) and the Gala's
  `awards` (D10). Every other layout option, design ones included, stays with members.
- **Q3 Inputs that change nothing (S2).** Hidden in part 4, deleted by migration in part 5. The sharing image
  (Phase 9), the news post body and author (a later News page) and the fields on shared objects (the slim pages'
  header photo, photo credits outside albums) stay hidden instead (session).
- **Q4 News (D22).** No News page before launch: the News page is an administrator's (members do not see it),
  the post body and author are hidden, and the to-do row asking for bodies goes. Whether news becomes a feed or a kept list stays open.
- **Q5 Collective events (S1).** A Collective event needs no edition year; the `other` kind is retired.
- **Q6 Album link (S9).** The album's link to its edition stays; the edition's link to its album is retired. An
  edition with several albums shows the first made that holds a photograph (session).
- **Q7 One control per decision (S11).** Take-part order is the rows' own order (Odunde's `takepart` retired);
  the homepage's lead event is the `season` option (the `leadEvent` pick retired); the gold button is the
  hero's own button (`highlight` only highlights a program card); the Gala's tiers follow their order and
  `featured` flag (the Gala's `emphasis` retired). Each page renders as before.
- **Q8 Scopes (S12, session from Q3).** The Odunde sponsor scope and the partner scopes other than Odunde show
  nothing and are removed.
- **Q9 Teacher (S13).** The Lessons page's pick is the one source; `teacher` leaves the person groups, and the
  group becomes optional (session).
- **Q10 Releases.** Editions are prepared as drafts and published on the announce day; Content Releases are
  switched off.
- **Q11 Page lists (S14).** Outcomes, timeline entries, giving levels and initiatives become lists on the one
  page that shows each.
- **Q12 Sidebar and To do (S7, S8).** The sidebar follows the site (below); a To do view grouped by page, with
  counts and only what is owed, replaces the Pending list.
- **Q13 Privacy.** An Editor can still read enquiries and subscribers through the API. Accepted for now, written
  into ADR 0042 and the member guide, and revisited with D3. The same holds for changes (found in review): the
  Studio's locks shape its interface only, and a member's login can change any document through the API.
- **Q14 Timing.** All of parts 4 and 5 before the meeting in the week of 12 October.

Session decisions: governance documents sit under Pages, then Impact; the To do counts only what the site shows
(past editions only their album and attendance); site settings, enquiries and subscribers are read-only for
members; enquiries and subscribers leave global search; lint reports offer members no actions and
administrators only Delete; the `developer` role gets the member view; the theme joins the Services group; the
unshown "as of" dates are hidden; the event type is titled "Event", since a Collective event is not an edition.

## The sidebar

```
To do                      owed items by page, with counts
News posts
Events
  Odunde Festival          editions, festival zones
  End-of-Year Gala         editions, ticket tiers, sponsor levels, honorees
  Collective events
Photos                     albums, photographers
People                     people, testimonials, hometown associations
Pages
  Homepage, Odunde Festival, End-of-Year Gala, Programs, Yoruba Language Lessons,
  Yoruba Cultural Collective (initiatives), Get Involved, Impact (outcomes, governance documents),
  Our Story (timeline), Donate (giving levels), Photo Gallery
Used on several pages      programs, headline figures, doors, partners
Administrators also see    Site settings, Inbox, the Vision tool
```

## Work

| Part | Tickets | Stored change | By |
| --- | --- | --- | --- |
| 4, quick wins | 01 to 06 | none | Mon 28 Sep |
| 5, pull request A | 07, 08 | none | Wed 30 Sep |
| 5, pull request B | 09 to 13 | migrations | Fri 2 Oct |
| 5, pull request C | 14 to 16 | migrations | Tue 6 Oct |

Every stored change follows ADR 0035 and ADR 0042: export `development` first, move data with a reviewed
migration, list retired fields in `RETIRED_FIELDS`, regenerate TypeGen, and update the registry and presence
rows, the route map, the Presentation locations and the cache tags. Every page renders the same content,
proved by Playwright in both data modes and a content snapshot before and after each migration.
