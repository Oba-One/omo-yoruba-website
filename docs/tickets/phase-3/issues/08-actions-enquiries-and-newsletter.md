# 08: The nine actions write documents and answer with the result

Labels: infra
Status: resolved
Blocked by: 07

**What to build:** `packages/web/src/actions`: one action per enquiry kind and one for the
newsletter, `accept: 'form'`, validating in the handler with `parseEnquiry` (the newsletter with
the email rule), dropping a filled honeypot with a success answer and no write, refusing a
reply-to address past the address cap (five an hour, a Sanity count generated from the spec's
reply-to fields) and a burst from one origin (a token bucket in module memory), writing
`{ kind, [kind]: fields, submittedAt, source }` or `{ email, subscribedAt, source }` with
`SANITY_API_WRITE_TOKEN`, and answering `{ ok: true, title, body }` from `successCopy` with the
routing contact read from the settings, or `{ ok: false, summary, fields, values }`. The modal
and the newsletter form consume the result with JavaScript; the layout consumes it without.
`enquiry_submitted` and `newsletter_submitted` are announced on success (ADR 0019).

- [x] Vitest at the seam: the result builder maps Zod issues to the spec's sentences and keeps values; the honeypot answers success without a write; the cap and the bucket refuse with the sentence naming the general inbox; a write failure answers with the fallback sentence
- [x] A vendor enquiry submitted from the dev server creates an `enquiry` document in `development` with the eight fields under `vendor`, shown in the Inbox
- [x] The same form posted without JavaScript re-renders the page with the values kept on error and redirects to `sent=1` on success
- [x] A repeat newsletter address creates no second document and still reads as success

## Comments

11 September 2026. The handlers are pure of Astro's virtual modules and tested with a fake
client (the result builder, the honeypot, the cap and the bucket, the write failure and the
missing token, the repeat subscriber). A vendor enquiry submitted from the dev server through
the bridge created `enquiry` document `7LO6o5K6XyoZKPjp1euFmv` in `development` with the seven
filled fields under `vendor` and `source: "/"`; a newsletter signup created subscriber
`7LO6o5K6XyoZKPjp1euIhD`. The enquiry-notify function is not deployed yet (owner follow-up), so
no email was sent and the documents carry no `notifiedAt`. The bridge learned that Astro's
client `actions` object is a proxy (`in` fails) and that a transport error must never show its
body as the summary: the fallback sentence names the general inbox instead. The no-JS POST paths
are proven in ticket 09.
