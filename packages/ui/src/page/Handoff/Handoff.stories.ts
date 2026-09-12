import type { ComponentProps } from 'astro/types';
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
          'The closing line of a section or a page: one button and a short line beside it. The homepage ends its mosaic with it; other pages close with where they hand off.',
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
