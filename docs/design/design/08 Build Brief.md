# Build brief: Omo Yorùbá of Southern California, eleven new pages

Paste everything below the line into a new session in this project.

---

## What you are doing

Building eleven new pages for omoyorubaofsocal.org at full design fidelity, from
approved wireframes that already exist in this project. The structure, section
order, content volume, and interaction patterns are settled. Do not re-plan them.
Your job is to design and build.

## Read these first, in this order

1. `06 Site Wireframes.dc.html` — the approved plan. Twelve canvases: a sitemap
   plus eleven pages. Every section is a numbered block with its purpose, how
   much content it holds, which components it reuses, which are new, and what is
   pending from the client. The right rail on each canvas carries the thirty-second
   read for three audiences (grant reviewer, first-time family, returning member)
   and where the page hands off. Build what the blocks say.
2. `07 Interaction Inventory.dc.html` — fourteen interactions with the rule
   governing each: inline, modal, own page, or handoff. This is binding. It also
   names the six components that carry every interaction.
3. `01 Components.dc.html` — the reference copy of the site chrome. Nav, hero,
   footer, buttons, card variants, photo tiles, event band, stats, kickers,
   dividers, form, socials, logo, colour and pattern swatches. Take chrome from
   here, do not rebuild it.
4. `02 Homepage.dc.html` — the live homepage, the fidelity bar to match.
5. `oy-components.css` — the shared interaction layer. Sticky nav, card hover
   (border deepens, title warms to terracotta, arrow slides, 2px aṣọ òkè rule
   draws under the action), no lift, no drop shadow, no layout shift anywhere.
   Extend this file rather than writing per-page interaction CSS.

Skip `03 Homepage Explorations`, `04`, and `05`. They are history.

## The design system is binding

The Omo Yorùbá design system is bound to this project. Load its token
stylesheets and bundle in the helmet of every page, exactly as `02 Homepage.dc.html`
does. Non-negotiables:

