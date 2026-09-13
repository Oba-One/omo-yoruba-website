import type { ComponentProps } from 'astro/types';
import Card from '../../cards/Card/Card.astro';
import ProgramCard from '../../cards/ProgramCard/ProgramCard.astro';
import { PROGRAMS } from '../../fixtures/homepage';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import CardGrid from './CardGrid.astro';

type Args = StoryArgs<ComponentProps<typeof CardGrid>>;

const card = (title: string) => ({
  component: Card,
  props: { title },
  slots: { default: '<p>One line under the title.</p>' },
});

const meta = {
  title: 'Page/CardGrid',
  component: CardGrid,
  args: { columns: 3, slots: { default: [card('One'), card('Two'), card('Three')] } },
  parameters: {
    docs: {
      description: {
        component:
          'One column of cards as rows, or two, three, four or five across at the content width. Three and two collapse to one column under 860px; four goes to two under 1000px and to one under 600px; five goes to two under 1000px.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Three: Story = {};

export const Two: Story = { args: { columns: 2, slots: { default: [card('One'), card('Two')] } } };

/** One column, 14px apart: cards laid out as rows (Get Involved's rows option, Donate's one door). */
export const One: Story = { args: { columns: 1, slots: { default: [card('One'), card('Two')] } } };

/** Five across, 16px apart: Our Story's staff and volunteers as compact cards; two across under 1000px. */
export const Five: Story = {
  args: {
    columns: 5,
    slots: { default: [card('One'), card('Two'), card('Three'), card('Four'), card('Five')] },
  },
};

export const Four: Story = {
  args: { columns: 4, slots: { default: [card('One'), card('Two'), card('Three'), card('Four')] } },
};

const programs = (count: number) =>
  PROGRAMS.slice(0, count).map((program) => ({ component: ProgramCard, props: { program } }));

/** The program cards four across: the Programs page option. */
export const ProgramsFour: Story = { args: { columns: 4, slots: { default: programs(4) } } };

/** Three across, as the homepage shows them (and a Programs page option). */
export const ProgramsThree: Story = { args: { columns: 3, slots: { default: programs(3) } } };

/** Pairs. */
export const ProgramsPairs: Story = { args: { columns: 2, slots: { default: programs(4) } } };

/** Cards whose content the Studio still owes. */
export const Pending: Story = {
  args: {
    slots: {
      default: [1, 2, 3].map(() => ({
        component: Card,
        props: {},
        slots: { default: '<span class="oy-pend">Pending: the card</span>' },
      })),
    },
  },
};

/** The Programs hub's line under its cards, in the muted small type the prototype sets. */
export const WithNote: Story = {
  args: {
    columns: 4,
    note: 'Each card says who it is for and when it runs, so you can find the right one at a glance.',
    slots: { default: programs(4) },
  },
};
