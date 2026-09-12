# Put the recap post's title back in the development dataset

Type: task
Status: open
Owner: yes
Labels: content
Phase: 4
Blocked by: none

## Question

A seed run on 12 September 2026 wrote the prototype's spelling to the recap post in the
`development` dataset before ADR 0009 was checked. In the Studio, open News, the post
`news-odunde-2026-recap`, and change its title from "Ọdúndé 2026: the recap" to "Odunde 2026: the
recap" (display text keeps "Odunde" unmarked; ADR 0009 and ADR 0023). The seed no longer writes the
marked form, and a scripted patch was not allowed from the Phase 4 session. Publish; the homepage's
news card shows the corrected title.
