# Phase 6: the FAQ accordion without a library

Date: 13 September 2026. Method: read the repo's requirements first (`COMPONENT-MAP.md` line 87;
`01 Components.dc.html` lines 614 to 628; `11 Yoruba Language School.dc.html` lines 118 to 131 and
186 to 204; the `.oy-faq` block in `packages/tokens/src/oy-components.css`; `ROUTES-AND-INTERACTIONS.md`;
`CONTENT-MODEL.md`; the `faqItem` schema, layout options and Pending registry in `packages/content`;
`Prose`, `Pending` and `Schedule` in `packages/ui`; the e2e specs; `AGENTS.md`; ADR 0018; the Phase 3
play function note and the Phase 5 carousel note). Then the primary sources, most read from their
repositories through `gh api`: the HTML Standard (`whatwg/html` `source`, commit of 8 September 2026);
the DOM Standard (`whatwg/dom`, 25 August 2026); the UI Events event architecture (`w3c/uievents`
`dom-architecture.bs`); CSSOM View and CSS Containment 2 (`w3c/csswg-drafts`); ARIA in HTML
(Recommendation of 11 August 2026, editor's draft of 3 September 2026), HTML-AAM (editor's draft of 27
August 2026) and WAI-ARIA (`w3c/aria` main); the APG accordion pattern (source last changed 29 April
2026), its example, the disclosure FAQ example, and APG issues 3391 and 3406 with pull request 3434;
WHATWG issue 8864; WCAG 2.2 (Recommendation of 12 December 2024) and its Understanding pages
(`w3c/wcag` main); `mdn/browser-compat-data` on `main` (BCD below, release dates from its `browsers/`
files); Playwright's docs at tag v1.63.0; axe-core at tag v4.13.0. Installed packages read: `storybook`
10.6.0 (`dist/test/index.js`, `dist/preview/runtime.js`, under
`node_modules/.bun/storybook@10.6.0+34ec30f1499ccd6a/node_modules/storybook`) and `playwright-core`
1.63.0 (`lib/coreBundle.js`). Three throwaway scripts in the session scratchpad drove Playwright's
bundled Chromium (Chrome for Testing 153.0.8010.12, headless shell; "Chromium 153" below) against inline
test pages, with axe-core 4.13.0 injected; "observed" marks their results. No repo file other than this
note changed, nothing was installed, and no screen reader was run. Contrast ratios are computed from
`packages/tokens/src/tokens/colors.css` with the WCAG relative luminance formula.

## A. What the handoff and the repo ask for

- `COMPONENT-MAP.md` line 87: `Accordion` (FAQ) with single open, multi open, closed rows that keep
  44px and an open by default option; props `items[]`, `multi`, `defaultOpen`; used on Lessons. The
  canvas (`01 Components.dc.html` line 616): single open by default, several open where people compare
  answers, closed rows keep their 44px target. Its example (lines 618 to 626) shows an open first row
  whose answer is a chip reading "Pending: the answer", and a closed second row.
- The Lessons prototype (lines 118 to 131): `section#faq` on the alt ground with the `h2` "Questions
  parents ask", a lead paragraph, then per question a `div.oy-faq-item` holding `button.oy-faq-q` with
  `aria-expanded`, the question text and `span.oy-faq-mark` (`aria-hidden`) showing "+" or "−", and a
  `div.oy-faq-a` rendered only while open. The questions are not headings. Its logic (lines 186 to
  204) opens the first item when the `faq` prop is `open`, and its toggle adds an index without
  removing the others, so the prototype script is multi open. `ROUTES-AND-INTERACTIONS.md` line 157
  says single open and so does the owner; both outrank the prototype script.
