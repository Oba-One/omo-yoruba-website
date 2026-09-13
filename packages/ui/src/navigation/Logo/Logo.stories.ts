import type { ComponentProps } from 'astro/types';
import { type Meta, onDark, type StoryArgs, type StoryObj } from '../../storybook';
import Logo from './Logo.astro';
import { logoAssets } from './story-assets';

type Args = StoryArgs<ComponentProps<typeof Logo>>;

const meta = {
  title: 'Navigation/Logo',
  component: Logo,
  args: { variant: 'lockup', href: '/' },
  parameters: { staticBuildAssets: logoAssets },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The Ifẹ̀ head at 40px beside the two-line wordmark, as the nav shows it. */
export const Default: Story = {};

/** Under 1060px the second line hides; the toolbar viewport is locked to 375. */
export const Narrow: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };

/** The head alone; the image carries the full name for assistive technology. */
export const Mark: Story = { args: { variant: 'mark' } };

/** The head alone without a link, as a footer or a print piece might place it. */
export const MarkUnlinked: Story = { args: { variant: 'mark', href: undefined } };

/** The light lockup on a dark ground, as the footer shows it. */
export const OnDark: Story = { ...onDark, args: { variant: 'light', href: undefined } };
