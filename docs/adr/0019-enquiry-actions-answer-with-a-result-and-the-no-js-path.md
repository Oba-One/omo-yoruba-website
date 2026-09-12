# Enquiry actions answer with a result object; without JavaScript a query opens the modal and success redirects

Decided with the owner on 11 September 2026 (Phase 3 grill). The nine Astro Actions (eight
enquiry kinds and the newsletter) validate inside the handler with `parseEnquiry` and answer with
one shape, `{ ok: false, summary, fields, values }` or `{ ok: true, title, body }`, instead of
declaring `input` and throwing Astro's input errors, so the JavaScript path and the no-JS path
read the same result and the values as typed ride along for the re-render. Without JavaScript a
trigger is a link `?enquiry=<kind>#enquiry` that the server renders with the modal open; a POST
with errors re-renders the page with status 400, the modal open, the summary at the top and the
fields refilled from the posted form; a successful POST redirects to `?enquiry=<kind>&sent=1`,
whose render shows the success block from the same `successCopy`, so a refresh never resubmits.
With JavaScript the click is intercepted, the URL is untouched and the modal shows the copy the
action returned. Spam is handled without a service: a honeypot field that answers success and
writes nothing, an address cap of five enquiries an hour per reply-to address checked with a
Sanity count generated from the spec's reply-to fields, and a per-address-of-origin token bucket
in module memory as a best effort on a warm function, each refusal with its own sentence. A repeat newsletter address reads as
success and writes nothing, so the form never reveals whether an address is subscribed.

## Considered options

Astro's `input` schema with thrown `ActionInputError`: idiomatic, but the posted values are gone
by the time the page renders and rate limiting and write failures would need a second shape. A
CSS `:target` trigger: one hash cannot name both the modal and the kind. Re-rendering the
success in place: Astro's documented pattern, rejected because a refresh re-posts. The redirect
lives in the middleware, since a layout cannot return a response.

## Consequences

- Eight cache variants per page (`?enquiry=<kind>`) sharing the page's tags; Phase 4 caches
  them like any other URL.
- The success copy is filled in two places from one function: in the action for the JavaScript
  path and at render for `sent=1`.
- A capped address is told to write to the general inbox; the cap and the honeypot never
  create a document, so the Inbox stays human.
