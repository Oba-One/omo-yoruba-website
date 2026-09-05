import type { ComponentProps } from 'astro/types';
import { type Meta, onDark, type StoryArgs, type StoryObj, TEST_STRING } from '../../storybook';
import Button from './Button.astro';

type Args = StoryArgs<ComponentProps<typeof Button>>;

const meta = {
  title: 'Core/Button',
  component: Button,
  args: { variant: 'primary', size: 'default', slots: { default: 'Become a member' } },
  parameters: {
    docs: {
      description: {
        component:
          'One gold primary action per screen view: the gold button is the one thing a visitor is asked to do next, so a section never shows two. Secondary actions take the indigo outline, quiet ones the text with an arrow. Hover darkens or fills, press settles 1.5 percent, focus draws a 2px ring, and nothing lifts.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', slots: { default: 'Get involved' } },
};

export const Quiet: Story = {
  args: { variant: 'quiet', arrow: true, slots: { default: 'All programs' } },
};

export const Small: Story = { args: { size: 'small', slots: { default: 'Donate' } } };

export const WithArrow: Story = { args: { arrow: true } };

export const AsLink: Story = { args: { href: '/get-involved', arrow: true } };

/** Hover darkens the gold; the secondary outline fills indigo. No lift. */
export const Hover: Story = { parameters: { pseudo: { hover: '.oy-btn' } } };

export const SecondaryHover: Story = {
  args: { variant: 'secondary', slots: { default: 'Get involved' } },
  parameters: { pseudo: { hover: '.oy-btn' } },
};

/** The 2px ring, offset 2px (gold-300 inside a dark band). */
export const Focus: Story = { parameters: { pseudo: { focusVisible: '.oy-btn' } } };

/** Pressed: the button settles to 98.5 percent. */
export const Pressed: Story = { parameters: { pseudo: { active: '.oy-btn' } } };

export const Disabled: Story = { args: { disabled: true } };

/** A disabled link drops its href and reads as unavailable. */
export const DisabledLink: Story = {
  args: { href: '/tickets', disabled: true, slots: { default: 'Sold out' } },
};

/** While a form submits: the label reads Sending... and the button cannot be pressed again. */
export const Busy: Story = { args: { busy: true, slots: { default: 'Send' } } };

/** The type test inside the button, at 15px bold. */
export const Diacritics: Story = { args: { slots: { default: TEST_STRING } } };

/** On dark grounds the gold stays; the outline turns white and fills white on hover. */
export const OnDark: Story = {
  ...onDark,
  args: { arrow: true, slots: { default: 'Sponsor a table' } },
};

export const OnDarkSecondary: Story = {
  ...onDark,
  args: { variant: 'secondary', slots: { default: 'Apply as a vendor' } },
};

export const OnDarkFocus: Story = {
  ...onDark,
  args: { variant: 'secondary', slots: { default: 'Apply as a vendor' } },
  parameters: { pseudo: { focusVisible: '.oy-btn' } },
};
