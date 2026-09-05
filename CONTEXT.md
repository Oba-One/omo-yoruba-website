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

**Zone**:
One of the festival's areas. Named zones: Ọjà Balógun (the market), Àgbàlá Ọmọde (the
children's yard). Two are unnamed and pending.
_Avoid_: area, stage, village

**Lessons**:
Yoruba Language Lessons. One teacher, live online, enrol by writing to her.
_Avoid_: School, classes, Saturday school, term

**Collective**:
The Yoruba Cultural Collective. Solar Hub and Green Goods are its two initiatives. Green
colour lives only here.
_Avoid_: YCC in copy, sustainability program

**Program**:
One of four: Lessons, Collective, Kids & STEM, Cultural Exchange. Only Lessons and the
Collective have their own page.
_Avoid_: programme in code and copy (US spelling), course

### Site parts

**Take-part band**:
The closing rows on nine pages (vendor, sponsor, performer, volunteer, table, give),
reordered per page.
_Avoid_: CTA section, footer CTA

**Door**:
One of the four Get Involved entry points (member, volunteer, partner, give). Renders as a
card or a path row.
_Avoid_: tile, option, pathway

**Glance strip**:
The at-a-glance facts under a page header.
_Avoid_: key facts, info bar

**Kicker**:
The Yoruba • English uppercase label above a heading, stored as `{ yo, en }`.
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

### Content

**Enquiry**:
Any owned form submission. Eight kinds plus newsletter. Becomes an `enquiry` document,
then an email.
_Avoid_: lead, submission, request

**Pending**:
An empty required-for-launch field. Renders a named chip on the site and a row in the
Studio Pending view.
_Avoid_: placeholder flag, TODO, lorem ipsum, mock

**Confirmed fact**:
Content the client has supplied (list in `docs/design/CONTENT-MODEL.md` section 1).
Everything else is pending.
_Avoid_: assumed, approximate, sample

**Layout option**:
A Studio field mirroring a design tweak prop, with the same name across pages.
_Avoid_: variant flag, feature toggle

**Elder test**:
Readable by an elder on a phone in sunlight: AA contrast, 17px body, 44px targets.
_Avoid_: accessibility pass

**Word list**:
`packages/lint/yoruba-terms.json`, the one map of bare Yoruba forms to their marked forms,
shared by the repo lint, the Sanity validation and the content-lint function.
_Avoid_: dictionary, glossary (that is the copy glossary in the `oy-voice` skill)
