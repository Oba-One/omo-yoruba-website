import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { takePart } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Odunde/Takepart',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `takepart` option: which way in leads the closing band. Vendor or sponsor moves to the top in the markup, so reading and tab order follow what is seen, and the first row carries the band's gold action. The vendor row's terms stay Pending until the edition holds them; the give handoff closes the section.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Vendor: Story = {
  args: { options: { takepart: 'vendor' }, slots: { default: [takePart('vendor', 'column')] } },
};

export const Sponsor: Story = {
  args: { options: { takepart: 'sponsor' }, slots: { default: [takePart('sponsor', 'column')] } },
};
