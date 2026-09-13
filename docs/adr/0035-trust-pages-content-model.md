# The trust pages' content model: subjects, sources and what the Studio holds once

Decided with the owner on 13 September 2026 (Phase 7 grill, `docs/tickets/phase-7/spec.md`, Q3 to Q17).
Get Involved, Impact, Our Story and Donate are where a grant reviewer checks claims, and the register marks
almost every fact their prototypes print as invented. The model changes where the prototypes draw
something the schema cannot hold honestly, and one rule runs through it: a fact the site already keeps
somewhere (an edition's attendance, the EIN, a stat, a person) is read from there, never typed a second
time on a page (owner's yes; every retired field is empty in `development`).

- **An outcome names one subject.** Impact's four outcomes are Lessons, Odunde, Kids & STEM and the
  Collective, and Odunde is an event, not a program. An outcome names a program or an event page's kind,
  exactly one, as the year strip row does (ADR 0031); its heading is that subject's name, so `title` and
  the undrawn `year` retire. A figure carries its source line or its chip; without a figure, the plain
  statement of what is being measured stands alone. While fewer than four exist, slots name the
  prototype's subjects not yet covered, as the homepage's voices do.
- **The civic figures live on the edition.** Attendance, vendors hosted and the cost of the festival
  change every year (ADR 0013), so Impact reads them from the festival's editions (a new
  `event.vendorsHosted` beside `attendance`) and counts the festival page's partners.
- **Governance reads documents, newest per kind.** Form 990, annual report and audit each show the newest
  `governanceDoc` of their kind, as a file link or its note ("Copies on request"), or that kind's chip;
  the block always renders, since a missing heading reads as concealment.
- **A timeline entry is a year and one line.** `title` and `image` retire, `blurb` is required and a
  `milestone` switch marks the founding and today. The option stays hidden until wayfinder ticket 07 is
  answered.
- **Names on Our Story come from people.** The board and the staff and volunteers are `person` documents
  by group, each group with its own Pending line; the teacher stays on the Lessons page. A person without
  a portrait draws the woven tick: portraits are optional, so a placeholder would read as owed.
- **Donate's owed facts wait on the Zeffy form.** The give-now facts (fees, receipt, monthly) describe how
  the owner's Zeffy form is set up, so they are fact rows with their values owed; only "If the form fails"
  is ours to state. The check, matching and fund rows take the address, the EIN and the legal name from the
  settings through a `kind` on each other way.
- **Optional is not owed.** The nine association names leave the registry: the register calls prose only
  the safe default, so no chip asks for a list the owner may never publish.
- **New homes for what the prototypes draw.** `impactPage.howWeWorkImage`, `storyPage.foundingFacts[]`,
  `storyPage.foundingImage`, `storyPage.takePart[]`, `donatePage.giveNow.facts[]` and a reference from the
  associations block to its stat; `impactPage.nextYear.blurb` retires for the partnerships contact's
  sentence.

## Considered options

- Page-owned fact rows for the civic cells and the governance positions: rejected, a second copy of an
  edition's facts and of the documents that already exist.
- An outcome keyed to programs only, with a free title for Odunde: rejected, the festival's card would
  link nowhere and its slot could not be matched.
- The prototypes' summer camp photographs beside How we work and How it began: rejected, the register
  allows them only under a summer camp caption, and the camp's year (2018 or 2019 by the evidence in the
  photographs) contradicts "before Odunde".

## Consequences

- The seed gains revisions: a stored value that still reads exactly as an earlier seed wrote it moves to
  the new seed's value, and a value anyone edited stays. Phase 7 uses it for the two header actions, Get
  Involved's door list and Impact's six captions; the seed still never inserts into a list the owner
  changed.
- `event` and `person` reach `/impact` and `stat` reaches `/get-involved`; the Presentation locations and
  cache tags follow the route map.
- CONTENT-MODEL section 3's `impactPage.governance`, `storyPage.timeline` entries with titles and
  `donatePage.otherWays` of title and blurb read as amended here.
