import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { pastGalas, takePart } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Gala/Past',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `past` option: the newest past gala album in the carousel with its credit, the gallery link and the way to Odunde, or nothing, which leaves the take-part band next.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Shown: Story = {
  args: {
    options: { past: 'shown' },
    slots: { default: [pastGalas('past-shown-carousel'), takePart('column')] },
  },
};

export const Hidden: Story = {
  args: { options: { past: 'hidden' }, slots: { default: [takePart('column')] } },
};
