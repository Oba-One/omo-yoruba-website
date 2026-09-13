# 10: Collective events

Labels: design, content
Status: open
Blocked by: 08

**What to build:** `/programs/cultural-collective` lists "Collective events" by ADR 0030: every dated
collective event still to come, nearest first, each row with its month and day, title, summary, weekday
and time with the venue or its chip, and a quiet "Ask to join" opening `contact`; with nothing to come,
the heading and the registry's Pending line. `events` hidden drops the section and the header's "See what
is on".

- [ ] `@oy/content`: the collective rule beside the edition rule, tested in Los Angeles time (an event
      without an end counts until its start day ends; an undated one never lists); the venue row for the
      collective kind and the presence row for events still to come, `presenceWhat` finding a row by kind;
      the query reads dated collective events; TypeGen
- [ ] `@oy/ui`: `ListRow`'s event form (date block, body, where line, action) with its chips and the
      exemption its date block needs; stories and tests
- [ ] `packages/web`: the builder carries the events, the option and the header's anchor; tested with
      events before, during and after their day
- [ ] `Pages/Collective/Events` stories (shown, hidden); Playwright: the Pending line with no events, "Ask
      to join" opening the contact form with focus returning

## Comments
