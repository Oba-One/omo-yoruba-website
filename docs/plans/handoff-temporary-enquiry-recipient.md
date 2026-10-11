# Temporary enquiry recipient

11 October 2026. The owner approved `afo@greenpill.builders` as the temporary
destination for all website enquiry notifications. The owner-requested delivery
test reached this mailbox through the verified website sender.

The private Sanity Function variable `ENQUIRY_TO` is configured to that address.
Deployment `OP-ybvq4phn8y` completed at `2026-10-11T10:29:13.634Z`; environment
readback lists the recipient, sender and Resend key. Public site contacts and
visitor Reply-To remain unchanged. There was no additional test email or replay
of old enquiries during this configuration change.

Repair and verify `info@omoyorubaofsocal.org`, then remove `ENQUIRY_TO` to restore
role/general routing. Its domain currently has no MX record and the original
test delivery was delayed by SMTP connection failure. This remains in D16,
alongside PostHog and Chromatic.

PR #44 contains commit `143911f3738ac03c882635328f00e1cc3d5d7267`. `bun check`
passes with 1,220 tests; the focused suite passes 14. Spec and standards reviews
are clear. Sanity deployment is complete. The initial Vercel preview failed to
retrieve Git information; redeploying the same commit succeeded. Remaining PR
checks are being completed before merge.

The CMS setup test `k7ZbACRkY4ac1LuB1KkxBU` is Handled with the final setup note.
Raw readback confirmed the note, status and original email receipt; there are
zero enquiry drafts. The note/status edits did not replay its notification.
Album content and the other session's edits were preserved.
