# CMS simplification review

11 October 2026. Review only: no schema, application code or Sanity content changed.
The owner identified too many fields on each page as the main source of friction.

## Recommendation

Make ordinary page editing about text, photographs and changing facts. Put stable
presentation and button behavior in code. Keep occasional copy and search overrides
under Advanced, with publishing decisions separate from appearance.

Start with the Gala page as a pilot, then apply the same pattern to the other pages.
The next step is to agree the proposed defaults below, then implement that bounded
change. These recommendations have not been adopted as project decisions.

## What the review found

- The eleven page types expose 40 layout choices; 37 are editable by members.
  The other three are the existing administrator-held publishing switches.
  Counts come from the authored schema and `PAGE_LAYOUTS`, not the older review's
  count of 44. This counts available settings across tabs, not simultaneously visible
  inputs or mandatory work on every edit.
- Ten page types receive Content, Actions, Layout, and Search and sharing groups
  through `definePage`. The homepage has three groups, with its buttons inside Hero.
- All eleven published page documents have no `seo` override. The website already
  derives search titles and descriptions from their headings and introductory lines.
- Gala Content contains the header, five separate section intros and the take-part
  rows. Each take-part row has five authored fields, including its optional chip.
- The shared button object asks for its label, destination kind and the applicable
  form or address. Normal page headers render at most two actions, but the schema
  permits an unlimited list of secondary actions. With a primary action, additional
  secondary actions after the first would not appear. The homepage uses a separate
  rendering path and needs its own review before changing that contract.
- Known facts are often generic Label / Value / Note rows. Donate finds its receipt
  information by the editable label `Receipt`, so renaming it to another phrase
  would stop the trust block from finding it.
- The September simplification already fixed unused fields, the sidebar, edition
  filtering and the To do view. Repeating those changes would not address this request.

## Priorities

| Priority | Change | Editing benefit | Keep editable |
| --- | --- | --- | --- |
| 1 | Replace routine presentation controls with fixed defaults | Removes design decisions from each page | Homepage promotion and intentional section visibility |
| 1 | Default the header buttons and repeated take-part wording | Editors select and order ways to participate without configuring ordinary button behavior | Page-specific copy overrides and meaningful campaign choices |
| 1 | Move Search and sharing to Advanced | Removes a group that currently has no published overrides | An optional title and description override |
| 2 | Give pages a short default form and group supporting material by section | Reduces scanning inside the Content group itself | Main copy, photos, factual lists and longer supporting copy |
| 2 | Replace known fact rows with named inputs | Editors enter a value once without maintaining labels or order | Every factual value, with Pending for unknowns |
| 3 | Create ticket tiers and honorees from their edition | Fills the edition reference from context and reduces repeated choices | Prices, inclusions, names and recognition details |

### Presentation defaults

These 22 options are candidates to leave the ordinary editing form. Begin by
preserving their current effective published values. Freeze the chosen presentation
in code after checking relevant drafts and the actual pages. Using the first schema
option blindly could change a page whose stored value differs.

| Page | Candidate layout keys |
| --- | --- |
| Homepage | `gallery`, `involved`, `newsletter`, `pattern`, `motion` |
| Odunde | `phead`, `zones`, `labels` |
| Gala | `treatment`, `tiers`, `labels` |
| Programs | `cards`, `inline` |
| Lessons | `faq` |
| Collective | `initiatives`, `green` |
| Get Involved | `doors` |
| Impact | `stats`, `outcomes` |
| Our Story | `bios` |
| Gallery | `open`, `captions` |

Some choices affect how much content is shown, including photo counts, figure
counts and biography length. Preserve today's output first; any later decision to
derive counts from selected content should be explicit. Fixed motion still needs
to respect reduced-motion preferences.

When a fixed choice limits visible items or removes a presentation path, adjust
the corresponding editor too. Do not leave members adding photographs or figures
that exceed an unexplained limit, or editing a full bio that can no longer appear.

Keep homepage event promotion available as an editorial choice. Keep consent,
awards and timeline decisions with administrators. Other content visibility controls
belong with the affected section, not among decorative choices. Do not hide missing
required facts automatically to make the form or public page look complete.

This recommendation reopens ADR 0006 and ADR 0042 / S10: the owner previously kept
design options available to members. The reason to revisit that choice is the
current preference for fewer fields, not an access-control requirement.

### Buttons, labels and supporting copy

Use fixed defaults for conventional actions such as Get tickets, Donate and the
teacher enquiry. Keep the actual ticket form address and routing contacts in their
existing authoritative documents. Preserve the existing distinction between a
membership enquiry and the Zeffy membership form.

