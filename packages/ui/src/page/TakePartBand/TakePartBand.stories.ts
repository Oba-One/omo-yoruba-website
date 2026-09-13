import type { ComponentProps } from 'astro/types';
import {
  FESTIVAL_TAKE_PART,
  GALA_TAKE_PART,
  VENDOR_TERMS_PENDING,
} from '../../fixtures/event-pages';
import {
  COLLECTIVE_TAKE_PART,
  LESSONS_TAKE_PART,
  PROGRAMS_TAKE_PART,
} from '../../fixtures/program-pages';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import TakePartBand from './TakePartBand.astro';

type Args = StoryArgs<ComponentProps<typeof TakePartBand>>;

const ROW_PENDING = 'a way in, its title or its button label';

const meta = {
  title: 'Page/TakePartBand',
  component: TakePartBand,
  args: {
    rows: FESTIVAL_TAKE_PART,
    labels: 'column',
    vendorTerms: null,
    vendorTermsPending: VENDOR_TERMS_PENDING,
    pending: 'the ways in',
    rowPending: ROW_PENDING,
  },
  parameters: {
    docs: {
      description: {
        component:
          "The closing take-part band's rows from the page singleton: the accent and what the button opens follow each way in (vendor, sponsor, performer, volunteer, table, enrol and member open their form, give opens the Give Dialog, updates goes to the newsletter form on the page); the chip is the way in's unless the row names its own; the title, the line and the button label are the row's own. The first working row carries the one gold action; the give and updates rows' are quiet. The label style is the page's `labels` option, and `lead` moves a way in to the top in the markup. On Odunde the vendor row adds the edition's vendor terms, Pending until the Studio holds them.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Odunde's four rows as the seed writes them, the vendor row first and its terms Pending. */
export const Default: Story = {};

/** Odunde with the `takepart` option on sponsor: the sponsor row moves up in the markup and takes the gold. */
export const SponsorFirst: Story = { args: { lead: 'sponsor' } };

/** The Gala's four rows: sponsor, table, volunteer, and the give row with its quiet Donate. */
export const Gala: Story = { args: { rows: GALA_TAKE_PART, vendorTerms: undefined } };

export const Column: Story = {};

export const NoLabels: Story = { args: { labels: 'none' } };

export const Kicker: Story = { args: { labels: 'kicker' } };

/** The kicker style under 720px: the button drops under the copy at full width. */
export const KickerNarrow: Story = {
  args: { labels: 'kicker' },
  globals: { viewport: { value: 'mobile', isRotated: false } },
};

export const TwoRows: Story = { args: { rows: FESTIVAL_TAKE_PART.slice(0, 2) } };

export const ThreeRows: Story = {
  args: { rows: GALA_TAKE_PART.slice(1), vendorTerms: undefined },
};

/** The Programs page's rows: enrol opens the enrol form and takes the gold; the volunteer row's chip is its own. */
export const Programs: Story = { args: { rows: PROGRAMS_TAKE_PART, vendorTerms: undefined } };

/** The Lessons page's rows: volunteer first with the gold, member on the performer accent, give without a line. */
export const Lessons: Story = { args: { rows: LESSONS_TAKE_PART, vendorTerms: undefined } };

/** The Collective's rows: "Partner" and "Skills" name sponsor and volunteer rows; Updates goes to the newsletter form, quiet. */
export const Collective: Story = { args: { rows: COLLECTIVE_TAKE_PART, vendorTerms: undefined } };

/** A row the Studio has not finished: the registry's chip where its title and its button go. */
export const RowPending: Story = {
  args: {
    rows: [
      { _key: 'way-1', way: 'sponsor', line: FESTIVAL_TAKE_PART[1]?.line },
      ...FESTIVAL_TAKE_PART.slice(2),
    ],
  },
};

/** No rows in the Studio: the section shows the registry's Pending line. */
export const Pending: Story = { args: { rows: [] } };
