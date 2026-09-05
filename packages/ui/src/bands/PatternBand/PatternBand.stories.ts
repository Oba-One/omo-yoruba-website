import type { ComponentProps } from 'astro/types';
import { type Meta, onDark, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import PatternBand from './PatternBand.astro';

type Args = StoryArgs<ComponentProps<typeof PatternBand>>;

const meta = {
  title: 'Bands/PatternBand',
  component: PatternBand,
  args: { pattern: 'dots' },
  // The overlays fill a positioned parent, so every story renders inside a stage.
  decorators: [wrap('sb-oy-stage sb-oy-stage--indigo oy-dark')],
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The àdìrẹ dot field over indigo at 8 percent, the texture of every dark band. */
export const Default: Story = {};

/** A stronger field, as the event band uses. */
export const DotsStronger: Story = { args: { opacity: 0.13 } };

/** The chevron row for the top edge of the festival frame. */
export const Chevron: Story = { args: { pattern: 'chevron' } };

/** The same row pointed the other way for the bottom edge. */
export const ChevronFlipped: Story = { args: { pattern: 'chevron', flip: true } };

/** The motif column that frames the event band; hides under 1000px. */
export const Motif: Story = {
  args: { pattern: 'motif' },
  decorators: [wrap('sb-oy-stage sb-oy-stage--row sb-oy-stage--indigo oy-dark')],
};

/** The batik wash pooling over paper. */
export const Batik: Story = {
  args: { pattern: 'batik' },
  decorators: [wrap('sb-oy-stage sb-oy-stage--paper')],
};

/**
 * Every pattern here already sits in the dark scope; this story also locks the canvas to the
 * indigo background so the stage reads as part of a full dark band, as the site shows it.
 */
export const OnDark: Story = { ...onDark };
