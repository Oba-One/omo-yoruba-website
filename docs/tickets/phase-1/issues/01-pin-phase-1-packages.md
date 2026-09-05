# 01: Pin the Phase 1 packages after verifying them against primary docs

Labels: infra
Status: resolved
Blocked by: none

**What to build:** the exact versions of `@storybook-astro/framework`, `storybook`,
`@storybook/builder-vite`, `@storybook/addon-a11y`, `@storybook/addon-docs`, `chromatic`, the
`chromaui/action` commit SHA and the fontsource packages for Source Serif 4 and Source Sans 3,
each checked against the docs or source that owns it before anything is added to a manifest.
The findings answer wayfinder ticket 19 (font provider and subsets) and record what the Storybook
framework stubs or cannot render, so the checkpoint report is grounded.




- [x] `docs/research/phase-1-storybook-chromatic.md` cites primary sources for every pin, the
      story file API (slots, play functions, portable stories), the manager theming import path,
      the backgrounds and a11y configuration, the Chromatic action inputs and the tag plus SHA
- [x] `docs/research/fonts-source-serif-sans-subsets.md` verifies glyph coverage and mark
      positioning for the test string, lists the unicode ranges per subset, and names the exact
      fontsource files to load
- [x] Every pin is exact (`bunfig.toml` sets `exact = true`) and matches the research notes
- [x] Wayfinder ticket 19 gets its answer under `## Answer` with a pointer from the map
