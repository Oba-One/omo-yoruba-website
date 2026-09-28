# @oy/lint

The voice and colour checks generic tools cannot do for this repo, and the two word lists they
share. The command line runs the em dash, Yoruba diacritics and colour checks in the git hooks and
in CI. The Studio's validation and the `content-lint` function import the em dash, diacritics and
sentence case checks with the same lists (ADR 0010). A finding is an error in the repo. In the Studio
an em dash is an error that blocks publishing; missing marks and sentence case are warnings.

## What lives where

- `src/cli.ts`: the command line, with the checks `dash`, `yoruba`, `colors` and `all`, and
  `commit-msg` for the commit message hook.
- `src/em-dash.ts`, `src/yoruba.ts`, `src/sentence-case.ts`, `src/color-literals.ts`: the pure
  checks, imported by subpath (`@oy/lint/em-dash` and the others in `package.json`).
- `yoruba-terms.json`: the word list, each bare Yoruba form with its marked form.
- `proper-nouns.json`: the names the sentence case check ignores.
- `.lintignore` at the repo root: the files a check skips, one glob per line, limited to one check
  by a `[dash]`, `[yoruba]` or `[colors]` prefix. `src/files.ts` reads it.

## What each check catches

- `dash`: every em dash, and an en dash unless it sits between two digits.
- `yoruba`: a bare form from the word list where its marks belong. Some terms count only in prose,
  not in identifiers, keys or attribute values.
- `colors`: hex values, colour functions such as `rgb()`, and named colours, in `packages/ui` and
  `packages/web`. Colours belong in `@oy/tokens`.

## Commands

From the repo root. Each check takes file paths, which is how the pre-commit hook passes the staged
files; with none, it scans every file git knows.

| Command | Does |
| --- | --- |
| `bun lint` | Biome, then all three checks |
| `bun lint:dash`, `bun lint:yoruba`, `bun lint:colors` | one check |
| `bun run --filter @oy/lint test` | this package's tests |

## Rules that matter most here

- One word list: a Yoruba word goes into `yoruba-terms.json` once, and everything else imports it.
  Never copy the list.
- Exemptions go in `.lintignore`, never in code (ADR 0010).

The rules and their exemptions come from `docs/design/QUALITY.md` section 1. The wider copy glossary
is in the `oy-voice` skill.
