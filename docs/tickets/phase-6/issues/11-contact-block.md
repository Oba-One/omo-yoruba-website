# 11: ContactBlock

Labels: design
Status: resolved
Blocked by: none

**What to build:** the contact block Our Story's "Reach us" and Get Involved's fallback will use in Phase
7 (COMPONENT-MAP, Lists and rows): the mailing address, the phone and the general email from the site
settings, each a link where it can be one (`tel:`, `mailto:`) or the registry's chip while the settings
hold nothing, and a button opening the `contact` enquiry. No page uses it in Phase 6.

- [x] `@oy/ui`: `ContactBlock` with every value filled, each missing, all missing, and on a tinted
      ground; the registry's wording for each chip; links through `safeHref`
- [x] Stories for every state and a test of the markup (the links, the chips, the trigger)
- [x] The component map row updated

## Comments

13 September 2026. `@oy/ui`: `ContactBlock` (`15 People and History.dc.html` Reach us, `13 Get
Involved.dc.html` Or just talk to someone): the general email as a `mailto:` link, the phone as a `tel:`
link from its digits and the mailing address on one line, each the registry's chip ("the general inbox",
"phone number", "mailing address") while empty, then "Send a message" opening `contact`, an outline by
default or quiet. It lays its facts through `FactList`, which gains a per-fact `href` that becomes a link
only through `safeHref`. Stories: every value, each missing, all missing and on a tinted ground with the
quiet button; tests of the links, the chips and the trigger. The component map row names the props. The
page passes values cleaned of stega, since two become hrefs; no page uses the block until Phase 7.
