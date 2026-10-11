# Member guide

## The rewrite for older readers (11 October 2026)

The owner asked for the guide to be checked against the Studio as it stands and
made plain enough that an older member can follow it without help. The source is
still `docs/content-ops.md`, shown at `/member-guide` and in the Studio's
**Member guide** tab.

### What changed

- The guide is now "How to update our website": thirteen sections in the order a
  member works. Every task is numbered steps with one action each. Bold marks
  only the words on the Studio's screen, and the guide says so. Notes that are
  not steps sit in an `aside`. What only administrators do (the Inbox, the three
  held-back switches, Organization details) has its own section at the end.
- New for members: where to find each kind of content, what to do when something
  looks wrong, when to ask an administrator, and the Studio's words explained.
  New facts: the price on a ticket tier is only what the website shows, and
  Zeffy charges its own (the 11 October walkthrough); an album shows once it has
  a web address and a photograph (`queries/gallery.ts`). The note about the
  Vision tab is gone: members never saw it.
- `ReadingGuide` in `@oy/ui`: from 960px the list of tasks stays in view beside
  the steps; the steps read at 18px, the top of the site's body range, in a 68ch
  column; `figure`, `figcaption` and
  `aside` have their styles; a link inside a sentence wraps with its line;
  printed, the page drops the list of tasks and keeps each step whole. The
  component is documented here because `docs/design/` is a read-only reference.
- The guide links itself in a new tab, so a member can keep it beside the Studio
  or print it.

### How the steps were checked

Against the code that draws the Studio: `studio/structure.ts`, the templates,
the schema's titles, groups and descriptions, the Missing content pane, the
enquiry actions and the layout options. The Studio's own labels (Publish,
Discard changes, Generate, Add item, Upload, "Used on" and the create button)
were read from the English strings of the installed `sanity` 6.12.0, and from
the walkthrough screenshots of 11 October.

Not checked in a signed-in Studio: the built-in browser was signed out, no
browser had the Claude in Chrome extension connected, and the owner chose to
leave the screenshots for later. So three details rest on the package's strings
and on older screenshots: **Upload** in a photograph's menu, the red and yellow
marks beside a box, and the phone button above a preview.

### Screenshots

Four of the first eight still show the Studio as it is and stay: `pages.jpg`,
`event-form.jpg`, `photo-details.jpg` and `people.jpg`. Five files are removed:
`events.jpg` (the sidebar still said To do), `album-controls.jpg` (credit now
comes before the photographs), `missing-content.jpg` (dark, an administrator's
sidebar, a Vision tab), `preview-and-publish.jpg` (the page tabs before ADR 0053)
and `todo.jpg`, which nothing used.

Seven are owed, each from a signed-in Studio in the light appearance, cropped so
no account control or administrator menu shows, about 700px wide so the words in
them stay readable:

1. The whole Studio as a member sees it, for Find your way around.
2. A page form on Content with Advanced beside it.
3. An edition opened: Edition details, Ticket tiers, Honorees, Albums.
4. The top of an album's form: Title, Web address with Generate, Edition,
   Photographer, Credit confirmed.
5. Missing content with a page chosen and one item's details open.
6. A page beside its form in Presentation, with Publish at the bottom right.
7. Publish and the menu beside it, open on Discard changes.

Add each as a `figure` with a `figcaption` in `docs/content-ops.md`, and raise
the count in `packages/web/e2e/member-guide.spec.ts`. The built-in browser
captures at most 800 by 600 at a time, so a wider picture is stitched from two.

### Proof

The guide's browser tests pass on desktop and mobile: keyboard navigation, every
screenshot loading with its caption, axe with no violations, no sideways scroll
at 375px, the list of tasks in view beside the last section at 1440px, and the
print view without the list. The component's two tests pass. Typecheck and the
voice lints pass.

### Reviews

One pass on each axis before the commit, both read-only.

- Standards. The steps were set at 19px, outside the documented body range: now
  18px. The list of tasks clipped its links' focus ring once it scrolled: it has
  room now. Link colour, hover and focus repeated the tokens' base rules and are
  gone. A printed guide lost the Studio's address: it is written out. The guide
  never said who an administrator is: it does now.
- Spec, each step read against the Studio's code. Four statements were wrong and
  are corrected: an event page shows only an album's first video, the three
  switches are locked for members and not hidden, the homepage's buttons can be
  changed in Studio, and an edition's form has an All fields tab. Steps that
  carried several actions are split, terms are explained where they first
  appear, and Add to another list is new because Missing content sends members
  to lists the guide gave no steps for.
- The browser tests caught one more: an address beginning `www.` inside its own
  link is linked a second time by the Markdown renderer, which leaves the outer
  link empty. The visible address has no `www.`; the bare name redirects.

### Still open

- The seven screenshots above.
- A walkthrough by a member with an Editor account: add an event, an album and a
  person, and clear one Missing content item, keeping the work as drafts.
