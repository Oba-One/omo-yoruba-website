import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { seam, seats } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Gala/Tiers',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `tiers` option: the ticket tiers side by side in columns, or stacked as rows with the button on the right. The tiers are placeholders and the Eventbrite link is still owed, so the buy-now tiers show its chip.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Columns: Story = {
  args: { options: { tiers: 'columns' }, slots: { default: [seam, seats('columns', 'seats')] } },
};

export const Rows: Story = {
  args: { options: { tiers: 'rows' }, slots: { default: [seam, seats('rows', 'seats')] } },
};
