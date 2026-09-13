import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { evening, glance, header, seam } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Gala/Treatment',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `treatment` option: formal lets indigo carry the evening; warm turns the grounds to paper and lets terracotta into the header scrim and the seam. The seed holds no date, venue, dress or prices for Gala 2026, so every fact shows its Pending chip.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const slots = { default: [header, glance, evening('shown'), seam] };

export const Formal: Story = { args: { options: { treatment: 'formal' }, slots } };

export const Warm: Story = { args: { options: { treatment: 'warm' }, slots } };
