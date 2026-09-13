import type { ComponentProps } from 'astro/types';
import { ZONES } from '../../fixtures/event-pages';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import ZoneCard from './ZoneCard.astro';

type Args = StoryArgs<ComponentProps<typeof ZoneCard>>;

const market = ZONES[0] as (typeof ZONES)[number];

const meta = {
  title: 'Cards/ZoneCard',
  component: ZoneCard,
  args: { zone: { ...market, image: market.image.src } },
  decorators: [wrap('sb-oy-narrow')],
  parameters: {
    docs: {
      description: {
        component:
          'A festival zone: the photograph, the translation, the Yoruba name with its marks and one line. The seeded zones carry no line yet, so it shows the registry chip. A zone the festival is still owed is a placeholder card.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Ọjà Balógun as the seed holds it: the name, the translation, the photograph, the line owed. */
export const Default: Story = {};

/** No photograph yet: the àdìrẹ placeholder names it. */
export const NoPhoto: Story = { args: { zone: { ...market, image: undefined } } };

/** A zone the festival is owed. */
export const Pending: Story = { args: { zone: undefined, pending: 'the unnamed zones' } };

/** Hover: the border deepens and the name warms; the photograph holds still. */
export const Hover: Story = { parameters: { pseudo: { hover: '.oy-zone' } } };
