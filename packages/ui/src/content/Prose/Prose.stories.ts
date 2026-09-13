import type { ComponentProps } from 'astro/types';
import { GALA_EVENING_INTRO, PROSE_EVERY_NODE, WHAT_IT_IS } from '../../fixtures/event-pages';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import Prose from './Prose.astro';

type Args = StoryArgs<ComponentProps<typeof Prose>>;

const meta = {
  title: 'Content/Prose',
  component: Prose,
  args: { value: WHAT_IT_IS },
  decorators: [wrap('oy-wrap')],
  parameters: {
    docs: {
      description: {
        component:
          'Body copy from the Studio through astro-portabletext: paragraphs, the heading and quote styles, strong, em, links to a checked scheme, and the pull quote. An empty field renders nothing; the page shows its Pending chip.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** "What Odunde is", as the seed writes it. */
export const Default: Story = {};

/** A plain text field, the Gala's evening intro as the seed writes it. */
export const PlainText: Story = { args: { value: undefined, text: GALA_EVENING_INTRO } };

/** Every node the schema allows, written from the seed's copy. */
export const EveryNode: Story = { args: { value: PROSE_EVERY_NODE } };

/** A link whose scheme the site does not trust keeps its text and loses the link. */
export const UntrustedLink: Story = {
  args: {
    value: [
      {
        _type: 'block',
        _key: 'untrusted',
        style: 'normal',
        markDefs: [{ _type: 'link', _key: 'bad', href: 'javascript:alert(1)' }],
        children: [
          { _type: 'span', _key: 'untrusted-a', text: 'The other half of our year is ', marks: [] },
          { _type: 'span', _key: 'untrusted-b', text: 'the Gala', marks: ['bad'] },
          { _type: 'span', _key: 'untrusted-c', text: '.', marks: [] },
        ],
      },
    ],
  },
};

/** Nothing in the field: nothing renders. */
export const Empty: Story = { args: { value: [] } };

/** The wide measure, as the Programs hub sets Kids & STEM's prose across its section (74ch). */
export const Wide: Story = {
  args: { value: undefined, text: GALA_EVENING_INTRO, measure: 'wide' },
};
