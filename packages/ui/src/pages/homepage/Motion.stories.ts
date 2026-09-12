import type { ComponentProps } from 'astro/types';
import HomeRoot from '../../page/HomeRoot/HomeRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { hero } from './sections';

type Args = StoryArgs<ComponentProps<typeof HomeRoot>>;

const meta = {
  title: 'Pages/Homepage/Motion',
  component: HomeRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `motion` option: on, the hero photo breathes over 26 seconds and the copy rises in; off, everything is settled. Reduced motion switches it off regardless.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const On: Story = { args: { motion: 'on', slots: { default: hero(true) } } };

export const Off: Story = { args: { motion: 'off', slots: { default: hero(false) } } };