- Chromatic's new baseline for the ReadingGuide story is the owner's to accept.
- The QA pass on `feat/qa-pass` shows two videos on an event page. When it
  merges, the note under Add a video, which says the first video, follows.
- The Role box on a person suggested "Head teacher", which `CONTEXT.md` asks us
  to avoid. Pull request 50 replaces the example and holds the Studio's words to
  the rule; it merges on its own.

Suggested skills: `oy-voice` and `humanize-writing` for the words,
`oy-component` for the layout.

## The first guide (30 September 2026)

Kept as the record of the first version. The section above replaces what this
one says about the title, the eight screenshots, the larger preview image and To
do.

The owner's member guide now has eight task screenshots and an embedded Studio
**Member guide** tab. The source is `docs/content-ops.md`, written in a concise,
friendly tone for members using the current Studio labels.

The guide covers page forms, events, albums, people, To do, drafts, previewing,
publishing, photo permission and help. Its instructions were checked against the
Studio structure, templates, schemas and To do implementation. Roles and gallery
visibility follow ADRs 0042 and 0043; news is absent under ADR 0048.

The screenshots in `docs/screenshots/member-guide/` were captured from production
on 30 September with the existing administrator account. They show event
navigation, an edition form, photo details, People, To do, Programs page/list
choices, album controls, and Presentation with publishing controls. Captures
exclude account controls and administrator-only navigation. The photograph in
the photo details image is credited to Red Carpet Films. The preview's Publish
button is actually disabled; no content was changed to capture it.

Astro renders the Markdown at `/member-guide`, with noindex metadata. The new
`@oy/ui` ReadingGuide component provides task links, token-based type and spacing,
keyboard focus and a reading column. Screenshot URLs redirect to Vite's imported
JPEG assets, so the files stay beside the document. Plain HTML images in Markdown
retain their dimensions and lazy loading without requiring Sharp. The base URL
keeps relative image links working with either trailing-slash spelling. Links to
Studio and the larger preview image open a new tab, preserving the guide view.

`createStudioConfig` adds the tool for members and administrators in the embedded
Studio. The standalone CLI Studio omits it because it has no Astro guide route.
Vision remains administrator-only. No schema, stored content, permissions or
service configuration changed. No dependency was added.

Validation: `bun check` passed 1,047 tests, type checks, lint and toolchain
pins. `bun run build` and the Storybook build passed. Browser checks confirmed
that the guide fills the Studio tool panel, section links work inside it, and
375px reading has no horizontal overflow. The original-size screenshot route
loads a JPEG. All six dedicated guide browser tests passed at 375 and 1440,
including axe, keyboard navigation, all eight screenshots, trailing-slash links
and unknown-image 404 responses. Storybook's accessibility panel reported zero
violations, 16 passes and zero inconclusive checks.

### Standards review

One P3 finding: task headings used the smaller H3 scale. Changed them to the H2
token and the title to the hero token. No other standards or smell findings.

### Spec review

No actionable findings or scope expansion. The pending Editor-account walkthrough
is a usability evidence limitation, recorded below.

An Editor-account walkthrough remains: one member should use the guide to add
an event, album and person and clear a To do item. Keep test work as drafts until
the owner approves publishing. This guide is not a completed usability test.
Chromatic visual acceptance is also the owner's step after CI publishes it.

The new component is documented here because `docs/design/` is a read-only
reference. Existing local changes in `handoff-pr-21-ci.md` were preserved and
will stay outside this change.

Implementation sources: [Sanity custom tools](https://www.sanity.io/docs/studio/custom-studio-tool),
[Astro Markdown](https://docs.astro.build/en/guides/markdown-content/) and
[Astro images](https://docs.astro.build/en/guides/images/).

Suggested skills: humanize-writing and oy-voice for copy changes, oy-content-ops
for the member walkthrough, and oy-component for future display changes.

### Merge and production verification

The owner authorized merging PR 22 after the checks were green. All ten PR
checks and the Vercel preview status passed for `df831ba4d0d6ee91f4ea569236903a714e2139e8`.
PR 22 was squash-merged on 1 October at 00:26 UTC (30 September locally), as
`0b2d9a0564b039990f940fbbd7cd901ef3476bfd`.

Production deployment `dpl_C8KUJPj26AymKreftSwxAjWwW6Tg` is READY for that commit.
It serves the production aliases, including `omoyorubasocal.org` and
`omo-yoruba-khaki.vercel.app`. Opened the latter's live Studio with the existing
administrator session and verified the Member guide tab, section navigation
inside its frame, and successful loading of all eight screenshots. The guide
is available at `/admin/member-guide`. No migration or schema command is needed.

Local main was fast-forwarded to the merge. The existing changes to
`handoff-pr-21-ci.md` were preserved. This deployment note is saved locally.
