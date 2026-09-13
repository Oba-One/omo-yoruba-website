import type { ComponentProps } from 'astro/types';
import { GALA_ALBUM_CREDIT, ODUNDE_ALBUM_CREDIT } from '../../fixtures/event-pages';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
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
          "An album's photograph credit: the name as the Studio holds it, with the registry's chip until the credit is confirmed.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The Odunde 2026 album as the dataset holds it: the name, not yet confirmed. */
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
