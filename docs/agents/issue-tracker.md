# Issue tracker: local Markdown under docs/tickets/

Issues, specs and plans for this repo live as Markdown files in `docs/tickets/`.
Single owner, no remote tracker. Chosen on 4 September 2026 (Phase 0).

**Being retired (21 November 2026).** The trust plan moves the open items to Linear once afo names
a team, then deletes `docs/tickets/` and `docs/plans/`. Closed tickets, finished plans, handoffs
and session prompts were deleted on 21 November (git history keeps them). What is left: the open
review tickets, the open wayfinder tickets with their map, the phase specs that ADRs cite, and
`docs/plans/open-work.md`. Until the move, add no new effort folder, plan or handoff; a session's
report goes in its pull request body. The `## Agent skills` block that points here lives in `AGENTS.md`.

## Conventions

- One effort per directory: `docs/tickets/<effort-slug>/`
- The spec, when there is one, is `docs/tickets/<effort-slug>/spec.md`
- Tickets are one file each at `docs/tickets/<effort-slug>/issues/<NN>-<slug>.md`,
  numbered from `01`, never a single combined file
- Near the top of each ticket: `Labels:`, `Status:` (`open`, `claimed`, `resolved`,
  `closed`), `Blocked by:` (ticket numbers), and for wayfinder tickets `Type:`
- Comments and conversation history append under a `## Comments` heading

## Labels

Five labels, used on the `Labels:` line, more than one allowed:

- `bug`: something built does not behave as its ticket or prototype says
- `content`: needs copy, facts, photos or a decision about content; often owner-owned
- `design`: a visual or interaction question the prototypes do not settle
- `infra`: tooling, CI, hosting, environment, dependencies
- `later`: consciously deferred; not for the current phase

The triage skill is not used in this repo (single owner), so there are no triage
role labels.

## When a skill says "publish to the issue tracker"

Until the move to Linear, add a file under `docs/tickets/review/issues/` (the next free number)
or `docs/tickets/wayfinder/issues/` for a decision. No new effort folders.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The owner will normally pass the path or
the ticket number directly.

## Wayfinding operations

Used by `/wayfinder`. The map is `docs/plans/wayfinder.md`; its child tickets
live in `docs/tickets/wayfinder/issues/`.

- **Map**: `docs/plans/wayfinder.md` (Destination, Notes, Decisions so far,
  Not yet specified, Out of scope).
- **Child ticket**: `docs/tickets/wayfinder/issues/NN-<slug>.md`, numbered from
  `01`, the question in the body. `Type:` records `research`, `prototype`,
  `grilling` or `task`; `Status:` records `open`, `claimed` or `resolved`.
- **Blocking**: a `Blocked by: NN, NN` line. A ticket is unblocked when every
  ticket it lists is `resolved`.
- **Frontier**: scan the issues directory for tickets that are open, unblocked
  and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under `## Answer`, set `Status: resolved`, then
  add a one-line pointer (gist plus link) to Decisions so far in the map.
- **Owner decisions**: a ticket with `Owner: yes` only resolves with the owner in
  the session. Never answer it on their behalf.
