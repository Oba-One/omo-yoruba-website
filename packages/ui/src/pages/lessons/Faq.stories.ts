import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { faq, takePart } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Lessons/Faq',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `faq` option: the five questions parents ask start all closed, or with the first open. One stays open at a time. Every answer is owed (the register invents all of them), so an opened question shows the registry's chip.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Closed: Story = {
  args: { options: { faq: 'closed' }, slots: { default: [faq('closed'), takePart] } },
};

export const Open: Story = {
  args: { options: { faq: 'open' }, slots: { default: [faq('open'), takePart] } },
};
