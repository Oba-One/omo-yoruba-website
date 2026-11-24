import type { ComponentProps } from 'astro/types';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import FestivalParticipation from './FestivalParticipation.astro';

type Args = StoryArgs<ComponentProps<typeof FestivalParticipation>>;

const meta = {
  title: 'Page/FestivalParticipation',
  component: FestivalParticipation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Three equally weighted cards near the top of Odunde. Each explains its shared enquiry form before opening it. The site owns the modal and its form behavior.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};
