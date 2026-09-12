# 03: SiteNav with the Events dropdown, the mobile menu and the current state

Labels: design
Status: open
Blocked by: none

**What to build:** `SiteNav` in `@oy/ui/navigation`: the sticky bar with the logo lockup, the
Events dropdown (Ọdúndé Festival, End-of-Year Gala) that opens on hover, focus-within and click,
closes on Escape and marks `aria-expanded`; the links Programs, Get Involved, Impact, Our Story;
the gold small Donate trigger; the current page in terracotta with the gold underline
(`aria-current` on the link, `data-current` on the Events trigger when a child is current);
and the mobile menu under 880px as a native dialog with the same links flattened, Events as a
group label, the close ×, Donate at the bottom, focus trapped and returned to the burger. The
behaviour lives in an inline custom element (ADR 0018).

- [ ] Stories: Default, each current state, dropdown open, mobile menu open at 375, on the paper ground
- [ ] `play`: the burger opens the menu, Tab stays inside, Escape closes it and focus returns to the burger; the dropdown opens on click and closes on Escape
- [ ] Vitest: the current link carries `aria-current="page"`, the Events trigger carries `data-current` on `/odunde`, the Donate trigger is a link to `/donate#give`, every target is 44px in markup terms (the button and link classes from the tokens)
- [ ] The nav renders once, first in the layout, and anchors get `scroll-margin-top: 96px`
