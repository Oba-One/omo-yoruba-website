import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { associations, talk } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/GetInvolved/Hta',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `hta` option: the hometown associations shown (the prose beside its cells: the count from its stat, "Not yet" while no name is listed, how to connect) or hidden, which leaves the fallback for anyone who would rather talk to someone. Listing the names is optional (ADR 0035); a page that lists them shows them under the prose, bracketed here.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Shown: Story = {
  args: { options: { hta: 'shown' }, slots: { default: [associations(), talk] } },
};

export const Listed: Story = {
  args: { options: { hta: 'shown' }, slots: { default: [associations(true), talk] } },
};

export const Hidden: Story = {
  args: { options: { hta: 'hidden' }, slots: { default: [talk] } },
};
