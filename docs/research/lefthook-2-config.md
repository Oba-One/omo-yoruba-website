# lefthook 2 configuration

Date: 4 September 2026. Sources: https://lefthook.dev/configuration/index.html and the
project changelog at https://github.com/evilmartians/lefthook/blob/master/CHANGELOG.md
(2.0.0 entry). Verified locally with `lefthook validate` and `lefthook dump` on 2.1.12.

- 2.0.0 breaking changes: `exclude` takes globs only (no regexp), `skip_output` is
  removed in favour of `output`, some CLI flags were renamed, and `only` and `skip`
  command values run under the Bourne shell (also on Windows).
- `commands` and `scripts` still work; `jobs` (introduced in 1.10) is the current syntax
  and what `lefthook.yml` uses. A job has `name`, `run`, `glob`, `stage_fixed`, `skip`,
  `only`, `tags`, `env`, and `group` with `parallel` or `piped` sub-jobs. Placeholders:
  `{staged_files}`, `{push_files}`, `{all_files}`; the commit-msg hook receives the
  message file path as `{1}`.
- Installed by the root `prepare` script (`lefthook install`), which `bun install` runs.
  `LEFTHOOK=0` skips hooks for one command.

How `lefthook.yml` maps to `docs/design/QUALITY.md` section 4: pre-commit runs Biome
(write and re-stage), the em dash, Yoruba and colour checks on staged files, then
`bun run typecheck` and `vitest related` when TypeScript or Astro files are staged, all
in parallel; pre-push runs `bun run check`; commit-msg rejects non-conventional subjects
and any em or en dash. "Typecheck of touched packages" is approximated by running the
whole typecheck, which takes seconds at this size.
