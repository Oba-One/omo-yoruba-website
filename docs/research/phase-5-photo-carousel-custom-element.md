# Phase 5: the Photo Carousel as an inline custom element

Date: 12 September 2026. Method: read the repo's constraints first (ADR 0018; the inline scripts in
`SiteNav.astro` and `GiveDialog.astro`; `SiteNav.stories.ts`; `docs/design/design/Photo
Carousel.dc.html` and the `.oy-carousel` block in both copies of `oy-components.css`;
`COMPONENT-MAP.md`; `07 Interaction Inventory.dc.html`; `08 Build Brief.md`; the Odunde and Gala
prototypes; `QUALITY.md`; `AGENTS.md`). Then the primary sources: the W3C APG carousel pattern, its
two examples, the tabs pattern and the keyboard and landmark practices, with the pattern and example
sources read from `w3c/aria-practices` (`content/patterns/carousel/`, the pattern last changed 18
September 2025, the tabbed example 12 August 2025); WCAG 2.2 (Recommendation of 12 December 2024)
and its Understanding pages; WAI-ARIA 1.2; ARIA in HTML (11 August 2026); the HTML Standard; Pointer
Events; the Web Animations Level 1 source in `w3c/csswg-drafts`; MDN, with support versions from
`mdn/browser-compat-data` on `main` read through `gh api` (BCD below); web.dev on lazy loading and
CLS; the Playwright, Chromatic and Astro docs; and the installed packages: `astro` 7.3.1
(`packages/web/node_modules/astro`), `storybook` 10.6.0 (cited as `storybook/dist/...`, its Bun
store path is `node_modules/.bun/storybook@10.6.0+34ec30f1499ccd6a/node_modules/storybook`) and
`@testing-library/dom` 10.4.1. Contrast ratios are computed from the hex values in
`packages/tokens/src/tokens/colors.css` with the WCAG relative luminance formula; widths and dot
counts are arithmetic from the tokens. Nothing was installed and nothing ran in a browser.

## A. What the handoff and the repo ask for

### The prototype

- `Photo Carousel.dc.html` lines 21 to 42: a `div` with `role="region"`,
  `aria-roledescription="carousel"` and `aria-label` from the `label` prop (default "Photos"); the
  aṣọ òkè strip with `aria-hidden`; a stage of `figure` slides, each inactive one
  `aria-hidden="true"`; two buttons
  labelled "Previous photo" and "Next photo" that show ‹ and ›; a bar with the caption, the dots as a
  `tablist` named "Choose a photo" holding `tab` buttons with `aria-selected` and names "Photo N of
  M", and the count "N of M". The logic (lines 45 to 71) wraps at both ends (line 50) and has no
  keyboard handling, no timer and no swipe.
- The Odunde page passes six photographs under the heading "Ọdúndé in past years" and follows the
  carousel with an "All Odunde albums" button (`08 Odunde Festival.dc.html` lines 243 to 249, 298 to
  305); the Gala page passes five under "Past galas" with "All gala albums" (`09 End-of-Year
  Gala.dc.html` lines 182 to 187, 250 to 256).

### The ported CSS, and what it animates

- `packages/tokens/src/oy-components.css` lines 442 to 565 (verbatim from
  `docs/design/design/oy-components.css` lines 114 to 132): a paper frame with an indigo hairline and
  6px radius; the 8px aṣọ òkè strip; a 16:8 stage on `--indigo-900` with 14px margins (4:3 and 10px
  under 720px); every slide stacked absolutely at `opacity: 0` with `transition: opacity .35s ease`
  and `pointer-events: none` until `data-active="true"`; 52px round buttons (44px under 720px)
  centred by a static `transform: translateY(-50%)` with a .18s `background-color` transition; 12px
  dots 8px apart, also with a .18s `background-color` transition, the selected one terracotta 600; a
  15px caption; a 12.5px bold count with `text-transform: uppercase`.
- What animates: slide opacity over .35s and two background colours over .18s. Nothing moves,
  slides or scales.
- None of the port's reduced motion rules reach it. They cover `.v2-rule` (line 201), animations but
  not transitions under `.oy-home *` (line 290; the site's body carries `oy-home`,
  `packages/web/src/layouts/SiteLayout.astro` line 112) and the modal's animation (line 1860).

### The component map, the inventory and the brief

- `COMPONENT-MAP.md` line 92: framed (paper, aṣọ òkè top), 16:8 stage (4:3 under 720px), previous and
  next 52px (44px mobile), dots, caption, count, keyboard arrows; props `slides[]` and `label`; used
  for Odunde past years and Gala past galas. Swipe is listed for the `Lightbox` (line 93), not here.
  Conventions (lines 18 to 24): every component that can be empty has a Pending treatment, no hover
  lift, photos never zoom, transitions 0.15 to 0.22s ease.
- `07 Interaction Inventory.dc.html` never mentions a carousel. Its one photo browsing entry (lines
  187 to 196) is the gallery: an album tile opens a page, a photograph opens a full screen overlay
  driven by arrow keys, swipe, a background click or Escape, the caption stays visible, closing
  returns to the same scroll position and photograph, a photograph that fails to load shows its
  caption in a frame, and the overlay writes itself into the address bar. Its fourteen interactions
  (line 29) and the six components that carry them (line 238) include no carousel. The inventory
  still keeps six long forms inline (lines 51 to 115), which polish pass 2 of 1 September replaced
  with the Enquiry Modal in the same pass that introduced both framed carousels (`08 Build Brief.md`
  lines 267 to 270), so the inventory predates the carousel (an inference from the two files).
