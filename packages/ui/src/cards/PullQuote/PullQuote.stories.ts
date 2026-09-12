import type { ComponentProps } from 'astro/types';
import { type Meta, onDark, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import PullQuote from './PullQuote.astro';

type Args = StoryArgs<ComponentProps<typeof PullQuote>>;

// No testimonial exists in any dataset yet, so the quote below is an illustrative sentence about
// the layout, not a member's words, and the name is a placeholder pair of letters.
const sample = {
  quote: 'Two or three sentences from a member sit here in the display face, with room to breathe.',
  name: 'A. B.',
  relation: 'Parent, Language Lessons',
  permissionToName: true,
};

const meta = {
  title: 'Cards/PullQuote',
  component: PullQuote,
  args: { testimonial: sample },
  decorators: [wrap('sb-oy-narrow')],
  parameters: {
    docs: {
      description: {
        component:
          'The ayo dot row, the quote, the name and relation. Initials only when the person has not agreed to be named. Without a testimonial the card is a Pending card with the registry wording.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** Permission to name withheld: initials only. */
export const Initials: Story = {
  args: { testimonial: { ...sample, name: 'Adé Bákàrè', permissionToName: false } },
};

/** No testimonial yet: the Pending card. */
export const Pending: Story = { args: { testimonial: undefined } };

export const OnDark: Story = { ...onDark };
