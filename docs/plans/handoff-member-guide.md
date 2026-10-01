# Member guide

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

## Standards review

One P3 finding: task headings used the smaller H3 scale. Changed them to the H2
token and the title to the hero token. No other standards or smell findings.

## Spec review

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
