import type { ComponentProps } from 'astro/types';
import { type Meta, onDark, type StoryArgs, type StoryObj, TEST_STRING } from '../../storybook';
import Kicker from './Kicker.astro';

type Args = StoryArgs<ComponentProps<typeof Kicker>>;

const meta = {
  title: 'Core/Kicker',
  component: Kicker,
  args: { yo: 'Ẹ káàbọ̀', en: 'Welcome' },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Yoruba leads, English supports, the gold dot between them. */
export const Default: Story = {};

/** One half on its own: no dot. */
export const YorubaOnly: Story = { args: { en: undefined } };

export const EnglishOnly: Story = { args: { yo: undefined } };

/** The test string at the kicker's 12px: every mark must sit cleanly in uppercase. */
export const Diacritics: Story = {
  args: { yo: TEST_STRING, en: 'The type test at 12px' },
};

/** A block-level kicker above a heading. */
export const AsParagraph: Story = { args: { as: 'p' } };

/** Both halves empty: the Pending chip names the kicker that is owed. */
export const Pending: Story = { args: { yo: undefined, en: undefined, what: 'section kicker' } };

/** Inside a dark band the kicker and its dot turn gold-300. */
export const OnDark: Story = { ...onDark };
