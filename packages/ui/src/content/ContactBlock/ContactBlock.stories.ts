import type { ComponentProps } from 'astro/types';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import ContactBlock from './ContactBlock.astro';

type Args = StoryArgs<ComponentProps<typeof ContactBlock>>;

/** The settings in the bracketed placeholder form: the Studio holds no address, phone or inbox yet. */
const FILLED = {
  generalEmail: '[ inbox@example.org ]',
  phone: '[ (000) 000-0000 ]',
  address: '[ Street and suite ]\n[ City, state and ZIP ]',
};

const meta = {
  title: 'Content/ContactBlock',
  component: ContactBlock,
  args: { settings: FILLED },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "The ways to reach the organisation that Our Story's Reach us and Get Involved's fallback use (Phase 7): the general email and the phone from the site settings as links, the mailing address, each the registry's chip while the settings hold nothing, and a button opening the contact form. The values here are bracketed placeholders.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Every value in the settings. */
export const Default: Story = {};

/** The phone owed, the rest held. */
export const PhoneMissing: Story = { args: { settings: { ...FILLED, phone: null } } };

/** The inbox owed, the rest held. */
export const EmailMissing: Story = { args: { settings: { ...FILLED, generalEmail: '' } } };

/** The address owed, the rest held. */
export const AddressMissing: Story = { args: { settings: { ...FILLED, address: '  ' } } };

/** Nothing in the settings, as the development dataset stands: three chips and the button. */
export const Pending: Story = { args: { settings: null } };

/** On a tinted section ground, with the quiet button Get Involved's fallback draws. */
export const OnTint: Story = {
  args: { variant: 'quiet' },
  decorators: [wrap('oy-section oy-section--alt')],
};
