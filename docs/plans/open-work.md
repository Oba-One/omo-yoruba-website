# Open work

The one list of what is still open on omoyorubasocal.org: decisions for the owner, content the organization owes,
the Studio's simplification, engineering and polish. Consolidated on 13 September 2026 after Phase 8, from the
wayfinder tickets (`T12` means `docs/tickets/wayfinder/issues/12-*.md`), the phase handoffs (`HP3` means
`docs/plans/handoff-phase-3.md`), the pull requests' review leftovers and the Pending registry. The four-week plan
that works through it is `docs/plans/four-week-plan.md`.

**How to use it.** Change a row's status as work moves: open, doing, done, or dropped (with a word why). When a
ticket holds the detail, the row links it and stays one line. New work goes into the section it belongs to.

**Priority.**
- **Now:** before the organization's meeting, planned for the week of 12 October 2026.
- **Launch:** before the site is announced on its own domain.
- **Later:** after launch.

## 1. Decisions for the owner

| # | Decision | Default today | Why it matters | Priority | Source | Status |
| --- | --- | --- | --- | --- | --- | --- |
| D1 | Check the gallery and merge pull request 9 | Built as the PR describes | The gallery exists only on its branch | Now | T43 | done: merged 13 Sep at the owner's request; the Studio and preview checks move into E2 and week 1 |
| D2 | The public host until the domain works, and fixing `omoyorubasocal.org` | `omo-yoruba-khaki.vercel.app` stands in | Sets the webhook, the Studio's CORS, the preview host, email sending and canonical links | Now | the 13 September hosting session (H7); runbook "Deploy" | open |
| D3 | Which dataset holds the real content, and make `production` private | Site and Studio read `development`; `production` is empty with a public ACL | Decide before members type facts; a public dataset would expose enquiries | Now | the 13 September hosting session (H7) | open |
| D4 | Roles for organization members on the Sanity plan | Only the owner is a member; settings and the Inbox are hidden by structure only | Needed before inviting anyone to the Studio | Now | T22 | open |
| D5 | Consent for identifiable faces, children included, in every album and on the pages | Unconfirmed; the site is public | The gallery can stay `state: soon` until it is settled | Now | T09, T44 | open |
| D6 | The Studio's simplification: which changes in section 3 to make | As built | Members manage the content after the meeting | Now | section 3 | open |
| D7 | The favicon | None; best practices sits at 0.93 on every route | Shows in every tab and bookmark | Now | T32 | open |
| D8 | Confirm two lines of copy: the Give Dialog's text while Zeffy is not set up, and the "too many messages" refusal | As written | Every Donate click shows the first until T03 | Launch | HP3 | open |
| D9 | Gala tables: an enquiry or a purchase | An enquiry, invoiced by hand | The tables block and its copy | Launch | T04 | open |
| D10 | Gala awards | Hidden by default; `development` stores shown | The honorees block | Launch | T06 | open |
| D11 | Type sizes on phones: photo hero 34 or 44px, hero 38 or 44, H2 30 or 32 | The prototypes' sizes | AGENTS.md says 44 and 32; the tokens follow the prototypes | Launch | T30 | open |
| D12 | The volunteer chip's green outside Collective content | Green, as four prototypes draw it | AGENTS.md keeps green inside the Collective | Launch | T41, ADR 0036 | open |
| D13 | CSP: enforce as a header with hashes (keeps the cross-fade) or Astro's meta CSP (drops it) | Report-only | Phase 9 security; best practices 100 | Launch | T13, ADR 0011 | open |
| D14 | Lighthouse on previews: the bypass secret, and whether the checks are required | The workflow skips | Budgets checked on every pull request | Launch | T28 | open |
| D15 | Preview host for drafts (a second hostname) | None; the public host shows the cached page in Presentation | Editors see drafts before they publish | Launch | T29 | open |
| D16 | Finish setup: deploy the Sanity Functions with Resend, PostHog, the Chromatic token | Partly done; functions likely not deployed | Enquiry emails within a minute; visual baselines | Launch (Now if the organization tests forms) | T17 | open |
| D17 | What the sitemap lists, what each page shares (images), and a photo address's canonical link | Nothing built | Search and link previews | Launch | ADR 0037, Phase 9 prompt | open |
| D18 | The old site's URLs to redirect | None supplied; the old domain is out of reach | Links from the old site keep working | Launch | T10 | open |
| D19 | The photo carousel's remaining answers (dots as tabs, drawn chevrons, the count's case, eight photographs) | The rules' answers | Styling only | Later | T37, ADR 0027 | open |
| D20 | Storybook hosting | A separate Vercel project | A shareable component library | Later | T11 | open |
| D21 | Our Story's timeline shown by default | Hidden until its entries are confirmed | The timeline block | Later | T07 | open |
| D22 | News: a feed or a single kept list | Not built | Page 17 | Later | T08 | open |
| D23 | Accept the em dash lint exemption for `docs/design/` | Exempt | Tooling only | Later | T18 | open |
| D24 | A second Donate door for organizations beside "Partner or sponsor" | One door | Larger gifts | Later | T42, ADR 0034 | open |

