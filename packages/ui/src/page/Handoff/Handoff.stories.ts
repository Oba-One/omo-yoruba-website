import { pendingWhat } from '@oy/content/pending';
import type { ComponentProps } from 'astro/types';
import { FESTIVAL_GIVE_HANDOFF, FESTIVAL_PARTNERS_HANDOFF } from '../../fixtures/event-pages';
import { type Meta, onDark, type StoryArgs, type StoryObj } from '../../storybook';
import Handoff from './Handoff.astro';

type Args = StoryArgs<ComponentProps<typeof Handoff>>;

const meta = {
  title: 'Page/Handoff',
  component: Handoff,
  args: {
    action: { label: 'Open the photo gallery', kind: 'url', href: '/gallery' },
    text: 'Odunde, the Gala, and the language lessons, year by year.',
  },
  parameters: {
    docs: {
      description: {
        component:
          'Where a section or a page hands off. The line: one button and a short line beside it, centred; the homepage ends its mosaic with it. The box: the tinted box with the line on the left and up to two buttons on the right, as the event pages close their take-part and partners sections.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Quiet: Story = { args: { variant: 'quiet' } };

export const ButtonOnly: Story = { args: { text: undefined } };

export const OnDark: Story = { ...onDark };

/** The box under the Odunde take-part band: the page's line and Donate as the outline (ADR 0056). */
export const Box: Story = {
  args: { shape: 'box', ...FESTIVAL_GIVE_HANDOFF },
};

/** The quiet link in a box, deepened for the tint, as the Gala's sponsors section points at Impact. */
export const BoxQuiet: Story = { args: { shape: 'box', variant: 'quiet' } };

/** The box with two buttons, as the Odunde partners section closes: gold Donate, then the outline. */
export const BoxTwoButtons: Story = {
  args: { shape: 'box', variant: 'primary', ...FESTIVAL_PARTNERS_HANDOFF },
};

/** The box whose line is a missing fact: Get Involved's give door without its blurb shows the chip. */
export const BoxPending: Story = {
  args: {
    shape: 'box',
    variant: 'primary',
    text: undefined,
    textPending: pendingWhat('door', 'blurb'),
    action: { label: 'Donate', kind: 'give' },
  },
};
