import type { ComponentProps } from 'astro/types';
import { SPONSOR_LEVEL_PLACEHOLDERS } from '../../fixtures/event-pages';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import SponsorLevels from './SponsorLevels.astro';

type Args = StoryArgs<ComponentProps<typeof SponsorLevels>>;

const meta = {
  title: 'Content/SponsorLevels',
  component: SponsorLevels,
  args: { levels: SPONSOR_LEVEL_PLACEHOLDERS },
  parameters: {
    docs: {
      description: {
        component:
          "The sponsor levels as list rows in the Studio's order, or the registry's Pending line when there are none (Gala 2026 today).",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Levels: Story = {};

export const Pending: Story = { args: { levels: [] } };
