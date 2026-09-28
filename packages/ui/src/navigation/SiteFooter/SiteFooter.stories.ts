import type { ComponentProps } from 'astro/types';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { logoAssets } from '../Logo/story-assets';
import SiteFooter from './SiteFooter.astro';

type Args = StoryArgs<ComponentProps<typeof SiteFooter>>;

// The seed's site settings: the newsletter copy the prototype carries, nothing else confirmed.
const seeded = {
  orgName: 'Omo Yorùbá of Southern California',
  newsletterTitle: 'Festival news and updates, in your inbox',
  newsletterBlurb: 'Once or twice a month. Save-the-dates, program news, and ways to help.',
};

const meta = {
  title: 'Navigation/SiteFooter',
  component: SiteFooter,
  args: { settings: seeded, source: '/' },
  parameters: {
    staticBuildAssets: logoAssets,
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The last thing on every page: the trust line, the ways to reach a person, the socials, the newsletter, and the two link columns. Every fact the owner still owes renders as a Pending chip; the EIN reads XX-XXXXXXX until the settings hold it.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The development dataset as seeded: the newsletter copy, every other fact Pending. */
export const Default: Story = {};

/** Nothing in the settings at all: every chip visible. */
export const Pending: Story = { args: { settings: {} } };

/** The shape once the owner fills the settings (wayfinder ticket 02); the values here are the shape, not facts. */
export const Filled: Story = {
  args: {
    settings: {
      ...seeded,
      ein: '12-3456789',
      address: 'Omo Yorùbá of Southern California\nPO Box 000\nLos Angeles, CA 90000',
      phone: '(000) 000-0000',
      generalEmail: 'hello@example.org',
      socials: [
        { network: 'instagram', url: 'https://instagram.com/example' },
        { network: 'facebook', url: 'https://facebook.com/example' },
        { network: 'linkedin', url: 'https://linkedin.com/company/example' },
        { network: 'youtube', url: 'https://youtube.com/@example' },
      ],
    },
  },
};

/**
 * Social values the Studio's rule would refuse but the API accepts: a script URL, an address without its
 * scheme and a network the footer draws no mark for. Only the YouTube link is fit to render.
 */
export const UnsafeSocials: Story = {
  args: {
    settings: {
      ...seeded,
      socials: [
        { network: 'instagram', url: 'javascript:alert(1)' },
        { network: 'facebook', url: 'facebook.com/example' },
        { network: 'tiktok' as 'youtube', url: 'https://tiktok.com/@example' },
        { network: 'youtube', url: 'https://youtube.com/@example' },
      ],
    },
  },
};

export const NewsletterBusy: Story = {
  args: { newsletterState: 'busy', newsletterValue: 'ade@example.org' },
};

export const NewsletterSuccess: Story = {
  args: { newsletterState: 'success', newsletterValue: 'ade@example.org' },
};

export const NewsletterError: Story = {
  args: { newsletterState: 'error', newsletterValue: 'ade@example' },
};

export const Narrow: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
