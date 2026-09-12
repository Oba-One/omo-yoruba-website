# Pick the favicon

Type: grilling
Status: open
Owner: yes
Labels: design
Phase: 4
Blocked by: none

## Question

The site has no favicon: neither `packages/web/public` nor the design handoff holds one, so every
browser logs a 404 for `/favicon.ico` and Lighthouse's best-practices score drops (0.93 on
12 September 2026). The obvious source is the logo mark (`packages/ui/src/navigation/Logo/logo-mark.png`).
Approve that, or supply the icon you want; a session then produces the sizes (an SVG or 32px icon,
a 180px Apple touch icon) and the head links (ticket 33).
