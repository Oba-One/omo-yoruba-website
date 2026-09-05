# 09: Storybook build and Chromatic as the fifth CI job

Labels: infra
Status: resolved
Blocked by: 04

**What to build:** every pull request builds the Storybook and, when the `CHROMATIC_PROJECT_TOKEN`
secret exists (stage 6 of `scripts/setup-wizard.sh`), publishes it to Chromatic with snapshots at
375 and 1440. When the secret is absent the job says so in its log and summary and finishes green
instead of failing, so the job can be a required check before the wizard has run. The action is
pinned to a commit SHA like the others. The owner learns which job name to add to the branch
protection.




- [x] `.github/workflows/ci.yml` has a fifth job that is not path filtered and builds
      `packages/ui/storybook-static`
- [x] The Chromatic step is skipped with a visible notice when the secret is empty (also on
      pull requests from forks)
- [x] `chromaui/action` is pinned to a commit SHA with the version in a comment, verified in
      ticket 01
- [x] Chromatic modes snapshot at 375 and 1440 (configured in the preview; the first run needs the secret)
- [x] `packages/ui/vercel.json` pins the Storybook deploy (Root Directory `packages/ui`, output
      `storybook-static`), pending the owner's hosting call in wayfinder ticket 11
- [x] `docs/runbook.md` names the job to add to the required checks
