import { wayAction } from '@oy/content/take-part';
import type { ComponentProps } from 'astro/types';
import { FESTIVAL_TAKE_PART, GALA_TAKE_PART } from '../../fixtures/event-pages';
import { DOORS, OTHER_DOORS } from '../../fixtures/homepage';
import {
  COLLECTIVE_TAKE_PART,
  LESSONS_TAKE_PART,
  PROGRAMS_TAKE_PART,
} from '../../fixtures/program-pages';
import { VENDOR_DOOR } from '../../fixtures/trust-pages';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import PathRow from './PathRow.astro';

type Args = StoryArgs<ComponentProps<typeof PathRow>>;

const meta = {
  title: 'Cards/PathRow',
  component: PathRow,
  args: { door: DOORS[0] as Args['door'], primary: true },
  decorators: [wrap('oy-takepart')],
  parameters: {
    docs: {
      description: {
        component:
          'Chip, one line, one action: the compact alternative to door cards, and the row of a take-part band. A door names its chip from the prototypes (Membership, Volunteer, Vendors, Partnership, Give); a take-part row brings its own way in, chip, title, line and action. The accent follows the way in; hover deepens the border. No rule, no lift. The action is outline by default, gold once per view, quiet for the give row.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Member: Story = {};

export const Partner: Story = { args: { door: DOORS[1] as Args['door'], primary: false } };

/** The volunteer door, chip and accent from the Lessons page's take-part rows. */
export const Volunteer: Story = {
  args: { door: OTHER_DOORS[0] as Args['door'], primary: false },
};

/** The give door: opens the Give Dialog. */
export const Give: Story = { args: { door: OTHER_DOORS[1] as Args['door'], primary: false } };

/** The vendor door (ADR 0034): the chip "Vendors" and the vendor accent come from the door's key. */
export const Vendor: Story = { args: { door: VENDOR_DOOR as Args['door'], primary: false } };

export const Pending: Story = { args: { door: {}, primary: false } };

const [vendor] = FESTIVAL_TAKE_PART;
const give = GALA_TAKE_PART[3];

/** A take-part row: the festival's vendor row as the seed writes it, with the band's gold action. */
export const TakePartRow: Story = {
  args: {
    door: undefined,
    way: 'vendor',
    chip: 'Vendors',
    title: vendor?.title,
    line: vendor?.line,
    action: wayAction('vendor', vendor?.label),
    primary: true,
  },
};

/** The give row of the Gala's band: its action is quiet and opens the Give Dialog. */
export const Quiet: Story = {
  args: {
    door: undefined,
    way: 'give',
    chip: 'Give',
    title: give?.title,
    line: give?.line,
    action: wayAction('give', give?.label),
    primary: false,
    variant: 'quiet',
  },
};

/** A take-part row the Studio has not finished: the registry's chip where the title and the button go. */
export const TakePartRowPending: Story = {
  args: {
    door: undefined,
    way: 'sponsor',
    chip: 'Sponsors',
    line: 'Four questions, and we send the deck with our impact numbers.',
    pending: 'a way in, its title or its button label',
    primary: false,
  },
};

const [enrol] = PROGRAMS_TAKE_PART;
const member = LESSONS_TAKE_PART[1];
const [partner, , updates] = COLLECTIVE_TAKE_PART;

/** The Programs hub's enrol row as the seed writes it: the performer accent, the enrol form. */
export const Enrol: Story = {
  args: {
    door: undefined,
    way: 'enrol',
    chip: 'Enrol',
    title: enrol?.title,
    line: enrol?.line,
    action: wayAction('enrol', enrol?.label),
    primary: true,
  },
};

/** The Lessons page's member row: the performer accent, the member form, an outline. */
export const MemberRow: Story = {
  args: {
    door: undefined,
    way: 'member',
    chip: 'Membership',
    title: member?.title,
    line: member?.line,
    action: wayAction('member', member?.label),
    primary: false,
  },
};

/** The Collective's updates row: the give accent, a quiet link to the newsletter form. */
export const Updates: Story = {
  args: {
    door: undefined,
    way: 'updates',
    chip: 'Updates',
    title: updates?.title,
    line: updates?.line,
    action: wayAction('updates', updates?.label),
    primary: false,
    variant: 'quiet',
  },
};

/** A row that wears its own chip: the Collective's sponsor row reads "Partner". */
export const OwnChip: Story = {
  args: {
    door: undefined,
    way: 'sponsor',
    chip: partner?.chip,
    title: partner?.title,
    line: partner?.line,
    action: wayAction('sponsor', partner?.label),
    primary: true,
  },
};

export const Hover: Story = { parameters: { pseudo: { hover: '.oy-path' } } };
