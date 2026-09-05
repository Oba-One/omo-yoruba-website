import type { ComponentProps } from 'astro/types';
import { type Meta, onDark, type StoryArgs, type StoryObj } from '../../storybook';
import Divider from './Divider.astro';

type Args = StoryArgs<ComponentProps<typeof Divider>>;

const meta = {
  title: 'Core/Divider',
  component: Divider,
  args: { kind: 'asoke' },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The aṣọ òkè stripe: indigo, terracotta and gold bands, uneven on purpose. */
export const Default: Story = {};

/** The thin two-band form for tighter seams. */
export const Thin: Story = { args: { kind: 'thin' } };

/** The ayo dot row: terracotta on light, gold-300 in a dark band. */
export const Ayo: Story = { args: { kind: 'ayo' } };

/** The ornament from the handoff, centred at 280px. */
export const Ornament: Story = { args: { kind: 'ornament' } };

export const OnDark: Story = { ...onDark, args: { kind: 'ayo' } };
