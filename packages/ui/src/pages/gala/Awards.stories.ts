import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { honorees, pastGalas } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Gala/Awards',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The awards option, hidden by default: shown puts honorees before past galas. Sponsorship offers are not in use. The honorees are placeholders.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Hidden: Story = {
  args: {
    options: { awards: 'hidden' },
    slots: { default: [pastGalas('awards-hidden-carousel')] },
  },
};

export const Shown: Story = {
  args: {
    options: { awards: 'shown' },
    slots: { default: [honorees, pastGalas('awards-shown-carousel')] },
  },
};
