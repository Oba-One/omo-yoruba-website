# Enquiries are Sanity documents, and a Sanity Function emails them through Resend

Every owned form (eight enquiry kinds plus the newsletter) is an Astro Action that
validates with Zod and writes an `enquiry` or `subscriber` document with a write token
scoped to those types. The `enquiry-notify` Sanity Function fires on create, sends the
email through Resend to the routing address for that kind from `siteSettings.contacts`,
and patches `notifiedAt`. No third-party form service: the inbox lives with the content,
and the forms work without JavaScript first.

## Considered options

A hosted form service or emailing straight from the action. Rejected: submissions would
live outside the Studio, and a failed email would lose the enquiry.
