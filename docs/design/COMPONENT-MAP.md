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
| `Divider` | aṣọ òkè stripe 2 to 4 uneven bands (`asoke`); thin rule (`thin`); ayo dot row (`ayo`); the handoff ornament (`ornament`) | `kind` | Section seams | Never pinstripes |
| `ActionButton` | a Studio action as a button: an enquiry kind opens the Enquiry Modal (`data-enquiry`), `give` the Give Dialog (`data-give`), a link or an anchor is a plain href; a half-filled action renders a Pending chip | `action`, `variant`, `size`, `arrow` | Hero, doors, program cards | The page passes `primary` once per view |
| `Pending` | chip inline (`chip`); the "Pending from you" line (`line`); block with aspect ratio (`block`); every form names the missing item | `what`, `variant`, `aspect`, `tone` (indigo, terra, green, gold) | Every page | Shows the àdìrẹ dot fill at 8 to 12% |
| `PatternBand` | àdìrẹ dot field overlay (`dots`); chevron rows (`chevron`, `flip` for the bottom edge); motif columns (`motif`); batik wash (`batik`) | `pattern`, `opacity`, `flip` | Hero, event band, footer, cards | Lives in `bands/`; SVGs from `@oy/tokens/patterns/` (copied from `design/images/patterns/`) |
| `Logo` | mark + two-line wordmark (`lockup`, line two hides under 1060px); mark only (`mark`); light lockup for dark (`light`) | `variant`, `href` | Nav, footer | Lives in `navigation/`; `logo-mark.png`, `logo-lockup-light.png` beside the component |

## Page structure

| Component | Variants and states | Props | Used on |
| --- | --- | --- | --- |
| `SiteNav` | desktop with Events dropdown; mobile menu as a native dialog under 880px (the ported CSS breakpoint); current page marker (`aria-current` on the link, `data-current` on the Events trigger); dropdown open, focus within, Escape | `path`, `donateHref`, `menuOpen` (story only) | All |
| `SiteFooter` | with newsletter; trust line with the EIN placeholder; socials per network in the settings; Pending chips for the owed facts | `settings`, `newsletterState`, `newsletterAction`, `newsletterError`, `newsletterValue`, `source` | All |
| `ProgressBar` | idle; loading (the 2px gold bar the router events drive) | `loading` (story only) | All |
| `Hero` (homepage) | photo with scrim, breathing photo (motion on/off), kicker, H1, sub, the blessing line, one primary and the secondary actions; Pending for the photo and the heading | `image`, `alt`, `kicker`, `title`, `sub`, `blessing`, `primary`, `secondary`, `motion`, `imageEdit` | Home |
| `PageHeader` | slim (no photo); photo band; up to two buttons | `variant`, `kicker`, `title`, `line`, `image`, `actions` | All eleven |
| `GlanceStrip` | 4 and 5 facts; a fact can be Pending | `facts[]` | Odunde, Gala, Lessons, Collective |
| `EventBand` | festival frame (chevron rows, stripe seams, motif columns), gala frame; one edition at a time, Pending chips for a missing date or venue, the Pending line for no edition (lives in `bands/`) | `event`, `kind`, `href`, `edit`, `id` | Home |
| `StatStrip` | 4 and 6 figures; with and without source lines; the corner dot fields; Pending for a missing figure or no figures | `stats[]`, `sources`, `columns`, `what`, `id` | Home, Impact |
| `Section` | a section at the content width on white, the theme tint (`alt`, AA-safe kicker and muted text) or paper; batik or corner textures | `id`, `ground`, `texture`, `labelledby` | Every page |
| `SectionHead` | the aṣọ òkè swatch and kicker, the heading, an optional intro and quiet link; Pending for a missing heading | `kicker`, `title`, `intro`, `link`, `id` | Every section |
| `CardGrid` | two, three or four across, collapsing under 860px (four: 1000px and 600px) | `columns` | Home, Programs, Get Involved |
| `HomeRoot` | the page root's data attributes (`data-highlight`, `data-pattern`, `data-motion` and the rest) for the page-section stories; the site puts them on the body | `highlight`, `pattern`, `motion`, `season`, `involved`, `newsletter`, `gallery`, `theme` | Storybook (Pages) |
| `TakePartBand` | 2, 3, 4 rows; label style column, none, kicker; colour accent per way in (vendor, sponsor, performer, volunteer, table, give); reorderable | `rows[]`, `labels` | Nine pages |
| `YearStrip` | program cadence across the year, 5 columns | `months[]` | Programs |
| `Handoff` | the closing "where this page hands off" line with a quiet button | `text`, `cta` | Several |

## Cards

