import type { ComponentProps } from 'astro/types';
import { DOORS, OTHER_DOORS } from '../../fixtures/homepage';
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
          "Chip, one line, one action: the compact alternative to door cards. The chips are the prototypes' own (Membership, Partnership, Volunteer, Give) and the accent follows the way in; hover deepens the border. No rule, no lift.",
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

export const Pending: Story = { args: { door: {}, primary: false } };

export const Hover: Story = { parameters: { pseudo: { hover: '.oy-path' } } };
