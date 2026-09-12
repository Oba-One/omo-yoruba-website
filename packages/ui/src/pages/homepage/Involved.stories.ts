import type { ComponentProps } from 'astro/types';
import HomeRoot from '../../page/HomeRoot/HomeRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { involved } from './sections';

type Args = StoryArgs<ComponentProps<typeof HomeRoot>>;

const meta = {
  title: 'Pages/Homepage/Involved',
  component: HomeRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `involved` option: Raise your hand as two door cards or as path rows. Each door opens its enquiry kind; the first is gold.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Doors: Story = { args: { involved: 'doors', slots: { default: involved('doors') } } };

export const Rows: Story = { args: { involved: 'rows', slots: { default: involved('rows') } } };
