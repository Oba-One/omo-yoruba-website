# Interactive components carry their behaviour in inline, plain JavaScript custom elements

Decided with the owner on 11 September 2026 (Phase 3 grill) after the spike in
`docs/research/phase-3-storybook-play-functions.md`. `@storybook-astro/framework` 1.11.0 serves
a hoisted `<script>` untransformed in the dev canvas (TypeScript syntax fails, plain JavaScript
runs) and emits nothing for it in a static build (the module 404s), and the container API behind
Vitest never executes scripts. So SiteNav, EnquiryModal, GiveDialog and NewsletterForm carry
their behaviour in a `<script is:inline>` written in plain JavaScript that defines a custom
element guarded by `customElements.get`, sets `data-ready` on the host once wired, and reads its
copy from data attributes and the markup. A story's `play` function waits for `data-ready`, then
drives the keyboard; Chromatic can therefore snapshot open states. The alternative, hoisted
TypeScript scripts with no play functions and Playwright as the only proof, was rejected because
the component library would then show every state except the ones that matter.

## Consequences

- No TypeScript and no bundling in those scripts; keep them small and put shared logic in the
  markup (data attributes) rather than in a second script. `astro check` does not see them, so
  Playwright proves the behaviour on the site and the play function proves it in the canvas.
- Vitest tests assert the initial markup and ARIA state only.
- Inline scripts are exactly what `<ClientRouter />` leaves alone on navigation. The two
  dialogs are persisted and may be disconnected and connected again, so an element wires itself
  once and adds its document and window listeners per connection with an AbortController; the
  nav and the footer re-render per page and upgrade on insertion. A dialog exposes what opened
  it as `oyTrigger`, so a trigger inside another dialog returns focus to that dialog's trigger.
- The report-only CSP will list these scripts under `script-src`; Phase 9 hashes them or moves
  the policy (wayfinder ticket 13), the same choice `<ClientRouter />` already forces.
