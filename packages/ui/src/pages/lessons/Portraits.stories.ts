import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { glance, header, teacher } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Lessons/Portraits',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `portraits` option on the teacher\'s card. Until the Studio links her, the card draws the woven tick, "Teacher" and the chip for her name and bio, beside the enrol form\'s card with the chip for her email. Once linked, her portrait shows, or the woven tick when portraits are hidden. The linked teacher here is a bracketed placeholder.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** As the development dataset stands: no teacher linked yet. */
export const Pending: Story = {
  args: { options: { portraits: 'shown' }, slots: { default: [header, glance, teacher('shown')] } },
};

export const Shown: Story = {
  args: {
    options: { portraits: 'shown' },
    slots: { default: [header, glance, teacher('shown', true)] },
  },
};

export const Hidden: Story = {
  args: {
    options: { portraits: 'hidden' },
    slots: { default: [header, glance, teacher('hidden', true)] },
  },
};
