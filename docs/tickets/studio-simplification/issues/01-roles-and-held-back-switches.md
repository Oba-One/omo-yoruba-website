# 01: Roles: what members and administrators see

Labels: infra
Status: resolved
Blocked by: none

**What to build:** S4 and S10 (spec Q1, Q2, Q13). Members are Editors; administrators keep site settings, the Inbox, the Vision tool and the three held-back switches. Nothing stored changes.

- [x] `studio/roles.ts`: `isAdministrator` on `userHasRole`, `forMembers`, the administrator-only tools and documents (`ADMIN_ONLY_TYPES`) and the held-back pages
- [x] The Vision tool for administrators only (a `tools` resolver); Content Releases, scheduled drafts and scheduled publishing switched off
- [x] Site settings and the News page hidden from members' Pages; the 11 settings rows out of their Pending view
- [x] Site settings, the News page, enquiries and subscribers read-only for members; enquiries and subscribers out of search
- [x] Lint reports: no actions for members, Delete only for administrators
- [x] The three held-back switches read-only for members, each describing why; no Restore on their pages for members
- [x] A structure test for an administrator and an editor
- [x] `bun check` green; Playwright unchanged in both data modes

## Comments

26 September 2026. Built on `studio/simplify`. The code review changed three things: one table in `studio/roles.ts` (`ADMIN_ONLY_TYPES`) now drives the sidebar, the to-do rows, the wording to check, the actions and the read-only documents, and it adds the News page; members lose Restore on the gallery, Our Story and Gala pages, since an old version could flip a held-back switch; and scheduled drafts and scheduled publishing are off beside Content Releases. The layout flag is `heldBack`, and the builder adds "Only an administrator changes it." to the switch's help. The locks shape the Studio only: through the API an Editor can still change any document (ADR 0042, consequences). Members can still unpublish a page, as before; that question is in the pull request. Checks at the part 4 pull request: `bun run test` 147 files and 898 tests, typecheck clean, `bun typegen` no diff, `bun run build` green; Playwright with `--workers=1` seeded 281 passed and 11 skipped, placeholder 254 passed and 38 skipped, both equal to `main`.