- "Odunde" as one word in all display text (decision, 1 Sep 2026; overrides the design system's original two-word rule). File names keep "Odunde" for now.
- Full diacritics on every Yoruba word: Ọjà Balógun, Àgbàlá Ọmọde, Ẹgbẹ́ Ìbílẹ̀,
  Ẹ káàbọ̀, Ẹ ṣé.
- Indigo carries 60 to 70 percent of visual weight. Gold is for actions and
  celebration only, one gold primary action per screen view. Terracotta warms
  kickers and festival moments. Green stays inside Cultural Collective content.
- Pattern is texture, never costume. Àdìrẹ dot fields, aṣọ òkè stripes, ayo dot
  rows, all at low opacity. Never kente, never Adinkra.
- WCAG AA, 17px minimum body, 44px minimum touch targets. An elder must be able
  to read this on a phone in sunlight.
- No em dashes in UI copy. Commas, periods, colons.
- No emoji. The only glyphs are • → ✓ ×.
- Sentence case for headings and buttons. Kickers and path chips are the only
  uppercase elements.
- Motion is modest: buttons settle on press, cards change border and colour, the
  photo inside a still frame breathes. No lift, no parallax, no scroll animation.

## Content rules, absolute

Nothing is invented. No dates, prices, dollar figures, quotes, names, statistics,
schedules, or biographies that the client has not supplied. The wireframes mark
every gap with an orange pending chip. Wherever a chip appears, ship a visible
placeholder that names what is missing, in the design system's placeholder style,
so the client can see exactly what they owe.

The only facts you may state: 501(c)(3) since 1997, Los Angeles, the Odunde
Festival at Leimert Park each June, the End-of-Year Gala in November or December,
the Yoruba Language School, taught weekly online by one teacher, enrolment by contacting her, the Yoruba Cultural Collective with its
Solar Hub and Green Goods initiatives, Kids & STEM including Àgbàlá Ọmọde and the
STEM Hub, Cultural Exchange, and the four figures already live on the homepage:
29 years, 3,000+ community, 5 festival zones, 9 hometown associations. EIN is
"XX-XXXXXXX" until supplied.

Photography does not exist yet. Every image is a captioned placeholder block that
names the future photo, at a fixed aspect ratio, using the design system's
placeholder fills. The existing `images/` folder has a handful of usable shots
already on the homepage; reuse those where a wireframe block calls for the same
subject, and place a named placeholder everywhere else.

## Order of work

Build in this order. Do not start page one until step one is done.

**Step 1, the shared layer.** This step is the point of the whole build. Nothing
on these eleven pages should be designed twice. Before any page exists, extend
`01 Components.dc.html` and `oy-components.css` with every component the
wireframes call for more than once, then build every page out of that library.

Build these, each with its states and variants, each shown in the component
canvas with a short note on where it is used:

| Component | Variants to build | Used on |
| --- | --- | --- |
| Page header | Slim (no photo), photo band | All eleven |
| At a glance strip | 4 and 5 facts | Odunde, Gala, Language School, Collective |
| Take-part band | 2, 3, and 4 rows, reorderable | Nine pages |
| Person card | With portrait, without portrait, compact | People & History, Language School |
| Schedule row | Time-led, day-led | Odunde, Gala, Language School |
| Zone card | Yoruba name, translation, line, photo | Odunde |
| List row | News, event, sponsor tier, path | News, Gala, Get Involved |
| Filter chip row | With and without year dropdown | News, Gallery |
| FAQ accordion | Single and multi open | Language School, and later others |
| Ticket tier card | Buy-now and enquiry variants | Gala |
| Amount selector | One-time and monthly | Donate |
| Enquiry modal shell | Sponsor and performer field sets | Five pages |
| Multi-step inline form | Two and three step | Language School, Odunde |
| Outcome and legitimacy block | With and without figures | Impact, Donate |
| Album tile and lightbox | Album grid, full-screen overlay | Gallery |
| Year strip | Programme cadence across the year | Programs |

The nav also needs one change: two dropdowns, Events holding Odunde and the
Gala, About holding People & History, flattened on mobile.

**The component canvas is the single source of truth, and it stays that way.**
Every time a page needs something that does not exist yet, build it in
`01 Components.dc.html` first, with its variants and hover and error states, and
only then use it on the page. Every time a page needs a variant of something that
does exist, add the variant to the canvas rather than overriding it locally.
Shared interaction and chrome CSS goes in `oy-components.css`, once. Structural
layout stays inline on each page.

A page should read as an arrangement of library parts plus its own layout and
copy. If a page file contains a new visual treatment that no other page could
use, that is a signal it belonged in the library. At the end of each step, update
the component canvas so it still describes the real system, and note in your
summary what was added to it.

**Step 2, the two event pages.** `08 Odunde Festival`, `09 End-of-Year Gala`.
Highest traffic, most new components, and they prove the shared layer works.

**Step 3, programs.** `10 Programs`, `11 Yoruba Language School`,
`12 Yoruba Cultural Collective`.

**Step 4, conversion and trust.** `13 Get Involved`, `14 Impact`,
`15 People & History`, `16 Donate`.

**Step 5, content.** `17 News & Events`, `18 Photo Gallery`.

Continue the numbered file naming. One Design Component per page.

## How the pages must hold together

Four handoffs repeat across the set and are what stop eleven pages becoming
eleven islands:

- Every page that makes a claim links to Impact. Every page that shows a face
  links to People & History.
- Both event pages close with the same take-part band, reordered per page.
- Every program page closes with enrol, volunteer, give.
- The footer carries the newsletter on every page, so no page gets its own band.

The specific handoffs per page are listed in each canvas's rail. Honour them.

## Interactions

Implement from `07 Interaction Inventory.dc.html`. The short version:

- Six inline forms we own end to end: newsletter, membership, volunteer,
  enrolment, vendor application, general contact. Long forms keep the page
  around them and never become modals.
- Three modals: sponsor enquiry (triggered from five pages), performer enquiry
  (same shell), Gala table reservation. Escape closes, focus returns to the
  trigger, focus is trapped while open.
- Three handoffs where money moves: donation amount and frequency chosen on our
  page then out to Zeffy, Gala seats out to Eventbrite in a new tab, table
  reservations invoiced by hand. Our design covers the decision, the platform
  covers the card.
- Two browsing behaviours: album pages with a deep-linkable lightbox, and inline
  filtering that writes itself into the address bar and never reloads.

Success on any form we own opens with "Ẹ ṣé! ✓" and is followed by a plain
sentence saying what happens next. Errors are sentences naming the field, never
colour alone, and never clear what was typed. Every form shows a human fallback
beside it. Nothing opens on load: no entry pop-up, no scroll-triggered
newsletter, no exit intent.

Forms are prototypes, so submissions do not need a backend. Wire the states:
empty, filled, submitting, success, error.

## Tweaks, on every page

Every page gets three to five props so the client can see real variations without
a new round of work, following the pattern in `02 Homepage.dc.html`. Tweaks are
for things in-place editing cannot do: alternative treatments, section order, and
flags that change several elements at once. Not for single strings or colours,
which are editable directly.

Each page should carry at least one layout tweak, one density or emphasis tweak,
and one that reflects an open argument from the wireframe rail, so the choice can
be made by looking rather than discussing. Suggested starting sets:

- **Odunde** — header photo band or slim; zone cards as five across, grid, or
  list; schedule shown or collapsed; take-part band order (vendor first or
  sponsor first).
- **Gala** — formal or warm treatment; tier cards as three columns or stacked
  rows; awards block shown or hidden; ticket emphasis (seats first or tables
  first).
- **Programs** — cards four across or two by two; inline programs expanded or
  collapsed; year strip shown or hidden.
- **Language School** — enrolment form inline at block 8 or pinned as a sticky
  bar; audience cards or a plain list; teachers with or without portraits; FAQ
  open or closed by default.
- **Cultural Collective** — green accent strength; initiatives side by side or
  stacked; status lines shown or hidden.
- **Get Involved** — four doors or four path rows; forms expanded or collapsed
  behind their door; hometown association block shown or hidden.
- **Impact** — stat strip of four or six; source lines shown or hidden;
  outcomes as cards or rows; funder block shown or hidden.
- **News & Events** — events-led or feed-led order; calendar as rows or cards;
  filters shown or hidden.
- **Gallery** — album tile density; captions always on or on hover.
- **People & History** — board and staff with or without portraits; bios short or
  full; timeline shown or hidden, which settles that open argument.
- **Donate** — amount presets of four or six; monthly as a toggle or a second
  tab; impact block shown or hidden.

Keep the prop names consistent across pages where they mean the same thing, so
the tweak panel feels like one system.

## Open arguments the client has not settled

Raise these rather than silently deciding:

- Gala tables as an enquiry rather than a purchase.
- The two unnamed festival zones. If there are not five, the block becomes three
  cards plus a general programme line.
- Whether the Gala gives awards. If not, cut that block.
- A timeline on People & History, which they did not ask for and I would still
  argue for.
- The real cadence of news posts, which decides whether that page is a feed or a
  single well-kept list.

## Do not

- Do not redesign the homepage, the nav, the footer, or the card hover language.
- Do not build a one-off version of something that already exists in the
  component canvas, and do not override a shared component's styling locally.
  Add the variant to the library instead.
- Do not add sections the wireframes do not have. If you think one is needed, ask.
- Do not invent content to fill a block that looks empty. An empty-feeling
  section is a layout problem.
- Do not use stock photography, AI-generated people, or drawn SVG illustration of
  people or objects.
- Do not build a page per program beyond the two specified. Kids & STEM and
  Cultural Exchange stay inline on the Programs hub.

## Done means

Each page opens cleanly, matches its wireframe block for block, is assembled
from the shared library rather than restyled raw HTML, honours its handoffs,
carries its tweaks, passes AA contrast in every state, works at 375px and 1440px,
and shows a named placeholder everywhere the client still owes content.

`01 Components.dc.html` must, at the end, contain every shared component the
eleven pages use, with its variants and states, and be usable as the starting
point for the next page anyone builds.


## Polish pass 2 (1 September 2026)

Decisions carried into the files:

- Cards: 6px corners, paper ground, indigo hairline, 8px aṣọ òkè top edge, faint àdìrẹ dot field. Image containers square. No image zoom anywhere. Lives in oy-components.css, so it applies to every page.
- Header wordmark: "Omo Yorùbá of Southern California" in Source Serif, two lines; the second line drops under 1060px.
- Every form action opens the Enquiry Modal: dialog on desktop, bottom sheet under 720px.
- Take-part band: fixed-width label column by default; "none" and "kicker" variants exist. Rows carry a colour accent per way in (vendor, sponsor, performer, volunteer, table, give).
- Odunde: five zones as an uneven mosaic; schedule can be hidden (CMS); past years is an inline framed carousel (Photo Carousel.dc.html).
- Gala: one "Sponsor the Gala" action; honourees, running order, and past galas hideable; past galas carousel.
- Programs: three-card variant. Language School: online, one teacher, write-to-enrol (how she wants enquiries is pending).
- Collective: member-led label on Solar Hub and Green Goods, CMS events section.
- Gallery: no filters, album mosaic, opening an album opens the viewer, credits per album.
- Donate: Zeffy embed inside our card (their embed shows only amount and payment fields; their API is read-only, so no custom checkout). Partner/sponsor doors moved up.
- Nav: "News" instead of "News & Events"; Contact lives in the footer only.

## Polish pass 3 (2 September 2026)

- Nav: About dropdown replaced by a plain "Our Story" link to People & History. Contact stays in the footer.
- Card texture lab on the Components page (#card-lab): A current, B paper grain, C grain + àdìrẹ dots, D grain + indigo wash. Picked C: data-card="grain-dots" is set on .oy-home on every page. Cards only.
- Donate: every Donate button on the site opens Give Dialog.dc.html (mounted from Site Nav). The dialog wraps Zeffy's embed; if it fails to load, it offers Contact us and a mailing address. Donate page keeps a single "Give now" button plus partner/sponsor doors. #give in the URL opens the dialog on load.
- Yoruba Language Lessons (was School): one teacher, live online, times set with her individually, fees agreed with her. No terms, no Saturdays, no venue. Page slimmed to teacher + contact, levels, one lesson, five FAQs, take part. Enquiry modal "enrol" kind now asks when suits you instead of term.
