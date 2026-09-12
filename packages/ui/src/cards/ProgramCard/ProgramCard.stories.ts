import type { ComponentProps } from 'astro/types';
import { PROGRAMS } from '../../fixtures/homepage';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import ProgramCard from './ProgramCard.astro';

type Args = StoryArgs<ComponentProps<typeof ProgramCard>>;

const meta = {
  title: 'Cards/ProgramCard',
  component: ProgramCard,
  args: { program: PROGRAMS[0] as ComponentProps<typeof ProgramCard>['program'] },
  decorators: [wrap('sb-oy-narrow')],
  parameters: {
    docs: {
      description: {
        component:
          'Photo or placeholder, name, blurb, one quiet action. Four across, three, or pairs through the CardGrid. The highlighted card moves first with the gold ring; the Collective link reads green.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Yoruba Language Lessons, with its photograph and action from the Studio. */
export const Default: Story = {};

/** The Collective: no photograph yet (the placeholder names it), green link. */
export const Collective: Story = { args: { program: PROGRAMS[1] as Args['program'] } };

/** Cultural Exchange: the blurb is Pending and the action falls back to the hub. */
export const Pending: Story = { args: { program: PROGRAMS[3] as Args['program'] } };

export const Hover: Story = { parameters: { pseudo: { hover: '.oy-card' } } };
