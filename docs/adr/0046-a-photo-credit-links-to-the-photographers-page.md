# A photo credit links to the photographer's page

Decided on 28 September 2026 by the owner, when they named the organization's event photographer, Red Carpet
Films, as the photographer of all three albums (open-work C3, D5). The owner gave two pages, a YouTube channel and a
Facebook page, and chose the YouTube channel for the credit's link.

- The `photographer` document has its Link again (`url`, Sanity's `url` type), shown to members beside the name
  and the credit line: "Their own page. The name in their credits links to it." ADR 0042 retired the field as an
  input that changed nothing; the design's content model had it (CONTENT-MODEL, `photographer`: `name`, `url`,
  `defaultCredit`).
- Wherever an album's credit shows, the photographer's name links to that page: the album page's credit, the
  Lightbox's bar and the event pages' past years. The full stop stays outside the link. The link takes the site's
  own link colours, which the Lightbox's dark scope already turns gold, and it opens in the same tab, as the
  partner links do. The site checks the address again with `safeHref`, since the Studio's rule does not bind a value
  written through the API; an address it refuses leaves the name without a link.
- A photograph with a credit of its own links only through a photographer of its own. A written credit
  (`creditNote`) links nowhere, and no photograph borrows its album's link for a credit that is not the album's.
- In the Lightbox the link is the first thing in a caption a keyboard reaches, and the captions of the other
  photographs are hidden. When the photograph moves while the link has focus, focus moves to the shown caption's
  link, else to Next or Previous, so it never falls out of the dialog and the arrows keep working.
- The queries read the link through the album's reference (`credit->url`), beside the name, so one edit to the
  photographer reaches every album that names them. A publish of a photographer already purges the album pages and
  both event pages (`TYPE_ROUTES.photographer`).

## Considered options

- The Facebook page: Facebook often asks a visitor to sign in before it shows a page; the channel opens for anyone.
- Both pages: one name in one credit line takes one link.
- A new tab: the site keeps new tabs for leaving a task under way, Zeffy's page behind the Give Dialog and the
  Gala's tickets on Eventbrite, and for a Studio button set to open one. A credit's link is an ordinary link, like
  a partner's.
- A link only once the credit is confirmed: the chip already marks a credit that is owed, and the link follows the
  photographer the album names.

## Consequences

- Amends ADR 0042: the photographer's link is no longer retired, so `RETIRED_FIELDS` drops it and neither the seed
  nor the `retired-fields` migration unsets it. Amends ADR 0039: the credit links. Both are noted there.
- On 28 September the dataset's photographer `photographer-red-carpet-media` became "Red Carpet Films", its name
  and its credit line both, with the channel as its link, and the three albums name it, their credits confirmed on
  the owner's word. The owner's facts go into the dataset through the Sanity MCP (E19), not into the seed: the seed
  still writes the register's three guessed photographers, unconfirmed and without a link. Its default run leaves
  the owner's values alone, but `bun seed -- --replace` puts the guesses back and unconfirms the credits.
- The link went into the dataset before this change reached `main`, whose seed and `retired-fields` migration
  still unset it and whose Studio shows it as a field to remove. Until the merge, and from any older checkout
  after it, run neither; if one runs, set the link again. The deployed schema that agents read (`get_schema`)
  gains the Link only when the owner deploys the schema again after the merge.
- The photographers "Members and volunteers" and "Omo Yorùbá archive" stay in the dataset with no album naming
  them, for a later album. Deleting them does not last: `bun seed` creates any seeded document that is missing.
- The seeded runs of the album, Odunde and Gala specs (`packages/web/e2e/`) expect the credits and the link as the
  dataset holds them (`PHOTOGRAPHER_PAGE` in `helpers.ts`), not as the seed writes them: a freshly seeded or
  replaced dataset fails them until the credits are entered again, and a change to them in the Studio changes what
  the specs expect.