## 2. Content the organization owes

Every empty fact shows a Pending chip on the site and a row in the Studio's Pending view. The launch gate
(QUALITY section 6) is every chip filled or accepted as visible. The owed-facts tickets hold the full lists.

| # | Page | What is owed | Priority | Source | Status |
| --- | --- | --- | --- | --- | --- |
| C1 | Everywhere | The EIN, the mailing address and the phone; the general inbox; each role's contact (membership, volunteers, partnerships, vendors, performers, tables, teacher, general) with an email and a response line; the Zeffy link; social links | Now | T02, T03 | open |
| C2 | Homepage | Put the recap post's title back to "Odunde 2026: the recap"; three named voices; a Collective photograph; the news posts' bodies; confirm the posts' dates | Now | T27, T31, `pending.ts` | open |
| C3 | Gallery | The consent and removal policy in your words; consent per album; confirm the three photographers' credits; the summer camp's year; captions; the header line | Now | T44, T09 | open |
| C4 | Odunde | The 2027 edition (date, hours, cost, venue line, schedule, vendor fees and dates, permit note); the two unnamed zones and each zone's line; plan-your-visit facts; 2026 attendance; partners; "What Odunde is"; confirm six captions' marks | Launch | T38, T05 | open |
| C5 | Gala | The 2026 edition: date, doors, venue, dress, running order, ticket tiers with prices and what each includes, the Eventbrite link, sponsor levels, honorees | Launch | T38, T03, T06 | open |
| C6 | Programs | Cadence and ages on each card; Kids & STEM ages and what the STEM Hub builds; everything about Cultural Exchange with two photographs; when each program runs | Launch | T40 | open |
| C7 | Lessons | The teacher's name, bio, portrait with consent and email; ages; what you learn, the levels, the steps, five FAQ answers; confirm "Video call" and "settled after the first lesson" | Launch | T40 | open |
| C8 | Collective | Why culture and sustainability belong together; one voice; Solar Hub and Green Goods facts and photographs; dated events | Launch | T40, T31 | open |
| C9 | Get Involved | Bullets for the member, volunteer and vendor doors; the vendor door's blurb; a volunteer photograph; the general contact's name and response line | Launch | T42 | open |
| C10 | Impact | A source for each headline figure; How we work; four outcomes; 2026 attendance and vendors hosted; the 2027 cost; three voices; the Form 990, annual report and audit; partners and funders; confirm the captions | Launch | T42 | open |
| C11 | Our Story | The 1997 story, the founders, the first year, the earliest photograph; timeline entries; the board, staff and volunteers | Launch | T42, T07 | open |
| C12 | Donate | How the Zeffy form handles fees, receipts and monthly giving; confirm the give-now blurb and the larger-scale intro; giving levels with what each pays for; other ways to give; the tax line | Launch | T42, T03 | open |
| C13 | News | Waits for the cadence decision | Later | T08 | open |

## 3. The Studio, simplified for members

From the Studio review of 13 September 2026, which read the structure, the schema and the dataset as an
organization member would meet them. Today a member sees 36 document types, 44 layout options and a Pending view of
135 rows, where 66 open an empty list and 11 are settings rows an editor cannot publish. Facts often live somewhere
other than the page that shows them, some inputs change nothing, and the sidebar follows the code rather than the
site. The four-week plan works through these (weeks 1 and 2). Quick wins need no decision; the rest need D6.

