import type { ComponentProps } from 'astro/types';
import {
  GALA_ALBUM_CREDIT,
  LINKED_ALBUM_CREDIT,
  ODUNDE_ALBUM_CREDIT,
} from '../../fixtures/event-pages';
import { type Meta, onDark, type StoryArgs, type StoryObj } from '../../storybook';
import CreditLine from './CreditLine.astro';

type Args = StoryArgs<ComponentProps<typeof CreditLine>>;

const meta = {
  title: 'Media/CreditLine',
  component: CreditLine,
  args: { ...ODUNDE_ALBUM_CREDIT },
  parameters: {
    docs: {
      description: {
        component:
          "An album's credit: the name as the Studio holds it, with the registry's chip until the credit is confirmed, linking to the photographer's page when the Studio holds one. The label says what the credit is for: Photographs, or another kind of work such as Video under a video's tile.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The Odunde 2026 album as the seed writes it: the register's name, not yet confirmed. */
export const Unconfirmed: Story = {};

export const Gala: Story = { args: { ...GALA_ALBUM_CREDIT } };

/** Confirmed in the Studio: the name alone. */
export const Confirmed: Story = { args: { confirmed: true } };

/** No credit held, not confirmed. */
export const Pending: Story = { args: { credit: null } };

/** Confirmed with no photographer named: no line. */
export const ConfirmedWithoutName: Story = { args: { credit: null, confirmed: true } };

/** Inside a line of text, as the Lightbox sets it after the caption: a span in the text's size and colour. */
export const Inline: Story = { args: { as: 'span' } };

/** The inline form in the dark scope, as the Lightbox's bar shows it: the chip in its on-dark colours. */
export const OnDark: Story = { ...onDark, args: { as: 'span' } };

/** The credit the three albums hold since 28 September 2026: confirmed, the name a link to the photographer's page. */
export const Linked: Story = { args: { ...LINKED_ALBUM_CREDIT } };

/** The linked name inline in the dark scope, as the Lightbox's bar shows it: the link in the scope's colours. */
export const LinkedOnDark: Story = { ...onDark, args: { ...LINKED_ALBUM_CREDIT, as: 'span' } };

/** An address the Studio's rule refuses but the API accepts: the name shows, with no link. */
export const UnsafeLink: Story = {
  args: { ...LINKED_ALBUM_CREDIT, href: 'javascript:alert(1)' },
};

/** Another kind of work: a video's maker, inline in the muted line under a `VideoGrid` tile (ADR 0051). */
export const Video: Story = {
  args: { ...LINKED_ALBUM_CREDIT, label: 'Video', as: 'span' },
};
