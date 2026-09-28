# Check the trust pages in the Studio and on the preview, then merge the Phase 7 pull request

Type: task
Status: resolved
Owner: yes
Labels: infra
Phase: 7
Blocked by: none

## Question

Phase 7 (conversion and trust) is pull request https://github.com/Oba-One/omo-yoruba-website/pull/8 from
`phase-7/conversion-and-trust`. Before merging:

1. Open `/admin`, the Presentation tool and `/get-involved`. Click a door's photograph, the associations'
   cells (they open the stat reference) and the `doors` and `hta` options: each opens its field, and text
   everywhere opens its own through stega. On `/impact`, How we work's photograph, an outcome card once one
   exists, the civic cells (they open the past edition's attendance), a photograph tile, and the `stats`,
   `outcomes`, `sources` and `funders` options. On `/our-story`, the earliest photograph's placeholder, a
   person's card once people exist, a take-part row, and the `timeline`, `bios` and `portraits` options. On
   `/donate`, the partner door's photograph, the `impact` option and a giving level once one exists.
2. Look at the four pages at 375 and 1440 against `13 Get Involved.dc.html`, `14 Impact.dc.html`,
   `15 People and History.dc.html` and `16 Donate.dc.html`. ADR 0036 lists what matches and what stays
   different on purpose; the captures are reproducible (`docs/runbook.md`, "Comparing a page with its
   prototype").
3. Decide what the pages show today:
   - The volunteer row's chip on Our Story keeps the volunteer accent's green tint, as the festival, Gala,
     Programs and Collective prototypes draw it; the People and History prototype draws it indigo, and
     AGENTS.md keeps green inside Cultural Collective content (ADR 0036). Keep it, or make the volunteer
     accent another tint site-wide.
   - `SectionHead`'s intro now uses the prototypes' section lead (64ch, 12px under the heading, line height
     1.7) on every page, the homepage and the event and program pages included (ADR 0036).
   - Donate's give-now section has no second gold Give now under the header's (spec Q14), and its larger
     scale shows one door in the row form until you add a second (ADR 0034).
4. The seed ran on `development` during the phase: the vendor door, Get Involved's door list, the two
   header actions unset, Impact's six captions, the headline order and the associations label, Our Story's
   rows, and Donate's give-now facts and tax line. Run `bun seed` on any other dataset that should match.
5. Until this branch deploys, the Studio on `main` does not know the new fields (the vendor door key,
   `vendorsHosted`, the outcome's subject, the timeline entry's shape, the founding facts and image, the
   give-now facts, the other ways' kind and detail); edit the trust pages from this pull request's preview.
6. Merge when satisfied. Phase 8 starts from `main` afterwards (`docs/plans/prompt-phase-8.md`).

## Answer

Phase 7 merged as pull request 8. What its steps left open moved to open-work rows before the ticket
closed; the comment below names each.

## Comments

27 September 2026. Closed (open-work H1): pull request 8 merged on 13 September 2026. Where what
was left went:

- The volunteer chip's green outside Collective content (step 3): open-work D12; ADR 0036 and this
  ticket keep the detail.
- Donate's one Give now follows the one-gold-action rule (spec Q14); a second door beside Partner or
  sponsor is open-work D24 (ticket 42, ADR 0034).
- `SectionHead`'s section lead on every page (step 3) and the comparison with the prototypes (step 2):
  the deep review (open-work E2), whose prompt names the section lead.
- Reseeding another dataset (step 4): open-work E18, once D3 names the dataset that holds the content.
- Step 1 was a check before the merge. Step 5 no longer applies: the Studio on `main` knows the new
  fields.
