import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { board, reach, staff, takePart } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/OurStory/Portraits',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `portraits` option on the board and the staff and volunteers: a person's portrait where the Studio holds one and the woven tick where it does not, or every card without a portrait. Before anyone is listed each group shows its own Pending line, and the page closes with Reach us and the two take-part rows.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** As the development dataset stands: no person listed, the contact facts owed. */
export const Pending: Story = {
  args: {
    options: { portraits: 'shown' },
    slots: { default: [board({ listed: false }), staff(false), reach, takePart] },
  },
};

export const Shown: Story = {
  args: { options: { portraits: 'shown' }, slots: { default: [board(), staff()] } },
};

export const Hidden: Story = {
  args: {
    options: { portraits: 'hidden' },
    slots: { default: [board({ portraits: 'hidden' }), staff()] },
  },
};
