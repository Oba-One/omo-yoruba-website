# 12: The enquiry-notify function and the Blueprint manifest

Labels: infra
Status: open
Blocked by: 04

**What to build:** `sanity.blueprint.ts` at the repo root defining `enquiry-notify` on
`create` of an `enquiry` without `notifiedAt`; the handler reads the routing contact for the
kind's role from `siteSettings.contacts`, builds a plain text email from the spec's field labels,
sends it through Resend with an idempotency key, then patches `notifiedAt` (or `notifyError`)
locked to the document revision. The pure parts (routing, subject and body) are test driven.

- [ ] Tests: routing picks the role's entry, then general, then the general email; the body lists
      every field of the kind with its label; nothing throws on an empty contacts list
- [ ] `sanity functions test enquiry-notify` runs the handler locally against a sample event and
      writes nothing when `context.local` is set
- [ ] The runbook records how to set `RESEND_API_KEY` on the deployed function
