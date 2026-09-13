import type { ComponentProps } from 'astro/types';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import Split from './Split.astro';

type Args = StoryArgs<ComponentProps<typeof Split>>;

const meta = {
  title: 'Page/Split',
  component: Split,
  args: {
    slots: {
      default: '<p>The copy column: a heading, the prose and its links.</p>',
      aside: '<p>The aside: a photograph or a running order.</p>',
    },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** The person shape: a 320px card beside the copy, as the Lessons page sets its teacher beside her form. */
export const Person: Story = {
  args: {
    shape: 'person',
    slots: {
      default: '<p>The person card.</p>',
      aside: '<p>The card beside it.</p>',
    },
  },
};

/** The columns centred on each other, as Donate sets the give-now copy beside its facts. */
export const Centred: Story = { args: { align: 'center' } };
