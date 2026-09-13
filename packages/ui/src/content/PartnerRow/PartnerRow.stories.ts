import type { ComponentProps } from 'astro/types';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import PartnerRow from './PartnerRow.astro';

type Args = StoryArgs<ComponentProps<typeof PartnerRow>>;

// The development dataset holds no partners: every name and logo here is the bracketed placeholder.
const LOGO = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='280' height='64'><text x='140' y='40' font-family='sans-serif' font-size='20' text-anchor='middle'>[ Partner logo ]</text></svg>",
)}`;

const meta = {
  title: 'Content/PartnerRow',
  component: PartnerRow,
  args: {
    partners: [
      { _id: 'p1', name: '[ Partner name ]' },
      { _id: 'p2', name: '[ Funder name ]' },
      { _id: 'p3', name: '[ Sponsor name ]' },
    ],
  },
  parameters: {
    docs: {
      description: {
        component:
          "The partners and sponsors of a page: a text chip per name, or the logo when the Studio holds one, linked to the partner's site when it has one. No partners shows the registry's Pending line.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Chips: Story = {};

/** A partner with a site: the chip is a link and its border deepens on hover. */
export const Linked: Story = {
  args: {
    partners: [
      { _id: 'p1', name: '[ Partner name ]', url: 'https://example.org' },
      { _id: 'p2', name: '[ Funder name ]' },
    ],
  },
};

/** A partner with a logo: the logo stands in for the name, which stays its alt text. */
export const Logos: Story = {
  args: {
    partners: [
      { _id: 'p1', name: '[ Partner name ]', logo: { src: LOGO, width: 280, height: 64 } },
      { _id: 'p2', name: '[ Funder name ]' },
    ],
  },
};

/** No partners in the Studio. */
export const Pending: Story = { args: { partners: [] } };
