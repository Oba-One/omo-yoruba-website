import type { ComponentProps } from 'astro/types';
import { ALBUM_TILES, GALLERY_PENDING, PLACEHOLDER_ALBUM } from '../../fixtures/gallery';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import AlbumGrid from './AlbumGrid.astro';

type Args = StoryArgs<ComponentProps<typeof AlbumGrid>>;

const mobile = { globals: { viewport: { value: 'mobile', isRotated: false } } };
const desktop = { globals: { viewport: { value: 'desktop', isRotated: false } } };

const meta = {
  title: 'Media/AlbumGrid',
  component: AlbumGrid,
  decorators: [wrap('oy-wrap')],
  args: { albums: ALBUM_TILES, pending: GALLERY_PENDING.albums },
  parameters: {
    docs: {
      description: {
        component:
          "The gallery's albums. The mosaic leads with the newest album two columns by two rows; three albums fill a clean block, four or more follow the prototype, one spans the width and two sit as halves. Under 900px two columns with the lead across both, under 560px one. The grid lays the tiles two, three or four across at the port's densities. With `captions: hover` the titles wait for hover or keyboard focus where a pointer hovers; a phone always shows them. Albums beyond the three that exist are the bracketed placeholder form.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The three albums the dataset holds, newest year first: the lead, then two wide tiles beside it. */
export const Default: Story = { ...desktop };

/** At 375 the tiles stack, the lead as tall as the rest. */
export const Mobile: Story = { ...mobile };

/** One album spans the width. */
export const OneAlbum: Story = { ...desktop, args: { albums: ALBUM_TILES.slice(0, 1) } };

/** Two albums sit as halves. */
export const TwoAlbums: Story = { ...desktop, args: { albums: ALBUM_TILES.slice(0, 2) } };

/** Four albums: the prototype's mosaic, the fourth two columns wide. */
export const FourAlbums: Story = {
  ...desktop,
  args: { albums: [...ALBUM_TILES, PLACEHOLDER_ALBUM] },
};

/** Five albums: the fifth starts the single tiles. */
export const FiveAlbums: Story = {
  ...desktop,
  args: { albums: [...ALBUM_TILES, PLACEHOLDER_ALBUM, PLACEHOLDER_ALBUM] },
};

/** The port's densities: two across. */
export const GridTwo: Story = { ...desktop, args: { layout: 'grid', columns: 2 } };

/** Three across. */
export const GridThree: Story = { ...desktop, args: { layout: 'grid', columns: 3 } };

/** Four across. */
export const GridFour: Story = {
  ...desktop,
  args: { layout: 'grid', columns: 4, albums: [...ALBUM_TILES, PLACEHOLDER_ALBUM] },
};

/** `captions: hover`: the titles wait for the pointer or the keyboard. */
export const CaptionsOnHover: Story = { ...desktop, args: { captions: 'hover' } };

/** No album holds a photograph yet: the registry's Pending line. */
export const Pending: Story = { args: { albums: [] } };
