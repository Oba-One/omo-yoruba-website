# Open PR merge pass, 10 October 2026

All seven PRs are merged: 32, 33, 34, 35, 36, 39 and 40. No open PRs remain.
Local main is updated to `216452d`. Content publication and a Sanity schema
deployment were not part of this merge pass; they remain separately authorized
follow-up work.

## Current outcome

- PR 34, the sponsor-level phone layout, merged as
  `1571397e03b90652ab5a8410e14094df56962b23`.
- PR 35, the pre-meeting tracking update, merged as
  `135b2db65b9141eb2fce56d44d08c75d8974b794`. Its production deployment
  `dpl_DgNqCDxyjfCVoGWTpTMmUJ8YfDYe` is READY and serves the public aliases.
- PR 33 merged at `8b23e3dc77438dd25ec950791e160296b46d0df3`, including
  the reviewed photograph-credit selector repair. All ten checks and Vercel
  passed at `27caa88`. Production deployment `dpl_Ecr4QvfWGSUP6c5a9rauPTpjBhHY`
  is READY for the merge. The first repair push missed a Biome line wrap; the
  formatting-only correction was checked locally before the final push.
- PR 36 merged as `9106c243c8db7af37b368b28bdcef4d22441f8fc` after all
  ten checks and Vercel passed at `651b6db`.
- PR 39 merged at `acbd6aacd5e81e89d499ee37276241c2ad747b68` after all ten
  checks and Vercel passed at `261548e`. Content activation and schema deployment
  remain after the merge.
- PR 40 uses ADR 0052 and merged as `9b6e4f71f54bfa89f38eb3c177cee73dda89e1c6`
  after all ten checks and Vercel passed at `0352231`. The reviewed integration
  preserved both features and the last main update changed no file content.
- PR 32's crowned Ifẹ̀ head on indigo is approved. Its only conflict was in
  `open-work.md`; current main's decisions were preserved, and D7, E3, ticket
  32 and Wayfinder now record the owner's confirmation. Both review axes passed.
  The approved image bytes are unchanged. `bun run check` passes 1,193 tests,
  and the desktop and phone icon checks both pass. All ten checks and Vercel
  passed at `74d241d`; PR 32 merged at
  `216452d3a0657bd32bf70be8bc3f7a8053b4c01f`.

The open-PR list was checked again after the favicon merge and is empty.
Local main is fast-forwarded to `216452d`.

Production deployment `dpl_5xQTQBNdQCYF767TnGdQQQuHPr2k` is READY for that exact
commit and serves `www.omoyorubasocal.org` and the existing production aliases.
The homepage, Gala, Odunde and Gallery routes returned HTTP 200 and link both
icons. The live `favicon.ico` and `apple-touch-icon.png` returned as images, and
their bytes match the approved files. No content was published and no Sanity
schema deployment command was run.

Each PR is attached to this chat. The GitHub connector reads PRs but its merge
endpoint returns 403, `Resource not accessible by integration`. The authenticated
local `gh` CLI can merge. Default sandbox network calls to `gh` are denied, so
the reviewed escalated command is needed. Do not bypass branch protection:
after each merge, the next PR becomes behind and must be updated and checked.

Automatic approval review initially rejected PR 33's merge using stale evidence
that Playwright was still running. A separate live GitHub read and a fresh check
tool read confirmed CLEAN and all checks completed successfully. The reviewed
retry succeeded without changing the merge method or bypassing protection.

## Review and local verification

The repository's Matt Pocock code-review skill was found in the local Claude
plugin cache. Separate Standards and Spec agents reviewed all seven PR diffs
against `5468627fc276fa401cc70edaa24e8bb634088a79` and the repairs.

Standards: zero standalone feature blockers, two integration issues, and one
optional naming observation (`sold` in TicketTiers). The initial Spec review
left the favicon choice open; the owner has since confirmed it. R136 remains open for
content pins outside albums. The integration repairs are:

- Keep videos as ADR 0051 and renumber the ticket dialog to ADR 0052, including
  references. The renamed ADR body is unchanged.
- Select photograph credits directly under `.oy-section-inner` in the Gala and
  Odunde specs. VideoGrid adds nested credit lines, which made singular assertions
  ambiguous. Both review axes approved this repair. A Chromium fixture with
  linked photograph and video credits confirms the repaired selector finds one
  photograph credit while the original finds two links.

The combined six code-complete PRs were assembled in a private temporary
checkout. Typechecking and lint passed. Unit tests passed 1,193 tests in 163 files;
the web build, Storybook build, TypeGen without drift, and toolchain pins passed.
Focused browser checks: 88 passed, 11 skipped for missing content, one flaky
album test passed on retry. Videos and tickets are not activated in placeholder
mode. The initial sandbox unit run could not bind loopback; rerunning with
reviewed local access passed.

The sponsor-level width check also passed on the public site in both desktop
and mobile projects, after PR 34's production deployment.

Cached Modern Web Guidance 0.0.193 was used for the native dialog review. Its
search command attempted a blocked network request, so the applicable cached
guide was read directly; no online refresh was performed.

## Workspace and follow-up

The owner's existing edits to `handoff-member-guide.md`, `handoff-pr-21-ci.md`,
and untracked `handoff-arts-internship-grant.md` are preserved. Application work
and dependency installs are in temporary checkouts, not the owner's checkout.
SHA-256 checks confirm all three existing files are unchanged after the local
fast-forward. This handoff is saved locally and is not committed.

After the video merge, follow PR 39's schema deployment instructions before
adding its videos. After the ticket merge, set the Gala edition's ticket link
and update the Studio's seats introduction so it no longer promises Eventbrite.
Do not treat these as completed content operations. The owner has not authorized
content publication in this merge request.

Suggested skills: pragmatic-programming and the repository code-review skill
for remaining code review, agent-instructions for continuation notes,
humanize-writing for prose, deployments-cicd for production inspection,
oy-content-ops and oy-content-model for separately authorized Sanity work.
