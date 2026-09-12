import type { ComponentProps } from 'astro/types';
import { HERO } from '../../fixtures/homepage';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import Hero from './Hero.astro';

type Args = StoryArgs<ComponentProps<typeof Hero>>;

const meta = {
  title: 'Page/Hero',
  component: Hero,
  args: {
    image: HERO.image.src,
    alt: HERO.image.alt,
    kicker: HERO.kicker,
    title: HERO.title,
    emphasis: HERO.emphasis,
    sub: HERO.sub,
    blessing: HERO.blessing,
    primary: HERO.primary,
    secondary: HERO.secondary,
    motion: true,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The homepage hero: the photograph behind a scrim and the àdìrẹ dot field, and the copy set left: the Yoruba • English kicker, the heading with its gold words in italic, the one gold action and the outline action, the blessing line. The photo breathes slowly when motion is on and holds still under reduced motion or the page option.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Motion on: the photo breathes over 26 seconds and the copy rises in. */
export const Default: Story = {};

/** Motion off: everything settled, the photo still. */
export const MotionOff: Story = { args: { motion: false } };

export const NoBlessing: Story = { args: { blessing: undefined, secondary: [] } };

/** No gold words in the Studio: the whole heading white. */
export const PlainHeading: Story = { args: { emphasis: undefined } };

/** Nothing from the Studio yet: the surface, a Pending chip for the photograph and one for the heading. */
export const Pending: Story = {
  args: {
    image: undefined,
    kicker: undefined,
    title: undefined,
    sub: undefined,
    blessing: undefined,
    primary: undefined,
    secondary: [],
  },
};