- The brief makes the inventory binding (lines 21 to 24) and sets the non-negotiables the carousel
  meets or misses: WCAG AA, 44px targets, glyphs limited to • → ✓ ×, modest motion with no lift,
  parallax or scroll animation (lines 51 to 58).
- The Phase 5 grill, recorded while this note was written, fixes the content: each carousel shows
  the first eight photographs of the newest past edition's album in album order, each with its own
  caption and alt text; the album's credit sits under the carousel with a Pending chip while it is
  unconfirmed; the albums buttons link to `/gallery` (`docs/tickets/phase-5/spec.md` Q8; ADR 0024).

### Repo rules and the two inline elements

- `docs/design/README.md` section 3 and `AGENTS.md`: no hover lift and photos never zoom (lines 83
  and 84), the elder test (line 114: AA, 17px body, 44px targets), the glyph set and uppercase only
  for kickers and path chips (lines 115 to 117). The token `--touch-target: 44px` sits in
  `packages/tokens/src/tokens/spacing.css`, and `packages/web/e2e/targets.spec.ts` fails any visible
  button under 44px at 375.
- SiteNav draws its caret with borders because of the glyph rule (`SiteNav.astro` line 104).
  `packages/lint` checks dashes, Yoruba marks and colour literals only (`packages/lint/src/files.ts`
  line 5), so ‹ › would pass the lint while breaking the rule.
- ADR 0018 as built: SiteNav's script guards `customElements.get`, returns early once `data-ready` is
  set and sets it last (`SiteNav.astro` lines 146 to 209); GiveDialog wires once into `this.oyApi`,
  adds its `document` and `window` listeners per connection under an `AbortController`, and aborts
  them and deletes `data-ready` in `disconnectedCallback` (`GiveDialog.astro` lines 294 to 326); the
  story waits for `data-ready`, then drives `userEvent` (`SiteNav.stories.ts` lines 65 to 84).
