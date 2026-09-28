# The Studio follows the site: roles, held-back switches, one place per fact and a To do view

Decided with the owner on 26 September 2026 in the weeks 1 and 2 decisions session
(`docs/tickets/studio-simplification/spec.md`), from the Studio review of 13 September (open-work section 3)
and the four-week plan's principles for the Studio. Members of the organization manage the site's content after
the meeting in the week of 12 October, and the Studio they met followed the code: 36 document types, 44 layout
options, a Pending view of 135 rows of which 66 opened an empty list, facts kept in two places, inputs that change
nothing, help text with ADR numbers, and personal data one query away.

- **Roles.** Members are Editors. Administrators keep site settings (the organization's public facts included,
  since the general inbox is also where unrouted enquiries go), the Inbox, the Vision tool and three held-back
  switches. The rule, in the owner's words: members edit details and facts; administrators keep security and
  settings with drastic effects. The News page, which has no page before launch (D22), is an administrator's too.
  One table (`studio/roles.ts`) names these documents: members do not find them in the sidebar or the to-do list,
  open them read-only anywhere else, and get no actions on them.
- **Held-back switches.** The gallery's `state`, Our Story's `timeline` and the Gala's `awards` publish content
  that waits for an owner decision (photo consent, confirmed timeline entries, whether the Gala gives awards). They
  are read-only for members and say why, and a member cannot restore an old version of those three pages, which
  could flip one. Every other layout option, design ones included, stays with members; ADR 0006's options are
  otherwise unchanged.
- **One place per fact.** An album names its edition, and the edition no longer names its album. The teacher is
  the person the Lessons page picks, and the person groups hold no teacher. Outcomes, timeline entries, giving
  levels and initiatives are lists on the one page that shows each, not documents in the sidebar.
- **One control per decision.** Take-part order is the rows' own order, the homepage's lead event is the `season`
  option, the gold button is the hero's own button, and the Gala's tiers follow their order and `featured` flag.
  Odunde's `takepart`, the homepage's `leadEvent` and the Gala's `emphasis` are retired.
- **Inputs that change nothing** are hidden, then deleted by migration, except the sharing image (Phase 9), the
  news post body and author (a later News page) and the fields on shared objects, which stay hidden. Scope values that show
  nothing are removed. A Collective event needs no edition year, and the `other` kind is retired.
- **A hidden input blocks nothing.** Sanity checks hidden inputs too, so a member could meet an error they cannot
  see. Every check, Sanity's built-in ones included (a reference must be published, a link must be a URL), skips
  an input the form hides (`skipValidationWhenHidden`, applied where the schema is assembled). An image asks for alt
  text only once it has a picture, and no field of a shared object has a default: a default makes Sanity create the
  object, empty, on every new document, where its required fields block Publish and the site and the to-do list
  count it as filled. The Sanity CLI registers the rules as written instead, because Sanity's schema manifest keeps
  only rules it can read without a document: a deployed schema then tells agents what each field requires.
- **Drafts, not releases.** An edition is prepared as drafts and published by hand on the announce day; Content
  Releases, scheduled drafts and scheduled publishing are switched off.
- **The sidebar and the To do view.** The sidebar is arranged the way the site is (the spec draws it), and a To do
  view grouped by page, with counts and only what is owed, replaces the Pending list. The registry (ADR 0014)
  keeps its rows and wording, so the site's chips read as before: the To do takes each row's page from the
  register's Where label, a row bound to an edition (an event's facts, the Gala's ticket tiers and sponsor
  levels) says which edition it asks about (the next one or the past one) and counts only the edition the site's
  own rules pick, and a row for an item of a page's list keeps the item's type and names the list it lives in. The To do is Sanity's own lists
  fed by one live query, not a custom pane; it opens on a counting line, so opening a document from search never
  waits for the count, and a failed count tries again by itself.

## Considered options

- **Design options for administrators only** (S10 as reviewed): the owner kept them with members. Their rule draws
  the line at drastic effects, and a pattern or a motion setting is not one.
- **Members edit the public facts** (S15, splitting the settings): dropped. The general inbox is also the routing
  fallback, so a member's edit could re-route every enquiry without a named contact.
- **The edition keeps the album link instead:** members add photographs on the album, so the link belongs there.
- **The teacher as a person group:** the page's pick is what the Lessons page reads today, it sits where a member
  looks for the Lessons page's content, and it needs no migration.
- **Content Releases:** one more concept for members, and plan dependent; drafts cover the announce day.
- **The page lists after the meeting:** the owner chose now, while the dataset holds two initiatives and none of
  the other three.
- **Locking enquiries in an administrators-only dataset now:** large (the forms, the email function, the Inbox)
  and it would delay the member test; revisited with D3.

## Consequences

- Hiding and locking are not access control. Through the API (a script, the CLI or the Sanity MCP server signed
  in as a member) an Editor can read, change, publish and delete every document in the dataset: enquiries,
  subscribers, site settings and the held-back switches included. The Studio's locks shape its interface only, and
  the private dataset keeps the public out, not members. Custom roles (an Enterprise plan) or an
  administrators-only dataset would be the lock (D3). The member guide says what is off limits and why.
- Amends ADR 0006 (three options are administrators' only), ADR 0013 (giving levels, outcomes, timeline entries
  and initiatives are page lists; governance documents stay documents, one per filing), ADR 0014 (the To do view,
  the edition an event row asks about, and the list a list row names), ADR 0025 (take-part order is the rows' order, with no option over it) and
  ADR 0039 (the album's link only).
- Stored content moves only by migration after a dataset export (the runner in part 5, ADR 0035's rule); nothing
  is moved by hand. Every page renders the same content before and after, proved in both data modes.
- The member guide (`docs/content-ops.md`, week 3) describes the Studio as simplified.
