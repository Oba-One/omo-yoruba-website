import type { ComponentProps } from 'astro/types';
import Button from '../../core/Button/Button.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import ButtonRow from './ButtonRow.astro';

type Args = StoryArgs<ComponentProps<typeof ButtonRow>>;

const meta = {
  title: 'Page/ButtonRow',
  component: ButtonRow,
  args: {
    slots: {
      default: [
        {
          component: Button,
          props: { variant: 'quiet', href: '/impact', arrow: true },
          slots: { default: 'What the festival produces' },
        },
        {
          component: Button,
          props: { variant: 'quiet', href: '/gala', arrow: true },
          slots: { default: 'The other half of our year, the Gala' },
        },
      ],
    },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The two quiet links under "What Odunde is". */
export const Default: Story = {};
