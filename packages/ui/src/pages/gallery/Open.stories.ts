import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { albumBody, albumHeader, albums, credits, header } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Gallery/Open',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `open` option: where an album's tile on the gallery leads, and so how the album page arrives. Under `viewer` (the default) the tile is the album's first photo address, so the album page arrives with the Lightbox open on its first photograph; closing it shows the album's photographs. Under `grid` the tile is the album page. The three albums the dataset holds, and End-of-Year Gala 2025's six photographs with their credit unconfirmed.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** `viewer`: each tile links to its album's first photo address. */
export const Viewer: Story = {
  args: {
    options: { open: 'viewer' },
    slots: { default: [header, albums('always', 'viewer'), credits] },
  },
};

/** `grid`: each tile links to its album's page. */
export const Grid: Story = {
  args: {
    options: { open: 'grid' },
    slots: { default: [header, albums('always', 'grid'), credits] },
  },
};

/** Under `viewer`, the album page as a tile opens it: the Lightbox served open on the first photograph. */
export const ViewerArrives: Story = {
  args: {
    options: { open: 'viewer' },
    slots: { default: [albumHeader, albumBody(true), credits] },
  },
};

/** Under `grid`, the album page as a tile opens it: the photographs, the Lightbox closed. */
export const GridArrives: Story = {
  args: {
    options: { open: 'grid' },
    slots: { default: [albumHeader, albumBody(false), credits] },
  },
};
