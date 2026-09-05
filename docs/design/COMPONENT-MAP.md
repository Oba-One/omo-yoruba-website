# Component map

Every visual part of the site, built once in `packages/ui`, with a colocated
story and test. Reference for each: `design/01 Components.dc.html` (the canvas,
every variant with a note on where it is used), `design/oy-components.css` (the
interaction layer), the design system `css/components.css` (base `.oy-*` classes),
and the page files where the component appears.

Conventions:

- Path: `packages/ui/src/<group>/<Name>/<Name>.astro`, `<Name>.stories.ts`,
  `<Name>.test.ts`, optional `<Name>.css` when styles are long. Scoped `<style>`
  in the `.astro` file by default; tokens via `var(--*)` only, no literal colours.
- Class names keep the `.oy-*` vocabulary from the CSS so the ported stylesheet
  applies and the prototypes remain readable side by side.
- Images: props accept `ImageMetadata | string | SanityImageSource`; the
  component renders `<Image>` when it can and a plain `<img>` in Storybook.
- Every component that can be empty has a `Pending` treatment: the design
  system placeholder block (àdìrẹ fill, caption naming the missing photo or fact,
  fixed aspect ratio).
- Dark scope: parents add `.oy-dark`; components do not carry a `dark` prop
  unless the canvas shows a distinct variant.
- No hover lift. Buttons darken or fill and settle 1.5% on press. Cards deepen
  their border. Photos never zoom. Transitions 0.15 to 0.22s ease.

## Core

| Component | Variants and states | Props | Used on | Story notes |
| --- | --- | --- | --- | --- |
| `Kicker` | Yoruba • English; single; on dark (gold-300) | `yo`, `en`, `as` | Every section | Test string with diacritics at 12px |
| `Button` | primary (gold), secondary (indigo outline, fills on hover), quiet (text with arrow), sizes default and small; hover, focus (2px ring, offset 2px, gold-300 in dark), pressed (settle 1.5%), disabled, busy ("Sending...") | `variant`, `size`, `href`, `type`, `arrow`, `busy`, `disabled` | Everywhere | One gold per view rule documented in the story |
| `Divider` | aṣọ òkè stripe 2 to 4 uneven bands; thin rule | `kind` | Section seams | Never pinstripes |
| `Pending` | chip inline; block with aspect ratio; caption naming the missing item | `what`, `aspect`, `tone` (indigo, terra, green, gold) | Every page | Shows the àdìrẹ dot fill at 8 to 12% |
| `PatternBand` | àdìrẹ dot field overlay; chevron rows; motif columns; batik wash | `pattern`, `opacity` | Hero, event band, footer, cards | SVGs from `design/images/patterns/` |
| `Logo` | mark + two-line wordmark; mark only under 1060px; light version for dark | `variant` | Nav, footer | `logo-mark.png`, `logo-lockup-light.png` |

## Page structure

| Component | Variants and states | Props | Used on |
| --- | --- | --- | --- |
| `SiteNav` | desktop with Events dropdown; mobile overlay; current page marker; dropdown open, focus-within, Escape | `current`, `items` | All |
| `SiteFooter` | with newsletter; trust line; socials | `settings`, `newsletterState` | All |
| `Hero` (homepage) | photo with scrim, breathing photo (motion on/off), kicker, H1, sub, two actions | `image`, `kicker`, `title`, `sub`, `primary`, `secondary`, `motion` | Home |
| `PageHeader` | slim (no photo); photo band; up to two buttons | `variant`, `kicker`, `title`, `line`, `image`, `actions` | All eleven |
| `GlanceStrip` | 4 and 5 facts; a fact can be Pending | `facts[]` | Odunde, Gala, Lessons, Collective |
| `EventBand` | festival frame (chevron rows, stripe seams, motif columns), gala frame; one event at a time | `event`, `kind` | Home |
| `StatStrip` | 4 and 6 figures; with and without source lines | `stats[]`, `sources` | Home, Impact |
| `TakePartBand` | 2, 3, 4 rows; label style column, none, kicker; colour accent per way in (vendor, sponsor, performer, volunteer, table, give); reorderable | `rows[]`, `labels` | Nine pages |
| `YearStrip` | program cadence across the year, 5 columns | `months[]` | Programs |
| `Handoff` | the closing "where this page hands off" line with a quiet button | `text`, `cta` | Several |

## Cards

