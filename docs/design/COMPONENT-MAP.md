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
| `Kicker` | Yoruba • English; single; on dark (gold-300); Pending chip when both halves are empty | `yo`, `en`, `as`, `what` | Every section | Test string with diacritics at 12px |
| `Button` | primary (gold), secondary (indigo outline, fills on hover), quiet (text with arrow), sizes default and small; hover, focus (2px ring, offset 2px, gold-300 in dark), pressed (settle 1.5%), disabled, busy ("Sending...") | `variant`, `size`, `href`, `type`, `arrow`, `busy`, `disabled` | Everywhere | One gold per view rule documented in the story |
| `Divider` | aṣọ òkè stripe 2 to 4 uneven bands (`asoke`); thin rule (`thin`); ayo dot row (`ayo`); the handoff ornament (`ornament`); the seam between two full-width sections (`seam`: indigo over gold, terracotta over gold under the Gala's warm treatment, from the tokens) | `kind` | Section seams, the Gala after the evening | Never pinstripes |
| `ActionButton` | a Studio action as a button: an enquiry kind opens the Enquiry Modal (`data-enquiry`), `give` the Give Dialog (`data-give`), a link or an anchor is a plain href; outline by default; a half-filled action renders nothing (the Studio refuses to publish one) | `action`, `variant`, `size`, `arrow` | Hero, doors, program cards, Handoff | The page passes `primary` once per view |
| `Pending` | chip inline (`chip`, 16px corners so a long chip wraps as a rounded box); the "Pending from you" line (`line`); block with aspect ratio (`block`); every form names the missing item | `what`, `variant`, `aspect`, `tone` (indigo, terra, green, gold) | Every page | Shows the àdìrẹ dot fill at 8 to 12% |
| `PatternBand` | àdìrẹ dot field overlay (`dots`); chevron rows (`chevron`, `flip` for the bottom edge); motif columns (`motif`); batik wash (`batik`) | `pattern`, `opacity`, `flip` | Hero, event band, footer, cards | Lives in `bands/`; SVGs from `@oy/tokens/patterns/` (copied from `design/images/patterns/`) |
| `Logo` | mark + two-line wordmark (`lockup`, line two hides under 1060px); mark only (`mark`); light lockup for dark (`light`, lazy below the fold) | `variant`, `href` | Nav, footer | Lives in `navigation/`; `logo-mark-2x.webp`, `-3x.webp` and `logo-lockup-light-2x.webp`, `-3x.webp` beside the component, cut from the masters in `design/images/` at twice and three times the drawn size |

## Page structure

| Component | Variants and states | Props | Used on |
| --- | --- | --- | --- |
| `SiteNav` | desktop with Events dropdown; mobile menu as a native dialog under 880px (the ported CSS breakpoint); current page marker (`aria-current` on the link, `data-current` on the Events trigger); dropdown open, focus within, Escape | `path`, `donateHref`, `menuOpen` (story only) | All |
| `SiteFooter` | with newsletter; trust line with the EIN placeholder; socials per network in the settings; Pending chips for the owed facts | `settings`, `newsletterState`, `newsletterAction`, `newsletterError`, `newsletterValue`, `source` | All |
| `ProgressBar` | idle; loading (the 2px gold bar the router events drive) | `loading` (story only) | All |
| `Hero` (homepage) | photo with scrim, breathing photo (motion on/off), the copy set left: kicker, H1 with its gold words in italic, sub, the blessing line, one primary and the secondary actions (the page swaps the primary for the highlighted program's action); Pending for the photo and the heading | `image`, `alt`, `kicker`, `title`, `emphasis`, `sub`, `blessing`, `primary`, `secondary`, `motion`, `imageEdit`, `edit` | Home |
| `PageHeader` | slim (no photo); photo band behind the scrim with the aṣọ òkè rule, the dot field and the breathing photograph; up to two buttons (the first gold); the facts line joined by gold dots that never end a wrapped line, each missing fact its chip; Pending chips for a missing heading or photograph | `variant`, `kicker`, `title`, `titlePending`, `line`, `image`, `imagePending`, `actions`, `facts`, `dots`, `motion`, `imageEdit`, `edit`, `id` | Odunde, Gala (then all eleven) |
| `GlanceStrip` | 4 and 5 facts, each value or its chip, a note or the note's chip; the caption under the band | `facts[]`, `caption`, `edit`, `id` | Odunde, Gala, Lessons, Collective |
| `Split` | two columns for copy and its photograph or running order (1.1 to 0.9, stacking under 900px); a section head in the copy sits 16px above the prose | slot, `aside` slot | Odunde (What Odunde is), Gala (the evening) |
| `ButtonRow` | a wrapping row of buttons under a block, with an optional muted note (`.oy-button-row-note`) | slot | Odunde, Gala |
| `EventBand` | festival frame (chevron rows, stripe seams, motif columns), gala frame; one edition at a time, the line as the prototype's sentence at the body size (venue • date. summary), Pending chips for a missing date or venue, the Pending line for no edition (lives in `bands/`) | `event`, `kind`, `href`, `edit`, `id` | Home |
| `StatStrip` | 4 and 6 figures; with and without source lines; the corner dot fields; Pending for a missing figure or no figures | `stats[]`, `sources`, `columns`, `what`, `id` | Home, Impact |
| `Section` | a section at the content width on white, the theme tint (`alt`, AA-safe kicker and muted text) or paper; the batik wash behind the content | `id`, `ground`, `texture`, `labelledby` | Every page |
| `SectionHead` | the aṣọ òkè swatch and kicker, the heading, an optional intro and quiet link; the registry's chip for a missing heading when the page passes its wording; a note after the intro, or its chip (the festival's attendance) | `kicker`, `title`, `intro`, `note`, `notePending`, `link`, `id`, `pending` | Every section |
| `CardGrid` | two, three or four across, collapsing under 860px (four: 1000px and 600px); its stories show the program cards three across (the homepage), four across and in pairs | `columns` | Home, Programs, Get Involved |
| `HomeRoot` | the page root's data attributes (`data-theme`, adire by default as on the site, `data-highlight`, `data-pattern`, `data-motion` and the rest) for the page-section stories; the site puts them on the body | `theme`, `highlight`, `pattern`, `motion`, `season`, `involved`, `newsletter`, `gallery` | Storybook (Pages) |
| `PageRoot` | the generic page root for the event pages' page-section stories: any page's layout options as data attributes | `theme`, `options` | Storybook (Pages/Odunde, Pages/Gala) |
| `TakePartBand` | the singleton's take-part rows (ADR 0025): 2, 3, 4 rows; label style column, none, kicker; chip, accent and form per way in (vendor, sponsor, performer, volunteer, table, give); the lead way in moved up in the markup; gold on the first working row, the give row quiet; the festival's vendor terms after the vendor row's line with their chip; the Pending line with no rows (lives in `page/`) | `rows[]`, `labels`, `lead`, `vendorTerms`, `vendorTermsPending`, `pending`, `rowPending`, `edit` | Odunde, Gala (then the program pages) |
| `YearStrip` | program cadence across the year, 5 columns | `months[]` | Programs |
| `Handoff` | where a section hands off: the centred `line` (one button and a short line, the homepage's mosaic) or the tinted `box` (the line on the left, up to two buttons on the right, a quiet button deepened to terracotta 700 for AA on the tint) | `action`, `secondAction`, `text`, `variant`, `shape` | Home, Odunde, Gala |

## Cards

| Component | Variants and states | Props | Used on |
| --- | --- | --- | --- |
| `Card` (base) | paper ground, indigo hairline, 8px aṣọ òkè top edge, grain-dots texture; hover border deepens, title warms to terracotta, arrow slides, 2px aṣọ òkè rule draws under the action; optional photo at a fixed height; dark scope | `as`, `image`, `alt`, `mediaHeight`, `kicker`, `title`, `bodyClass`, `rule` | Base for the rest |
| `ProgramCard` | photo or placeholder, name, blurb, the quiet action from the Studio (none, no link); four across, three, pairs through `CardGrid`; the highlighted card moves first with the gold ring under `data-highlight` (the prototype's page rule, ported into the card); the Collective link reads green; Pending for the blurb | `program`, `imageEdit` | Home, Programs |
| `DoorCard` | a door as a card: photo or placeholder, title, blurb, the bullets when the page asks, one action (enquiry kind or Give) gold once per view; Pending for the bullets | `door`, `primary`, `bullets`, `imageEdit` | Home, Get Involved, Donate |
| `PathRow` | the row form of a door (chip by door key: Membership, Partnership, Volunteer, Give) or of a take-part row (its own way in, chip, title, line and action); the accent per way in; outline, gold once per view or quiet (`variant`); the registry's chip where a row misses its title or button; the default slot continues the line; stacked by `PathRows` (`content/`) with the label style | `door` or `way`, `chip`, `title`, `line`, `action`, `pending`; `primary`, `variant`, `edit`; `PathRows`: `labels` | Home, Odunde, Gala, Get Involved |
| `NewsCard` | month and year, kicker, title, summary; Read more only with an href, its accessible name completed by the post's title: the homepage passes the page the post is tagged to until the News page exists (ADR 0023) | `post`, `href` | Home, News |
| `PersonCard` | with portrait; without (woven tick instead of a face, a real design); compact; the role as a kicker, the name as a heading or its chip, the bio | `person`, `variant`, `namePending`, `edit` | Gala honorees (then Our Story, Lessons) |
| `ZoneCard` | Yoruba name with marks (`lang="yo"`), translation, one line or its chip, photo or placeholder; a placeholder card for an owed zone; mosaic, five, grid, list layouts driven by `ZoneGrid` (`content/`), which pads to the confirmed four | `zone`, `pending`, `imageEdit`; `ZoneGrid`: `zones[]`, `layout`, `edit` | Odunde |
| `TicketTierCard` | buy-now (the edition's Eventbrite link in a new tab with `rel="noopener"` and the notice, or its chip where the button goes); enquiry (opens `table`, the invoicing line); featured (gold inset ring); chips for a missing price or includes; arranged by `TicketTiers` (`content/`): columns or rows, the table tier first when tables lead, gold on the first featured tier, the Pending line with no tiers | `tier`, `ticketsUrl`, `primary`, pending wordings, `edit`; `TicketTiers`: `tiers[]`, `layout`, `emphasis`, `ticketsUrl`, `pending` | Gala |
| `OutcomeCard` | with figure and source; plain statement without figure | `outcome`, `variant` (card, row) | Impact |
| `PhotoTile` | caption over scrim, Yoruba first with the gold dot (marked `yo` only when it carries Yoruba letters); square corners; the framed 360px `figure` shape beside a page's prose; placeholder with the dot field; `PhotoMosaic` (`media/`) arranges seven, five or three and pads with placeholders | `image`, `alt`, `caption`, `what`, `shape`, `edit`; `PhotoMosaic`: `tiles[]`, `count`, `edit` | Home, Odunde, Impact |
| `AlbumTile` | cover, title, count, credit; captions always or on hover; mosaic density | `album`, `captions` | Gallery |
| `PullQuote` | ayo row, quote, name and relation, filling its cell; initials only without permission to name; without a testimonial, the registry's Pending chip, then the prototype's placeholder for the slot the page names (the bracketed quote, "Name pending" with the voice); `ProverbLine` (`content/`) sits under the voices with the sun crest | `testimonial`, `placeholder`; `ProverbLine`: `yo`, `en` | Home, Impact, Lessons, Collective |
| `PartnerRow` | text chips when no logo; logo when present (the name as its alt); linked to the partner's site when it has one; the Pending line with no partners (lives in `content/`) | `partners[]`, `pending`, `edit` | Odunde, Impact |

## Lists and rows

| Component | Variants and states | Props | Used on |
| --- | --- | --- | --- |
| `ScheduleRow` | time-led; day-led; the zone tag; arranged by `Schedule` (`content/`): an ordered list, inside a native disclosure with the quiet Hide or Show toggle on the right when `toggle` (the festival), the Pending line with no rows | `item`, `mode`; `Schedule`: `items[]`, `mode`, `toggle`, `open`, `pending`, `edit` | Odunde, Gala, Lessons |
| `FactList` | the plan-your-visit description list, two columns, each value or its chip; the Pending line with no facts | `facts[]`, `pending` | Odunde |
| `ListRow` | sponsor tier (Phase 5: name, amount, the ticked recognition, chips for what is owed, listed by `SponsorLevels` with the Pending line); event, recurring and news entry with their pages | `row`, `kind`; `SponsorLevels`: `levels[]`, pending wordings | Gala (then News, Get Involved) |
| `FilterChips` | with and without year select; URL-synced; result count announced | `chips[]`, `years[]`, `selected` | News (later) |
| `Accordion` (FAQ) | single open; multi open; closed rows keep 44px; open by default option | `items[]`, `multi`, `defaultOpen` | Lessons |
| `Timeline` | dated entries with optional image; hideable by parent | `entries[]` | Our Story |
| `ContactBlock` | address, phone, email, opens `contact` | `settings` | Our Story, Get Involved |

## Media

| Component | Variants and states | Props | Used on |
| --- | --- | --- | --- |
| `ImagePlaceholder` | gradient or àdìrẹ fill, caption naming the future photo, fixed aspect; the default slot replaces the caption (Pending uses it) | `what`, `aspect`, `tone`, `label` | Anywhere a photo is missing |
| `PhotoCarousel` | framed (paper, aṣọ òkè top), 16:8 stage (4:3 under 720px), prev and next 52px (44px mobile) with drawn chevrons, the dots as 44px tabs, caption, count (not uppercase); APG's tabbed carousel as the inline `oy-photo-carousel` element: Left and Right on tabs and buttons, Home and End on tabs, no rotation, no swipe, a 0.2s fade off under reduced motion, the first photograph without JavaScript; one photograph is a figure, none the placeholder (ADR 0027) | `slides[]`, `id`, `labelledby` or `label`, `sizes`, `pending`, `edit` | Odunde past years, Gala past galas |
| `CreditLine` | "Photographs:" and the album's credit, with the registry's chip until the credit is confirmed | `credit`, `confirmed`, `pending` | Odunde, Gala (then the gallery) |
| `Lightbox` | full-screen `<dialog>`, arrows, swipe, Escape, caption and credit, `?photo=` deep link, focus return | `photos[]`, `openKey` | Gallery album |

## Forms and dialogs

| Component | Variants and states | Props | Used on |
| --- | --- | --- | --- |
| `Field` | text, email, tel, select, textarea; label, hint, error sentence tied through `aria-describedby`; wide variant; `aria-required` and `data-req`, never the native `required`; 44px min | `spec`, `id`, `name`, `value`, `error`, `wide`, `autocomplete` | Enquiry Modal |
| `NewsletterForm` | footer (inline, in dark); band variant, which `NewsletterBand` (`bands/`) places on the indigo band with the settings' title and blurb before the footer; states idle, busy, success (button reads "Ẹ ṣé! ✓" in place), error; honeypot; posts natively, enhances through the site's bridge | `action`, `state`, `error`, `value`, `source`, `variant`, `site`; `NewsletterBand`: `title`, `blurb`, `edit` and the form's props | Footer, Home band |
| `EnquiryModal` | one native dialog, eight forms from `enquiry-kinds.ts`, only the open kind visible; states empty, filled, submitting, success (Close focused), error (summary as alert, values kept); dialog on desktop, bottom sheet under 720px; Escape, scrim click, focus return; opens from any `[data-enquiry]` trigger; server-rendered open for `?enquiry=<kind>` and a posted result | `kind`, `open`, `state`, `values`, `errors`, `summary`, `success`, `contacts`, `site`, `actions`, `source` | Mounted once by the layout |
| `GiveDialog` | embed (the island's template mounted on first open, aṣọ òkè edge); fallback (check line with the address or Pending, Contact us, Try again) after the timer; pending (the island's answer while the URL is empty, no Try again) | `open`, `mode`, `orgName`, `address`, `ein`, `contactHref`, `timeout`; slot `embed` | Mounted once by the layout; every Donate trigger |
| `EnquiryCard` | the card that explains a form before opening it: title, what it asks, how many questions, what happens next (from the page), the trigger as a link to `?enquiry=<kind>#enquiry` | `kind`, `title`, `blurb`, `next`, `label`, `variant` | Get Involved doors, Lessons, Odunde, Gala |

Phase 5 built the event pages' parts (`docs/tickets/phase-5/spec.md`, ADRs 0024 to 0028): `Prose`
(`content/`, astro-portabletext 1.0.0, or a plain `text` field), the take-part band, the tiers, the sponsor
levels, the carousel and the credit line; pages compose them and the page-section stories under
`Pages/Odunde` and `Pages/Gala` show one option each, in `PageRoot`.

Built in Phase 3 as above. Where the routes table and the footer prototype disagreed (SVG marks
and two link columns in the prototype, text initials and four columns in the table), the
prototype won as the later polish; the mobile menu breaks at 880px because the ported CSS does.
Phase 4 built the homepage parts (`docs/tickets/phase-4/spec.md`): the site footer takes
`newsletter={false}` when the band is placed before it, and images reach every part as a URL, an
`ImageMetadata` import or the resolved set the site builds from the asset reference
(`packages/ui/src/media/image.ts`, ADR 0022).

## Retired (keep out of the library)

`AmountSelector` (Zeffy owns the amount step) and `MultiStepForm` (every form is
now a dialog). They appear in the canvas marked retired; do not build them.

## Storybook organisation

Sidebar groups mirror the folders: Core, Page, Cards, Content, Media, Forms,
Navigation, Bands, then **Pages** with one story per page section option
(the tweak table) using seed-shaped fixtures from `packages/ui/src/fixtures/`.
Fixtures use only confirmed facts and Pending states; no mock names or prices. Since Phase 4
`Pages/Homepage` holds one story file per layout option (Season, Highlight, Gallery, Involved,
Newsletter, Pattern, Motion), each wrapping a section in `HomeRoot`, and the fixtures import
the register's photographs from `docs/design/design/images/w2` as URL assets.

Every story file exports at least: `Default`, each variant, `Pending` (empty
content), and `OnDark` where the component appears in a dark scope. Interactive
components add a `play` test for keyboard behaviour. Chromatic snapshots at
375 and 1440 (`parameters.chromatic.modes` in the preview). Story types come from
`packages/ui/src/storybook.ts` (`Meta`, `StoryObj`, `onDark`, `wrap`, the test string); slots
are passed as `args.slots.default`. Tests compose the stories with `composeStories` and render
them with the framework's `renderStory`.

Manager theme (`packages/ui/.storybook/theme.ts`; the handoff said `apps/storybook`, ADR 0003 moved it): `base: 'light'`,
`brandTitle: 'Omo Yorùbá components'`, `colorPrimary: #1E2A5A`,
`colorSecondary: #E8A13A`, `appBg: #FAF5EC`, `appContentBg: #FFFFFF`,
`barBg: #1E2A5A`, `barTextColor: #C8CDE8`, `barSelectedColor: #F4C66D`,
`fontBase: "Source Sans 3", "Noto Sans", system-ui`, `fontCode: ui-monospace`,
`appBorderRadius: 6`, `inputBorderRadius: 999`. Docs pages load
`@oy/tokens` so headings render in Source Serif 4 indigo and body in Source Sans
3 at 17px.
