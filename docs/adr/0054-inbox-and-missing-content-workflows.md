# Inbox and missing content workflows

Accepted 11 October 2026 after the signed-in CMS walkthrough. The owner approved
email notifications, a simpler Inbox and To do list, and hiding Vision in the
live CMS. Album updates and publication belong to a separate session.

## Decision

The Inbox organizes all enquiry kinds by New, In progress, Handled and Not
emailed, with Subscribers alongside. Enquiries are operational records: staff
notes save with live editing and named actions change status without Publish.
Submitted fields remain read-only. A reply link opens the staff member's email
app; replies are not synchronized back. Administrator access rules remain the
same. Legacy `handled` values map to status until the next status action. The
live dataset had no enquiry drafts before rollout.

The notification Function runs on creation or an explicit retry request, scoped
to the website's private development dataset. It records acceptance and the
provider ID separately from handling status. Errors stay visible. Stable
idempotency keys prevent duplicate sends within the provider's 24-hour window.
An old uncertain result requires a human provider check. A rejected first
request can retry after correction. Receipt updates preserve concurrent notes.
Deployment does not send old enquiries. Form success copy acknowledges receipt
without claiming that payment, membership or an email handoff has happened.

Missing content keeps the Pending registry, presence checks and current-edition
selection authoritative. A custom pane built with Sanity UI replaces ADR 0042's
native-list-only layout for this checklist. It consolidates repeated field rows
into one document task, with expandable details, page filtering and unpublished
change labels. Next-event essentials come first. Owner decisions and absent
documents stay visible. Wording reports retain their native document list.
Filling a saved draft clears its task; publishing remains separate.

Vision is a developer query console. Register it only for local development,
with the existing administrator role restriction. Production editing does not
need it. Member guide and Presentation remain available.

## Consequences

The Inbox is a small manual workflow, not a shared email client. Staff must keep
notes and handling status current. Resend acceptance does not prove delivery;
its dashboard owns the final delivery result. Newsletter sign-ups are stored
only. The checklist reduces navigation without hiding incomplete facts or
inventing content. No album document is changed by this work.
