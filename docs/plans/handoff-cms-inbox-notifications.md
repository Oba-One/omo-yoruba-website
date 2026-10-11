# CMS Inbox, notifications and missing content

11 October 2026. Work is isolated on `codex/cms-inbox-notifications` from
`b5bc0ea`. The owner's other session owns album updates and publication.

## Implemented and checked

- Inbox queues: New, In progress, Handled, Not emailed, Subscribers. Notes save
  automatically. Status actions and the reply link work without Publish.
- Missing content: one document task with expandable details, page filtering,
  next-event priority, draft labels and the same underlying Pending rules.
- Vision is available only to local administrators, omitted from deployments.
- Notifications: explicit retry, provider receipt, duplicate-send guard and
  revision-safe writes that preserve staff notes and overlapping attempts.
- Member guide, screenshot, runbook and ADR 0054 explain the workflow.

`bun typegen`, `bun check` (167 files, 1,215 tests), `bun run build`, and the
desktop/mobile enquiry and guide Playwright checks (24 tests) pass. Standards
and spec reviews found two retry issues; both were fixed and reviewed again.
No outstanding review blocker remains. The signed-in local walkthrough proved
Gala filtering and editor links, email intent routing, notes autosave, status
transitions and Inbox grouping. Notes/status changes did not send another email.

## Live email setup

The `website` Sanity Blueprint stack is `ST-ayekuuu8cz` in `qsya7q8x`, scoped to
the private `development` dataset. Both Functions are deployed. The Resend key
and `ENQUIRY_FROM` are configured in the Function environment. The sender is
`Omo Yorùbá website <forms@omoyorubasocal.org>`.

Resend domain `6abf256c-47ca-414e-9824-c8472b2fbe04` is verified. Cloudflare holds
the DKIM TXT and two DNS-only CNAMEs, plus a new monitoring DMARC record. Existing
website DNS records were preserved. No receiving service was enabled.

Exactly one owner-approved test was submitted through the public contact form:
enquiry `k7ZbACRkY4ac1LuB1KkxBU`, Resend email
`01a12a67-344e-7a96-b22b-7099829c5a01`, accepted at
`2026-10-11T09:59:27.776Z`. The Inbox test is left In progress with an explanatory
note. Four older tests were not replayed. No album content was changed.

## Remaining blocker and release follow-through

Resend reports Delivery delayed: SMTP `421 4.4.1 Failed to establish connection`.
The configured recipient `info@omoyorubaofsocal.org` has no MX record; its DNS is
at NameSecure, distinct from the website's Cloudflare zone. The owner was asked
to confirm a working inbox or its mailbox provider. Do not claim delivery or
send another test without authorization. Messages remain saved in the Inbox.

PR #43 merged as `45bccadefa96f89c41cc1fcca34827021e88864a`. All PR checks passed.
The full CI browser suite reported 283 passed and 50 conditional skips; one
existing layout accessibility test passed on retry. Production deployment
`dpl_GEeZngaLNL8xXS6aWPQn3RrecMJD` is READY and aliased to the public domain. The
final schema deployed successfully and Blueprint operation `OP-mvxxjfjaez`
completed at `2026-10-11T10:12:23.163Z`. Keep D16 open for the recipient
issue, PostHog and Chromatic; the checklist simplification is complete.

Separate observation: directly visiting `/contact` renders the existing 404
page, while its footer Contact control opens the functioning enquiry modal.
The route is absent from the existing source. This predates the current change
and remains a separate navigation follow-up.

## Owner-requested delivery follow-up

The owner then requested a delivery test to `afo@greenpill.builders`. Resend
confirmed Delivered for `01a12a74-3b7b-752c-8fe8-b5c9fc8d8485` at 03:13 PDT.
This was a direct provider delivery check using the same verified sender and
existing key, following the successful website-to-Function test. It did not
change the public contact or permanent notification routing. The owner then
approved using that address for temporary live notification routing. The follow-up
adds a private Function override, leaving public contacts unchanged. `ENQUIRY_TO`
is now configured to `afo@greenpill.builders`; Function deployment
`OP-ybvq4phn8y` completed at `2026-10-11T10:29:13.634Z`. Configuration readback
lists `ENQUIRY_TO`, `ENQUIRY_FROM` and `RESEND_API_KEY`. Remove the recipient
override after repairing and verifying the organization mailbox. No extra email
was sent during this configuration change, and old enquiries were not replayed.

The follow-up is PR #44, commit `143911f3738ac03c882635328f00e1cc3d5d7267`.
`bun check` passes with 1,220 tests; both review axes are clear.

Production verification confirmed the new Inbox, notes autosave, Gala checklist
filtering and editor links, and the absence of Vision. The remaining Gala checklist
contains doors time, dress code, running order and the honorees decision.
Signed-in verification screenshots are in `docs/screenshots/cms-walkthrough/`,
including `live-inbox.jpg` and `live-missing-content.jpg`. The four screenshots of
the mail provider's console (the two deliveries and the DNS setup) stay out of the
repository.
The original shared checkout and its pre-existing edits were preserved; the
merged implementation lives on the isolated worktree branch and remote main.
