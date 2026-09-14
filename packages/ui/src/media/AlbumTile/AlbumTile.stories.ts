import type { ComponentProps } from 'astro/types';
import { ALBUM_TILES } from '../../fixtures/gallery';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import AlbumTile from './AlbumTile.astro';

type Args = StoryArgs<ComponentProps<typeof AlbumTile>>;

const [odunde, gala, camp] = ALBUM_TILES as [
  (typeof ALBUM_TILES)[number],
  (typeof ALBUM_TILES)[number],
  (typeof ALBUM_TILES)[number],
];

const meta = {
  title: 'Media/AlbumTile',
  component: AlbumTile,
  decorators: [wrap('sb-oy-narrow')],
  args: odunde,
  parameters: {
    docs: {
      description: {
        component:
          "An album on the gallery: one link with the cover and, over the scrim, the title and its line, the year and the count, or the count and the chip where the year is owed. The border turns gold on hover; nothing lifts or zooms. The title is a heading, and the cover's alt stays empty because the title names the link. `AlbumGrid` lays tiles out in the gallery's mosaic.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Odunde 2026: the title carries the year, so the line reads the count alone. */
export const Default: Story = {};

/** A tile two rows tall takes the larger title. */
export const Lead: Story = { args: { size: 'lead' }, decorators: [wrap('sb-oy-medium')] };

/** A year the title does not carry reads before the count. */
export const WithYear: Story = { args: { ...gala, title: 'End-of-Year Gala', year: '2025' } };

/** The summer camp: no date and no edition, so the chip stands where the year would be. */
export const YearPending: Story = { args: camp };

/** No cover and no photograph yet: the placeholder names the cover. */
export const Pending: Story = {
  args: { ...camp, image: undefined, count: '0 photographs' },
};

/** The title on hover (the pointer's state, as the gold border shows it). */
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
