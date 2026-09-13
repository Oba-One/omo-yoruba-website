import type { ComponentProps } from 'astro/types';
import { DOORS } from '../../fixtures/homepage';
import { VENDOR_DOOR } from '../../fixtures/trust-pages';
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
          "One clear way in: photo or placeholder, a title, two lines, one real button that opens the enquiry kind or the Give Dialog. The first door on a view is gold, the rest outline. Get Involved adds the door's chip above the title, its bullets and an anchor, and lays the cards out as rows under its `doors` option (the photograph on the left, stacking under 820px).",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Become a member: the gold action opens the member enquiry. */
export const Default: Story = {};

export const Member: Story = {};

/** Partner or sponsor: the outline action opens the sponsor enquiry. */
export const Partner: Story = { args: { door: DOORS[1] as Args['door'], primary: false } };

/** With the "what it asks and gives" bullets, as Get Involved shows them; the member door still owes its lines. */
export const WithBullets: Story = { args: { bullets: true } };

/** A door with only its key: the placeholder, the registry's chip for the blurb and no button. */
export const Pending: Story = { args: { door: { key: 'volunteer' }, primary: false } };

export const Hover: Story = { parameters: { pseudo: { hover: '.oy-card' } } };

/** In draft mode the photo carries its edit attribute for click-to-edit. */
export const WithEdit: Story = {
  args: { imageEdit: 'id=door-member;type=door;path=image;base=%2Fadmin' },
};

/** Get Involved's card: the chip above the title, the bullets and the anchor the footer links to. */
export const GetInvolved: Story = { args: { label: true, bullets: true, id: 'member' } };

/** The vendor door as the seed writes it: its photograph and button, its blurb and bullets owed. */
export const Vendor: Story = {
  args: { door: VENDOR_DOOR as Args['door'], label: true, bullets: true, primary: false },
};

/** The row form: the photograph fills the row's height beside the copy (Get Involved's rows, Donate's one door). */
export const Row: Story = {
  args: { layout: 'row', label: true, bullets: true },
  decorators: [wrap('sb-oy-wide')],
  globals: { viewport: { value: 'desktop' } },
};
