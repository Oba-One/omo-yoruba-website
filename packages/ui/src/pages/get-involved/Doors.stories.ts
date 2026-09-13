import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { doors, header } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/GetInvolved/Doors',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `doors` option: the four ways in as two cards across, or one row each with the photograph on the left. Each card carries its chip, its anchor and what it asks and gives; the member and volunteer doors owe their bullets and the vendor door its blurb and bullets. With no header action, the first door holds the page's gold (ADR 0034).",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Cards: Story = {
  args: { options: { doors: 'cards' }, slots: { default: [header, doors('cards')] } },
};

export const Rows: Story = {
  args: { options: { doors: 'rows' }, slots: { default: [header, doors('rows')] } },
};
