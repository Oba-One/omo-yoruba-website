import type { ComponentProps } from 'astro/types';
import { NEWSLETTER } from '../../fixtures/homepage';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import NewsletterBand from './NewsletterBand.astro';

type Args = StoryArgs<ComponentProps<typeof NewsletterBand>>;

const meta = {
  title: 'Bands/NewsletterBand',
  component: NewsletterBand,
  args: { ...NEWSLETTER, source: '/' },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The newsletter placed as a band before the footer: the title and blurb from the site settings on the indigo band with the drifting dot field, and the form in its band variant. The footer then leaves its own block out.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Success: Story = { args: { state: 'success', value: 'ade@example.org' } };

export const Pending: Story = { args: { title: undefined, blurb: undefined } };
