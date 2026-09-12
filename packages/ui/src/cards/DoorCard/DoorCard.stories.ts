import type { ComponentProps } from 'astro/types';
import { DOORS } from '../../fixtures/homepage';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import DoorCard from './DoorCard.astro';

type Args = StoryArgs<ComponentProps<typeof DoorCard>>;

const meta = {
  title: 'Cards/DoorCard',
  component: DoorCard,
  args: { door: DOORS[0] as Args['door'], primary: true },
  decorators: [wrap('sb-oy-narrow')],
  parameters: {
    docs: {
      description: {
        component:
          'One clear way in: photo or placeholder, a title, two lines, one real button that opens the enquiry kind or the Give Dialog. The first door on a view is gold, the rest outline.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Become a member: the gold action opens the member enquiry. */
export const Member: Story = {};

/** Partner or sponsor: the outline action opens the sponsor enquiry. */
export const Partner: Story = { args: { door: DOORS[1] as Args['door'], primary: false } };

/** With the "what it asks and gives" bullets, as Get Involved shows them; the member door still owes its lines. */
export const WithBullets: Story = { args: { bullets: true } };

/** A door with only its key: the placeholder, the chips and no button. */
export const Pending: Story = { args: { door: { key: 'volunteer' }, primary: false } };

export const Hover: Story = { parameters: { pseudo: { hover: '.oy-card' } } };