- Content: `faqItem` is a required `question` and an optional `answer` of type `blockContent`, whose
  Studio description promises a Pending chip while it is empty
  (`packages/content/src/schema/objects/faqItem.ts`); `lessonsPage.faq[]` holds five (`CONTENT-MODEL.md`
  line 66); the layout option `faq` is `closed` or `open` (`packages/content/src/layout-options.ts` line
  73; ROUTES line 209). The registry names "the questions parents ask" for an empty list and "an answer"
  when any answer is missing (the two `lessonsPage` entries for `faq[]` in
  `packages/content/src/pending.ts`), so the chip reads "Pending: an answer"; the registry outranks the
  canvas wording (ADR 0014). `blockContent` allows the normal, `h3` and `blockquote` styles, strong, em,
  links and `pullQuote` (`blockContent.ts` lines 23 to 60); `Prose` renders nothing for an empty value,
  and `ProseHeading` renders the `h3` style as an `h3`.
- The port (`packages/tokens/src/oy-components.css` lines 1666 to 1719): hairlines between rows; a full
  width flex question row with `padding: 20px 4px` and `min-height: 44px`, the display face at 600 and
  18px in `--indigo-700`, a 0.2s colour transition to `--terra-600` on hover; a 28px mark circle with a
  1.5px `--border-soft` ring; the answer at 16px in `--text-muted` with `padding: 0 4px 22px`. Nothing
  animates the opening.
- Against the repo rules: the "+" and "−" text marks fall outside the glyph set (`AGENTS.md` line 83),
  so they must be drawn; the 16px answer is under the 17px body floor (line 82). Contrast, computed: the
  question 12.61:1 on `--paper`; the hover `--terra-600` 4.52:1 (18px at 600 is not large text, so 4.5:1
  applies and it passes narrowly); the answer's `--muted` 4.85:1 on paper and 5.26:1 on white; the mark's
  ring 1.18:1, so the drawn bars in `--indigo-700` must carry the state. Every element gets the base
  `:focus-visible` outline in `--focus-ring` (`packages/tokens/src/base.css` lines 53 to 57).
- A precedent: `Schedule` already puts the festival schedule in a native `details` with no script, its
  summary styled as a quiet button with `list-style: none`, a hidden `::-webkit-details-marker` and
  `min-height: 44px` (`packages/ui/src/content/Schedule/Schedule.astro` lines 46 to 84), and
  `packages/web/e2e/odunde.spec.ts` lines 86 to 104 prove it without JavaScript through
  `toHaveJSProperty('open', ...)` and a click on `summary`.
- The harness: the 44px sweep selects `a, button, input, select, textarea` and filters with
  `checkVisibility()` (`packages/web/e2e/targets.spec.ts` lines 6 to 17), so a `summary` is never
  measured; the axe runs use `wcag2a`, `wcag2aa`, `wcag21a` and `wcag21aa` (`a11y.spec.ts` line 17), and a
  separate `heading-order` run covers `/`, `/odunde` and `/gala` (lines 58 to 67); CI builds against a
  placeholder Sanity project, so the Lessons route has no questions there (`prompt-phase-6.md` line 10).
- ADR 0018 governs components whose behaviour must run in Storybook: an inline plain JavaScript custom
  element, `data-ready`, and play functions that wait for it. A component with no script sits outside
  it, as `Schedule` does.

## B. The HTML Standard: `details`, `summary` and exclusive groups

Sources: https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element and
`#the-summary-element`; https://html.spec.whatwg.org/multipage/interaction.html; the rendering section.

- `details` represents a disclosure widget; its content model is one `summary` followed by flow
  content; the standard forbids using it for tab or menu widgets, which are not disclosures.
