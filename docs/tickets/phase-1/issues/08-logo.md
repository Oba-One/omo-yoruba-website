# 08: Logo

Labels: design
Status: resolved
Blocked by: 04

**What to build:** `Logo` renders the Ifẹ̀ bronze head mark at 40px with the two-line Source
Serif wordmark ("Omo Yorùbá" then "of Southern California", the second line hidden under
1060px), the mark alone, and the light lockup for dark grounds (the footer). Image sources come
with the component and accept a plain URL so Storybook renders them without `astro:assets`.




- [x] `src/navigation/Logo/Logo.astro` with `variant` (lockup, mark, light) and `href`
- [x] Stories: Default, Mark, Light (OnDark), Narrow (under 1060px viewport)
- [x] Alt text follows the `oy-voice` skill; the decorative mark beside the wordmark is hidden
      from assistive technology
- [x] Test renders the stories and checks the variants
