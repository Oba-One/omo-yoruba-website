import type { ComponentProps } from 'astro/types';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
// The prerendered Logo resolves its PNGs only when they reach the client bundle (Logo.stories.ts).
import lockupLightUrl from '../Logo/logo-lockup-light.png?url';
import markUrl from '../Logo/logo-mark.png?url';
import SiteNav from './SiteNav.astro';

type Args = StoryArgs<ComponentProps<typeof SiteNav>>;

const mobile = { globals: { viewport: { value: 'mobile', isRotated: false } } };
const desktop = { globals: { viewport: { value: 'desktop', isRotated: false } } };

const meta = {
  title: 'Navigation/SiteNav',
  component: SiteNav,
  args: { path: '/' },
  parameters: {
    staticBuildAssets: [markUrl, lockupLightUrl],
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The sticky bar on every page. Events is a dropdown, the current page reads terracotta with the gold underline, Donate opens the Give Dialog, and under 880px the burger opens the mobile menu as a native dialog. Nothing opens on load.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The home page: nothing is current. */
export const Default: Story = {};

/** On the festival page the Events trigger is current and the dropdown link carries aria-current. */
export const OnOdunde: Story = { args: { path: '/odunde' } };

export const OnGala: Story = { args: { path: '/gala' } };

export const OnPrograms: Story = { args: { path: '/programs' } };

/** The Lessons page keeps Programs current (the ported CSS key is "school"). */
export const OnLessons: Story = { args: { path: '/programs/yoruba-lessons' } };

export const OnGetInvolved: Story = { args: { path: '/get-involved' } };

export const OnImpact: Story = { args: { path: '/impact' } };

export const OnOurStory: Story = { args: { path: '/our-story' } };

/** The dropdown as hover and focus within show it. */
export const DropdownOpen: Story = {
  ...desktop,
  parameters: { pseudo: { focusWithin: '.oy-nav-drop' } },
};

/** Under 1060px the second wordmark line hides; under 880px the links give way to the burger. */
export const Narrow: Story = { ...mobile };

/** The mobile menu, rendered open for the snapshot only; the site never opens it on load. */
export const MobileMenuOpen: Story = { ...mobile, args: { path: '/odunde', menuOpen: true } };

/** Keyboard: the burger opens the menu, Escape closes it and focus returns to the burger. */
export const MobileMenuKeyboard: Story = {
  ...mobile,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvasElement.querySelector<HTMLElement>('oy-site-nav');
    await waitFor(() => expect(root?.dataset.ready).toBe('true'), { timeout: 5000 });
    const burger = canvas.getByRole('button', { name: 'Open menu' });
    await userEvent.click(burger);
    const menu = canvasElement.querySelector<HTMLDialogElement>('dialog.oy-nav-menu');
    await expect(menu?.open).toBe(true);
    await expect(burger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.tab();
    await expect(menu?.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{Escape}');
    // The dialog's close event is a queued task, so what it does is awaited.
    await waitFor(() => expect(menu?.open).toBe(false));
    await waitFor(() => expect(burger).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(burger).toHaveFocus());
  },
};

/** Keyboard: the Events trigger opens on focus and click, Escape closes it. */
export const DropdownKeyboard: Story = {
  ...desktop,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvasElement.querySelector<HTMLElement>('oy-site-nav');
    await waitFor(() => expect(root?.dataset.ready).toBe('true'), { timeout: 5000 });
    const trigger = canvas.getByRole('button', { name: 'Events' });
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getByRole('link', { name: 'Ọdúndé Festival' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
  },
};
