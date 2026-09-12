# 09: Playwright proves the five states, the focus rules and axe with each dialog open

Labels: infra
Status: resolved
Blocked by: 01, 08

**What to build:** the e2e suite in `packages/web/e2e`: for each of the eight kinds, open from a
trigger, submit empty (the summary and the field sentences appear, a typed value survives),
fill and submit (the busy label, then the success block with the close button focused), Escape
closes and focus returns to the trigger; the newsletter's four states; the mobile menu's trap,
Escape and focus return; the Events dropdown on hover, focus and Escape; no dialog open on load
on every route; `#give` opens the Give Dialog and the fallback appears when the embed request is
blocked; the reduced-motion cross-fade; axe at 375 and 1440 on the layout with each dialog
open, zero violations; every `a`, `button`, `input`, `select` and `textarea` at 375 has a 44px
box. The action requests are intercepted so CI writes nothing.

- [x] Every spec passes locally against `astro dev` and in the CI job with the placeholder variables
- [x] Axe reports zero violations in every checked state
- [x] The intercepted success answer uses the action's own encoding, so the modal renders it as it would a real one

## Comments

11 September 2026. 52 tests across two projects: 46 pass, 6 skip by design (the desktop copies
of the mobile-only menu and targets checks, and the two write-gated no-JS successes, which pass
with `E2E_WRITE=1` against `development` and created contact enquiries on the way). Findings
along the way, all fixed: Astro 7 backgrounds the dev server when it detects a coding agent, so
the runner saw "exited early" and orphaned daemons kept port 4321 (`ASTRO_DEV_BACKGROUND=0` in
the web server env); the dev toolbar's shadow DOM carried four h1 elements (`PLAYWRIGHT=1`
turns it off); the error re-render answered 200 (now 400 from the layout); the redirect after a
successful no-JS POST has to come from the middleware, since a layout cannot return a response;
the mobile menu painted its Donate button white on gold; the logo link was 40px and the footer
links 22px (now 44); axe measured the bottom sheet mid-animation (the audit waits for finite
animations). Playwright cannot click the sheet's submit button at 375 without JavaScript (the
nested scroll containers never settle), so the no-JS specs submit with Enter.

Review follow-up: the suite runs its own dev server on 4322 so a `bun dev` on 4321 is never
reused with its toolbar; the trust line and Give Dialog assertions tolerate filled settings; the
"iframe present but never loading" path stays untested (an iframe fires `load` even for a
refused frame, so the timer catches a hang only), covered by the stories' timed fallback.
