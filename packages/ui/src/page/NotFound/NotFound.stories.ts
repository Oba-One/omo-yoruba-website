import type { ComponentProps } from 'astro/types';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import NotFound from './NotFound.astro';

type Args = StoryArgs<ComponentProps<typeof NotFound>>;

const meta = {
  title: 'Page/NotFound',
  component: NotFound,
  args: {
    kicker: { en: 'Page not found' },
    title: 'This page is not here',
    line: 'The address may be old or mistyped. These three doors lead back into the site.',
    doors: [
      { label: 'Go to the homepage', href: '/' },
      { label: 'Get involved', href: '/get-involved' },
      { label: 'See our programs', href: '/programs' },
    ],
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The page for an address the site does not have (ROUTES section 1): an indigo band with the page's one H1, a line and three doors home, the first in gold and the others outlined. The site renders it for any unknown address and for an album the gallery does not hold.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** Without a kicker: the heading leads. */
export const NoKicker: Story = { args: { kicker: undefined } };
