import type { ComponentProps } from 'astro/types';
import { FESTIVAL_HEADER, FESTIVAL_META } from '../../fixtures/event-pages';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import PageHeader from './PageHeader.astro';

type Args = StoryArgs<ComponentProps<typeof PageHeader>>;

const meta = {
  title: 'Page/PageHeader',
  component: PageHeader,
  args: {
    variant: 'photo',
    kicker: FESTIVAL_HEADER.kicker,
    title: FESTIVAL_HEADER.title,
    line: FESTIVAL_HEADER.line,
    image: FESTIVAL_HEADER.image.src,
    actions: FESTIVAL_HEADER.actions,
    facts: FESTIVAL_META,
    dots: true,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The top of an inner page: kicker, one H1, the line, up to two actions with the first gold, and the facts under the buttons with a Pending chip for each missing one. Photo band or slim. The seeded Odunde 2027 carries no date, hours or cost yet.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The photo band as the festival page opens: the procession, the scrim, the dot field. */
export const Default: Story = {};

export const Photo: Story = {};

/** The same header on paper, without the photograph. */
export const Slim: Story = { args: { variant: 'slim' } };

/** A fact the Studio holds reads as text between the chips. */
export const MixedFacts: Story = {
  args: { facts: [{ text: 'Leimert Park' }, { pending: 'the date' }, { pending: 'the cost' }] },
};

/** One action only: the gold one. */
export const OneAction: Story = { args: { actions: [FESTIVAL_HEADER.actions[0] ?? null] } };

/** No photograph yet: the band keeps its surface and names the photograph it waits for. */
export const PendingPhoto: Story = { args: { image: undefined } };

/** No heading: the H1 carries the chip, so the page keeps its one H1. */
export const PendingHeading: Story = {
  args: { title: undefined, titlePending: 'the page heading', facts: undefined },
};

/** Motion off: the photograph holds still. */
export const Still: Story = { args: { motion: false } };