| Component | Variants and states | Props | Used on |
| --- | --- | --- | --- |
| `Card` (base) | paper ground, indigo hairline, 8px aṣọ òkè top edge, grain-dots texture; hover border deepens, title warms to terracotta, arrow slides, 2px aṣọ òkè rule draws under the action; optional photo at a fixed height; dark scope | `as`, `image`, `alt`, `mediaHeight`, `kicker`, `title`, `bodyClass`, `rule` | Base for the rest |
| `ProgramCard` | photo or placeholder, name, blurb, quiet action; four across, three, pairs through `CardGrid`; the highlighted card takes the gold ring under `data-highlight`; the Collective link reads green; Pending for the blurb | `program`, `imageEdit` | Home, Programs |
| `DoorCard` | a door as a card: photo or placeholder, title, blurb, the bullets when the page asks, one action (enquiry kind or Give) gold once per view; Pending for the bullets | `door`, `primary`, `bullets`, `imageEdit` | Home, Get Involved, Donate |
| `PathRow` | the row form of a door: chip by way in, title, line, action, accent per way in; stacked by `PathRows` (`content/`) with the label style | `door`, `primary`; `PathRows`: `labels` | Home, Get Involved |
| `NewsCard` | month and year, kicker, title, summary; Read more only with an href (none until the News page) | `post`, `href` | Home, News |
| `PersonCard` | with portrait; without (woven tick instead of a face, a real design); compact | `person`, `variant`, `bio` (short, full) | Our Story, Lessons |
| `ZoneCard` | Yoruba name with marks, translation, one line, photo; mosaic, five, grid, list layouts driven by the parent | `zone` | Odunde |
| `TicketTierCard` | buy-now (Eventbrite, new tab notice); enquiry (opens `table`); featured (gold inset ring) | `tier` | Gala |
| `OutcomeCard` | with figure and source; plain statement without figure | `outcome`, `variant` (card, row) | Impact |
| `PhotoTile` | caption over scrim, Yoruba first with the gold dot; square corners; placeholder with the dot field; `PhotoMosaic` (`media/`) arranges seven, five or three and pads with placeholders | `image`, `alt`, `caption`, `what`, `edit`; `PhotoMosaic`: `tiles[]`, `count`, `edit` | Home, Impact |
| `AlbumTile` | cover, title, count, credit; captions always or on hover; mosaic density | `album`, `captions` | Gallery |
| `PullQuote` | ayo row, quote, name and relation; initials only without permission to name; the Pending card without a testimonial; `ProverbLine` (`content/`) sits under the voices with the sun crest | `testimonial`; `ProverbLine`: `yo`, `en` | Home, Impact, Lessons, Collective |
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
| `ImagePlaceholder` | gradient or àdìrẹ fill, caption naming the future photo, fixed aspect; the default slot replaces the caption (Pending uses it) | `what`, `aspect`, `tone`, `label` | Anywhere a photo is missing |
| `PhotoCarousel` | framed (paper, aṣọ òkè top), 16:8 stage (4:3 under 720px), prev and next 52px (44px mobile), dots, caption, count; keyboard arrows | `slides[]`, `label` | Odunde past years, Gala past galas |
| `Lightbox` | full-screen `<dialog>`, arrows, swipe, Escape, caption and credit, `?photo=` deep link, focus return | `photos[]`, `openKey` | Gallery album |

## Forms and dialogs

| Component | Variants and states | Props | Used on |
| --- | --- | --- | --- |
| `Field` | text, email, tel, select, textarea; label, hint, error sentence tied through `aria-describedby`; wide variant; `aria-required` and `data-req`, never the native `required`; 44px min | `spec`, `id`, `name`, `value`, `error`, `wide`, `autocomplete` | Enquiry Modal |
| `NewsletterForm` | footer (inline, in dark); band variant, which `NewsletterBand` (`bands/`) places on the indigo band with the settings' title and blurb before the footer; states idle, busy, success (button reads "Ẹ ṣé! ✓" in place), error; honeypot; posts natively, enhances through the site's bridge | `action`, `state`, `error`, `value`, `source`, `variant`, `site`; `NewsletterBand`: `title`, `blurb`, `edit` and the form's props | Footer, Home band |
| `EnquiryModal` | one native dialog, eight forms from `enquiry-kinds.ts`, only the open kind visible; states empty, filled, submitting, success (Close focused), error (summary as alert, values kept); dialog on desktop, bottom sheet under 720px; Escape, scrim click, focus return; opens from any `[data-enquiry]` trigger; server-rendered open for `?enquiry=<kind>` and a posted result | `kind`, `open`, `state`, `values`, `errors`, `summary`, `success`, `contacts`, `site`, `actions`, `source` | Mounted once by the layout |
| `GiveDialog` | embed (the island's template mounted on first open, aṣọ òkè edge); fallback (check line with the address or Pending, Contact us, Try again) after the timer; pending (the island's answer while the URL is empty, no Try again) | `open`, `mode`, `orgName`, `address`, `ein`, `contactHref`, `timeout`; slot `embed` | Mounted once by the layout; every Donate trigger |
| `EnquiryCard` | the card that explains a form before opening it: title, what it asks, how many questions, what happens next (from the page), the trigger as a link to `?enquiry=<kind>#enquiry` | `kind`, `title`, `blurb`, `next`, `label`, `variant` | Get Involved doors, Lessons, Odunde, Gala |

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
