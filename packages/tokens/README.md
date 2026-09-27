# @oy/tokens

The design system as CSS: the tokens, the base styles, the component classes, the fonts and the
pattern SVGs, ported from the design handoff and loaded with one import, `@oy/tokens`
(`src/index.css`). Every colour on the site comes from here: `packages/ui` and `packages/web` use
`var(--*)` only, and `bun lint:colors` checks it.

## Using it

- The site's layout imports `@oy/tokens` once; Storybook imports it in
  `packages/ui/.storybook/preview.ts`.
- One file on its own: `@oy/tokens/tokens/colors.css`, `@oy/tokens/fonts.css` and so on.
- A pattern: `@oy/tokens/patterns/chevron-band.svg`, or its `--pattern-*` token in CSS.
- Dark bands: wrap them in `.oy-dark`. Card texture: `data-card="grain-dots"` on the page root.

## The layers and what the port changed

`src/index.css` loads the layers in this order, and the last one wins on conflict. The originals
stay under `docs/design/design/` as the reference: change the port here, not there. Below, `_ds/...`
stands for `docs/design/design/_ds/omo-yor-b-design-system-feb77d94-d2e7-43f8-9f12-b869c74d646d`.

1. `src/fonts.css`: self-hosted `@font-face` rules from the pinned fontsource packages instead of
   the Google Fonts import (`docs/research/fonts-source-serif-sans-subsets.md`). Source Serif 4
   uses the weight-only files, and the OY Yoruba faces come first in both stacks for Ń ń Ǹ ǹ Ḿ ḿ
   Ṣ ṣ, cut into `src/fonts/` by `scripts/make-yoruba-subsets.sh`, with `OFL.txt` beside them
   (ADR 0026).
2. `src/tokens/colors.css` and `typography.css`: verbatim from `_ds/.../tokens/`,
   plus `--text-muted-on-tint`, `--text-hero-photo` (the homepage prototype's hero scale) and the
   Collective's tints and text green, `--green-50` to `--green-300` and `--green-700` (the
   prototype's literal greens).
3. `src/tokens/spacing.css`: `--radius-card` is 6px and `--radius-media` 4px, because the
   interaction layer wins (`docs/design/README.md` section 3).
4. `src/tokens/patterns.css`: adds `--pattern-chevron-band`, `--pattern-motif-band`,
   `--pattern-batik-wash`, `--pattern-ornament-divider` and `--pattern-sun-crest`, pointing at
   `src/patterns/`.
5. `src/tokens/themes.css`: verbatim from `_ds/.../tokens/`.
6. `src/base.css` and `src/components.css`: verbatim from `_ds/.../css/`: the reset, the type
   defaults, the `.oy-dark` scope, the layout primitives and the base `.oy-*` classes, whose hover
   lift and shadows the next layer overrides.
7. `src/oy-components.css`, the interaction layer from `docs/design/design/oy-components.css`.
   Pattern URLs go through the tokens. Left out: the canvas-only helpers (`.cx-cardlab`,
   `.sc-host`), the retired AmountSelector and MultiStepForm blocks, and the homepage hero's
   `.v2-cta--*` switch. Changed: a chip keeps its own type and colour in a fact row and its own box
   in a sponsor level's amount, the four-zone mosaic keeps its columns under 820px, and the Pending
   chip has 16px corners. Added: the Gala page's style block (the warm treatment and the
   `.oy-seam`), ported to the end of the file with a vertical warm scrim under 760px (ADR 0028); the
   chips on the enrol, member and updates rows, the program cards' when line, the chips in the year
   strip and a list row's date block; and the Collective's block under `[data-scope="collective"]`:
   the status and member-led pills, the strong option's grounds, the swatch and AA kickers
   (ADR 0031, ADR 0033).

The comments in each file name its edits too.

## An open owner call: the heading floors

`typography.css` keeps the design system's `--text-hero`, `clamp(38px, 5.4vw, 60px)`, and
`--text-h2`, `clamp(30px, 3.4vw, 38px)`, while AGENTS.md and the brief say hero 44 to 64px and H2
32 to 40. The port keeps the design system's values because the prototypes the owner reviewed
render with them; raising the floors is the owner's call (Phase 1 handoff). The homepage's photo
hero uses `--text-hero-photo`, `clamp(34px, 4.8vw, 56px)`, the value `02 Homepage.dc.html` sets
inline: 34px on a phone, lower still than the generic floor. The owner asked for it to match the
prototype, and it is the same open call (ADR 0023, wayfinder ticket 30).

## Checks

`src/index.test.ts` guards the import order, that every `@import` and pattern `url()` resolves
inside the package, the 6px radius, the no-lift overrides and the omissions above; `bun run test`
runs it. Biome's `noDescendingSpecificity` and `noImportantStyles` are off for `src/**/*.css`,
because the design system's cascade order and its reduced-motion rules are deliberate, and the
vendored SVGs are not linted. Both exemptions live in `biome.json`. The visual rules are in the
`oy-design-system` skill.
