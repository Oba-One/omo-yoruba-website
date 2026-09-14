import type { ComponentProps } from 'astro/types';
import { GALLERY_CREDITS } from '../../fixtures/gallery';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import GalleryCredits from './GalleryCredits.astro';

type Args = StoryArgs<ComponentProps<typeof GalleryCredits>>;

const meta = {
  title: 'Media/GalleryCredits',
  component: GalleryCredits,
  args: { credits: GALLERY_CREDITS },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Photography credit and permissions, the section the gallery and every album page close with: the heading and its lead, then how the site credits, the consent policy and where removal requests go, each the Studio\'s words or the registry\'s chip, and a quiet "Send a message" beside them.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The owner's policy and the general inbox in the placeholder form, as the rows read once the Studio holds them. */
export const Default: Story = {
  args: {
    credits: {
      ...GALLERY_CREDITS,
      rows: [
        {
          label: 'Credits',
          value: 'Given with each album, and with a photograph where it differs.',
        },
        {
          label: 'Consent policy',
          value: '[ How you ask permission, and how a photograph comes down ]',
        },
        { label: 'Removal requests', value: '[ The general inbox ]' },
      ],
    },
  },
};

/** Today: the policy and the inbox owed, each its registry chip. */
export const Pending: Story = {};
