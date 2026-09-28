import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { albumHeaderHeld, albumSoon, albums, credits, header, soon } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Gallery/State',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `state` option, the consent hold for the albums: `built` (the default) shows the albums; `soon` replaces them with one sentence that claims nothing unconfirmed and the two event pages, and an album page shows the same sentence in place of its photographs, while the event pages show no photographs of past years. Photographs a page shows through its own fields stay. Photography credit and permissions closes the page in both, the policy and the inbox owed.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Built: Story = {
  args: { options: { state: 'built' }, slots: { default: [header, albums(), credits] } },
};

export const Soon: Story = {
  args: { options: { state: 'soon' }, slots: { default: [header, soon, credits] } },
};

/** `soon` on an album page: the title keeps its year, the sentence stands in for the photographs. */
export const AlbumSoon: Story = {
  args: { options: { state: 'soon' }, slots: { default: [albumHeaderHeld, albumSoon, credits] } },
};
