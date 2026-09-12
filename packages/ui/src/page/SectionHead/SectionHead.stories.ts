import type { ComponentProps } from 'astro/types';
import { type Meta, onDark, type StoryArgs, type StoryObj, TEST_STRING } from '../../storybook';
import SectionHead from './SectionHead.astro';

type Args = StoryArgs<ComponentProps<typeof SectionHead>>;

const meta = {
  title: 'Page/SectionHead',
  component: SectionHead,
  args: { kicker: { yo: 'Ohun tí a ń ṣe', en: 'What we do' }, title: 'Our programs' },
  parameters: {
    docs: {
      description: {
        component:
          'The head of a page section: the aṣọ òkè swatch and the Yoruba • English kicker, the heading, an optional intro and an optional quiet link on the right.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const WithLink: Story = { args: { link: { label: 'All programs', href: '/programs' } } };

export const WithIntro: Story = {
  args: {
    kicker: { yo: 'Àwọn ohùn wa', en: 'Our voices' },
    title: 'Member voices',
    intro: 'Families, elders, and vendors on what this community holds for them.',
  },
};

export const SingleKicker: Story = {
  args: { kicker: { en: 'Stay close' }, title: 'News & events' },
};

export const NoKicker: Story = { args: { kicker: undefined, title: 'Raise your hand' } };

/** The kicker test string at 12px. */
export const Diacritics: Story = { args: { kicker: { yo: TEST_STRING, en: 'Welcome' } } };

/** The heading still owed by the Studio, named by the registry. */
export const Pending: Story = { args: { title: undefined, pending: 'the heading' } };

export const OnDark: Story = { ...onDark };