**Quick wins** (no owner decision; nothing stored changes)

| # | Change | What a member gains | Size | Status |
| --- | --- | --- | --- | --- |
| S1 | The edition form: the summary moves into the Edition tab (today it shows only under All fields); a kind's form hides what that kind's page never reads; a starting template per kind | Finds the summary the homepage band shows; a Collective event takes about six inputs | S | open |
| S2 | Hide inputs that change nothing: the event hero image, the slim pages' header photo, the sharing image (until Phase 9 uses it), photo credits outside albums, five unread `order` fields, the News page, `keepsOwnList`, `proceedsReturn`, the Gala's extra glance facts | No work without a visible result | S | open |
| S3 | Labels in the site's words: titles on every option value, US dates, descriptions written for members (no ADR or ticket numbers), one name for the headline figure (it has four), a pointer on each event page to where its edition's facts live | Reads the Studio without the codebase | S to M | open |
| S4 | Administrator-only: the Vision tool, the News page, and the settings rows in Pending | Sees only what they can act on | S | open |
| S5 | An honoree must name its edition; tier, level and honoree previews show the edition | No silent no-shows | S | open |
| S6 | Correct the recipes that drifted: `oy-release` asks for fields that do not exist; the album recipe now links both ends (done 13 Sep) | The editor guide starts from true recipes | S | doing |

