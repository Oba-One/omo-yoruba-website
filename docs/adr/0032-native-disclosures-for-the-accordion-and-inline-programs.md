# The FAQ accordion and the inline programs are native disclosures, with no script

Decided 13 September 2026 while building Phase 6's tickets 03 and 07, from
`docs/research/phase-6-faq-accordion.md`. ADR 0018 gives interactive components their behaviour in inline
plain JavaScript custom elements. The Lessons page's questions and the Programs hub's Kids & STEM and
Cultural Exchange toggles need none: the `Accordion` is a group of native `details` sharing a `name` (one
open at a time, opening another closes it), and the `Disclosure` is one `details` whose quiet summary
reads "Hide details" or "Show details". The browser supplies the keyboard (Enter and Space on the
summary), the expanded state to assistive technology, find in page opening the answer it lands in, and
the same behaviour without JavaScript, as `Schedule` already did for the festival's day. The questions
stay plain text in the summary, not headings: the section's `h2` keeps the heading order, and how a
heading inside a summary reaches screen readers is unverified.

## Considered options

- APG's accordion as an inline custom element (`h3 > button[aria-expanded]` toggling `hidden` panels):
  every question a heading, but a panel hidden by the attribute is not searchable, the no-JavaScript
  state has to render every answer open and collapse them on upgrade, and the script needs a CSP hash in
  Phase 9.
- A small script only to force one-open in older browsers: rejected; before Chrome 120, Firefox 130 and
  Safari 17.2 the group degrades to several open, a variant the component canvas already accepts.

## Consequences

- Storybook's synthetic Enter and Space cannot toggle a native summary, so the play functions click and
  Tab, and Playwright proves the keys with real input.
- Each accordion on a page needs its own `id` for the group's name, never taken from the question text,
  which carries stega in Presentation.
- The targets sweep measures `summary` elements too, since they are the controls.
- If every question must be reachable as a heading in every screen reader, the APG build above replaces
  this one behind the same props.
