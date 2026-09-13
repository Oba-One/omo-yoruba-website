import type { ComponentProps } from 'astro/types';
import { FESTIVAL_GIVE_HANDOFF } from '../../fixtures/event-pages';
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

/** The box under the Odunde take-part band: the page's line and the quiet Donate. */
export const Box: Story = {
  args: { shape: 'box', variant: 'quiet', ...FESTIVAL_GIVE_HANDOFF },
};

/** The box with two buttons, as the Odunde partners section closes: gold Donate, then the outline. */
export const BoxTwoButtons: Story = {
  args: {
    shape: 'box',
    variant: 'primary',
    text: 'Want the day to happen again next June? Give now, or sponsor and join this row.',
    action: { label: 'Donate', kind: 'give' },
    secondAction: { label: 'Sponsor Odunde', kind: 'enquiry', enquiryKind: 'sponsor' },
  },
};
