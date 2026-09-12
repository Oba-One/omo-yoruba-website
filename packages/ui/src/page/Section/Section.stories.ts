import type { ComponentProps } from 'astro/types';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import SectionHead from '../SectionHead/SectionHead.astro';
import Section from './Section.astro';

type Args = StoryArgs<ComponentProps<typeof Section>>;

const head = {
  component: SectionHead,
  props: {
    kicker: { yo: 'Àwọn ohùn wa', en: 'Our voices' },
    title: 'Member voices',
    id: 'voices-h',
  },
};

const meta = {
  title: 'Page/Section',
  component: Section,
  args: { labelledby: 'voices-h', slots: { default: [head, '<p>The section body.</p>'] } },
  parameters: {
    docs: {
      description: {
        component:
          'A section at the content width with the section padding from the tokens, on white, the theme tint or paper, and the low-opacity batik wash behind the content. Texture, never costume.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Alt: Story = { args: { ground: 'alt' } };

export const Paper: Story = { args: { ground: 'paper' } };

export const Batik: Story = { args: { ground: 'paper', texture: 'batik' } };
