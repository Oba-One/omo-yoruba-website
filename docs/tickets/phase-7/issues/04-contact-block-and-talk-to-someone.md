# 04: The contact block, and "Or just talk to someone"

Labels: design, content
Status: open
Blocked by: 02

**What to build:** Get Involved's fallback for anyone who would rather speak to a person (spec Q4): the
heading and its seeded line, the general inbox, the phone, who answers and the response time, each from
the settings or its chip; a Call button only when a phone exists and a quiet "Send a message"; then two
boxes, "Meet the people you are writing to." to Our Story and the give door's own words with its gold
Donate.

- [ ] `@oy/content`: registry rows and named constants for the general contact's name and response line;
      the query reads the settings the block draws
- [ ] `@oy/ui`: `ContactBlock` gains the contact's rows with their labels, the Call button and an
      optional Send a message; stories (both pages' shapes, pending) and tests
- [ ] `packages/web`: the builder carries the block and the give box; tested
- [ ] Playwright: `tel:` and `mailto:` only when the settings hold them, the contact form's round trip, the
      Give Dialog from the box, no mock name or response time while owed

## Comments
