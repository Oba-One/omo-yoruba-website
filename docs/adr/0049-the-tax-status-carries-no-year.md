# The tax status carries no year

Decided by the owner on 9 October 2026: the site states the organization's tax status and its founding year as two
facts. The footer's trust line reads "501(c)(3) nonprofit • Founded 1997 • EIN XX-XXXXXXX • Los Angeles, CA", and the
Tax status cell on Impact and Donate reads "501(c)(3)" with the note "Founded 1997". This closes D25.

The design handoff joins them: "501(c)(3) nonprofit since 1997" in the footer and "Since 1997" under the tax status
(the Build Brief, ROUTES section 2, the Impact and Donate prototypes, CONTENT-MODEL section 1). The IRS master file
gives the organization's EIN a ruling date of October 2014, and the EIN is about to be published beside that line. A
grant reviewer who looks the EIN up should find nothing on the site that the record does not say.

## Considered options

- **Keep "since 1997":** the handoff's line and the old site's. It dates the tax status to a year the record beside
  the EIN does not show.
- **Leave the year out of the trust line and the cell:** the owner wants the founding year stated, and the footer is
  the one place every page states it. The cell's note can still go if "Founded 1997" under "Tax status" reads as
  one claim.

## Consequences

- "Since 1997" stays wherever it speaks of the organization or its work: the homepage's "Language, festival, family.
  Since 1997." and Impact's "What we have built since 1997".
- The handoff's wording stays in `docs/design` as the record of the brief; this decision overrides it, as ADR 0009
  overrides the two-word festival name. AGENTS.md, CONTEXT.md and the `oy-voice` skill carry the new line.
- The wording lives in two places in code: `SiteFooter.astro`, and `TAX_STATUS_CELL` in `page-skeleton.ts`, the cell
  Impact and Donate both open their trust cells with. The UI fixtures and the `GlanceStrip` story repeat the cell.
- The founding year rests on the owner's word. If the determination letters turn up, the tax status can say more.
