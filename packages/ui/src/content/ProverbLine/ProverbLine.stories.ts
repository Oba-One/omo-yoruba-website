import type { ComponentProps } from 'astro/types';
import { PROVERB } from '../../fixtures/homepage';
import { type Meta, onDark, type StoryArgs, type StoryObj } from '../../storybook';
import ProverbLine from './ProverbLine.astro';

type Args = StoryArgs<ComponentProps<typeof ProverbLine>>;

const meta = {
  title: 'Content/ProverbLine',
  component: ProverbLine,
  args: PROVERB,
  parameters: {
    docs: {
      description: {
        component:
          'The sun crest and a proverb: Yoruba in the display face, its English sense beside it. The ethos line of the site.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const YorubaOnly: Story = { args: { en: undefined } };

export const OnDark: Story = { ...onDark };
