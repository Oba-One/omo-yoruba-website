# @oy/tokens

Design tokens, base styles, component CSS, fonts and pattern SVGs: the design handoff's CSS,
ported in Phase 1 and loaded with one import, `@oy/tokens` (`src/index.css`). Every colour on
the site comes from here: `packages/ui` and `packages/web` use `var(--*)` only, checked by
`bun lint:colors`.

## Layers, in load order

| File | Source | Edits in the port |
| --- | --- | --- |
| `src/fonts.css` | `_ds/.../tokens/fonts.css` | Self-hosted `@font-face` rules from the pinned fontsource packages instead of the Google Fonts import (`docs/research/fonts-source-serif-sans-subsets.md`); Source Serif 4 from the weight-only files, and the OY Yoruba faces first in both stacks for Ń ń Ǹ ǹ Ḿ ḿ Ṣ ṣ, cut into `src/fonts/` by `scripts/make-yoruba-subsets.sh` with `OFL.txt` beside them (ADR 0026) |
| `src/tokens/colors.css`, `typography.css`, `themes.css` | `_ds/.../tokens/` | Verbatim, plus two Phase 4 additions: `--text-muted-on-tint` (colors) and `--text-hero-photo` (typography, the homepage prototype's hero scale) |
| `src/tokens/spacing.css` | `_ds/.../tokens/spacing.css` | `--radius-card` 6px and `--radius-media` 4px: the interaction layer wins (`docs/design/README.md` section 3) |
| `src/tokens/patterns.css` | `_ds/.../tokens/patterns.css` | Adds `--pattern-chevron-band`, `--pattern-motif-band`, `--pattern-batik-wash`, `--pattern-ornament-divider`, `--pattern-sun-crest` pointing at `src/patterns/` |
| `src/base.css` | `_ds/.../css/base.css` | Verbatim: reset, type defaults, the `.oy-dark` scope, layout primitives |
| `src/components.css` | `_ds/.../css/components.css` | Verbatim: the base `.oy-*` classes (its hover lift and shadows are overridden below) |
| `src/oy-components.css` | `docs/design/design/oy-components.css` | Pattern urls through the tokens; canvas-only helpers (`.cx-cardlab`, `.sc-host`) dropped; the retired AmountSelector and MultiStepForm blocks left out; Phase 5: a chip inside a fact row keeps its type, the four-zone mosaic keeps its columns under 820px, the Pending chip has 16px corners, and the Gala page's style block (the warm treatment and the `.oy-seam`) is ported to the end with a vertical warm scrim under 760px (ADR 0028) |

`_ds/...` is `docs/design/design/_ds/omo-yor-b-design-system-feb77d94-d2e7-43f8-9f12-b869c74d646d`.
The originals stay under `docs/design/design/` as the reference; change the port here, not there.

Conflict noted, not resolved: `typography.css` sets `--text-hero` to `clamp(38px, 5.4vw, 60px)` and
`--text-h2` to `clamp(30px, 3.4vw, 38px)` (verbatim), while `AGENTS.md` and the brief say hero 44
to 64px and H2 32 to 40. The port keeps the design system's values because the prototypes the
owner reviewed render with them; raising the floors is an owner call (Phase 1 handoff). Since
Phase 4 the homepage's photo hero uses `--text-hero-photo`, `clamp(34px, 4.8vw, 56px)`, the value
`02 Homepage.dc.html` sets inline: 34px on a phone, lower still than the generic floor, followed at
the owner's request for alignment with the prototype and recorded in ADR 0023 as the same open
owner call.

## Using it

- Site: import `@oy/tokens` once in the layout. Storybook: `packages/ui/.storybook/preview.ts`.
- One file: `@oy/tokens/tokens/colors.css`, `@oy/tokens/fonts.css`, and so on.
- A pattern SVG: `@oy/tokens/patterns/chevron-band.svg`, or the `--pattern-*` token in CSS.
- Dark bands: wrap in `.oy-dark`. Card texture: `data-card="grain-dots"` on the page root.

## Checks

`src/index.test.ts` guards the import order, that every `@import` and pattern `url()` resolves
inside the package, the 6px radius, the no-lift overrides and the omissions above. Biome's
`noDescendingSpecificity` and `noImportantStyles` are off for `src/**/*.css` (the design system's
cascade order and its reduced-motion rules are deliberate) and the vendored SVGs are not linted;
both exemptions live in `biome.json`.
