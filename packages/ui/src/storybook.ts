/**
 * Shared story plumbing for @oy/ui. The framework exports no `Meta` or `StoryObj`, so the two
 * aliases follow the pattern every Storybook renderer uses (`ComponentAnnotations` and
 * `StoryAnnotations` over the renderer type; docs/research/phase-1-storybook-chromatic.md).
 * Args map to `Astro.props`; `slots.default` and `slots.<name>` carry HTML strings for slots.
 */
import type { AstroRenderer } from '@storybook-astro/framework';
import type { Args, ComponentAnnotations, StoryAnnotations } from 'storybook/internal/types';

export type Meta<TArgs = Args> = ComponentAnnotations<AstroRenderer, TArgs>;
export type StoryObj<TArgs = Args> = StoryAnnotations<AstroRenderer, TArgs>;

/** Props of an .astro component plus the slot map stories pass as `slots`. */
export type StoryArgs<TProps> = TProps & { slots?: Record<string, string> };

/** Every face must render this cleanly at every size (docs/design/README.md section 3). */
export const TEST_STRING = 'Ẹ káàbọ̀ sí Ọjà Balógun, Àgbàlá Ọmọde àti Ẹgbẹ́ Ìbílẹ̀. Odún dé! Ẹ ṣeun.';

type StoryRenderer = () => string;

/** Wraps a story in an HTML shell; the framework keeps `class` on the wrapper and strips `style`. */
export const wrap = (className: string) => (story: StoryRenderer) =>
  `<div class="${className}">${story()}</div>`;

/**
 * The dark scope for OnDark stories: locking the indigo background makes the preview's global
 * decorator wrap the story in `.oy-dark`. Verified in the static build, where story globals reach
 * the decorator at prerender time (docs/plans/handoff-phase-1.md).
 */
export const onDark = {
  globals: { backgrounds: { value: 'indigo' } },
};
