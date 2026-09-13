import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { fund, funders, governance, photographs, voices } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Impact/Funders',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `funders` option: partners and funders shown (the Pending line while the Studio holds none) or hidden, between governance and the dark band that closes the page. The band's sentence names the partnerships lead, or the role with the chip for how soon they reply.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Shown: Story = {
  args: {
    options: { funders: 'shown' },
    slots: { default: [voices, photographs, governance, funders, fund] },
  },
};

export const Hidden: Story = {
  args: { options: { funders: 'hidden' }, slots: { default: [governance, fund] } },
};
