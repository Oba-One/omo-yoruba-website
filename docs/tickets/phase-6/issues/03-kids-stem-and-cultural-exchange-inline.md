# 03: Kids & STEM and Cultural Exchange inline

Labels: design, content
Status: resolved
Blocked by: 02

**What to build:** `/programs` describes its two inline programs in full (spec Q3, Q4, ADR 0031): Kids &
STEM with its prose and two sub-program cards (photograph, name, blurb, facts or their chip, outline
action), and Cultural Exchange with its blurb, three facts and a photograph placeholder, each chip naming
its own fact. Both sections sit behind a quiet "Hide details / Show details" toggle that works without
JavaScript and starts open or closed by the `inline` option.

- [x] `@oy/content`: sub-programs gain `image` and `facts[]`; `kidsStem.image`, `kidsStem.ages` and the
      sub-program's `ages` and `detail` retire; the registry's Kids & STEM facts row and Cultural Exchange's
      rows per field; the query reads them; TypeGen
- [x] Seed: the two sub-programs' photographs with the prototype's framing, the facts' labels without
      values, the retired fields unset at their nested paths (the seed learns to fill and unset inside an
      object's keyed items)
- [x] `@oy/ui`: the disclosure with its toggle (open, closed, without JavaScript); the sub-program card
      with its facts and Pending; the Cultural Exchange split; a `span.oy-pend` exemption wherever a new
      container styles its spans; stories and tests
- [x] `packages/web`: the builder carries both sections and hides the fourth program's section under
      `three`; tested
- [x] `Pages/Programs/Inline` stories (expanded, collapsed); Playwright: the toggles open and close with
      the keyboard and without JavaScript, the chips name each owed fact

## Comments

13 September 2026. `@oy/content`: a sub-program carries `image` and `facts[]`; `kidsStem.image`,
`kidsStem.ages` and the sub-program's `ages` and `detail` retired. The registry's Kids & STEM row is a
condition on a labelled fact without its value ("ages and what they build"), and Cultural Exchange has a
row per field ("what the exchange is", "who it is for", "the cadence", "how to join", "a photograph of the
exchange"); the lumped "everything about this program" is gone. The GROQ condition was checked against
`development`. Seed: the ayo and robots photographs with the prototype's framing, the labels Ages (both)
and What they build (the STEM Hub) with no values; `retiredFields` now unsets nested and per-item paths
(`kidsStem.subprograms[_key=="sub-1"].detail`) and `missingFields` fills the keyed items of an object's
array, never deeper. Written to `development`, where a second run changes nothing. `@oy/ui`: `Disclosure`
(a native `details` whose quiet toggle sits on the head's first line, under the head below 720px, its
name completed by the section's), `SubprogramCard`, `FactList`'s one-column form, the disclosure body's
26px gap and `Split`'s 22px above facts that follow copy. The `Pages/Programs/Inline` stories render the
two sections from small markup compositions, because the story renderer serializes component references
only ten levels deep and Section, Disclosure, CardGrid and a card go one past it. The Disclosure's play
function clicks: Storybook's synthetic Enter and Space cannot toggle a native summary
(`docs/research/phase-6-faq-accordion.md`, section G), so Playwright proves the keys. `packages/web`: the
builder carries both sections (a program the `three` cards leave out takes its section with it) and the
page composes them. Playwright: 14 passed seeded and 14 with the placeholder project (real Enter and
Space, the no-JavaScript toggle, each owed fact named, none of the register's inventions). The targets
sweep now measures `summary` too.
