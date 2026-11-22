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
          "The `funders` option: partners and funders shown (the Pending line while the Studio holds none) or hidden, after governance. The ask that closes the page is a card at the section's foot, or stands alone with the partners hidden. Its sentence names the partnerships lead, or the role with the chip for how soon they reply.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Shown: Story = {
  args: {
    options: { funders: 'shown' },
    slots: { default: [voices, photographs, governance, funders] },
  },
};

export const Hidden: Story = {
  args: { options: { funders: 'hidden' }, slots: { default: [governance, fund] } },
};
