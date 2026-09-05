# Biome and .astro files

Date: 4 September 2026. Sources: https://biomejs.dev/internals/language-support/ and
https://biomejs.dev/reference/configuration/.

- Astro, Vue and Svelte are marked experimental for parsing, formatting and linting.
  Without `html.experimentalFullSupportEnabled`, Biome handles the frontmatter script of
  a `.astro` file only, and its docs recommend switching off `useConst`, `useImportType`,
  `noUnusedVariables` and `noUnusedImports` for those files to avoid false positives.
  `biome.json` does that in an `overrides` entry.
- Full HTML support (`html.experimentalFullSupportEnabled: true`, `html.formatter.enabled`)
  is experimental as of 2.5. Not enabled: the template side of `.astro` files is
  type-checked by `astro check`, which the brief already requires.
- `linter.rules.recommended` is deprecated in 2.5; `linter.rules.preset: "recommended"`
  replaces it (`biome migrate --write` did the rewrite).
- CSS and JSON are fully supported, so Biome covers TS, JSON and CSS as
  `docs/design/QUALITY.md` section 1 asks. `eslint-plugin-astro` is not added: one tool,
  as the brief prefers, with `astro check` covering templates.
- `files.includes` uses negated globs (`!**/dist`). `docs/design/**` is excluded so the
  vendored handoff stays verbatim. `vcs.useIgnoreFile: true` honours `.gitignore`.
