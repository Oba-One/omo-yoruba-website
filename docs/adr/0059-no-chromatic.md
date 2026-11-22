# No Chromatic: Storybook is built on every pull request and reviewed by eye

Accepted 21 November 2026. Asked whether to set the Chromatic token or drop the service, the owner
answered "Drop Chromatic". The repository has never held the token, so Chromatic never ran: the old
`Storybook build and Chromatic` job skipped its publish step with a green tick on every pull request
since September.

Amends ADR 0008 (Storybook adopts the design system and is deployed), which had CI publish each pull
request's Storybook to Chromatic at 375 and 1440.

## Decision

- CI keeps the `Storybook build` job, so a story that no longer builds fails the pull request. There is
  no `Chromatic` job, no artifact hand-off, and no `CHROMATIC_PROJECT_TOKEN` secret; the setup wizard no
  longer asks for one.
- A visual change is reviewed in Storybook at 375 and 1440 (`oy-component`) and, when a page shows it,
  through the pull request's captures at 375 and 1280 (`verify-omo-yoruba`, the PR template).
- The stories keep their `chromatic` parameters (`modes`, `ignoreSelectors`). They do nothing without the
  service and cost nothing, and they make bringing it back a matter of the token and the job.

## Consequences

- No visual regression is caught automatically: a change that moves a component's look passes CI unless
  a story stops building or a Playwright or axe check notices.
- `requiredChecks` in `.agents/merge-policy.json` lists eight jobs, and the classic protection on `main`
  swaps `Storybook build and Chromatic` for `Storybook build` (runbook, Branch protection).
- Bringing Chromatic back: restore the `chromatic` job from the history of pull request 58, add the token
  as a repository and a Dependabot secret, and add `Chromatic` to `requiredChecks`.
