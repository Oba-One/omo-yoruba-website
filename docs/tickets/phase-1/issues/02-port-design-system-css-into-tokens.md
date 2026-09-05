# 02: Port the design system CSS into @oy/tokens

Labels: design
Status: resolved
Blocked by: none

**What to build:** importing `@oy/tokens` from any page or story loads the whole design system in
the agreed order: tokens (colours, typography, spacing, patterns, themes), base, the component
classes, then the interaction layer on top so its decisions win on conflict (6px card radius, no
hover lift, grain-dots card texture, border deepening on hover, no photo zoom). The five pattern
SVGs ship inside the package and are reachable as tokens, so no CSS points back into
`docs/design`. Canvas-only helpers and the retired components (amount selector, multi-step form)
are left out and the omission is written down.




- [x] `@oy/tokens` exports `index.css` with the import order tokens, base, components, interaction
      layer; each ported file names its source and any edit at the top
- [x] `--radius-card` resolves to 6px and `--radius-media` to 4px everywhere, not only inside
      `.oy-home`
- [x] The five pattern SVGs live in the package and are referenced through `--pattern-*` tokens
- [x] `bun lint` passes on the package (Biome, em dash, Yoruba, no colour literal outside tokens)
- [x] A unit test guards the import order and the presence of the pattern files
- [x] The tokens README describes the layers and the deliberate omissions
