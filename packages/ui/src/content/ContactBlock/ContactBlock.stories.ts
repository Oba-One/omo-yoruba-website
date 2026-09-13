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
          "The ways to reach the organisation that Our Story's Reach us and Get Involved's fallback use (Phase 7): the general email and the phone from the site settings as links, the mailing address, the person who answers and how soon from the general routing contact, each the registry's chip while the Studio holds nothing, then a Call button while there is a phone and a button opening the contact form. `part` sets the facts or the actions alone. The values here are bracketed placeholders.",
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

/** The general routing contact in the bracketed form. */
const CONTACT = { name: '[ Name ]', responds: 'within [ how many ] working days' };

/** Get Involved's fallback: the facts it lists, the Call button and the quiet message button. */
export const GetInvolved: Story = {
  args: {
    contact: CONTACT,
    rows: ['email', 'phone', 'name', 'responds'],
    nameLabel: 'Who answers',
    call: true,
    variant: 'quiet',
  },
};

/** Our Story's Reach us: the address and who receives the message, no button (the form card opens it). */
export const OurStory: Story = {
  args: {
    contact: CONTACT,
    rows: ['email', 'phone', 'address', 'name'],
    nameLabel: 'Who receives this',
    label: false,
  },
};

/** The routing contact owed, as the development dataset stands: its two chips and no Call button. */
export const ContactPending: Story = {
  args: {
    settings: null,
    contact: null,
    rows: ['email', 'phone', 'name', 'responds'],
    call: true,
    variant: 'quiet',
  },
};

/** The actions alone, for the column beside the facts. */
export const ActionsOnly: Story = { args: { part: 'actions', call: true, variant: 'quiet' } };

/** The facts alone. */
export const FactsOnly: Story = {
  args: { part: 'facts', contact: CONTACT, rows: ['name', 'responds'] },
};
