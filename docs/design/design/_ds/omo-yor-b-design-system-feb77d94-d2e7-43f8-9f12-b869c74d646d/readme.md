# Omo Yorùbá Design System

Design system for **Omo Yorùbá of Southern California** (omoyorubaofsocal.org): a 501(c)(3) founded in 1997 that sustains Yoruba language, culture, and intergenerational community in Los Angeles. Signature events: the **Odun De Festival** at Leimert Park each June, and the **End-of-Year Gala** in November/December. Year-round programs: Yoruba Language School (Saturdays), Yoruba Cultural Collective (Solar Hub, Green Goods), Kids & STEM, Cultural Exchange.

This system powers the website revamp first (grant-reviewer credibility, easy joining, event funnels) and provides social-ready tokens for flyers and Instagram. The site's three jobs, in order: prove legitimacy and impact to grant reviewers in under two minutes, make joining obvious, run vendor/sponsor/ticket funnels for the two signature events.

**Sources** (in `uploads/`): `design.md` (operational spec, source of truth for tokens and copy), `Design-Foundations.md` (cultural rationale), `homepage-mockup.html` (exploratory feel, not binding). Where anything conflicts, design.md wins. No codebase, Figma, logo files, or photography were provided.

## Non-negotiables

1. The festival is written **"Odun De"** (two words) in all display text. Single-word "odunde" only in URLs and file names.
2. **Diacritics are identity.** Yoruba words always carry full tone marks and underdots: Ọjà Balógun, Àgbàlá Ọmọde, Ẹgbẹ́ Ìbílẹ̀, Ẹ káàbọ̀, Ẹ ṣé. Every type choice must render the test string cleanly at heading and body sizes: "Ẹ káàbọ̀ sí Ọjà Balógun, Àgbàlá Ọmọde àti Ẹgbẹ́ Ìbílẹ̀. Odún dé! Ẹ ṣeun."
3. **Pattern is texture, never costume.** Àdìrẹ dot fields, aṣọ òkè stripe rhythms, ayo dot-grids at low opacity. Never kente (not Yoruba), never Adinkra symbols (Akan), no safari or faux-carved clichés.
4. **The elder test:** readable by an elder on a phone in sunlight. WCAG AA contrast, 17px+ body, 44px touch targets.
5. **No em dashes in UI copy.** Use commas, periods, or colons.

## CONTENT FUNDAMENTALS

- **Voice:** warm, family-oriented, action-forward. Short sentences. Never corporate, never generic "African-inspired". Ethos line: "Many hands make the load light."
- **Bilingual micro-moments:** Yoruba leads, English supports, always translated. Kicker pattern "Ẹ káàbọ̀ • Welcome"; success state "Ẹ ṣé! ✓"; zone names stay in Yoruba with marks (Ọjà Balógun, Àgbàlá Ọmọde).
- **Casing:** sentence case for headings and buttons ("Enroll a learner", "Raise your hand", "Get the deck"). Kickers and path chips are the only uppercase elements.
- **Person:** "we/our" for the org, "you/yours" for the reader. Action verbs open CTAs.
- **Punctuation:** no em dashes anywhere; commas, periods, colons. Bullets "•" join short facts ("501(c)(3) nonprofit since 1997 • EIN XX-XXXXXXX • Los Angeles, CA").
- **Emoji:** not used. The only glyphs are the bullet •, arrow →, and check ✓.
- **Framing:** Odun De is compared to Chinese New Year, Diwali, Nowruz: "communities that pause the world to celebrate who they are."
- **Example copy, verbatim from spec:** H1 "Celebrating and sustaining Yoruba culture in Southern California since 1997". Sub "Language, festival, family. From the Yoruba Language School to the Odun De Festival at Leimert Park, we pass the culture to the next generation."

## VISUAL FOUNDATIONS

