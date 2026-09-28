# 88: A button's link publishes without a scheme, and the site then shows a Pending chip instead of the button

Labels: bug
Status: open
Blocked by: none

**Finding** (R88 in `docs/plans/review-alignment-and-quality.md`; packages/content (cta object); minor; correctness): Every page's primary and secondary actions, program card actions, doors and sub-programs use cta. A member who types a link the way people usually write one publishes with no warning and the button on the public page turns into a chip. The comment above safeHref says the schema's rule.uri covers this, which is true of the Portable Text link annotation but not of cta.href.

**Evidence:** packages/content/src/schema/objects/cta.ts:52-66: for kind url the rule only asks that href is not empty. packages/ui/src/core/ActionButton/action.ts:33-36 (safeHref) and :59-66 accept only http(s), mailto, tel or a path on the site. bun probe: resolveAction({kind: 'url', href: 'www.eventbrite.com/e/123'}) answers {ok: false, pending: 'the link'}; 'https://www.eventbrite.com/e/123' and '/odunde' pass. The Portable Text link does validate its scheme (schema/objects/blockContent.ts:52-53).

**What to build:** Move the safeHref predicate into a plain module in @oy/content and use it in the cta rule (for example "Start the link with https://, mailto:, tel: or /"), so the Studio refuses what the site would hide. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
