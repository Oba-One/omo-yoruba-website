---
name: oy-component
description: How to add or change a component in @oy/ui. Use for new UI, a new variant or state, a Pending treatment, a story, a component test, or a Chromatic baseline.
---

# Adding or changing a component

Inventory and props: `docs/design/COMPONENT-MAP.md`. Visual reference: the component canvas
`docs/design/design/01 Components.dc.html` and the page where the part appears. Styling
rules: the `oy-design-system` skill.

## Files

`packages/ui/src/<group>/<Name>/` holds `<Name>.astro`, `<Name>.stories.ts`,
`<Name>.test.ts`, and `<Name>.css` only when the styles are long. Folders follow
`docs/design/README.md` section 5: core, page, cards, content (the map's lists and rows),
media, forms, navigation (SiteNav, SiteFooter, Logo) and bands (EventBand, TakePartBand,
PatternBand). The map's "Page structure" table splits across page, navigation and bands. One
component per folder, built once; a page needing a new treatment adds it here first.

## The .astro file

- Scoped `<style>` by default; colours through `var(--*)` only.
- Keep the `.oy-*` class vocabulary from the ported CSS so `@oy/tokens` styles apply and the
  prototypes stay readable side by side.
- Props: typed `interface Props`; images accept `ImageMetadata | string | SanityImageSource`
  and render `<Image>` when they can, a plain `<img>` in Storybook.
- A component that can be empty renders `<Pending what="..." />` (the design system
  placeholder: àdìrẹ fill, caption naming the missing item, fixed aspect ratio).
- Dark scope comes from a parent `.oy-dark`; no `dark` prop unless the canvas shows a
  distinct variant.
- No hover lift, no photo zoom; 44px minimum targets; every `<img>` has `alt`.
- Copy inside components follows the `oy-voice` skill; success copy and field specs come
  from `enquiry-kinds.ts`, never inline.

## Stories

Every story file exports `Default`, one story per variant, `Pending` (empty content) and
`OnDark` when the part appears in a dark band. Hover via `parameters.pseudo`. Interactive
components add a `play` function that drives the keyboard behaviour (menu, modal,
accordion, lightbox). Fixtures come from `packages/ui/src/fixtures/`: confirmed facts and
Pending states only, no mock names or prices. Kicker and Button stories render the
diacritics test string.

## Tests

`<Name>.test.ts` uses Vitest with portable stories (`composeStories`) for a render smoke test
plus the behaviour the play function exercises. Run `bun run test`.

## Done means

- Renders in Storybook with the theme; `addon-a11y` clean.
- Chromatic snapshot at 375 and 1440 accepted by the owner.
- `docs/design/COMPONENT-MAP.md` updated if props, variants or usage changed.
- If Storybook cannot render the component after a reasonable attempt, stop and ask the
  owner (ADR 0002). No silent pivot.
