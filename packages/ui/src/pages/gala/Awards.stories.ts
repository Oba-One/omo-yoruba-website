import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { honorees, pastGalas, sponsor } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Gala/Awards',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `awards` option, hidden by default: hidden leaves sponsor levels next to past galas; shown puts the honorees between them, this year first. The honorees are placeholders; with none in the Studio the section shows its Pending line.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Hidden: Story = {
  args: {
    options: { awards: 'hidden' },
    slots: { default: [sponsor, pastGalas('awards-hidden-carousel')] },
  },
};

export const Shown: Story = {
  args: {
    options: { awards: 'shown' },
    slots: { default: [sponsor, honorees, pastGalas('awards-shown-carousel')] },
  },
};
