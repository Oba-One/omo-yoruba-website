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
          'Date, kicker, title, summary. Read more appears only when the page supplies a link: until the News page exists the homepage links the page the post is tagged to, so nothing points at a post page that is not planned.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The Odunde 2026 recap without a link: a post tagged to no page. */
export const Default: Story = {};

/** As the homepage shows it: Read more opens the festival page the recap is tagged to. */
export const WithLink: Story = { args: { href: NEWS[0]?.href } };

export const WithKicker: Story = {
  args: { post: { ...NEWS[1], kicker: { yo: 'Ẹ̀kọ́ èdè', en: 'Lessons' } } as Args['post'] },
};

/** A post with only its title: nothing stands in for the date or the summary. */
export const TitleOnly: Story = { args: { post: { title: 'End-of-Year Gala' } } };
