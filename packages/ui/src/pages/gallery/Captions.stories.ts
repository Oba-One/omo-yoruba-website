import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { albumBody, albums, header } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Gallery/Captions',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `captions` option: the albums' titles on the gallery and the photographs' captions on an album page, always shown (the default) or waiting for hover and keyboard focus where a pointer hovers. A phone always shows them.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Always: Story = {
  args: {
    options: { captions: 'always' },
    slots: { default: [header, albums('always'), albumBody(false, 'always')] },
  },
};

export const Hover: Story = {
  args: {
    options: { captions: 'hover' },
    slots: { default: [header, albums('hover'), albumBody(false, 'hover')] },
  },
};
