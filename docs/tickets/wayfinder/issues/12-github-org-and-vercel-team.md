# GitHub org and repo name, Vercel team

Type: grilling
Status: resolved
Owner: yes
Labels: infra
Phase: 0
Blocked by: none

## Question

Which GitHub org or account hosts the repo, and under which name? Which Vercel team owns the projects? The setup wizard links Vercel and sets secrets against whatever remote the repo has.

## Comments

4 September 2026: the repo exists at https://github.com/Oba-One/omo-yoruba-website (public,
default branch main). Still open: the Vercel team, and whether to enable branch protection
(command in docs/runbook.md).

5 September 2026: branch protection on main requires the four CI jobs (docs/runbook.md).
Still open: the Vercel team.

27 September 2026. Resolved (open-work H2): the Vercel team was the last part still open. Ticket 17 no
longer waits on this one.

## Answer

Both are named. GitHub: the repository `Oba-One/omo-yoruba-website`, on the owner's personal account
(a user account, not an organization), public, default branch `main`, protected since 5 September 2026.
Vercel: the Greenpill Dev Guild team (`greenpilldevguild`), which holds the project `omo-yoruba`, created
on 11 September 2026 and linked to the repository (`docs/runbook.md`, Deploy). Checked on 27 September
2026 with `gh` and the team's Vercel project list.
