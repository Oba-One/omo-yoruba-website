import type { ComponentProps } from 'astro/types';
import { type Meta, onDark, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import Pending from './Pending.astro';

type Args = StoryArgs<ComponentProps<typeof Pending>>;

const meta = {
  title: 'Core/Pending',
  component: Pending,
  args: { variant: 'chip', what: '2027 date' },
  // A card's width, so the line and the block read as they do on a page.
  decorators: [wrap('sb-oy-narrow')],
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The chip, named after the fact that is owed. */
export const Default: Story = {};

/** With nothing to name it reads Pending alone. */
export const Unnamed: Story = { args: { what: undefined } };

/** The line: a label and the sentence that tells the owner what to supply. */
export const Line: Story = {
  args: {
    variant: 'line',
    what: 'The named contact who follows this up, and how long they take to reply.',
  },
};

/** The block stands in for a photo or figure with the dot fill at 8 to 12 percent. */
export const Block: Story = {
  args: { variant: 'block', what: 'the zone photo', tone: 'indigo' },
};

export const BlockTerra: Story = {
  args: { variant: 'block', what: 'a festival photo', tone: 'terra' },
};

export const BlockGreen: Story = {
  args: { variant: 'block', what: 'the Solar Hub photo', tone: 'green' },
};

export const BlockGold: Story = {
  args: { variant: 'block', what: 'the gala photo', tone: 'gold', aspect: '1 / 1' },
};

/** On dark bands the chip and the line flip to gold so a pending item is never invisible. */
export const OnDark: Story = { ...onDark };

export const OnDarkLine: Story = {
  ...onDark,
  args: { variant: 'line', what: 'The founding story, in your words. Around 180 words.' },
};
