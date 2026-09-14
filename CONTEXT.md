# Omo Yorùbá site

Shared vocabulary for the website of Omo Yorùbá of Southern California. Use these terms in
code, tickets, schema, stories and copy. `/domain-modeling` sharpens them as the content
model settles.

## Language

### Events and programs

**Odunde**:
The June festival at Leimert Park. One word in display text since 1 September 2026; with
marks in the nav (Ọdúndé); lowercase `odunde` in URLs and file names.
_Avoid_: splitting it into two words (the older design system spelling), "the festival" without a name

**Gala**:
The End-of-Year Gala, November or December. Seats go to Eventbrite; tables are an enquiry.
_Avoid_: dinner, banquet, fundraiser

**Edition**:
One running of an event (Odunde 2027, Gala 2026), kept as one `event` document. Every fact
that changes from year to year lives on the edition: dates, venue, cost, dress, schedule,
vendor terms, tickets.
_Avoid_: the festival page's date, this year's gala, the current event's settings

**Next edition**:
The edition an event page shows: the nearest edition of the page's kind still to come. Between
editions it may not exist yet, and its facts read Pending.
_Avoid_: current edition, active event, this year's festival

**Past years**:
The photographs of the newest past edition of a kind, from its album, closing an event page (past
galas on the Gala page). The only place a past edition appears on an event page.
_Avoid_: recap, archive, previous events

**Zone**:
One of the festival's areas. Named zones: Ọjà Balógun (the market), Àgbàlá Ọmọde (the
children's yard). Two are unnamed and pending; the festival page names them as placeholders up to
the four confirmed.
_Avoid_: area, stage, village

**Vendor terms**:
One festival edition's booth fees, application close and decision dates, and permit note.
_Avoid_: vendor pricing, booth rates

**Ticket tier**:
One way into the Gala: seats bought through Eventbrite, or a table of ten arranged by enquiry.
_Avoid_: ticket type, package, price point

**Sponsor level**:
A named level of sponsorship with its amount and what it is recognised with.
_Avoid_: sponsorship tier, sponsor package

**Honoree**:
A person or organization the Gala recognises in an edition. The block stays hidden until the owner
says the Gala gives awards.
_Avoid_: awardee, honouree (spelling)

**Lessons**:
Yoruba Language Lessons. One teacher, live online, enrol by writing to her.
_Avoid_: School, classes, Saturday school, term

**Teacher**:
The one person who teaches the Lessons. A reader reaches her through the enrol form or her
routing contact; her name and portrait are hers to give.
_Avoid_: teachers, head teacher, tutor, instructor

**Collective**:
The Yoruba Cultural Collective. Solar Hub and Green Goods are its two initiatives. Green belongs
to the Collective's content and to nothing else on the site.
_Avoid_: YCC in copy, sustainability program

**Initiative**:
One of the Collective's member-led projects, Solar Hub or Green Goods, with its status line, who
it serves, when it started and what comes next.
_Avoid_: venture, program (a program is one of the four)

**Status line**:
An initiative's state in the Collective's own words, beside its plainer status: planned,
piloting or running.
_Avoid_: badge, tag, progress

**Collective event**:
A one-off gathering the Collective hosts, listed on its page while it is dated and still to
come. Never an edition: it has no season and no year before or after it.
_Avoid_: edition, meetup, class

**Program**:
One of four: Lessons, Collective, Kids & STEM, Cultural Exchange. Only Lessons and the
Collective have their own page; Kids & STEM and Cultural Exchange are inline programs,
described in full on the Programs hub.
_Avoid_: programme in code and copy (US spelling), course

**Sub-program**:
One of the two halves of Kids & STEM: Àgbàlá Ọmọde, the children's program that also runs as
the festival's children's yard of the same name, and the STEM Hub. Each has its own ages and
what it offers.
_Avoid_: track, class, subprogramme

