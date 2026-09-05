import type { ComponentProps } from 'astro/types';
import { type Meta, onDark, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import ImagePlaceholder from './ImagePlaceholder.astro';

type Args = StoryArgs<ComponentProps<typeof ImagePlaceholder>>;

const meta = {
  title: 'Media/ImagePlaceholder',
  component: ImagePlaceholder,
  args: { what: 'the zone photo', tone: 'indigo', aspect: '4 / 3' },
  decorators: [wrap('sb-oy-narrow')],
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Indigo gradient with the white dot field, 4 to 3, the caption naming the future photo. */
export const Default: Story = {};

export const Terra: Story = { args: { tone: 'terra', what: 'a festival photo' } };

/** Green stays inside Cultural Collective content. */
export const Green: Story = { args: { tone: 'green', what: 'the Solar Hub photo' } };

export const Gold: Story = { args: { tone: 'gold', what: 'the gala photo' } };

/** The àdìrẹ fill on indigo-900, for photo tiles and album covers. */
export const AdireFill: Story = { args: { tone: 'adire', what: 'Gala album cover' } };

/** A portrait ratio, as a person card uses. */
export const Portrait: Story = { args: { aspect: '4 / 5', what: 'a portrait of the teacher' } };

/** A pending photo: the Pending chip takes the caption's place. */
export const Pending: Story = {
  args: {
    what: 'a portrait of the teacher',
    label: 'Pending: a portrait of the teacher',
    slots: { default: '<span class="oy-pend">Pending: a portrait of the teacher</span>' },
  },
};

export const OnDark: Story = { ...onDark, args: { tone: 'terra', what: 'a festival photo' } };