**Medium** (each needs the owner's yes)

| # | Change | What a member gains | What changes in code | Size | Status |
| --- | --- | --- | --- | --- | --- |
| S7 | Regroup the sidebar as the site: To do, News posts, Events (Odunde, the Gala with its tiers, levels and honorees, Collective events), Photos, People, Pages with the lists only they show, Used on several pages; settings, the Inbox and design options for administrators | Things are where the site shows them | The structure only, with a structure test | M | open |
| S8 | A To do view: Pending grouped by page, with counts, only what is owed | A short, true to-do list | A counting pane; the registry and the site's chips unchanged | M | open |
| S9 | One link between an album and its edition: keep the album's, retire the edition's | Links photographs once; an album reaches its event page's past years | Three queries, three registry rows, a migration, TypeGen, tests | M | open |
| S10 | Design-only layout options for administrators (patterns, motion, treatments) | About 21 choices instead of 44 | A design flag per option and a role check | S to M | open |
| S11 | One control per decision: take-part order (the rows' order or the `takepart` option), the homepage's lead event (the reference or the season), the hero's gold button (its action or the highlight) | One place for each choice | Options, two components, a seed revision, tests | M | open |
| S12 | Scopes that show nothing (the Odunde sponsor scope, partner scopes beyond Odunde): remove them or show them | Every option has an effect | Option lists, or queries and components | S to M | open |
| S13 | The teacher from one source, the person in the teacher group | The teacher is added once | The Lessons query, a registry row, the seed | M | open |

**Larger** (each needs the owner's yes; the cheapest time is now, while the dataset holds almost none of these)

| # | Change | What a member gains | What changes in code | Size | Status |
| --- | --- | --- | --- | --- | --- |
| S14 | Outcomes, timeline entries, giving levels and initiatives become lists on the one page that shows each | Adds them where they show, in order; four types leave the sidebar | Four types become objects; queries, registry and presence rows, routes, Presentation, cache tags, seed, TypeGen, tests | L | open |
| S15 | Split site settings: the organization's public facts members may change (address, phone, general inbox, social links, footer copy) apart from configuration (routing contacts, Zeffy, analytics, theme) | Clears the to-do rows they are shown | A new singleton; nine reads and the email function; registry; routes; a migration; tests | L | open |

**Questions the owner answers first** (week 1): the Sanity plan and whether members may change the public
organization facts (T22); whether design options are for members at all (ADR 0006); which album link stays; whether
unread fields are deleted or kept hidden for planned use; whether news posts get their own page soon (T08);
whether a Collective event may drop the required year, and whether the "Other" kind stays; which control wins for
take-part order, the lead event and the gold button; whether members stage editions in Content Releases.

## 4. Engineering and polish

| # | Work | Needs first | Priority | Source | Status |
| --- | --- | --- | --- | --- | --- |
| E1 | Create the publish webhook on the chosen host, so an edit shows within a minute instead of up to a day | D2 | Now | T25 | open |
| E2 | Run the deep review of design alignment and code quality | D1 | Now | `docs/plans/prompt-deep-review.md` | open |
| E3 | The favicon files | D7 | Now | T32 | open |
| E4 | A 404 page in the site chrome | none | Now | ROUTES section 1, Phase 9 | open |
| E5 | The performer form's blurb says "Five questions" and asks six | none | Now | `enquiry-kinds.ts` | open |
| E6 | Remove `PUBLIC_ZEFFY_EMBED_URL` from the env schema, the runbook and the wizard (the Zeffy link lives in site settings) | none | Now | HP3, runbook | open |
| E7 | Correct AGENTS.md where the build differs: the menu overlay starts under 880px, the hero sizes follow the tokens (after D11) | D11 for the sizes | Now | inventory | open |
| E8 | The editor guide `docs/content-ops.md`, written for members after the simplification | D6 | Now | Phase 10 | open |
| E9 | Enforce the CSP with hashes, proven in Playwright; security headers | D13 | Launch | Phase 9 | open |
| E10 | Sitemap, robots, canonical links and share images | D17 | Launch | Phase 9 | open |
| E11 | Redirects in `astro.config.ts` from `docs/redirects.md` | D18 | Launch | Phase 9 | open |
| E12 | Mobile LCP on `/` and both gallery routes; the event pages' font-swap shift | none | Launch | T35 | open |
| E13 | The analytics bundle: keep `posthog-js` (89 KB), use the lite build or the snippet | none | Launch | T15 answer | open |
| E14 | Lighthouse on every route at both presets; commit the local serve script | D14 for previews | Launch | Phase 9 | open |
| E15 | Playwright: a contrast helper, the 44px sweep and the gold rule on every route, "no dialog on load" everywhere | none | Launch | QUALITY section 2 | open |
| E16 | Accept Chromatic baselines at 375 and 1440 with the owner | D16 | Launch | QUALITY section 2 | open |
| E17 | Nightly `content-lint.yml` over the whole dataset | a read-token secret | Launch | QUALITY section 5 | open |
| E18 | Seed `production`, or move the content there, once D3 is decided | D3 | Launch | HP2 | open |
| E19 | Add real content through the Sanity MCP with the owner: a news post, an album, a person | E1, MCP sign-in | Launch | Phase 10 | open |
| E20 | Normalise Yoruba text to NFC on save | none | Later | HP1 | open |
| E21 | Storybook accessibility checks in CI (a new dependency) | owner's yes | Later | phase 1 ticket 05 | open |
| E22 | Review leftovers kept on purpose: the mosaic's spans, two caption rules, the Lightbox's closing flags, duplicated swipe code (PR 9); outcome kinds, program anchors, unused ContactBlock variants (HP7); `rowKinds` parsing GROQ, TypeGen unions on four queries (HP6) | none | Later | PR 9, HP6, HP7 | open |

## 5. Housekeeping

| # | Item | Status |
| --- | --- | --- |
| H1 | Close T26, T36, T39 and T41 (their pull requests merged); move their remaining calls into D11, D12, D10 and E1 first | open |
| H2 | Rewrite T12 (the org and team are named), T17 (only the remaining stages), T37 (answer 1 is settled), T03 (it names an env variable nothing reads), T07 (the timeline is hidden by default), T28 (ticket 33 is resolved) and T29 (ticket 26 has merged) | open |
| H3 | Refresh the wayfinder frontier's "Gates" column, which still points at finished phases | open |
| H4 | Fix the documents that contradict the build: the runbook's "datasets are private"; the wayfinder's "all nine forms send an email" (the newsletter only stores); ADR 0040 sending captions to T09 (T44 holds them); the voice skill's "Chinese New Year" against the seed's "Lunar New Year" | open |
| H5 | The owner runs `/mattpocock-skills:handoff` for `docs/plans/handoff-phase-8.md` | open |
| H6 | Delete the e2e proof enquiries left in `development` | open |
| H7 | Record the 13 September hosting facts in the runbook: `omo-yoruba-khaki.vercel.app` as the public host, the Sanity CORS entries, no webhook yet, `development` private and read by the site, `production` empty with a public ACL, the owner as the only member | open |
