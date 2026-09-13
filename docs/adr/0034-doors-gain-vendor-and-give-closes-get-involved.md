# Doors gain the vendor door, and the give door closes Get Involved as a box

Decided with the owner on 13 September 2026 (Phase 7 grill, `docs/tickets/phase-7/spec.md`, Q1, Q2 and
Q15). ADR 0013 kept four doors (member, volunteer, partner, give) as documents the homepage, Get Involved
and Donate share, but `13 Get Involved.dc.html` and its wireframe draw the page's four cards as member,
volunteer, vendor and partner, and close the page with the give door's own words in a box ("Would rather
give than join? That takes about a minute." and Donate). Vendors are one of the site's three funnels and
ROUTES already names this page as a trigger of the vendor form, so `vendor` joins the door keys and the
seed adds a vendor door ("Sell at Odunde", "Apply for a booth"); the give door keeps its document and
draws as the closing box on Get Involved, a card elsewhere.

The gold rule decides the rest. The prototypes draw a gold button on every door and none in the header,
while `development` held a gold header action on Get Involved and Our Story that no prototype draws. The
seed stops writing those actions, the header still draws whatever the Studio holds, and on Get Involved
the first door is gold only while the header holds no action. On Donate the doors are always outline
under the header's one "Give now"; a single referenced door draws in the row form, photograph on the
left, so it fills the width rather than leaving half a grid empty.

## Considered options

- Keep four doors including give, as the glossary had them: rejected; the page would lose its only
  signpost to the vendor form and its prototype's closing box.
- A vendor take-part row instead of a door: rejected; Get Involved's ways in are cards with photographs
  and bullets, which take-part rows do not carry (ADR 0029 keeps rows per page).
- A gold button on each door, as drawn: rejected by the one gold action per screen view rule.

## Consequences

- `PathRow` names the vendor chip "Vendors"; one chip per door across the site, so the prototype's
  "Volunteering" label reads "Volunteer" as the homepage's rows do.
- A dataset seeded before Phase 7 holds the old four doors on Get Involved and the two header actions;
  the seed revises those values only while they still read exactly as the earlier seed wrote them
  (ADR 0035).
- A second Donate door is the owner's to add; the prototype's two cards used a summer camp photograph
  and claims the register marks invented.
