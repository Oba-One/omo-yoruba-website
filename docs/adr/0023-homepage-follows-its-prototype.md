# The homepage follows its prototype where the routes table and the Phase 4 spec differed

Decided 12 September 2026, at the owner's request after reviewing pull request 5 ("full alignment
with the claude design", `docs/design/design/02 Homepage.dc.html` at 375 and 1440). Phase 4 had
followed ROUTES section 4 and its own spec in a few places where the prototype shows otherwise; the
prototype now wins for the homepage, except where a repo rule or the register says it cannot.

What changed to match the prototype:

- Three program cards across, the first three programs by `order` (ROUTES said four). The order
  field's description says so in the Studio.
- The `highlight` option swaps the hero's gold button, as the prototype's three hero buttons do:
  `school` and `collective` put the highlighted program's own card action there (whichever program
  it is, on the grid or not), `festival` keeps the hero's own action, and a half-filled program
  action never replaces a whole one. The Phase 4 spec had collapsed the three into one fixed
  button.
- News reads oldest first (the three newest posts), with Read more on each card whose post is
  tagged to a page. The News page still waits on its cadence (wayfinder ticket 08), so Read more
  opens that page (an edition's event page, a program's page), never a post route, and its
  accessible name carries the post's title.
- The member voices wait in the prototype's placeholder form, one slot each for a Language Lessons
  parent, an elder of Ẹgbẹ́ Ìbílẹ̀ and a vendor at Ọjà Balógun (the bracketed quote the slot wants,
  "Name pending" with the voice), from `HOMEPAGE_VOICE_SLOTS` in the Pending registry module. A
  testimonial fills the slot of its context, so the page never asks again for a voice it shows.
- Two fields for copy the prototype sets differently: `hero.emphasis`, the part of the heading in
  gold italic ("alive"), and `stat.shortLabel`, the strip's label ("years serving SoCal") while the
  Impact page keeps the full one.
- The prototype's framing of every photograph, seeded as hotspots (ADR 0022), and the Collective's
  interim photograph on its card.
- Details the build had drifted on: the hero copy set left at the prototype's scale (the tokens'
  generic hero centres a class the component shared), the gold word and the blessing line at the
  display face's 600 italic (the prototype's only italic face), the quote cards filling their
  cells, the event band's line as one sentence at the body size (the tokens' generic band set 15px)
  with its button kept right at every width, the newsletter band's form at the end of its row and
  across it under 820px, the page-section stories on the `adire` theme.

What stays different on purpose, because a rule outranks the prototype:

- Pending (ADR 0005, ADR 0014): each voice placeholder keeps the registry's chip above it, which the
  prototype does not show, so the page and the Studio's Pending view name the same owed item.
- "Odunde" without marks in display text (ADR 0009): edition titles and the recap post keep the seed's
  spelling where the prototype writes "Ọdúndé Festival 2027" and "Ọdúndé 2026: the recap". Marks stay
  in the nav and in the Yoruba half of bilingual kickers and captions.
- Yoruba Language Lessons, never "School", and no Saturdays: the highlighted Lessons button reads the
  card's "Enrol a learner", not "Enroll at the Language School"; the parent's slot asks what the
  lessons changed at home, not what Saturday mornings changed.
- Where the prototype's copy states what the register marks as invented, the seed's wording stays:
  the program blurbs leave out "build robots", "monthly" and "solar on community roofs", the doors
  leave out "early access to events", "a say in what we build next" and "the school", the rows use
  the doors' own blurbs, and the Gala band's venue and date stay Pending. The tile caption "Kids at
  play in the park" stays under a photograph of a board game.
- Phase 3's footer keeps its 44px link targets and its Pending chips for the inbox, the address and
  the social links.

One conflict is followed and left open: the photo hero's heading takes the prototype's
`clamp(34px, 4.8vw, 56px)` (the token `--text-hero-photo`), below AGENTS.md's "Hero 44 to 64px" and
the generic token's 38px floor; whether to raise it is the same owner call the tokens README
records for the generic hero.

## Considered options

- Keep ROUTES section 4 and the Phase 4 spec: rejected by the owner.
- A curated list of programs on the homepage singleton: set aside while there are four programs; the
  first three by order is one rule an editor can see in the Studio.
- Read more to `/news/<slug>`: rejected, no post page is planned until ticket 08 is answered.

## Consequences

- The Programs page (Phase 6) still shows four cards; ROUTES section 1 keeps `program` (4) for it.
- An editor who moves Lessons or the Collective out of the first three hides its card while the
  highlight still puts its action in the hero (the query reads every program, the grid shows three).
- A seed run on 12 September 2026, before this decision settled, wrote "Ọdúndé 2026: the recap" to the
  recap post in the `development` dataset; the seed no longer writes it, and the owner changes the
  field back in the Studio.
