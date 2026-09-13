# 10: Collective events

Labels: design, content
Status: resolved
Blocked by: 08

**What to build:** `/programs/cultural-collective` lists "Collective events" by ADR 0030: every dated
collective event still to come, nearest first, each row with its month and day, title, summary, weekday
and time with the venue or its chip, and a quiet "Ask to join" opening `contact`; with nothing to come,
the heading and the registry's Pending line. `events` hidden drops the section and the header's "See what
is on".

- [x] `@oy/content`: the collective rule beside the edition rule, tested in Los Angeles time (an event
      without an end counts until its start day ends; an undated one never lists); the venue row for the
      collective kind and the presence row for events still to come, `presenceWhat` finding a row by kind;
      the query reads dated collective events; TypeGen
- [x] `@oy/ui`: `ListRow`'s event form (date block, body, where line, action) with its chips and the
      exemption its date block needs; stories and tests
- [x] `packages/web`: the builder carries the events, the option and the header's anchor; tested with
      events before, during and after their day
- [x] `Pages/Collective/Events` stories (shown, hidden); Playwright: the Pending line with no events
- [ ] Playwright: "Ask to join" opening the contact form with focus returning, which runs once a dated
      collective event exists in the dataset (none does; the trigger's markup is unit-tested)

## Comments

13 September 2026. `@oy/content`: `collectiveEvents` beside the edition rule (dated collective events
until their end, or with no end until their start day ends in Los Angeles, nearest first; an undated one
never), tested across the Los Angeles midnight; the collective kind's venue row ("the venue"); the
presence row "the next Collective events", whose GROQ (an end ahead, or no end and a start within the
last day) was run against the development dataset; `presenceWhat(type, kind)` picking a row by kind as
`pendingWhat` does; the query reads every dated collective event. `@oy/ui`: `ListRow` `kind="event"` (the
month and day, the title, the summary, "Saturday, 10am" with the venue or its chip, a quiet action) with
`monthDay` and `weekdayTime` in Los Angeles time and the `.oy-lrow-date span.oy-pend` exemption; `EventList`
(the rows or the Pending line). `packages/web`: the builder lists the events by the rule with "Ask to join"
opening `contact`, and `events` hidden drops the section and the header's `#events` action; tested before,
during and after an event's day. `Pages/Collective/Events` (shown with bracketed rows, pending, hidden).
Playwright: 20 passed seeded and 20 with the placeholder project. The development dataset holds no
collective event, so the page shows the Pending line and the "Ask to join" loop (the contact form opening,
focus returning) runs only once one exists; the row's trigger markup is unit-tested and the modal's
behaviour is the enquiry suite's.
