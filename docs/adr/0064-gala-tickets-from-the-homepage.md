# Gala tickets from the homepage, with sponsorship offers hidden

Accepted 22 November 2026, at the owner's request during the content review.

The homepage's Gala Tickets button opens the Tickets Dialog on the homepage using
the lead edition's own ticket link. A separate Learn more link opens the Gala page.
Both pages use the existing ticket-link guard and dialog, including the direct
Zeffy-page fallback. Other ticket providers still open in a new tab. Without a
ticket link the band continues to link to the Gala page.

The Gala's sponsorship offers are not in use. `GALA_SPONSORSHIP_ENABLED` in the
content package's editing defaults hides the sponsorship section, header action
and take-part row, and parks its Pending rows. Stored offers remain available for
future use. Re-enabling sponsorship requires reviewing those offers and changing
that shared default. Other pages' partnership and sponsorship paths continue.

This extends ADR 0052 to the homepage and records the owner's exception to showing
filled parked content under ADR 0058: unused sponsorship offers stay hidden even
while their stored values exist.