**Year strip**:
The Programs hub's one-year view of when each program and event runs, each with a short
note.
_Avoid_: calendar, timeline (that is Our Story's), schedule

### Site parts

**Take-part band**:
The closing rows of a page: its take-part rows, in the page's order.
_Avoid_: CTA section, footer CTA

**Way in**:
One of the nine things a visitor can do from a take-part band: vendor, sponsor, performer, volunteer,
table, give, enrol, member, updates. Each has its accent and opens its enquiry kind, the Give Dialog, or
for updates the newsletter form.
_Avoid_: channel, CTA type, path

**Take-part row**:
One row of a take-part band as the page keeps it: a way in with its title, line and button label, and
the page's own name for the way in where it differs (the Collective calls its sponsor row Partner).
_Avoid_: path row (the component that draws it), CTA row

**Green scope**:
The Collective page's content, where green may appear; the nav, the footer and the dialogs sit
outside it.
_Avoid_: green theme, collective mode

**Door**:
One of the Get Involved entry points (member, volunteer, vendor, partner, give), kept once as a
`door` document and shown by the homepage, Get Involved and Donate. Renders as a card, a card
laid out as a row, or a path row; on Get Involved the give door closes the page as a box.
_Avoid_: tile, option, pathway

**Glance strip**:
The at-a-glance facts under a page header.
_Avoid_: key facts, info bar

**Kicker**:
The Yoruba • English uppercase label above a heading, stored as `{ yo, en }`. English is
always present; a kicker with no Yoruba half ("Coming up next") is the single form.
_Avoid_: eyebrow, overline, tagline

**Give Dialog**:
The dialog every Donate button opens; wraps the Zeffy embed with a fallback.
_Avoid_: donate modal, checkout

**Enquiry Modal**:
The one dialog shell every owned form opens in, with eight field sets.
_Avoid_: contact form, popup

**Handoff**:
A money step we do not own (Zeffy, Eventbrite, a hand invoice). Also the closing line on a
page that says where it hands off.
_Avoid_: redirect, integration

**Dark scope**:
The `.oy-dark` wrapper that flips headings, links and the focus ring for dark bands.
_Avoid_: dark mode, dark theme

**Grain-dots**:
The chosen card texture, `data-card="grain-dots"` on the page root.
_Avoid_: noise, paper grain

**Trust line**:
The footer line "501(c)(3) nonprofit since 1997 • EIN XX-XXXXXXX • Los Angeles, CA"; the EIN
reads XX-XXXXXXX until the site settings hold it.
_Avoid_: legal line, footer credits, disclaimer

**Mobile menu**:
The full-screen indigo overlay the burger opens under 880px (the ported CSS breakpoint; the
brief said 760): the same links flattened, Events as a group label, Donate at the bottom.
_Avoid_: hamburger menu, drawer, nav sheet

**Cross-fade**:
The 380ms fade between pages, with the 2px gold progress bar while the next page loads; off
under reduced motion. The only page-level motion.
_Avoid_: page transition, view transition (the mechanism), animation

**Lightbox**:
The full-screen dialog on an album page that shows one photograph at a time: the whole photograph, its
caption and photo credit, the count, previous and next, and a close. Opened from a photograph or a photo
address; Back closes it.
_Avoid_: viewer (except as the value of the gallery's `open` option), modal, slideshow, carousel (that is
the event pages' framed carousel)

**Photo address**:
An album page's address with `?photo=<key>`, naming one of its photographs. It opens the Lightbox on that
photograph, on load too, so it can be shared.
_Avoid_: deep link in copy, permalink, share link

**Track event**:
A named analytics event a component announces (enquiry_opened, give_opened, newsletter_submitted)
for the site to forward; components never talk to the analytics service themselves.
_Avoid_: analytics call, capture, ping

### Forms

**Trigger**:
The button or link that opens a dialog for a kind; focus returns to it on close. Without
JavaScript it is a link to the same page with the modal open.
_Avoid_: opener, CTA, launcher

**Action result**:
What an owned form's action answers with: ok with the success copy, or not ok with a summary
sentence, one sentence per field and the values as typed.
_Avoid_: response, error object, payload

**Summary**:
The one sentence at the top of a form on error, announced as an alert, naming what is missing
or wrong. Nothing typed is cleared.
_Avoid_: error banner, toast, validation message

**Success block**:
The "Ẹ ṣé! ✓" block that replaces the fields after a submission, with the plain sentence that
says what happens next and who writes.
_Avoid_: thank-you message, confirmation, toast

**Human fallback**:
The line beside every form naming the general email and phone for anyone who would rather
speak to a person; Pending while the settings are empty.
_Avoid_: contact info, help text, support link

**Honeypot**:
A hidden field a person never fills. A filled one answers success and writes nothing.
_Avoid_: spam trap, bot field, captcha

**Address cap**:
The limit of five enquiries an hour from one reply-to address, checked in Sanity; a capped
address is told to write to the general inbox.
_Avoid_: rate limit (the generic mechanism), throttle, ban

**Subscriber**:
A newsletter address kept as a `subscriber` document until a provider is named; a repeat signup
reads as success and changes nothing; nothing sends.
_Avoid_: newsletter enquiry, lead, contact, mailing list entry

**Bottom sheet**:
The Enquiry Modal's shape under 720px: pinned to the bottom edge with a grab handle look and no
drag behaviour.
_Avoid_: drawer, mobile modal, tray

### Content

**Enquiry**:
A submission of one of the eight owned forms (sponsor, performer, table, member, volunteer,
enrol, vendor, contact). Becomes an `enquiry` document, then an email. The newsletter is not
an enquiry: it becomes a `subscriber` document.
_Avoid_: lead, submission, request, newsletter enquiry

**Routing contact**:
An entry in the site settings that receives one or more enquiry kinds: a role, a name, an
email, a phone and a response line. It names the person in a form's success copy; when it is
empty the copy names the role instead.
_Avoid_: named contact in code, hard-coded address, coordinator field

**Pending**:
An empty required-for-launch field. Renders a named chip on the site and a row in the
Studio Pending view.
_Avoid_: placeholder flag, TODO, lorem ipsum, mock

**Pending registry**:
The one list of required-for-launch fields with the wording of what is missing. The Studio
Pending view and the site's chips both read it.
_Avoid_: placeholder list, TODO list, missing-content map

**Presence pending**:
A Pending row for a document type with no documents yet (people, partners, testimonials) or
fewer than expected (zones). A field query cannot find what does not exist.
_Avoid_: empty state, missing content, zero results

**Lint report**:
The document the `content-lint` function writes for a published document whose text breaks
the voice rules. Listed in the Pending view; empty when the document is clean.
_Avoid_: validation error, warning email, lint failure

**Stat**:
A sourced figure kept once as a `stat` document and referenced, in order, by the pages that
show it.
_Avoid_: number, metric, KPI, headline figure inline

**Source line**:
The line under a figure saying which year it covers and how it was counted. A figure without one
shows its chip until the owner writes it.
_Avoid_: citation, footnote, reference

**Outcome**:
What one program or event (the festival, the Gala) produced: a figure with its source line, or a
plain statement of what is being measured. Shown on Impact, one subject each.
_Avoid_: result, impact metric, KPI

**Slot**:
The place a page keeps for a voice or an outcome it expects, drawn with the chip and the name of
what it waits for until a document fills it.
_Avoid_: placeholder card, mock, sample

**Governance document**:
A Form 990, an annual report or an audit position, kept as a file or as a note such as "Copies on
request". Impact shows the newest of each kind and names a missing one.
_Avoid_: financials, filing, paperwork

**Timeline entry**:
A year or a span of years and one line on Our Story's timeline; a milestone (the founding, today)
is drawn apart from the rest.
_Avoid_: event (that is an edition), history item

**Giving level**:
An amount and what it pays for, with the source of the cost. Donate shows each as an outcome card.
_Avoid_: donation tier, preset, amount selector

**Other way to give**:
A way to give besides the Give Dialog: by check, employer matching, in-kind goods, a donor-advised
fund. The check row carries the mailing address, and the matching and fund rows the EIN and the legal
name, from the site settings.
_Avoid_: offline donation, alternative payment

**Hometown association**:
One of the nine family and town networks inside the community. Listing their names is optional;
the page describes them in prose until the owner adds them.
_Avoid_: HTA in copy, chapter, club

**Album**:
The photographs of one occasion, an edition or an occasion with no edition such as the summer camp, with
its own page on the gallery, one photo credit and its consent note. Its year is its own date's, else its
edition's.
_Avoid_: set, collection, gallery (the page of every album)

**Cover**:
The photograph an album shows on its tile on the gallery; the album's first photograph when none is chosen.
_Avoid_: thumbnail, hero image

**Photo credit**:
Who took an album's photographs, printed as "Photographs:" and the name, with its chip until the photographer
confirms it. A photograph carries its own only where it differs from the album's.
_Avoid_: attribution, byline, copyright line

**Consent note**:
What one album says about faces and permission beyond the gallery's own policy, shown under its photo credit.
_Avoid_: disclaimer, release, waiver

**Confirmed fact**:
Content the client has supplied (list in `docs/design/CONTENT-MODEL.md` section 1).
Everything else is pending.
_Avoid_: assumed, approximate, sample

**Layout option**:
A Studio field mirroring a design tweak prop, with the same name across pages.
_Avoid_: variant flag, feature toggle

**Page root**:
The body's data attributes that carry a page's layout options (`data-highlight`, `data-pattern`,
`data-motion` and the rest), which the ported CSS reads.
_Avoid_: theme wrapper, page state

**Lead event**:
The one edition the homepage's event band shows: the editor's explicit choice, else the season
rule's pick (the nearest dated upcoming festival or gala, else the calendar: festival January to
June, Gala July to December). A past edition never leads.
_Avoid_: next event, featured event, current event

**Draft mode**:
A request carrying the perspective cookie the Presentation tool set: reads come back as drafts
with stega, the overlay mounts, and the response is never cached.
_Avoid_: preview mode, visual editing mode, the draft cookie (the mechanism)

**Preview host**:
The second hostname of the same deployment the Presentation tool previews on, never cached, so an
editor never meets the public copy. Optional; the Studio's own origin until it exists.
_Avoid_: preview deployment (Vercel's protected branch builds), staging

**Type tag**:
The cache tag `type:<document type>` a public page carries for every type that reaches its route,
and the tag a publish purges.
_Avoid_: route tag (purged as a path), cache key

**Purge**:
What `/api/revalidate` does with a published document's tags through the cache provider; soft, so
the stale copy serves once more while the CDN revalidates.
_Avoid_: invalidation (the provider's verb), cache bust, revalidate (the route's name)

**Edit attribute**:
The `data-sanity` attribute the site writes on an image or an option's container so click-to-edit
reaches a field stega cannot mark. Rendered in draft mode only.
_Avoid_: data attribute, overlay hook

**Elder test**:
Readable by an elder on a phone in sunlight: AA contrast, 17px body, 44px targets.
_Avoid_: accessibility pass

**Word list**:
`packages/lint/yoruba-terms.json`, the one map of bare Yoruba forms to their marked forms,
shared by the repo lint, the Sanity validation and the content-lint function.
_Avoid_: dictionary, glossary (that is the copy glossary in the `oy-voice` skill)
