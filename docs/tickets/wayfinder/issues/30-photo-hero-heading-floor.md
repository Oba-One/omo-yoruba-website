# The photo hero's heading size on phones

Type: grilling
Status: open
Owner: yes
Labels: design
Phase: 4
Blocked by: none

## Question

The homepage hero's heading follows `02 Homepage.dc.html`: `clamp(34px, 4.8vw, 56px)` (the token
`--text-hero-photo`), so 34px on a 375px phone and under 44px below about 917px wide. AGENTS.md and
the brief say "Hero 44 to 64px"; the generic hero token keeps the design system's 38 to 60, already
recorded as an open owner call in `packages/tokens/README.md`. Keep the prototype's scale, or raise
the floor (at 44px the heading wraps to more lines on a phone)? One token changes either way; ADR
0023 records the conflict.

## Comments

27 September 2026. Ticket 26 is closed; of the homepage's differences from its prototype, ADR 0023
leaves this one to the owner. It is open-work D11, which also covers the generic hero token (38 or
44px) and H2 (30 or 32px) that `packages/tokens/README.md` records. AGENTS.md's "Hero 44 to 64px"
and "H2 32 to 40" wait for the answer (open-work E7).