A take-part row already derives its destination from its way in. Simplify the
remaining work by giving each page and way in an appropriate default title, button
label and chip. Let editors select and order the rows, with optional wording
overrides collapsed. Context matters: sponsoring the Gala and partnering with the
Collective should retain their different wording.

Stable page identity, bilingual kickers and small utility headings are also good
default candidates. Keep the homepage headline, organization story, program
descriptions and other substantial editorial copy editable. Derive procedural
ticket copy from the configured ticket behavior so it cannot name the wrong seller.

The Gala pilot should leave the main evening description and header photograph
prominent. Seats, sponsor, honoree and past-year introductions can use reviewed
defaults with optional overrides. Its everyday editor should not have to maintain
four supporting introductions to change one description or photograph.

### Known facts

For Lessons, expose named inputs for format, timing, ages and cost, with fixed
display labels. For Donate, use named inputs for fees, receipt information, monthly
giving and the fallback. Keep factual values and notes editable where needed.
The receipt field should be found by a stable key, not its display wording.

Retain a generic fact list only where the content is genuinely open-ended, such as
additional practical visitor information. Keep legal facts, policies, prices,
confirmed dates and contact details editable in their existing scope.

The published Donate introduction and Gala give row still make monthly-giving
claims; the introduction also promises an emailed receipt. C12 already records
this unresolved content work. Do not turn those statements into fixed defaults
before the donation form's behavior is confirmed.

### Edition and photo editing

After the page-form pilot, consider opening an edition with links to its ticket
tiers, honorees and albums. Creation there can supply the edition reference while
preserving the existing documents and queries. A storage migration to put all
related content inside the edition is not necessary for that navigation improvement.

The only published ticket tier is Gala 2026 General admission at $100. Keep the
price and inclusions editable. The 2026 seats-only decision can simplify its buying
controls without declaring that future editions can never offer tables.

Photo credit inheritance and cover fallback already exist. Collapse exceptional
per-photo credit overrides and make album-level credit prominent; keep alt text,
credit confirmation and consent explicit. These are secondary to the page-field
problem the owner identified.

## Implementation boundaries and proof

Pilot the Gala page before rolling the approach across all eleven pages. Compare
the current content form with one focused on its photograph and description, with
supporting text under Advanced and clear links to the edition's changing facts.
Hiding tabs alone is insufficient: reduce the default Content group's work too.

Before retiring stored inputs, export the dataset, inspect drafts and published
values, preserve approved wording, and use the existing migration process. Update
the Pending registry, hidden-input handling, queries, TypeGen and Presentation
locations where affected. A hidden required field must not block publishing, and
To do must not ask members for a field they cannot edit. Fixed copy needs no dead
click-to-edit target. Follow the existing content-model skill and runbook.

Acceptance should include a member changing Gala copy and a photograph, an editor
changing ticket pricing for the correct edition, and an administrator retaining
the awards decision. Check the public page before and after in desktop and mobile
views, with the same content and the same ticket, enquiry and donation behavior.

## Evidence and limits

Reviewed the local authored schemas, layout catalog, role rules, templates,
structure, Pending registry, GROQ queries and page builders. Read published page
configuration and relevant content from Sanity project `qsya7q8x`, dataset
`development`, on 11 October 2026. The read focused on published state; all drafts
must be inspected before any eventual migration.

The live Studio opened at its sign-in screen in the review browser, so this was
not an authenticated usability walkthrough. The conclusions above are grounded
in the authored forms, their rendering code and live content. Local Modern Web
Guidance was unavailable; its offline doctor attempted a registry request that
the sandbox blocked. No guidance package was refreshed.

Primary references:

- [Page groups and shared fields](../../packages/content/src/schema/singletons/page.ts)
- [Page-specific content fields](../../packages/content/src/schema/singletons/index.ts)
- [Layout inventory](../../packages/content/src/layout-options.ts)
- [Buttons](../../packages/content/src/schema/objects/cta.ts) and [take-part rows](../../packages/content/src/schema/objects/takePartRow.ts)
- [Named document fields](../../packages/content/src/schema/documents/content.ts)
- [Header actions and search fallbacks](../../packages/web/src/lib/sanity/page-skeleton.ts)
- [Donate's receipt lookup](../../packages/web/src/lib/sanity/donate-page.ts)
- [Previous simplification decision](../adr/0042-the-studio-follows-the-site.md)
- [Existing open work](open-work.md)

Only this review handoff was added. Existing local edits and the open-work list
were preserved. Application tests were not run because no behavior changed.
`bun lint` and `git diff --check` passed; all relative source links resolve.
