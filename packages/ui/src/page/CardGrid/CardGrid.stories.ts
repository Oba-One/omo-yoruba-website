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
          'Two, three or four cards across at the content width. Three and two collapse to one column under 860px; four goes to two under 1000px and to one under 600px.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Three: Story = {};

export const Two: Story = { args: { columns: 2, slots: { default: [card('One'), card('Two')] } } };

export const Four: Story = {
  args: { columns: 4, slots: { default: [card('One'), card('Two'), card('Three'), card('Four')] } },
};

const programs = (count: number) =>
  PROGRAMS.slice(0, count).map((program) => ({ component: ProgramCard, props: { program } }));

/** The program cards four across, as the homepage shows them. */
export const ProgramsFour: Story = { args: { columns: 4, slots: { default: programs(4) } } };

/** Three across: the Programs page option. */
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
