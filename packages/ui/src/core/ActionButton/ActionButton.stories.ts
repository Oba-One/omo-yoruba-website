import type { ComponentProps } from 'astro/types';
import { type Meta, onDark, type StoryArgs, type StoryObj } from '../../storybook';
import ActionButton from './ActionButton.astro';

type Args = StoryArgs<ComponentProps<typeof ActionButton>>;

const meta = {
  title: 'Core/ActionButton',
  component: ActionButton,
  args: {
    action: { label: 'Become a member', kind: 'enquiry', enquiryKind: 'member' },
    variant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The Studio decides what a button opens: an enquiry form, the Give Dialog, a link or a section on the page. The component only turns that into the right trigger; a half-filled action renders nothing, since the Studio refuses to publish one. Outline by default, gold once per view.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Opens the Enquiry Modal for its kind; without JavaScript it links to the same page with the modal open. */
export const Default: Story = {};

export const Give: Story = { args: { action: { label: 'Donate', kind: 'give' } } };

export const Link: Story = {
  args: { action: { label: 'See the Odunde Festival', kind: 'url', href: '/odunde' } },
};

export const NewTab: Story = {
  args: {
    action: { label: 'Get tickets', kind: 'url', href: 'https://www.eventbrite.com', newTab: true },
  },
};

export const Anchor: Story = {
  args: { action: { label: 'Plan your day', kind: 'anchor', href: '#plan' }, variant: 'secondary' },
};

export const Quiet: Story = {
  args: { action: { label: 'All programs', kind: 'url', href: '/programs' }, variant: 'quiet' },
};

/** An action without its form renders nothing rather than a dead button. */
export const Incomplete: Story = {
  args: { action: { label: 'Partner with us', kind: 'enquiry' } },
};

export const OnDark: Story = {
  ...onDark,
  args: { action: { label: 'Tickets & tables', kind: 'url', href: '/gala' } },
};
