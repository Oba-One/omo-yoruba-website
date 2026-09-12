# 02: Field and NewsletterForm

Labels: design
Status: open
Blocked by: none

**What to build:** the two form primitives in `@oy/ui/forms`. `Field` renders a `FieldSpec` from
`enquiry-kinds.ts` (text, email, tel, select, textarea) with a visible label, an optional hint,
an error sentence wired through `aria-describedby` and `aria-invalid`, the wide variant, a kept
value, and the 44px minimum. `NewsletterForm` renders the footer signup: the hidden label, the
email input, the honeypot, the submit button, and the four states (idle, busy with "Sending...",
success with the button reading "Ẹ ṣé! ✓" and the on-the-list line, error with the sentence
under the field), posting to the newsletter action without JavaScript and enhancing with the
inline custom element.

- [ ] Stories: every field kind, with hint, with error, wide, on dark; the newsletter's four states and on dark
- [ ] A `play` function submits an empty newsletter form and sees the error sentence without a network call
- [ ] Vitest: the label is tied to the control, the error sentence is referenced, a select renders every option, the busy button keeps focus
- [ ] Copy comes from the spec and the site settings, never from the component
