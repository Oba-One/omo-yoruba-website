# Collective events list while they are dated and still to come

Decided with the owner on 12 September 2026 (Phase 6 grill, Q11). The Collective page lists its events
from `event` documents of kind `collective`, but ADR 0024's edition rule does not fit them: an Odunde or
a Gala is one running of a yearly event with a season, so an undated edition can be read against the
calendar, while a Collective event (a circle, a workshop, a site visit) is a one-off with no season. So
they have a rule of their own: every collective event with a start lists while it is still to come, read
as ADR 0024 reads a dated edition (until its end, or with no end until its start day ends in Los
Angeles), nearest first. An event without a start never lists: there is no season to place it in, and a
row that says "date pending" forever reads as a stale page. With nothing to come, the section keeps its
heading and shows the registry's Pending line, counted by a presence row for collective events still to
come, so the page and the Studio's Pending view say the same thing.

## Considered options

- ADR 0024's rule as it stands: rejected; `upcoming` reads an undated edition by its kind's season, and a
  collective event has none, so every undated event would either list forever or never.
- Undated events listed last with the date's chip: rejected; the Collective's events are entered when
  planned, and a list of undated rows cannot say which is next.
- A plain empty-state sentence instead of the Pending line: rejected for consistency with ADR 0024 and
  ADR 0028; the owner has entered no events yet, so the line names what the page is waiting for.

## Consequences

- The Studio's presence row reads "still to come" in GROQ as a start within the last day or an end still
  ahead; the site's reading is the Los Angeles day, so on the day of an event without an end the two can
  differ by hours.
- A page cached before an event ends keeps listing it until the next render (one day at most, ADR
  0021), as the event pages keep an edition.
- The homepage band and the event pages still read festival and gala editions only.
