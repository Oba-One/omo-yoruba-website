# 03: SiteNav with the Events dropdown, the mobile menu and the current state

Labels: design
Status: resolved
Blocked by: none

**What to build:** `SiteNav` in `@oy/ui/navigation`: the sticky bar with the logo lockup, the
Events dropdown (Ọdúndé Festival, End-of-Year Gala) that opens on hover, focus-within and click,
closes on Escape and marks `aria-expanded`; the links Programs, Get Involved, Impact, Our Story;
the gold small Donate trigger; the current page in terracotta with the gold underline
(`aria-current` on the link, `data-current` on the Events trigger when a child is current);
and the mobile menu under 880px as a native dialog with the same links flattened, Events as a
group label, the close ×, Donate at the bottom, focus trapped and returned to the burger. The
behaviour lives in an inline custom element (ADR 0018).

- [x] Stories: Default, each current state, dropdown open, mobile menu open at 375, on the paper ground
- [x] `play`: the burger opens the menu, Tab stays inside, Escape closes it and focus returns to the burger; the dropdown opens on click and closes on Escape
- [x] Vitest: the current link carries `aria-current="page"`, the Events trigger carries `data-current` on `/odunde`, the Donate trigger is a link to `/donate#give`, every target is 44px in markup terms (the button and link classes from the tokens)
- [x] The nav renders once, first in the layout, and anchors get `scroll-margin-top: 96px`

## Comments

11 September 2026. The caret is drawn with CSS rather than the prototype's ▼, since the glyph
set is • → ✓ ×. The dropdown's visibility stays CSS driven (hover and focus within, as the
tokens define it); the element only keeps `aria-expanded` honest and answers Escape. The mobile
menu is a native dialog: a synthetic Escape (a play function) does not fire the browser's cancel,
so the element closes on Escape itself as well. The 44px targets come from the tokens' `.oy-btn`,
`.oy-nav-links a` and `.oy-nav-burger` rules, which the story renders. Both play functions pass
in the canvas at their locked viewports (375 for the menu, 1440 for the dropdown).
