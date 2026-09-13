import { COLLECTIVE_VOICE_SLOT, HOMEPAGE_VOICE_SLOTS } from '@oy/content/pending';
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
          "The ayo dot row, the quote, the name and relation. Initials only when the person has not agreed to be named. Without a testimonial the card waits in the prototype placeholder form for its slot (the quote it wants in brackets, Name pending with the voice), or as a Pending card with the registry wording when the page names no slot. The `single` variant is the Collective's one large quote, not a card, with the page's own registry wording.",
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

/** No testimonial yet, in the homepage's first slot: the registry's chip over the prototype's placeholder. */
export const Waiting: Story = {
  args: { testimonial: undefined, placeholder: HOMEPAGE_VOICE_SLOTS[0] },
};

/** No testimonial and no slot: the Pending card. */
export const Pending: Story = { args: { testimonial: undefined } };

export const OnDark: Story = { ...onDark };

/** The Collective's one voice: the large quote on the page, not a card. */
export const Single: Story = {
  args: {
    variant: 'single',
    testimonial: { ...sample, relation: 'Member, Yoruba Cultural Collective' },
  },
};

/** The Collective's voice as the Studio stands: the page's own chip over its placeholder. */
export const SingleWaiting: Story = {
  args: {
    variant: 'single',
    testimonial: undefined,
    placeholder: COLLECTIVE_VOICE_SLOT,
    pending: 'the quote and who said it',
  },
};
