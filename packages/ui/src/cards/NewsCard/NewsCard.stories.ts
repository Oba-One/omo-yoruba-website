import type { ComponentProps } from 'astro/types';
import { NEWS } from '../../fixtures/homepage';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import NewsCard from './NewsCard.astro';

type Args = StoryArgs<ComponentProps<typeof NewsCard>>;

const meta = {
  title: 'Cards/NewsCard',
  component: NewsCard,
  args: { post: NEWS[0] as Args['post'] },
  decorators: [wrap('sb-oy-narrow')],
  parameters: {
    docs: {
      description: {
        component:
          'Date, kicker, title, summary. Read more appears only when the page supplies a link, so nothing points at the News page before it exists.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The Odunde 2026 recap, as the homepage shows it: no link yet. */
export const Default: Story = {};

export const WithLink: Story = { args: { href: '/news/odunde-2026-recap' } };

export const WithKicker: Story = {
  args: { post: { ...NEWS[1], kicker: { yo: 'Ẹ̀kọ́ èdè', en: 'Lessons' } } as Args['post'] },
};

/** A post with only its title: the date and summary are Pending. */
export const Pending: Story = { args: { post: { title: 'End-of-Year Gala' } } };