- Astro 7.3.1's router: `swap()` marks every script that already ran, keyed by `src` or text, unless
  it has `data-astro-rerun` (`dist/transitions/swap-functions.js` lines 28 to 45 and 224); after the
  swap `runScripts()` recreates and runs the rest, then `astro:page-load` fires
  (`dist/transitions/router.js` lines 72 to 100, 351 and 352). So the carousel's script runs after
  the swap on the first page that has one; on later pages the text matches, the script is skipped,
  and the registered definition upgrades each new element as it is inserted. Astro never
  deduplicates `is:inline` scripts, so a page with two carousels repeats the script and the guard
  makes the second copy a no-op (https://docs.astro.build/en/reference/directives-reference/#isinline).

## B. The APG carousel pattern and its examples

Sources: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/ (source `carousel-pattern.html` lines 84
to 186), https://www.w3.org/WAI/ARIA/apg/patterns/carousel/examples/carousel-1-prev-next/,
https://www.w3.org/WAI/ARIA/apg/patterns/carousel/examples/carousel-2-tablist/,
https://www.w3.org/WAI/ARIA/apg/patterns/tabs/, and the example code under
https://github.com/w3c/aria-practices/tree/main/content/patterns/carousel/examples.

- Three styles. Basic has the rotation, previous and next controls and no picker. Tabbed adds slide
  pickers built with the tabs pattern, one tab stop for all of them. Grouped adds pickers as buttons
  in a group, one tab stop each, which the pattern calls the least friendly for keyboard users.
- Container. Role `region` or `group`, chosen by the page's information architecture with a pointer
  to the landmark practice, plus `aria-roledescription="carousel"`. The name comes from
  `aria-labelledby` pointing at a visible label when there is one, otherwise `aria-label`, and it
  should not repeat the word carousel.
- Controls. Rotation, previous and next are native buttons (recommended). Activating them does not
  move focus, so they can be pressed repeatedly. Tab and Shift+Tab need no scripting. In the basic
  example previous and next carry `aria-controls` pointing at the element that holds the slides, and
  they precede the slides in the tab sequence.
- Slides in a basic carousel: role `group`, `aria-roledescription="slide"`, a name from a visible
  label or `aria-label`, and a position such as "3 of 10" only when nothing more specific exists; the
  pattern calls position in a name normally inappropriate and needed there only because `group`
  lacks `aria-setsize` and `aria-posinset`, a limitation the tabbed style does not have.
- Live region. Optionally, the element wrapping the slides has `aria-atomic="false"` and `aria-live`
  set to `off` while the carousel rotates by itself, `polite` when it does not. The basic example
  states that the new slide is then announced when a screen reader user presses next or previous; its
  stylesheet hides every slide except the active one with `display: none`
  (`examples/css/carousel-prev-next.css` lines 29 to 40).
- Rotation. Every rotation rule is conditional on an auto-rotate feature: rotation stops when
  anything inside takes keyboard focus and resumes only through the rotation control, which is then
  the first tab stop and changes its label instead of exposing a state; both examples also start
  paused under reduced motion and pause on hover. A carousel that never rotates needs none of it: no
  rotation control, no pause on hover or focus, no timers, and `aria-live="polite"` on the slide
  wrapper if the live region is used. WCAG 2.2.2 Pause, Stop, Hide does not apply either, because its
  moving content must start automatically and the Understanding page treats content started by the
  user's own link or button as not automatic
  (https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).
- Tabbed carousel. Slides are `tabpanel` in place of `group` and, per the pattern, carry no
  `aria-roledescription`; each tab's name says which slide it shows, by name or number ("Slide 3"),
  slide names being preferable when unique; the `tablist` is named for its purpose ("Choose slide to
  display"); tab, tablist and tabpanel follow the tabs pattern. The tabbed example differs from its
  pattern page: its panels keep `aria-roledescription="slide"` and `aria-label="1 of 6"`
  (`examples/carousel-2-tablist.html` lines 150 to 208), its tabs are named "Slide 1" with
  `aria-controls` (lines 102 to 138), and the tablist sits before the slides.
- The tabbed example's code: ArrowRight and ArrowLeft select the next or previous tab with wrap and
  move focus to it, Home and End go to the ends, and the handler stops propagation and prevents the
  default for those keys; the selected tab loses its `tabindex` and the others get `-1`; a panel is
  shown by a class that switches `display: none` off (`examples/js/carousel-tablist.js` lines 131 to
  190 and 253 to 285; `examples/css/carousel-tablist.css` lines 29 to 40).
- Tabs pattern. Tab enters the tablist on the active tab and leaves it on the next press; Left and
  Right move focus with wrap; Home and End are optional; tabs should activate when focused as long as
  their panels show without noticeable latency; each tab has `aria-controls` to its panel and
  `aria-selected`; each panel has `aria-labelledby` to its tab. The roving tabindex steps (one
  element at `tabindex="0"`, the rest at `-1`, swapped on an arrow key before `focus()`) are in
  https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/.
- Landmarks. The landmark practice asks that a region landmark be labelled and that repeated
  landmarks of one role carry unique labels, save for identical content such as twin pagination bars
  (`content/practices/landmark-regions/landmark-regions-practice.html` lines 100 to 110 and 360 to
  372). ARIA in HTML maps a `section` with an accessible name to `region`, allows `tab` on a
  `button`, and allows no role other than `figure` on a `figure` that has a `figcaption`
  (https://www.w3.org/TR/html-aria/). WAI-ARIA 1.2 describes `group` as a set of objects not meant
  for a page summary or table of contents, asks for `aria-roledescription` only on elements with a
  valid role, and requires a `tab` inside a `tablist` (https://www.w3.org/TR/wai-aria-1.2/).
- The older WAI tutorial (updated 13 April 2017) keeps focus on previous and next but moves it to the
  slide when a numbered picker is used, and announces "Item N of M" from its own live region
  (https://www.w3.org/WAI/tutorials/carousels/functionality/). APG's tabbed example keeps focus in
  the tablist; this note follows APG.

Where the prototype departs from APG:

1. A `tablist` whose tabs have no panels: the figures are not `tabpanel`s, no tab has
   `aria-controls`, every dot is its own tab stop, and no arrow key works.
2. Tab names "Photo N of M" put the position in the name, which the pattern calls unnecessary for
   tabs; "Photo N" follows the "Slide 3" form.
3. Inactive slides are only `aria-hidden` and still rendered at opacity 0, so layout, lazy loading
   and the test tools all still see them (section D).
4. Slides have no role or name, and no live region wraps them.
5. The container is a `region` named by `aria-label` although the section heading above it is a
   visible label. On the site it sits inside `Section`, which renders `<section aria-labelledby>`
   (`packages/ui/src/page/Section/Section.astro`; the homepage labels every section,
   `packages/web/src/pages/index.astro` lines 69 to 126), so a nested `region` named by the same
   heading repeats a landmark with the same name. Deque's `landmark-unique` rule flags that as a best
   practice (https://dequeuniversity.com/rules/axe/4.13/landmark-unique), outside the WCAG tags the
   site's axe spec runs (`packages/web/e2e/a11y.spec.ts` line 17). `role="group"` with
   `aria-labelledby` on the heading avoids it.
6. ‹ and › are outside the glyph set.
7. 12px dots on a 20px pitch fail the repo's 44px rule, and they miss the spacing exception of WCAG
   2.5.8 (AA) as well: 24px circles centred on each target must not intersect another target or
   circle, and circles 20px apart do
   (https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html; the pitch arithmetic is
   mine). Only the criterion's equivalent control exception, argued through previous and next, could
   save them under WCAG; the repo rule applies regardless.
8. The .35s fade exceeds the 0.15 to 0.22s convention and has no reduced motion rule.
9. The uppercase count breaks the rule that keeps uppercase for kickers and path chips; the 15px
   caption and 12.5px count sit under the 17px body floor, as PhotoTile's 13px caption already does
   (`packages/ui/src/media/PhotoTile/PhotoTile.astro`).

What the prototype gets right on contrast (computed): the white glyph on the 55% `--indigo-900` disc
is 3.77:1 over a pure white area of photograph and 18.87:1 over black, above the 3:1 WCAG 1.4.11 asks
of controls (https://www.w3.org/TR/WCAG22/#non-text-contrast); the selected dot's `--terra-600` on
paper is 4.52:1 and the unselected `--indigo-700` ring 12.61:1; the count's `--muted` on paper is
4.85:1 and the caption's `--ink` 14.54:1, both above 4.5:1. What it misses: the light scope focus
ring, `--indigo-700` (`colors.css` line 45, applied by `packages/tokens/src/base.css` lines 53 to 57),
drops to 1.53:1 over a black area of photograph. A white outline with an `--indigo-900` halo keeps
one of its two rings at 4.05:1 or better against every colour of a 16 level RGB grid; `--gold-300`
with the same halo bottoms out at 3.21:1.

## C. Keyboard arrows

- APG's carousel keyboard section reaches arrow keys only through the tabs pattern, when the pickers
  are tabs. The general convention is Tab between components and arrow keys inside a composite widget
  (https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/, fundamental navigation conventions).
  APG neither recommends nor forbids Left and Right on the whole carousel; the tablist gives them a
  standard home.
- WCAG 2.1.4 Character Key Shortcuts (A) covers shortcuts made only of letter, punctuation, number or
  symbol characters, and its remedies (turn the shortcut off, remap it to include a non-printable key
  such as Ctrl or Alt, or make it active only while its component has focus) treat non-printable keys
  as the safe form (https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html). Arrow
  keys are not character keys, so a Left and Right handler is outside 2.1.4 (a reading of the
  criterion's text; the page does not name arrow keys), and a handler that acts only while focus is
  inside the carousel would meet the focus option regardless.
- Collisions to avoid: Alt+Left and Alt+Right go back and forward in history on Windows and Linux, as
  do Cmd+Left and Cmd+Right on macOS (https://support.google.com/chrome/answer/157179); unhandled
  arrows scroll the page.
- What a host listener receives: `keydown` bubbles from the focused control to the host in the
  browser, and in the canvas `userEvent.keyboard` dispatches it on the active element
  (`storybook/dist/test/index.js` line 15607) with `bubbles: true` (line 14982) and skips its own
  default action when a listener calls `preventDefault()`.
- A safe implementation: one `keydown` listener on the host that acts only when `event.target` is
  one of the carousel's own controls (a tab, or the previous or next button); returns when
  `event.defaultPrevented` or when Alt, Ctrl, Meta or Shift is held; maps Left and Right to the
  previous and next photograph with wrap on all three kinds of control, and Home and End on tabs
  only; calls `preventDefault()` only for a key it handled; moves focus with the selection on a tab
  (tabs pattern) and leaves focus on a button (APG controls). No listener on `document` or `window`,
  which would take arrows from the page and other components, and no `tabindex` on the host, which
  would add a tab stop with nothing to operate.

## D. Hiding inactive slides, and loading their images

| Technique | Accessibility tree and focus | Test tools | Lazy image while hidden |
| --- | --- | --- | --- |
| `hidden` (the UA's `display: none`) | removed, nothing inside focusable | hidden for Testing Library, user-event and Playwright | not fetched |
| `inert` with `opacity: 0` | removed from assistive technology and focus | Testing Library and user-event ignore `inert`; Playwright's visibility checks count opacity 0 as visible | fetched |
| `aria-hidden="true"` with `opacity: 0` (the prototype) | removed from assistive technology, focusable content still reachable | Testing Library skips it; Playwright's visibility checks count it visible | fetched |
| `visibility: hidden` after a fade | removed, not focusable | hidden for all three | not prevented, as far as the sources say |

- `hidden` renders as `display: none` from the UA stylesheet, and a `display` declaration on the
  element overrides it (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden),
  which is why GiveDialog restates `[hidden] { display: none }` (`GiveDialog.astro` lines 133 to
  137). `hidden="until-found"` (Chrome 102, Firefox 148, Safari 26.2 partial, BCD) reveals content for
  find in page and fragment links, which image-only slides do not need.
- `inert` makes hit testing behave as `pointer-events: none`, blocks focus, is ignored by find in
  page and is not exposed to accessibility APIs, with no visual cue of its own
  (https://html.spec.whatwg.org/multipage/interaction.html#inert-subtrees); Chrome 102, Firefox 112,
  Safari 15.5 (BCD `html/global_attributes.json`).
- Test tools: `@testing-library/dom` treats an element as inaccessible when it or an ancestor has
  `hidden`, `aria-hidden="true"` or `display: none`, or when its own computed `visibility` is
  `hidden` (`dist/role-helpers.js` lines 33 to 78); user-event's Tab skips `tabindex` below 0,
  disabled elements, and anything under `display: none` or `visibility: hidden`
  (`storybook/dist/test/index.js` lines 14097 to 14111, 14612 to 14659). Neither package mentions
  `inert`. Playwright counts an element visible when its box is non-empty and it lacks
  `visibility: hidden`, so opacity 0 is visible (https://playwright.dev/docs/actionability), and
  `getByRole` matches only elements not hidden in the ARIA sense unless `includeHidden` is set
  (https://playwright.dev/docs/api/class-locator).
- Lazy loading. Chrome, Safari and Firefox do not load a lazy image under `display: none`, but
  `opacity: 0` does not stop it; Chromium starts lazy images 1250px from the viewport on fast
  connections and 2500px on slow ones, and since Chrome 121 horizontal scrollers use the same
  distances (https://web.dev/articles/browser-level-image-lazy-loading, updated 13 August 2024). The
  HTML Standard turns lazy loading off when scripting is disabled, as an anti-tracking measure, and
  continues a deferred load when `loading` becomes eager
  (https://html.spec.whatwg.org/multipage/urls-and-fetching.html#lazy-loading-attributes). With
  `hidden` slides and `loading="lazy"`, then: slide 1 loads as the section approaches; a hidden slide
  loads when shown or when the script sets `img.loading = 'eager'` (Chrome 77, Firefox 75, Safari
  15.4, BCD `api/HTMLImageElement.json`); and a reader without JavaScript has no lazy loading, so
  nothing defers the hidden slides' images (an inference from the spec step).
- `decode()` settles only once the current request is completely available, broken or replaced
  (https://html.spec.whatwg.org/multipage/embedded-content.html#dom-img-decode), so on a lazy image
  that never started it waits for whatever starts the load (inference). The slide change should not
  wait on it: tabs that activate on focus need an instant panel, and the stage's fixed ratio and
  indigo ground already absorb a late image.
- `decoding="async"` lets the next paint proceed without waiting for the decode
  (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img); QUALITY.md asks for it
  with `loading="lazy"` below the fold (lines 83 and 84). Both carousels sit near the end of their
  pages, so every slide can be lazy; if a page ever puts one in the first viewport, slide 1 should
  load eagerly (the web.dev article advises against lazy loading in-viewport images).
- A fade on `hidden` slides. A transition cannot start from `display: none` without `@starting-style`
  (Chrome 117, Firefox 129, Safari 17.5) and `transition-behavior: allow-discrete`, and `display` is
  transitionable only in Chrome 117 and Safari 18, not Firefox (BCD `css/at-rules/starting-style.json`,
  `css/properties/transition-behavior.json`). A keyframe animation on the incoming slide works in all
  three: unhide it on top, let it fade in over the outgoing slide, then hide the outgoing slide once
  the incoming slide's `getAnimations()` have finished. `getAnimations()` triggers a style change
  event first, so an animation started by an attribute change in the same task is in the list
  (`web-animations-1/Overview.bs` lines 7015 to 7020,
  https://drafts.csswg.org/web-animations-1/#dom-animatable-getanimations); cancelling an animation
  rejects its `finished` promise with `AbortError` (same specification). Support: Chrome 84, Firefox
  75, Safari 13.1 (BCD `api/Element.json`). With no animation the list is empty and the hide is
  immediate.
- `sizes`. `.oy-wrap` is 1100px wide including its 24px gutters, as every box is `border-box`
  (`base.css` lines 2 to 6 and 91 to 95; `spacing.css`); the frame adds a 1px border and the stage
  14px margins (10px under 720px). The stage is therefore 1022px wide from a 1100px viewport up,
  `100vw - 78px` from 721px to 1099px, and `100vw - 70px` at 720px and below:
  `sizes="(max-width: 720px) calc(100vw - 70px), (max-width: 1100px) calc(100vw - 78px), 1022px"`.
  `sizes` describes the element's width; under `object-fit: cover` a 3:2 photograph in the 4:3
  stage is drawn 1.125 times wider than the element, which the next srcset step covers.
  `createImageSet({ width: 1022 })` without `aspect` yields 511, 1022, 1533 and 2044w (capped at the
  asset's width) plus the hotspot as `object-position`, so one set serves the 16:8 and the 4:3 crop
  (`packages/content/src/images.ts` lines 89 to 115). `sizes="auto"` is Chrome 126 and Firefox 150
  only, not Safari (BCD `html/elements/img.json`, WebKit bug 253143), and browsers without it read
  the list after `auto` (MDN `img`); it adds nothing over the exact value above.
- Layout shift. The stage's `aspect-ratio` fixes its box before any image arrives, so a late image
  never moves content (width and height attributes do the same for unframed images, MDN `img`).

## E. Reduced motion

- The prototype animates slide opacity (.35s) and the buttons' and dots' background colours (.18s);
  nothing else (section A).
- WCAG 2.3.3 Animation from Interactions is AAA. Its Understanding page excludes changes of colour,
  blurring or opacity that do not change perceived size, shape or position from motion animation (an
  erratum stops excluding blurring), and technique C39 answers it with `prefers-reduced-motion`
  (https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html,
  https://www.w3.org/WAI/WCAG22/Techniques/css/C39). A cross-fade is not motion animation in WCAG's
  terms, and MDN's own example swaps a scaling animation for a dissolve under `reduce`
  (https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion;
  Chrome 74, Firefox 63, Safari 10.1, BCD).
- The site goes further than WCAG: Astro's stylesheet cancels every view transition animation under
  `prefers-reduced-motion`, the 380ms page cross-fade included
  (`docs/research/phase-3-astro-actions-transitions-islands.md`, section B), the modal's entrance stops
  (port line 1860), and `.oy-home *` stops every CSS animation (port line 290).
- For the carousel: a 0.2s opacity keyframe on the incoming slide, set to `animation: none` under
  `reduce` in the component's own stylesheet (stories render outside `.oy-home`, where the port's
  rule does not reach), and the colour transitions kept. The script needs no `matchMedia`: without
  an animation, `getAnimations()` is empty and the outgoing slide hides at once.

## F. Swipe, and the base without JavaScript

### Swipe

- WCAG 2.5.1 Pointer Gestures (A) counts a swipe as a path-based gesture, asks for a single pointer
  alternative without a path, uses a carousel with previous and next buttons as its passing example,
  and covers only gestures the author implements, not the browser's or the operating system's
  (https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html). 2.5.7 Dragging Movements (AA)
  is about grabbing and moving, not path-based gestures, and exempts scrolling the user agent
  provides (https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html). The 52px and 44px
  buttons satisfy both, with or without swipe.
- Mechanics (https://w3c.github.io/pointerevents/): `touch-action: pan-y` leaves vertical panning to
  the browser and delivers horizontal movement as pointer events; the value is read at `pointerdown`;
  once the browser takes a gesture it fires `pointercancel` and sends nothing more for that pointer;
  touch input should behave as if captured by its `pointerdown` target (implicit capture, a SHOULD);
  `setPointerCapture` throws `NotFoundError` for a pointer id that is not active, which a synthetic
  test event's id can be. `pan-y` alone also disables pinch zoom, which MDN flags for low vision
  readers, so the value would be `pan-y pinch-zoom`
  (https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action; `pinch-zoom`
  Chrome 56, Firefox 85, Safari 13, BCD).
- Costs: a reader who has zoomed in cannot pan the page sideways with a gesture that starts on the
  stage (inference from `pan-y` allowing vertical panning only); a swipe is a drag, and only discrete
  input (tap, click, keypress) marks a layout shift as expected, so anything that moves after a swipe
  counts toward field CLS (https://web.dev/articles/cls); tests have to dispatch untrusted synthetic
  events (https://playwright.dev/docs/touch-events).
- A minimal version, if the owner wants one: `pointerdown`, `pointerup` and `pointercancel` on the
  stage for touch and pen only; record the start on down; on up, a horizontal travel of at least 40px
  that exceeds the vertical travel goes to the next or previous photograph; cancel clears; no capture
  call, no `preventDefault`, no document listeners. The Lightbox (Phase 8) needs the same gesture.
- Recommendation: leave swipe out of Phase 5. The component map lists it for the Lightbox and not
  the carousel, the brief makes the handoff binding, and the buttons already meet 2.5.1; decide once,
  for both components, when the Lightbox is built.

### The base without JavaScript

- Option 1, the first photograph only. The server renders slide 1 and `hidden` on the rest; controls,
  dots and count stay invisible through `visibility` until `data-ready`. CLS: none, because
  `visibility` keeps every box in place when the script arrives, where `display` would move the bar.
  Readers without JavaScript get one photograph, its caption and the section's albums link.
  ClientRouter: on the first arrival the script runs after the swap, so a frame can show the
  pre-ready state without any shift; on later arrivals the element upgrades as it is inserted; there
  is nothing to clean up.
- Option 2, a scroll-snap strip (`overflow-x: auto` with `scroll-snap-type: x mandatory`, Chrome 69,
  Firefox 99, Safari 11, BCD). Every photograph is reachable without JavaScript and swipe is native,
  outside 2.5.1 and 2.5.7. Costs: the strip must be keyboard focusable (Deque's
  `scrollable-region-focusable`, WCAG 2.1.1,
  https://dequeuniversity.com/rules/axe/4.13/scrollable-region-focusable), a named tab stop with no
  action; every slide stays in the accessibility tree unless script applies `inert` after each
  scroll; the script must follow the scroll to update dots and count (`scrollend` is Chrome 114,
  Firefox 109, Safari 26.2; `scrollsnapchange` is Chrome 129 only; BCD `api/Element.json`); neighbours
  load early (Chrome 121, web.dev); smooth scrolling from the buttons is motion and needs its own
  reduced motion branch; and the prototype's fade becomes a slide. CLS: none, the ratio is fixed.
  ClientRouter: a fresh strip per navigation starts at slide 1, the same as option 1.
- Recommendation: option 1. The prototype and both APG examples show one slide at a time, the
  script stays small, and the page already carries the albums link.

## G. Driving it from Storybook and Playwright

- Storybook (`@storybook-astro/framework` 1.11.0, `storybook` 10.6.0): the canvas re-inserts inline
  scripts after rendering, so play waits for `data-ready` first
  (`docs/research/phase-3-storybook-play-functions.md`; `SiteNav.stories.ts` line 70).
  `userEvent.click` focuses and clicks; `userEvent.keyboard('{ArrowRight}')`, `'{Home}'` and
  `'{End}'` dispatch on the active element; `'{Shift>}{ArrowRight}{/Shift}'` holds a modifier; Enter
  on a button clicks on keypress and Space on keyup (`storybook/dist/test/index.js` lines 14828 to
  14873). `userEvent.tab()` picks the next stop itself and skips `tabindex="-1"`, so it lands on the
  selected tab of a roving tablist (lines 14623 to 14659).
- Queries and matchers from `storybook/test`: `within(canvasElement).getByRole('tab', { name: 'Photo
  2' })`, `getByRole('tabpanel')` finding only the visible slide (hidden ones are inaccessible, above),
  `toHaveAttribute('aria-selected', 'true')`, `toHaveFocus()`, and `waitFor` for the outgoing slide's
  `hidden` after the fade.
- Chromatic pauses CSS animations on their last frame (https://www.chromatic.com/docs/animations/);
  the incoming slide is on top at full opacity in that frame, so a snapshot taken after a play
  function is right even if the outgoing slide has not been hidden yet.
- Vitest renders stories through the container API and never runs scripts (phase 3 note), so its
  tests assert the initial markup and ARIA only (ADR 0018).
- Playwright 1.63 (`packages/web/playwright.config.ts`: Chromium at 1440 and at 375 with touch):
  `getByRole('tab', { selected: true })` for the current photograph; `getByRole('tabpanel')` with
  `toHaveCount(1)`; `locator.press('ArrowRight')` and `toBeFocused()`; `page.emulateMedia({
  reducedMotion: 'reduce' })`; `test.use({ javaScriptEnabled: false })`; `page.on('request')` for
  image fetches; Chromium's `PerformanceObserver` with `layout-shift` entries for CLS attribution;
  `page.clock.install()` before `goto`, then `runFor`, to show nothing rotates
  (https://playwright.dev/docs/clock). A role query's `name` is a case-insensitive substring unless
  `exact: true`, so "Photo 1" also matches "Photo 10" without it
  (https://playwright.dev/docs/api/class-page#page-get-by-role). CI builds with a placeholder Sanity
  project, so the event pages have no photographs there (`docs/plans/prompt-phase-5.md` line 10):
  the carousel specs skip when fewer than two slides render.

## Recommendation

A tabbed carousel in APG's sense: the prototype's dots completed as tabs, one photograph shown at a
time, no rotation, no swipe for now, and every copy string in the markup.

### Markup skeleton

`packages/ui/src/media/PhotoCarousel/PhotoCarousel.astro`, props `slides[]` (image, alt, caption),
`labelledby` (the section heading's id) or `label`, `id` (the prefix for internal ids, distinct per
story, since the autodocs page set in `.storybook/preview.ts` can render several stories in one
document), `sizes`. One photograph renders the framed image and caption with no carousel roles or
controls; none renders the Pending placeholder in the stage. The album's credit line and its Pending
chip (spec Q8) belong to the page below the carousel, outside its group and live region.

```astro
<oy-photo-carousel class="oy-carousel" role="group" aria-roledescription="carousel"
  aria-labelledby={labelledby} aria-label={labelledby ? undefined : label}>
  <div class="oy-carousel-top" aria-hidden="true"></div>
  <div class="oy-carousel-stage">
    <button class="oy-carousel-btn oy-carousel-btn--prev" type="button" data-prev
      aria-label="Previous photo" aria-controls={`${id}-slides`}>
      <span class="oy-carousel-chevron" aria-hidden="true"></span>
    </button>
    <button class="oy-carousel-btn oy-carousel-btn--next" type="button" data-next
      aria-label="Next photo" aria-controls={`${id}-slides`}>
      <span class="oy-carousel-chevron" aria-hidden="true"></span>
    </button>
    <div class="oy-carousel-slides" id={`${id}-slides`} aria-live="polite" aria-atomic="false">
      {slides.map((slide, i) => (
        <div class="oy-carousel-slide" id={`${id}-slide-${i + 1}`} role="tabpanel"
          aria-labelledby={`${id}-tab-${i + 1}`} data-position={`${i + 1} of ${slides.length}`}
          data-active={i === 0 ? 'true' : undefined} hidden={i !== 0}>
          <img {...imgAttributes(slide.image, sizes)} alt={slide.alt} loading="lazy" decoding="async" />
        </div>
      ))}
    </div>
  </div>
  <div class="oy-carousel-bar">
    <div class="oy-carousel-cap">
      {slides.map((slide, i) => <p data-active={i === 0 ? 'true' : undefined}>{slide.caption}</p>)}
    </div>
    <div class="oy-carousel-dots" role="tablist" aria-label="Choose a photo">
      {slides.map((_, i) => (
        <button class="oy-carousel-dot" type="button" role="tab" id={`${id}-tab-${i + 1}`}
          aria-controls={`${id}-slide-${i + 1}`} aria-label={`Photo ${i + 1}`}
          aria-selected={i === 0 ? 'true' : 'false'} tabindex={i === 0 ? undefined : '-1'}></button>
      ))}
    </div>
    <p class="oy-carousel-count">1 of {slides.length}</p>
  </div>
</oy-photo-carousel>
<script is:inline>/* the element described below */</script>
```

The image also takes the hotspot as `object-position`, as PhotoTile does (`positionOf` in
`packages/ui/src/media/image.ts`). The buttons come before the slides, as in APG's examples; the
tablist stays after them, where it is drawn. Every caption is server-rendered, so marks and any
`lang` spans stay markup, and the script copies no string except the active slide's
`data-position` into the count.

### Behaviour of `oy-photo-carousel`

1. Defined inside `if (!customElements.get('oy-photo-carousel'))`. Wiring happens once
   (`this.oyApi`, as GiveDialog), reading slides, captions, tabs, buttons and count from the markup.
   With two slides or more, `data-ready="true"` is set at the end of each `connectedCallback` and
   deleted in `disconnectedCallback`; with fewer there are no controls to wire, and the element
   returns without marking itself ready.
2. The current index is the slide carrying `data-active`.
3. `show(index, focusTab)`: wraps with modulo; if the index is unchanged, only focuses when asked;
   otherwise unhides the incoming slide, moves `data-active` to it and to its caption, sets
   `aria-selected` true on its tab and false on the others, removes its tab's `tabindex` and sets
   `-1` on the others, writes its `data-position` into the count, focuses the tab when asked, then,
   once the incoming slide's `getAnimations()` have finished (rejections caught), sets `hidden` on
   every other slide provided the incoming slide is still current, so a later change wins.
4. Previous and Next call `show(current - 1)` and `show(current + 1)` on click; focus stays on the
   button.
5. A tab calls `show(k)` on click; the roving `tabindex` follows the selection whatever the browser
   does with focus on click.
6. Keys, from one `keydown` listener on the host (section C): ArrowLeft and ArrowRight on a tab or on
   either button, Home and End on a tab; ignored with a modifier held or `defaultPrevented`;
   `preventDefault()` only when handled; a tab passes `focusTab`, a button does not.
7. Warm-up: per connection, an `IntersectionObserver` (Chrome 51, Firefox 55, Safari 12.1, BCD) on
   the host sets `loading = 'eager'` on the images of the slides either side of the current one when
   the carousel approaches the viewport, then disconnects; every `show` warms the new neighbours;
   `disconnectedCallback` disconnects the observer if it is still waiting.
8. No rotation, no timers, nothing on load, no focus moved except within the tablist, no `document`
   or `window` listeners and therefore no `AbortController`. Anything global added later (swipe,
   resize) follows GiveDialog's per connection `AbortController`.

### CSS responsibilities

The component's scoped style, over the port, tokens only:

- `oy-photo-carousel { display: block }` (SiteNav does the same for its host).
- Pre-ready: `oy-photo-carousel:not([data-ready])` sets `visibility: hidden` on the buttons, dots and
  count, which keeps their boxes.
- Slides: undo the port's stacking fade (`opacity: 1`, `transition: none`, `pointer-events: auto`),
  restate `[hidden] { display: none }`, put `[data-active="true"]` on top with `z-index: 1` and a 0.2s
  `animation` from `opacity: 0`, and `animation: none` under `prefers-reduced-motion: reduce`.
- Captions: stack every caption in one grid cell and show the active one through `visibility`, so
  the bar keeps the height of the longest caption and nothing below moves when the photograph
  changes (this also keeps a future swipe out of field CLS).
- Buttons: a drawn chevron (two borders in `currentColor`, rotated) instead of ‹ and ›, as SiteNav's
  caret; the 1.5% press settle through the `scale` property (Chrome 104, Firefox 72, Safari 14.1,
  BCD), because `transform` already centres the button; a two-tone focus ring on the stage (white
  outline, `--indigo-900` halo).
- Dots: 44px square buttons with the 12px dot drawn by `::before` (`--indigo-700` ring,
  `--terra-600` fill when selected), `gap: 0`, `flex-wrap: wrap`. At 375 the bar's inner width is
  289px (327px of content, two 1px borders, 18px padding each side), so five dots fit beside the
  count, six fill a row, and the eight the spec allows wrap to a second row of two with the count
  beside them; at 1440 eight dots (352px) sit on one row with the caption and count.
- Forced colours override backgrounds and drop `box-shadow`, while borders and outlines keep a forced
  colour (https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors):
  the chevron and the ring's outline survive, the selected dot's fill does not, so mark it with a
  system colour such as `Highlight` under `forced-colors: active`.
- Count: no `text-transform: uppercase`, unless the owner keeps the prototype's.
- No `touch-action` while there is no swipe.

### Without JavaScript

Slide 1 and its caption show; slides 2 onwards are `hidden`; the controls, dots and count keep their
space but stay invisible, so the upgrade shifts nothing and Lighthouse sees a stable frame; the
section's albums link is the way to the other photographs. Because lazy loading needs scripting,
those readers still download the hidden slides' images; wrapping hidden slides in `<template>` would
prevent it at the cost of more script and markup, and is not worth it.

### Test plan

- Vitest (`PhotoCarousel.test.ts`, `composeStories` with `renderToBody`): the group with its role
  description and `aria-labelledby` or `aria-label`; `aria-live="polite"` and `aria-atomic="false"`
  on the wrapper; slide 1 without `hidden` and the rest with it; each panel labelled by its tab and
  each tab controlling its panel; `aria-selected` and `tabindex` on the tabs; the button names and
  `aria-controls`; `loading="lazy"`, `decoding="async"`, `sizes` and the hotspot `object-position`;
  the first caption active and the count "1 of N"; one photograph with no controls; none with the
  Pending placeholder; neither ‹ nor › in the output.
- Stories (`Media/PhotoCarousel`): `Default` (Odunde's six, desktop), `Gala` (five), `Mobile` (375),
  `OnePhoto`, `Pending`; play stories, each waiting for `data-ready`: `ButtonsWrap` (Next selects
  Photo 2, one tabpanel, count "2 of 6", focus still on Next; Previous twice then goes through
  Photo 1 to Photo 6, wrapping), `TabsKeyboard` (Tab from Next lands on the selected tab; ArrowRight
  moves focus and selection; End, then ArrowRight wraps to Photo 1; Home), `ArrowsOnButtons`
  (ArrowRight on Next changes the photograph and keeps focus), `ModifiersIgnored` (Shift+ArrowRight
  on a tab changes nothing), with `waitFor` on the outgoing slide's `hidden`.
- Playwright (`packages/web/e2e/carousel.spec.ts`, `/odunde` and `/gala`, both projects, skipped
  below two slides): upgraded with one tabpanel; buttons wrap and keep focus; tablist keys move focus
  and selection; under `reducedMotion: 'reduce'` the outgoing slide is hidden within one frame of the
  click (read inside a single `page.evaluate`), while the default keeps it until the fade ends; after
  scrolling the section into view, slides 1, 2 and N are requested and slide 3 only after slide 2
  shows (match requests by each slide's asset id); nothing changes after `page.clock.runFor` of a
  minute; client-side navigation `/`, then `/odunde`, then `/gala`, then back to `/odunde`, upgrades
  every carousel; without JavaScript one tabpanel shows, the controls are hidden and the albums link
  exists; axe on both routes with the carousel on Photo 2; the 44px sweep of `targets.spec.ts` run on
  both routes; layout shift entries attributed to the carousel sum to zero after load.
- Lighthouse: CLS stays under 0.05 on both routes (QUALITY.md line 74).

### Left to the owner

1. Swipe on the inline carousel: not in the component map, recommended to wait for the Lightbox
   (section F has the minimal version and its costs).
2. Dots as 44px tabs, which spreads the visible dots to a 44px pitch, or dots as a decorative mark
   with previous, next and the count as the only controls (APG's basic carousel, the prototype's
   spacing, no direct picking).
3. The drawn chevron instead of ‹ and ›, and "Photo N" instead of "Photo N of M" on the tabs.
4. The count's uppercase against the uppercase rule, and the 15px caption and 12.5px count against
   the 17px body floor.
5. Whether eight dots wrapping to two rows at 375 is acceptable (the spec's eight photographs meet
   the 44px pitch there), or the carousel takes six. The album, captions, credit line and the
   `/gallery` link are already settled (spec Q8, ADR 0024); until the gallery exists (Phase 8) that
   link is also the only path to the other photographs for readers without JavaScript.
6. An ADR recording the choices once settled, as the Phase 5 prompt asks for decisions that land.
