import type { ComponentProps } from 'astro/types';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import PartnerCards from './PartnerCards.astro';

type Args = StoryArgs<ComponentProps<typeof PartnerCards>>;

const LOGO = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='280' height='64'><text x='140' y='40' font-family='sans-serif' font-size='20' text-anchor='middle'>[ Partner logo ]</text></svg>",
)}`;

// The three the Studio lists for Odunde, by name, kind and link; the lines are the bracketed placeholder.
const ODUNDE = [
  {
    _id: 'partner-association-of-moremi-women',
    name: 'Association of Moremi Women',
    kind: 'partner',
  },
  { _id: 'partner-stemnetics', name: 'STEMnetics', kind: 'partner' },
  { _id: 'partner-wefa', name: 'WEFA', kind: 'sponsor', url: 'https://wefa.world' },
];

const meta = {
  title: 'Content/PartnerCards',
  component: PartnerCards,
  args: { partners: ODUNDE },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "The partners and sponsors of a page as cards: what each is to us as the kicker, its name, one line when the Studio holds one, and a quiet link worded by its site's address. Three across, a short last row in the middle. No partners shows the registry's Pending line.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Odunde's three: two partners without a site in the Studio, and a sponsor with one. */
export const Default: Story = {};

/** Each with its line: what the partner does with us, in the Studio's words. */
export const WithLines: Story = {
  args: {
    partners: ODUNDE.map((partner) => ({
      ...partner,
      line: '[ One line on what they do with us ]',
    })),
  },
};

/** Seven, as Impact lists them: two full rows and the last card in the middle. */
export const Seven: Story = {
  args: {
    partners: [
      ...ODUNDE,
      { _id: 'p4', name: '[ Sponsor name ]', kind: 'sponsor' },
      { _id: 'p5', name: '[ Sponsor name ]', kind: 'sponsor' },
      { _id: 'p6', name: '[ Funder name ]', kind: 'funder' },
      { _id: 'p7', name: '[ Partner name ]' },
    ],
  },
};

/** A logo leads its card; a link that is not a web address (any scheme but http or https) is left out. */
export const Logos: Story = {
  args: {
    partners: [
      {
        _id: 'p1',
        name: '[ Partner name ]',
        kind: 'partner',
        logo: { src: LOGO, width: 280, height: 64 },
      },
      { _id: 'p2', name: '[ Sponsor name ]', kind: 'sponsor', url: 'javascript:alert(1)' },
      { _id: 'p3', name: '[ Funder name ]', kind: 'funder', url: 'mailto://example.org' },
    ],
  },
};

/** No partners in the Studio. */
export const Pending: Story = { args: { partners: [] } };
