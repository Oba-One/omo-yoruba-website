import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { albumBody, albumHeader, credits } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Gallery/Open',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `open` option: where an album's tile on the gallery leads. Under `viewer` (the default) the tile is the album's first photo address, so the album page arrives with the Lightbox open on its first photograph; closing it shows the album's photographs. Under `grid` the tile is the album page. End-of-Year Gala 2025's six photographs, their credit unconfirmed.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Viewer: Story = {
  args: {
    options: { open: 'viewer' },
    slots: { default: [albumHeader, albumBody(true), credits] },
  },
};

export const Grid: Story = {
  args: {
    options: { open: 'grid' },
    slots: { default: [albumHeader, albumBody(false), credits] },
  },
};