| Component | Variants and states | Props | Used on |
| --- | --- | --- | --- |
| `Card` (base) | paper ground, indigo hairline, 8px aṣọ òkè top edge, grain-dots texture; hover border deepens, title warms to terracotta, arrow slides, 2px aṣọ òkè rule draws under the action; dark scope | `href`, `title`, `image`, `kicker` | Base for the rest |
| `ProgramCard` | with image; four across, three, pairs | `program` | Home, Programs |
| `DoorCard` | four doors, each opens a modal kind; card and row variants | `door`, `variant` | Home, Get Involved, Donate |
| `PathRow` | row form of a door | `path` | Get Involved |
| `NewsCard` | date, kicker, title, summary | `post` | Home, News |
| `PersonCard` | with portrait; without (woven tick instead of a face, a real design); compact | `person`, `variant`, `bio` (short, full) | Our Story, Lessons |
| `ZoneCard` | Yoruba name with marks, translation, one line, photo; mosaic, five, grid, list layouts driven by the parent | `zone` | Odunde |
| `TicketTierCard` | buy-now (Eventbrite, new tab notice); enquiry (opens `table`); featured (gold inset ring) | `tier` | Gala |
| `OutcomeCard` | with figure and source; plain statement without figure | `outcome`, `variant` (card, row) | Impact |
| `PhotoTile` | caption over scrim, Yoruba first; square corners; placeholder with dot field | `image`, `caption`, `aspect` | Home, Impact |
| `AlbumTile` | cover, title, count, credit; captions always or on hover; mosaic density | `album`, `captions` | Gallery |
| `PullQuote` | quote, name, relation; initials only when no permission | `testimonial` | Home, Impact, Lessons, Collective |
| `PartnerRow` | text chips when no logo; logo when present | `partners[]` | Odunde, Impact |

## Lists and rows

| Component | Variants and states | Props | Used on |
| --- | --- | --- | --- |
| `ScheduleRow` | time-led; day-led | `item`, `mode` | Odunde, Gala, Lessons |
| `ListRow` | event, recurring, sponsor tier, news entry | `row`, `kind` | News, Gala, Get Involved |
| `FilterChips` | with and without year select; URL-synced; result count announced | `chips[]`, `years[]`, `selected` | News (later) |
| `Accordion` (FAQ) | single open; multi open; closed rows keep 44px; open by default option | `items[]`, `multi`, `defaultOpen` | Lessons |
| `Timeline` | dated entries with optional image; hideable by parent | `entries[]` | Our Story |
| `ContactBlock` | address, phone, email, opens `contact` | `settings` | Our Story, Get Involved |

## Media

| Component | Variants and states | Props | Used on |
| --- | --- | --- | --- |
| `ImagePlaceholder` | gradient or àdìrẹ fill, caption naming the future photo, fixed aspect | `what`, `aspect`, `tone` | Anywhere a photo is missing |
| `PhotoCarousel` | framed (paper, aṣọ òkè top), 16:8 stage (4:3 under 720px), prev and next 52px (44px mobile), dots, caption, count; keyboard arrows | `slides[]`, `label` | Odunde past years, Gala past galas |
| `Lightbox` | full-screen `<dialog>`, arrows, swipe, Escape, caption and credit, `?photo=` deep link, focus return | `photos[]`, `openKey` | Gallery album |

## Forms and dialogs

| Component | Variants and states | Props | Used on |
| --- | --- | --- | --- |
| `Field` | text, email, tel, select, textarea; label, hint, error sentence; wide variant; 44px min | `spec`, `value`, `error` | Enquiry Modal, footer |
| `NewsletterForm` | footer (inline, in dark); band variant; states idle, busy, success (button reads "Ẹ ṣé! ✓"), error | `variant`, `state` | Footer, Home band |
| `EnquiryModal` | one shell, eight field sets from `enquiry-kinds.ts`; states empty, filled, submitting, success, error summary; dialog on desktop, bottom sheet under 720px; focus trap, Escape, focus return, scrim click | `kind`, `open`, `returnFocusTo` | Five pages plus nav and footer |
| `GiveDialog` | embed (Zeffy iframe in our card, aṣọ òkè header); fallback (check address, Contact) after load failure or timeout | `mode` | Every Donate button |
| `EnquiryCard` | the card that explains a form before opening it: title, what it asks, how long, what happens next, button | `kind` | Get Involved doors, Lessons, Odunde, Gala |

## Retired (keep out of the library)

`AmountSelector` (Zeffy owns the amount step) and `MultiStepForm` (every form is
now a dialog). They appear in the canvas marked retired; do not build them.

## Storybook organisation

Sidebar groups mirror the folders: Core, Page structure, Cards, Lists and rows,
Media, Forms and dialogs, then **Pages** with one story per page section option
(the tweak table) using seed-shaped fixtures from `packages/ui/src/fixtures/`.
Fixtures use only confirmed facts and Pending states; no mock names or prices.

Every story file exports at least: `Default`, each variant, `Pending` (empty
content), and `OnDark` where the component appears in a dark scope. Interactive
components add a `play` test for keyboard behaviour. Chromatic snapshots at
375 and 1440.

Manager theme (`apps/storybook/.storybook/theme.ts`): `base: 'light'`,
`brandTitle: 'Omo Yorùbá components'`, `colorPrimary: #1E2A5A`,
`colorSecondary: #E8A13A`, `appBg: #FAF5EC`, `appContentBg: #FFFFFF`,
`barBg: #1E2A5A`, `barTextColor: #C8CDE8`, `barSelectedColor: #F4C66D`,
`fontBase: "Source Sans 3", "Noto Sans", system-ui`, `fontCode: ui-monospace`,
`appBorderRadius: 6`, `inputBorderRadius: 999`. Docs pages load
`@oy/tokens` so headings render in Source Serif 4 indigo and body in Source Sans
3 at 17px.
