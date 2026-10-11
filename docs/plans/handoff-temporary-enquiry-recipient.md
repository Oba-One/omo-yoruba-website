# Temporary enquiry recipient

11 October 2026. The owner approved `afo@greenpill.builders` as the temporary
destination for website enquiry notifications. The preceding delivery test reached
that mailbox. The organization address `info@omoyorubaofsocal.org` still needs its
receiving setup repaired.

The notification Function accepts a private `ENQUIRY_TO` override. This applies
to all enquiry kinds, keeps the visitor's Reply-To, and leaves public contact
content unchanged. Unset the variable after the organization mailbox works to
restore the existing role/general routing. Invalid configuration stops sending
and records an Inbox error. Deployment does not replay accepted notifications.

`bun check` passes, including 1,220 unit tests and toolchain checks. The focused
notification suite passes all 14 tests. Spec and standards reviews found no
blockers. The deployment plan updates the existing Functions without changing
their triggers or replaying records. No album content was changed.

Deployment and recipient configuration will be completed after committing.