- **Color:** indigo dominates 60 to 70 percent of visual weight (àdìrẹ cloth ground). Gold #E8A13A is Ọ̀ṣun's gold: actions and celebration ONLY, never body text on light, one gold primary action per screen view. Terracotta #B4552D warms kickers and festival moments (earth of two homes: laterite and Leimert Park brick). Green #2E7D5B stays inside YCC/sustainability content so it reads as meaningful. Grounds: white default, paper #FAF5EC warm alternate, indigo-100 quiet tint.
- **Type:** Source Serif 4 (headings, 600/700) + Source Sans 3 (body/UI, 400/600/700) via Google Fonts; fallback stack goes through Noto Serif/Sans (guaranteed diacritics) then Georgia/system-ui. Hero 44 to 64px, H2 32 to 40, H3 20 to 24, body 17 to 18, caption 13 to 14. Line-height 1.15 headings, 1.6 body. Kicker: 12px, uppercase, 0.15em tracking, bold.
- **Spacing:** 8px grid; section padding 72 to 96px desktop, 48px mobile (`--section-pad`); content width 1080 to 1120px (1100 default).
- **Shape:** cards 14px radius; buttons and inputs full-round (999px); soft shadows appear on card hover ONLY, rare otherwise.
- **Backgrounds:** default page rhythm is dark indigo hero and footer bookending light body sections (white alternating with paper). Àdìrẹ dot texture at 8 to 12 percent opacity on dark bands; aṣọ òkè stripe dividers (2 to 4 uneven bands, never pinstripes); ayo dot rows as playful punctuation (kids/STEM contexts).
- **Imagery:** photography first, candid over posed, faces over objects, intergenerational moments, warm natural grading. Until Red Carpet Media photos arrive: placeholder blocks with gradient or àdìrẹ fill, a caption naming the future photo, fixed aspect ratio. No stock, no AI-generated people. Text over images always gets a scrim or solid panel.
- **Motion:** modest and quick. Buttons lift 2px on hover (.15s ease) and settle on press; cards lift 3px with a soft shadow; no bounces, no parallax, no scroll animation.
- **Hover states:** buttons darken (gold-500 → gold-600) or fill (secondary outline fills indigo); links shift indigo → terracotta; footer links shift to gold-300.
- **Focus:** 2px outline, offset 2px; indigo-700 on light, gold-300 on dark (`--focus-ring` flips inside `.oy-dark`).
- **Dark sections:** wrap in `.oy-dark` to flip headings to white, links to gold-300, focus ring to gold-300.
- **Themes:** three variants over one foundation, set `data-theme` on body: `calm` (photography carries emotion, texture nearly absent, gold only on primary buttons), `adire` (indigo-led dark texture bands, gold-300 glowing on dark, reading always on light), `festival` (terracotta and gold forward, 1.12x hero scale jump, energy from color and scale, never ornament count). A homepage bake-off picks the default.

## ICONOGRAPHY

- **No icon font, no SVG icon set.** The brand currently uses text glyphs as icons: arrow →, check ✓, bullet •, close ×. Keep it that way until real iconography is commissioned.
- Social icons are text-initial chips (IG, FB, LI, YT) in circles, per the mockup.
- Future direction (from Design-Foundations): simplified line iconography drawn from the talking drum, gele, and masquerade silhouettes for program icons. Not yet designed; do not improvise it.
- Ayo dot rows can serve as list bullets and loading states.
- **No logo was provided.** The nav renders the org name in Source Serif with a conic-gradient circle marked "OY" as an explicit placeholder (sanctioned by design.md section 5). Never draw a real logo; swap in the actual mark when supplied.

## Index

- `styles.css`: global entry, imports everything below.
- `tokens/`: `colors.css`, `typography.css`, `spacing.css`, `patterns.css`, `themes.css`, `fonts.css` (Google Fonts import).
- `css/base.css` (resets, dark scope, layout, texture utilities), `css/components.css` (all `.oy-*` component classes).
- Components: `components/core/` Kicker, Button, Divider; `components/forms/` Field, NewsletterSignup; `components/media/` ImagePlaceholder; `components/cards/` StatBlock, ProgramCard, NewsCard, DoorCard, PathRow; `components/navigation/` SiteNav, SiteFooter; `components/bands/` EventBand, NewsletterBand; `components/content/` PullQuote, PartnerRow, Timeline.
- `guidelines/`: foundation specimen cards (colors, type, spacing, patterns, usage do/don't, social-ready tokens, theme comparison).
- `ui_kits/website/`: homepage, Odun De Festival page, Get Involved page.
- `templates/`: none yet.
- `SKILL.md`: agent skill entry point.

## Intentional additions

- `--gold-600` hover shade and `--terra-700` gradient stop: derived to give gold/terra usable hover and depth values.
- Error color reuses terra-600 (no dedicated error token in spec); errors are plain-language sentences.

## Caveats

- Fonts load from Google Fonts CDN (spec allows); no font binaries are shipped in-project.
- EIN is a placeholder ("XX-XXXXXXX") pending the real number.
- Partner logo row uses text chips; real partner marks not provided.
