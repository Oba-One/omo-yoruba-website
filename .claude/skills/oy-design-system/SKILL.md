---
name: oy-design-system
description: The site's visual rules. Use for any styling work, a new component or page treatment, a colour, type, spacing, shape, motion or pattern question, dark bands, or the three themes.
---

# Omo Yorùbá design system

Source of truth: `docs/design/README.md` section 3 (the rules, restated in `CLAUDE.md`),
then the CSS in `docs/design/design/_ds/*/tokens/`, `css/base.css`, `css/components.css`,
and `docs/design/design/oy-components.css`, which wins on conflict. Ported into
`packages/tokens` in Phase 1; after that, read the tokens there.

## Colour roles

- Indigo is the ground, 60 to 70 percent of visual weight: `--indigo-900`, `--indigo-700`,
  `--indigo-100` tint. Grounds: white default, `--paper` warm alternate.
- Gold (`--gold-500`, hover `--gold-600`, `--gold-300` on dark) is for actions and
  celebration only. One gold primary action per screen view. Never body text on light.
- Terracotta (`--terra-600`, `--terra-700`) warms kickers, link hover and festival moments.
- Green (`--green-600`, `--accent-sustain`) stays inside Cultural Collective content.
- Semantic tokens over raw ones: `--text-heading`, `--text-body`, `--text-muted`, `--link`,
  `--link-hover`, `--accent-action`, `--accent-kicker`, `--border-soft`, `--focus-ring`,
  `--surface-*`. No hex or rgb literal outside `packages/tokens` (`bun lint:colors`).

## Type and space

- Source Serif 4 for headings (600, 700), Source Sans 3 for body and UI (400, 600, 700),
  falling back through Noto Serif and Noto Sans, then Georgia and system-ui.
- Scale tokens: `--text-hero`, `--text-h2`, `--text-h3`, `--text-h4`, `--text-body-size`
  (17px), `--text-small`, `--text-caption`, `--text-kicker` (12px, uppercase, `--track-kicker`
  0.15em, bold), `--text-stat`. Line-height `--leading-heading` 1.15, `--leading-body` 1.6.
- 8px grid: `--space-1` to `--space-8`, `--section-pad`, `--content-width` 1100px,
  `--gutter`, `--touch-target` 44px.

## Shape

- Cards: 6px radius (the `--radius-card` 14px token is overridden by `oy-components.css`),
  paper ground, indigo hairline, 8px aṣọ òkè top edge, grain-dots texture from
  `data-card="grain-dots"` on the page root. Square image containers.
- Buttons and inputs full-round (`--radius-pill`, `--radius-field` 999px).
- No drop shadows on rest or hover; the `--shadow-*` tokens are for menus only.

## Motion and states

- No hover lift anywhere. Buttons darken (gold) or fill (secondary outline fills indigo) and
  settle 1.5% on press. Cards deepen their border, title warms to terracotta, the arrow
  slides, a 2px aṣọ òkè rule draws under the action. Photos never zoom.
- Transitions 0.15 to 0.22s ease. The only page-level motion is the 380ms cross-fade,
  off under `prefers-reduced-motion`; the hero photo may breathe when the option is on.
- Focus: 2px outline, offset 2px, `--focus-ring` (indigo on light, gold-300 in dark scope).

## Pattern

Texture, never costume: àdìrẹ dot fields (`--pattern-adire-*`, 8 to 12 percent on dark,
7 percent on light), aṣọ òkè stripes (`--pattern-asoke`, two to four uneven bands, never
pinstripes), ayo dot rows for playful punctuation. SVGs in `docs/design/design/images/patterns`.
Never kente, never Adinkra, no drawn people or objects, no icon font: glyphs are • → ✓ ×.

## Dark scope and themes

- Wrap dark bands in `.oy-dark`: headings go white, body to `--text-on-dark-soft`, links and
  the focus ring to gold-300, kickers to `--accent-kicker-on-dark`.
- `data-theme` on `body`: `adire` (default), `calm`, `festival`. Themes only move
  `--hero-surface`, `--band-surface`, texture opacity, `--section-alt-surface` and
  `--theme-hero-scale`. The Studio `siteSettings.theme` field sets it.

## Elder test

WCAG AA in every state, 17px minimum body, 44px minimum targets, scrim or solid panel under
any text on a photo.
