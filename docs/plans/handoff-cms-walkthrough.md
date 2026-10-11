# CMS walkthrough handoff

The signed-in administrator walkthrough is complete. Use the
[review and editing paths](../research/cms-walkthrough-2026-10-11.md) for the
verified behavior and remaining recommendations. The user asked for a walkthrough
and review, not a new Inbox implementation or email delivery test.

## Completed

- Used the user-authenticated Brave tab at the canonical `/admin` host.
- Gala page introduction: temporary punctuation edit, draft autosave, visible
  Presentation update, restoration and cleanup of the test-created draft.
- Ticket tier: `$100` to `$100.00`, visible draft page update, restoration and
  cleanup of the test-created draft. Published pricing stayed `$100`.
- Gala 2025 photo: temporary caption punctuation edit, autosave and album photo
  viewer preview, then exact restoration. Crop/hotspot controls rendered; no crop
  or asset changes. Existing 53-photo draft preserved; published album has 35.
- Compared whole affected documents through the Sanity MCP before and after.
  Published revisions unchanged; draft content identical apart from system metadata.
- Inspected Inbox and To do in the signed-in UI. Four enquiries are labeled as
  automated test records; all remain unhandled with no notification result.
- Confirmed both datasets are private. No personal enquiry contents were saved
  to the report or screenshots.
- Saved screenshots under `docs/screenshots/cms-walkthrough/`.
- The live `/gala#tickets` dialog loaded Zeffy's General Admission at $100 with
  the confirmed time and venue. No ticket was selected or purchased.

## Findings for follow-up

- Project `qsya7q8x`, dataset `development`, schema `_.schemas.omo-yoruba`.
- No Sanity Blueprint stacks are deployed. The verified read-only commands were:
  `bun run --filter @oy/content sanity -- blueprints stacks --project-id qsya7q8x --json`
  and the organization-scoped `blueprints stacks --include-projects` check.
  Run outside the filesystem sandbox when its network proxy returns fetch failed;
  the existing CLI login works. Do not reinitialize authentication just because
  the sandbox request failed.
- D16 still needs function provisioning, Resend configuration and an authorized
  delivery test. Read `docs/runbook.md`, Functions. Do not replay old test records
  or send email merely to verify a review finding.
- All eight routing contact emails and response lines are empty. Current fallback
  is the organization's general email. The Inbox currently has Handled and Notes
  with the ordinary Publish action, not a reply composer.
- Vision is query-only and administrator-only. Recommend development-only access.
- To do has 12 groups / 86 field matches plus 7 Still to add categories. Counts
  match the shipped `pending.ts` registry, with drafts taking precedence. The
  report proposes fewer navigation layers and clearer priorities.
- A separate member Editor-account walkthrough, new file upload, publishing and
  email delivery were not exercised. The prior simplification's unit/CI and public
  browser proof are recorded in `handoff-cms-simplification.md`.

## Workspace and authorization

Main remains at `b5bc0eaa83cb760831697d2ffddb0588c90b7c5e`.
This task changes documentation and screenshots only; no commit or deployment.
The four changed documentation files passed the repository's targeted prose
lints, and `git diff --check` passed. No application tests were rerun because
application code did not change; the live browser and data checks are above.
Preserve all earlier local handoff and open-work edits. The temporary Gala page
and ticket drafts are gone. Do not discard `drafts.album-gala-2025`: it contains
pre-existing work.

The signed-in CMS tab was left on the Gala page editor. Do not assume browser
handles survive a later session; rediscover the tab through the documented browser
API. Apply content-operations guidance before any further stored-content writes.
