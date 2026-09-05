# 06: Divider and Pending

Labels: design
Status: resolved
Blocked by: 04

**What to build:** `Divider` draws the aṣọ òkè stripe (two to four uneven bands, never pinstripes),
its thin form, the ayo dot row and the ornament, all decorative. `Pending` renders the named chip
("Pending: 2027 date"), the "Pending from you" line, and the block with a fixed aspect ratio and the
àdìrẹ dot fill at 8 to 12 percent in indigo, terracotta, green or gold, each naming the missing
item. Both flip correctly inside `.oy-dark`.




- [x] `src/core/Divider/Divider.astro` with `kind`; stories Default, Thin, Ayo, Ornament, OnDark
- [x] `src/core/Pending/Pending.astro` with `what`, `variant`, `aspect`, `tone`; stories Default,
      Line, Block, each tone, OnDark
- [x] Tests render the stories and check the caption names the missing item
- [x] Copy follows the `oy-voice` skill: sentence case, marks on Yoruba words
