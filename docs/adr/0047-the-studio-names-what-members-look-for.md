# The Studio names what members look for

Decided on 30 September 2026 by the owner, after reviewing the Studio that ADR 0042 built. Three names read like
the code rather than the site: "Used on several pages", "Site settings" beside it, and "Collective events", the one
event list not named in full.

- No sidebar group is named for how the code reads its documents. The four documents under "Used on several pages"
  open beside the page that lists them, as Impact's governance documents already did: the programs beside Programs,
  the ways to get involved beside Get Involved, and the headline figures and partners beside Impact. The homepage,
  Donate, Get Involved's associations block and the Odunde page pick from the same documents, and click-to-edit
  still opens each one from any page that shows it.
- The administrators' document of the organization's facts, routing contacts, footer and services is "Organization
  details", the name the To do already gave its rows. Its code name stays `siteSettings`.
- The Collective is named in full. Events lists the Odunde Festival, the End-of-Year Gala and the Yoruba Cultural
  Collective events, a list titled by what it holds so it never reads as the Collective's page under Pages; a new
  one is a "Yoruba Cultural Collective event". The name is kept once, as `COLLECTIVE_NAME` in
  `packages/content/src/routes.ts`, and it is the confirmed name (CONTENT-MODEL, section 1).
- Every list of one document type is titled in the plural by what it holds (Albums, People, Honorees); the
  Inbox's lists keep their enquiry kinds' names. A document keeps its singular title for the Create menu and its
  own pane.
- Two documents take the site's words: a door is a "way to get involved" (Get Involved heads them "Ways in", and
  "Doors" also named the Gala's doors-open time), and a testimonial is a "member voice", as the homepage heads them.
- The To do's rows drop the register's leftovers: "Doors" and "Partner rows" name the pages they show on, the
  Collective's still-to-add row names it in full, and "organisation" takes the American spelling. A chip on the site
  changes with its row: "what it asks and gives", "the ways to get involved", "the ways to get involved for
  organizations", "the next events" and "your account of the organization".

## Considered options

- **A new name for the group** ("Shared", "Library"): any name for a group of unlike things still asks a member to
  know that the code shares them; the glossary already listed "shared content, globals, library" as words to avoid.
- **Partners at the top of the sidebar:** Impact lists every partner and funder, and the Odunde page shows only those
  marked for it, so the list belongs beside Impact.
- **"Get Involved cards" for doors:** Donate shows them as rows and Give closes Get Involved as a box, so "card" fits
  some of them only.
- **Keep "Site settings" and rename the To do's group to match:** most of the document is the organization's facts,
  and "settings" read as a second catch-all next to "Used on several pages".

## Consequences

- The Studio's structure and titles only: no field, value or document changes, so no migration, and `bun typegen`
  leaves no diff.
- Amends ADR 0042 (the sidebar's names and its group of shared documents).
- Code keeps its names (`siteSettings`, `door`, `testimonial`, `collective`). The glossary gives the Studio's word
  beside a term where the two differ (Door, Collective event), adds Member voice and Organization details, and
  lists "site settings" as a word to avoid.
- After the merge the owner opens `/admin` and deploys the schema again (runbook, Studio, preview and Visual
  Editing), so agents reading the deployed schema see the new titles.
- The member guide (`docs/content-ops.md`) and its screenshots use these names.
