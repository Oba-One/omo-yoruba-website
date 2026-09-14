import type { ComponentProps } from 'astro/types';
import { GALA_ALBUM, GALLERY_PENDING } from '../../fixtures/gallery';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import AlbumIntro from './AlbumIntro.astro';

type Args = StoryArgs<ComponentProps<typeof AlbumIntro>>;

const meta = {
  title: 'Media/AlbumIntro',
  component: AlbumIntro,
  decorators: [wrap('oy-wrap')],
  args: {
    links: [{ label: 'All albums', href: '/gallery' }, GALA_ALBUM.edition],
    credit: GALA_ALBUM.credit,
    confirmed: GALA_ALBUM.confirmed,
    pending: GALLERY_PENDING.credit,
  },
  parameters: {
    docs: {
      description: {
        component:
          "What an album page says before its photographs: the way back to the gallery and to the edition's page, the photo credit with its chip until confirmed, and the album's consent note when it has one.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** End-of-Year Gala 2025: its edition's page, the credit unconfirmed, no consent note. */
export const Default: Story = {};

/** An album with no edition, as the summer camp: the gallery alone. */
export const WithoutEdition: Story = {
  args: { links: [{ label: 'All albums', href: '/gallery' }] },
};

/** A confirmed credit, and a consent note in the placeholder form for the owner's words. */
export const ConfirmedWithNote: Story = {
  args: { confirmed: true, consentNote: '[ What this album says about faces and permission ]' },
};

/** No album could be read: no credit line. */
export const Pending: Story = { args: { showCredit: false, credit: undefined } };