- `name` (https://html.spec.whatwg.org/multipage/interactive-elements.html#attr-details-name) names a
  group in which opening one member closes the others; the value must not be empty. The standard calls
  such a set an exclusive accordion and gives one as an example, asks authors to weigh whether it
  frustrates people who want to read several answers at once, and asks that the group sit together in
  one container, with any heading that introduces it at the container's start.
- Two authoring rules: a document must not contain more than one member of a group with `open`, and
  must not nest a member inside another member of the same group. A group is every `details` in the same
  tree with an equal, non-empty `name`, so it spans the whole page rather than one component.
- Enforcement. Adding `open` to a member removes it from the open sibling. Inserting a member, or
  changing its `name`, while another member is open removes `open` from the inserted or renamed element.
  A note says these steps also run for the parser, so with two `open` members in the markup the first
  in tree order stays open and the later one closes. Observed in Chromium 153.
- `toggle`: every change of `open` queues a `ToggleEvent` with `oldState` and `newState` on the DOM
  manipulation task source, coalesced when `open` flips again before the task runs. An item rendered
  open fires one after load; the member closed at parse fired a coalesced event whose states were both
  closed (observed).
- Whether the open state survives: it lives only in the attribute. Persisted user state on history
  traversal is implementation-defined, and the standard's examples name form control values and scroll
  positions (https://html.spec.whatwg.org/multipage/browsing-the-web.html#restore-persisted-user-state),
  so a reload or a later visit renders the server's `open` again. The same holds for build B.
- `summary`: phrasing content, optionally intermixed with heading content; its activation behaviour
  toggles the parent's `open` when it is the parent's first `summary`; it is on the suggested list of
  sequentially focusable elements (https://html.spec.whatwg.org/multipage/interaction.html#the-tabindex-attribute).
  The standard names no keys: user agents should let people trigger activation behaviour from the
  keyboard, and that default action fires `click` (https://html.spec.whatwg.org/multipage/interaction.html#activation).
  In Chromium 153, Enter and Space on a focused summary both toggled it (observed); Firefox and Safari
  were not checked.
- Rendering (https://html.spec.whatwg.org/multipage/rendering.html#the-details-and-summary-elements):
  `summary` is `display: list-item` with a disclosure marker; the slot holding the rest of the content is
  `display: block; content-visibility: hidden` while closed, and the standard warns that this changes what
  layout APIs report. BCD's `html.elements.summary.display_list_item` is Chrome 89 and Firefox 49 but not
  Safari, which is why `Schedule` also hides `::-webkit-details-marker`. A `display: flex` summary had no
  list marker node in Chromium's accessibility tree (observed).
- Skipped contents must not be reachable by find in page or tab order, nor be focusable
  (https://drafts.csswg.org/css-contain-2/#content-visibility), so a link in a closed answer is out of
  the Tab sequence; find in page is the one exception the HTML Standard carves out.
- Find in page (https://html.spec.whatwg.org/multipage/interaction.html#interaction-with-details-and-hidden=until-found):
  the contents of closed `details` are searched without changing `open`; choosing a match runs the
  ancestor revealing algorithm, which sets `open` (so the group closes the open sibling) and, for
  `hidden="until-found"`, fires `beforematch` and removes `hidden`. Fragment navigation runs the same
  algorithm (https://html.spec.whatwg.org/multipage/browsing-the-web.html#scroll-to-the-fragment-identifier).
  Observed: a hash naming an element inside a closed named `details` opened it and closed the open one;
  a hash naming the `summary` itself opened nothing, since the summary is not in the content slot. The
  standard also warns that `toggle` events from find in page can leak what a person types.
- Styling hooks: `::details-content` (Chrome 131, Firefox 143, Safari 18.4) addresses the content slot;
  animating it to `height: auto` needs `interpolate-size`, which is Chrome 129 only (BCD).

## C. Support for `name`, and what an older browser does

BCD `html/elements/details.json` (last changed 7 May 2026), `html/global_attributes`, `api/Element.json`:

| Feature | Chrome | Edge | Firefox | Safari | Safari iOS |
| --- | --- | --- | --- | --- | --- |
| `details` `name` | 120 (5 Dec 2023) | 120 (7 Dec 2023) | 130 (3 Sep 2024) | 17.2 (11 Dec 2023) | 17.2 |
| opens on find in page | 97 (4 Jan 2022) | 97 | 148 (24 Feb 2026); 139 to 147 partial | 26.2 partial (12 Dec 2025) | 26.2 partial |
| `hidden="until-found"` | 102 | 102 | 148; 139 to 147 partial | 26.2 partial | 26.2 partial |
| `beforematch` event | 102 | 102 | 139 | 26.2 | 26.2 |

Partial means the browser does not scroll to the match (Firefox bug 2006040, WebKit bug 304174). Edge
and Safari iOS are BCD mirrors. `api.HTMLDetailsElement.name` matches the first row; `toggle` on
`details` is Chrome 36, Firefox 49, Safari 10.1; `Element.checkVisibility()` is Chrome 105, Firefox 106,
Safari 17.4.

- An older browser has none of the group steps, so `name` does nothing and each `details` opens and
  closes on its own: the accordion degrades to multi open and keeps its keyboard, its state exposure and
  its behaviour without JavaScript (an inference from the standard, where the group steps are all that
  `name` adds). A browser without the find in page behaviour does not search closed answers (inference
  from the older rendering, where closed content was not rendered).
- A fallback script (a `toggle` listener closing siblings when `HTMLDetailsElement.prototype` lacks
  `name`) would be a few lines, but it would bring ADR 0018's script, `data-ready` and a CSP hash for
  browsers released before September 2024. It is not worth it for five questions.

## D. The APG accordion pattern, ARIA in HTML and HTML-AAM

- Pattern (https://www.w3.org/WAI/ARIA/apg/patterns/accordion/, source
  `content/patterns/accordion/accordion-pattern.html`): each header's title sits in a `button` wrapped
  in a `heading` whose level suits the page, a native heading allowed, with the button its only content;
  `aria-expanded` on the button; `aria-controls` pointing at the panel; `aria-disabled="true"` only when
  an open panel cannot be collapsed; optionally `region` with `aria-labelledby` on each panel, avoided
  where more than about six panels can be open at once and most useful when panels hold headings.
- Keyboard: Enter or Space expands a collapsed panel (collapsing another where only one may be open) or
  collapses an open one; Tab and Shift+Tab move through every focusable element. Pull request 3434,
  merged 29 April 2026, removed the optional Down Arrow, Up Arrow, Home and End, resolving issue 3406,
  where arrow keys on headers kept a keyboard user from scrolling the panel just opened. Neither build
  should add arrow keys.
- Example (https://www.w3.org/WAI/ARIA/apg/patterns/accordion/examples/accordion/, markup changed 20
  January 2026, script 7 December 2022): `h3 > button[aria-expanded][aria-controls][id]` followed by
  `div[role=region][aria-labelledby]`, `hidden` while closed; a click listener flips `aria-expanded` and
  `hidden`; several panels can be open; level 3 because the example sits under an `h2`.
- APG's own FAQ is a disclosure example, not an accordion
  (https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-faq/): a list whose items
  hold a `button` with `aria-expanded` and `aria-controls` and the answer after it, no headings, answers
  opened independently.
- No APG pattern page mentions `details` or `summary`; a code search of `w3c/aria-practices` finds
  `details` only in the site's own usage warning templates. The first-party discussion is issue 3391
  (open), taken up by the APG task force on 1 April 2026. Matt King (`mcking65`) answered that
  `details` and `summary` can build an accordion, that single expansion is optional in the pattern and
  that `name` is an effective way to get it, and that the missing piece is the heading semantic, which
  by his account Chrome drops even when a heading element sits inside the summary. He then noted that
  the WAI resources page does expose headings for its summaries in Chrome, and on 16 April 2026 Daniel
  Montalvo (`daniel-montalvo`) attributed that to the page's `display: block` summaries instead of the
  default `list-item`. These are observations in a thread, not guidance.
- WHATWG issue 8864 (open since 7 February 2023) asks for headings inside `summary` to be allowed and
  exposed; `zcorpan` replied that `summary` is exposed as a button, which carries plain text only, and
  `scottaohara` that such headings are conforming but not consistently exposed.
- ARIA in HTML (https://www.w3.org/TR/html-aria/): `details` is `role=group`; `summary` has no
  corresponding role, with a note that its exposed role varies by user agent and assistive technology;
  a summary for its `details` takes no `role` and only global `aria-*`, `aria-disabled` and
  `aria-haspopup`. So no `aria-expanded` and no `role="heading"` on the summary; the browser supplies
  the state.
- HTML-AAM (https://w3c.github.io/html-aam/#el-summary): `summary` maps to MSAA
  `ROLE_SYSTEM_PUSHBUTTON` with expanded or collapsed states, UIA `Button` with `ExpandCollapse`, ATK
  `ROLE_TOGGLE_BUTTON` and AX `AXDisclosureTriangle`, named from its subtree; nothing about headings
  inside. WAI-ARIA marks `button` as having presentational children, which user agents should not expose
  (https://www.w3.org/TR/wai-aria-1.2/#button). If a platform layer treats the summary as a button in that
  sense, a heading inside is flattened; HTML-AAM does not say it does (my reading).
- Observed in Chromium 153's own accessibility tree (CDP `Accessibility.getFullAXTree`): the summary of
  a named `details` is `DisclosureTriangleGrouped` and of an unnamed one `DisclosureTriangle`, both
  focusable with `expanded`; an `h3` inside a summary stayed a level 3 `heading` node under it with
  `display` at `list-item`, `flex` and `block` alike, so the April observation may predate a Chromium
  change or concern the platform layer. The APG markup gave `heading` level 3 containing `button` with
  `expanded`. How NVDA, JAWS and VoiceOver announce and navigate a heading inside a summary is
  unverified: no first-party source beyond the two threads above was found, and the secondary write-ups
  that turned up report different behaviour by screen reader and were not checked.

## E. WCAG 2.2 criteria

https://www.w3.org/TR/WCAG22/ and the Understanding pages under https://www.w3.org/WAI/WCAG22/Understanding/:

- 2.5.8 Target Size (Minimum), AA (`target-size-minimum.html`): 24 by 24 CSS pixels, or the spacing
  exception. The repo's 44px is stricter. With the port's padding and fallback fonts a closed row
  measured 70px for the control (71px with its hairline) at 1440 and 375, and 89px for the longest
  prototype question, which wraps at 375 (observed). The whole row is the target in either build.
- 2.1.1 Keyboard, A (`keyboard.html`): the native `summary` and the native `button` both activate from
  the keyboard with no key handling in script.
- 4.1.2 Name, Role, Value, A (`name-role-value.html`): the Understanding page counts whether an
  accordion is expanded or collapsed as a state, and the criterion's note says standard HTML controls
  meet it when used according to specification. `details` gets there through the HTML-AAM mapping;
  build B through `aria-expanded`.
- 1.3.1 Info and Relationships, A (`info-and-relationships.html`): structure conveyed by presentation,
  headings in a larger bold font being the page's first example, must be programmatically determinable.
  The section `h2` is a real heading in both builds. Whether 18px semibold questions below it count as
  headings in that sense is a judgement; the prototype marks them as buttons, APG's FAQ as list items.
- 2.4.3 Focus Order, A (`focus-order.html`): each answer follows its question in the DOM and nothing
  moves focus, so the order holds in both builds.
- 2.4.7 Focus Visible, AA (`focus-visible.html`): the base outline applies to `summary` and `button`
  alike; `--indigo-700` on paper is 12.61:1, above the 3:1 of 1.4.11 that the page refers to.
- In the repo's axe tags, `summary-name` and `button-name` (`wcag2a`) run; `target-size` (`wcag22aa`
  only) does not; `heading-order` is best practice and runs only in its own test.

## F. Playwright and axe

- Visible. Playwright documents visible as a non-empty box without `visibility: hidden`
  (https://playwright.dev/docs/actionability#visible). Its 1.63 injected script also calls
  `checkVisibility()` outside WebKit, and in WebKit treats anything inside a closed `details` other than
  the summary as hidden (`lib/coreBundle.js`, `computeElementStyleVisibilityVisible`); `checkVisibility()`
  returns false under a `content-visibility: hidden` ancestor
  (https://drafts.csswg.org/cssom-view-1/#dom-element-checkvisibility). Observed: a link in a closed
  answer was not visible and its `checkVisibility()` false, yet `getBoundingClientRect()` reported 24.9 by
  18. So `toBeVisible()` and `toBeHidden()` on an answer work; a bounding box check does not.
- Roles. The 1.63 implicit role map gives `DETAILS` the role `group` and has no `SUMMARY` entry.
  Observed: `getByRole('button', { name: 'Three' })` matched no summary, and `getByRole('group', {
  expanded: true })` threw, because `expanded` is accepted only on button, link, tab and similar roles.
  Locate questions with `page.locator('summary', { hasText })`, or with `getByRole('heading', { level: 3,
  name })` if a question is an `h3`: a click on the heading opens the summary, since DOM dispatch hands
  activation to the nearest ancestor that has activation behaviour (https://dom.spec.whatwg.org/#concept-event-dispatch).
- State. `expect(details).toHaveAttribute('open')` and `.not.toHaveAttribute('open')` assert presence
  (the one argument form, since 1.39,
  https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-attribute-2);
  `toHaveJSProperty('open', true)` is what `odunde.spec.ts` uses today.
- Input. Observed: `locator.click()` on a summary opened it and closed the open sibling;
  `locator.press('Enter')` and `locator.press('Space')` toggled it; a hash naming an element inside an
  answer opened that answer, so `page.goto` with a fragment can test deep links.
- Build B: `getByRole('button', { name, expanded: true })`, `toHaveAttribute('aria-expanded', 'true')`
  and `toBeHidden()` on the panel. One trap: the UA stylesheet renders `hidden="until-found"` as
  `content-visibility: hidden` rather than `display: none`
  (https://html.spec.whatwg.org/multipage/rendering.html#hiddenCSS), so the panel's own padding still
  paints; with the port's `.oy-faq-a` padding each closed row grew by a 22px strip (93px against 71px,
  observed). Plain `hidden` leaves no strip but hides the answer from find in page.
- axe-core 4.13.0 (`doc/rule-descriptions.md` at v4.13.0): `summary-name` (serious; `wcag2a`, `wcag412`)
  asks the first `summary` of a `details` for visible text, `aria-label`, `aria-labelledby` or a `title`
  (`lib/rules/summary-name.json`, `lib/rules/summary-interactive-matches.js`); axe allows no `role` on
  that summary (`lib/standards/html-elms.js`); `nested-interactive` (`wcag2a`) would flag a link or
  button inside a summary; `heading-order` (best practice) counts `h1` to `h6` and `[role=heading]`;
  `target-size` is tagged `wcag22aa` only. Observed on the probe page: `summary-name`, `heading-order`,
  `nested-interactive`, `aria-allowed-attr`, `empty-heading`, `landmark-unique`, `region` and
  `button-name` found no violation for an `h2` followed by `h3`s inside summaries, or for the APG markup.

## G. Storybook play functions

- The canvas writes the story's HTML with `innerHTML`, re-inserts scripts and then runs `play`
  (`docs/research/phase-3-storybook-play-functions.md`). A native accordion has no script, so there is no
  `data-ready` to wait for, and insertion enforces the group as it does for the parser, so exclusivity
  works in the canvas. The autodocs page set in `packages/ui/.storybook/preview.ts` (line 18) can render
  several stories in one document (phase 5 note), which puts them in one tree: with a shared `name`, one
  story's open item would close another's. Each instance needs its own `name`.
- `userEvent` in `storybook` 10.6.0 (`dist/test/index.js`): `tab()` can reach a summary (its focusable
  selector includes `details > summary`, lines 14097 to 14107). `click()` dispatches a `click`, and a
  `MouseEvent` of type `click` runs activation behaviour whether or not it is trusted (DOM dispatch), so
  a click opens a summary (observed with a synthetic `PointerEvent`). `keyboard('{Enter}')` clicks only
  a `button`, some `input` types or `a[href]` (lines 14828 to 14852), and Space only a button or a
  clickable input (lines 14864 to 14873). Untrusted keyboard events carry no default action; click is
  the only exception (https://w3c.github.io/uievents/dom-architecture.html, `dom-architecture.bs` lines
  166 to 171). Observed: synthetic Enter and Space on a focused summary left it closed. A play function
  can therefore prove opening by click, exclusivity, `multi`, `defaultOpen` and the Tab stop, but not
  Enter or Space on a native summary; Playwright proves those with real key input.
- user-event's Tab treats an element as visible unless it or an ancestor has `display: none` or
  `visibility: hidden` (`isVisible`, line 14612; the bundle never mentions `content-visibility`), so in
  the canvas it may pick a link inside a closed answer that the browser would not focus. Keep such links
  out of Tab assertions, or open the answer first.
- Queries. Testing Library's `getByRole` takes implicit roles from aria-query's element map
  (`dist/preview/runtime.js`, `queryAllByRole` from line 26278 and `getImplicitAriaRoles2`), which maps
  nothing to `summary`, so `getByRole('button')` misses questions; `getByRole('group')` finds each
  `details`, and `getByRole('heading', { level: 3 })` a question that is an `h3`. Its inaccessibility
  test looks only at `hidden`, `aria-hidden`, `display: none` and `visibility: hidden` (lines 25647 to
  25664), so `getByRole` still finds content inside a closed answer, while jest-dom's `toBeVisible()`
  treats the contents of a closed `details` as not visible (`dist/test/index.js` lines 11385 to 11388).
- Build B: play waits for `data-ready`; `userEvent.keyboard('{Enter}')` on the question button
  dispatches `click` and the element's handler toggles, which proves the handler rather than the
  browser's key mapping.
- Chromatic snapshots after play, so open states can be baselines in both builds; natively through the
  `defaultOpen` arg or a click.

## H. The two builds compared

(A) native `details name` with the question in `summary`, no script. (B) APG `h3 > button` with an
inline custom element (ADR 0018) toggling `hidden`.

| Concern | A: native `details name` | B: APG button in a heading |
| --- | --- | --- |
| Without JavaScript | Opens and closes; exclusive where `name` is supported; `defaultOpen` is server-rendered `open` | Every answer must be server-rendered open, since a `hidden` panel is unreachable without script; the upgrade then collapses them, a layout shift if it lands after a paint |
| Single open | `name`: Chrome 120, Firefox 130, Safari 17.2; older browsers multi open | The script, wherever it runs |
| Heading order | Passes with plain questions (the `h2`, then the next section's `h2`) or an `h3` in each summary (axe passes); a heading inside a summary is unverified in screen readers | `h3 > button` under the `h2` passes and is the pattern's documented structure |
| Find in page, deep links | Native: closed answers are searched and opened, the sibling closes; fragment links open answers | `hidden` is not searchable; `hidden="until-found"` needs a `beforematch` handler to set `aria-expanded` and close siblings (observed: without one `aria-expanded` stayed false) and the padding moved off the panel |
| Reduced motion | Nothing animates; a future height animation needs `::details-content`, Chrome-only `interpolate-size` and a `no-preference` guard | Nothing animates; animating out of `hidden` needs `@starting-style` and the same guard |
| Focus visibility | Base outline on `summary` | Base outline on `button` |
| 44px closed rows | The summary is the row (70px observed); add `summary` to the sweep's selector | The button is the row; the sweep already selects it |
| Storybook play | No readiness wait; click, exclusivity, `multi`, `defaultOpen`, Tab stop; not Enter or Space | Waits for `data-ready`; click and user-event's Enter and Space |
| Playwright | `locator('summary', { hasText })`, `toHaveAttribute('open')`, real Enter and Space, fragment test; the no-JS run expects the same | `getByRole('button', { expanded })`, `toHaveAttribute('aria-expanded')`; the no-JS run expects every answer open |
| Unanswered question | The question in `summary`, the Pending chip in `.oy-faq-a` | The same chip inside the panel |
| Cost | Markup and CSS; no CSP hash, no router wiring; a `name` per instance | An inline script (an estimated 40 lines with the `beforematch` handler), a Phase 9 CSP hash (ADR 0018), per-instance ids for `aria-controls` and `aria-labelledby` |

## Recommendation

Build A: native `details` grouped by `name`, questions as plain text in `summary`, no script. It meets
every requirement with markup: single open by default, `multi` by dropping `name`, `defaultOpen` as
`open` on the first item, 44px rows, a keyboard path, state exposure, find in page, and the same
behaviour with or without JavaScript. It follows the repo's own `Schedule` precedent and stays outside
ADR 0018 because nothing needs to run. Neither candidate for a small inline custom element justifies
one: single open in browsers older than Chrome 120, Firefox 130 and Safari 17.2 degrades to multi open,
a variant the canvas already accepts, and no script makes a heading inside a summary more reliably
exposed. Plain questions keep heading order correct under the `h2`, match the prototype and APG's own
FAQ example, and leave an answer's `h3` style at a sensible level. Choose B only if the owner makes
every question reachable as a heading in every screen reader a requirement.

Markup skeleton (`packages/ui/src/content/Accordion/Accordion.astro`; props `items`, `multi`,
`defaultOpen`, `id` for the group name, and `pending` and `answerPending` defaulting to the registry
wordings, as `Schedule` takes `pending`):

```astro
{
  rows.length === 0 ? (
    <Pending variant="line" what={pending} />
  ) : (
    <div class="oy-faq">
      {rows.map((item, i) => (
        <details class="oy-faq-item" name={multi ? undefined : `${id}-questions`}
          open={defaultOpen && i === 0}>
          <summary class="oy-faq-q">
            <span class="oy-faq-text">{item.question}</span>
            <span class="oy-faq-mark" aria-hidden="true"></span>
          </summary>
          <div class="oy-faq-a">
            {hasBlocks(item.answer) ? <Prose value={item.answer} /> : <Pending what={answerPending} />}
          </div>
        </details>
      ))}
    </div>
  )
}
```

- `name` comes from the `id` prop, never from question text, which carries stega in Presentation
  (`handoff-phase-5.md`). No `role`, `aria-expanded` or `aria-controls` on `summary` (section D).
- CSS over the port, tokens only: `list-style: none` and a hidden `::-webkit-details-marker` on the
  summary, as `Schedule` does; the mark's two bars drawn in `::before` and `::after` with borders in
  `currentColor`, because forced colours give a border a visible system colour but force a background to
  the colour opposite the text, so a bar painted as a background would vanish
  (https://drafts.csswg.org/css-color-adjust-1/#forced-colors-properties); the vertical bar hidden
  under `details[open] > .oy-faq-q`; the hover colour transition kept (0.2s is inside the 0.15 to 0.22s
  convention); no open or close animation, so nothing needs a reduced motion rule; the answer at 17px.
- Pending: no questions renders the registry's line; an unanswered question stays in the list and opens
  onto `Pending: an answer`, including when `defaultOpen` opens it.
- Vitest (markup only): one `details` per item; the same instance-scoped `name` on each, none with
  `multi`; `open` on the first item only with `defaultOpen`; the chip for an empty answer and `Prose` for
  a filled one; the Pending line for no items; neither "+" nor "−" in the output.
- Stories: `Default`, `DefaultOpen`, `Multi`, `PendingAnswers`, `Empty`; play without a readiness wait:
  a click opens question 2, a click on question 3 closes 2 (`toHaveAttribute('open')` and its negation),
  `Multi` keeps both open, Tab reaches the first summary.
- Playwright on `/programs/yoruba-lessons`, both projects, skipped when no question renders: the `faq`
  option `closed` opens nothing and `open` opens the first; click, Enter and Space toggle with
  exclusivity; a closed answer is hidden; the same without JavaScript. Add the route to the
  `heading-order` test and the sweep, and `summary` to the sweep's selector.

## Open questions

1. Headings: plain question text (recommended), or an `h3` inside each summary once NVDA with Chrome,
   JAWS and VoiceOver on macOS and iOS have been checked. If `h3`, its size (the prototype's 18px against
   the H3 range of 20 to 24px) and an answer's own `h3` style both need a decision. If headings must hold
   in every screen reader, build B.
2. `faqItem.answer` is full `blockContent`, so an answer may hold a heading or a pull quote. Keep it, or
   give answers a narrower block type.
3. The 1.5% press settle is written for buttons (`AGENTS.md` line 61); on a full-width row it narrows
   the row by about 13px at 900px wide. Apply it, or leave rows with the colour change only.
4. `defaultOpen` with `multi`: the first item only, as the layout option has it, or a list of items.
5. Stable ids on answers (from each item's `_key`) would let a link open one answer through fragment
   navigation. Nothing asks for it yet.
6. An ADR recording the native build, the plain questions and the degradation to multi open, as the
   Phase 6 prompt asks for decisions that land.
