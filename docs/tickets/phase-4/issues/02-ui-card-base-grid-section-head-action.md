# 02: The card base, the grid, the section head and the action button

Labels: design
Status: open
Blocked by: 01

**What to build:** in `@oy/ui`, the parts every homepage block shares: `Card` (paper ground, indigo
hairline, 8px aṣọ òkè top edge, grain-dots, the hover language: border deepens, title warms, arrow
slides, the rule draws), `CardGrid` (two, three and four across, collapsing on narrow screens),
`SectionHead` (the aṣọ òkè swatch, the bilingual kicker, the heading, an optional intro and quiet
link) and `ActionButton`, which turns a Studio action (an enquiry kind, the Give Dialog, a link, an
anchor) into the right trigger. A shared image input type so a component takes a fixture image, a
URL or a resolved Sanity image alike.

- [ ] Each part has a story per variant, a Pending story where it can be empty, and an OnDark story where it sits in a dark band
- [ ] `ActionButton` renders `data-enquiry` and `data-give` triggers the mounted dialogs open, and a plain link otherwise
- [ ] `bun run test` passes in `@oy/ui` and Storybook renders every story
