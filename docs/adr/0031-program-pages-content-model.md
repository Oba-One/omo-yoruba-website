# The program pages follow the slimmed prototypes, and their content model changes to fit

Decided with the owner on 12 September 2026 (Phase 6 grill, Q2 to Q13). CONTENT-MODEL and the wireframes
predate the Build Brief's third polish pass, which slimmed Yoruba Language Lessons to "teacher + contact,
levels, one lesson, five FAQs, take part" and settled the Programs hub and the Collective page; the
prototypes `10 Programs`, `11 Yoruba Language School` and `12 Yoruba Cultural Collective` are that pass,
and they outrank the wireframes (AGENTS.md). Where the schema could not carry what they draw, the model
changes; where it carries something they dropped, the field retires (owner's yes, AGENT-DOCS section 8;
every retired field was empty or unrendered in `development`).

- **Lessons has no voices.** `lessonsPage.voices` retires with its registry row; a testimonial with the
  lessons context still fills the homepage's parent slot. What you learn gains its prose field (`learn`).
- **Kids & STEM's sub-programs carry their own photograph and facts.** The prototype's two cards each
  have a photograph and a pair of facts whose second label differs ("When", "What they build"), so a
  sub-program takes `image` and `facts[]` (the shared `fact`); `kidsStem.image`, `kidsStem.ages` and the
  sub-program's `ages` and `detail` retire.
- **The year strip names a kind, not an edition.** An event row points at the festival or the Gala as a
  kind, named by its page, since a reference to Odunde 2027 goes stale the day it ends (ADR 0024's
  reason); `yearStripRow.event` retires.
- **Owed facts are named one by one.** Cultural Exchange's facts and an initiative's status, reach and
  dates each get their own registry row, so a chip under "Who it is for" reads "who it is for" rather than
  the register's lumped "everything about this program".
- **Green lives in the Collective page's `main`.** `data-scope="collective"` sits on `main`, not the body,
  so the nav, the footer and the dialogs never turn green; the `green` option strengthens it inside that
  scope. The prototype's literal greens become tokens, and the member-led pill's text darkens to #1F5C41
  for AA at 12px.
- **One Collective photograph.** The page reuses the Collective program's photograph, so wayfinder ticket
  31 replaces one image for the homepage card, the Programs card and the page.
- **No interim photographs for what is not confirmed.** Cultural Exchange, the Solar Hub and Green Goods
  show placeholders: the prototypes' summer-camp and vendor photographs would tell a reviewer what those
  programs look like and sell.

## Considered options

- Keep the wireframe's Lessons voices: rejected by the owner; the slimmed prototype is the later decision
  and the homepage already carries a Lessons parent's voice.
- Named fields for the sub-programs' facts (`ages`, `builds`): rejected; the two cards' second facts
  differ, and Àgbàlá Ọmọde builds nothing.
- The prototypes' interim photographs, as ADR 0023 allowed on the Collective's card: rejected for the
  initiatives and the exchange, whose photographs would state invented facts.

## Consequences

- The seed unsets retired fields at nested paths and fills missing fields inside an object's keyed
  array items, so `development` moves over without an owner's edit being overwritten.
- `testimonial` no longer reaches `/programs/yoruba-lessons`, `event` no longer reaches `/programs`, and
  `program` reaches `/programs/cultural-collective`; the Presentation locations and cache tags follow the
  route map.
- CONTENT-MODEL section 3's `lessonsPage.voices[]` and `programsPage.yearStrip[]` "event" read as
  amended here.
