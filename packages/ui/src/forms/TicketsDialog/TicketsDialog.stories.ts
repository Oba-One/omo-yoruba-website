import type { ComponentProps } from 'astro/types';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import TicketsDialog from './TicketsDialog.astro';
import TicketsEmbedPlaceholder from './TicketsEmbedPlaceholder.astro';

type Args = StoryArgs<ComponentProps<typeof TicketsDialog>>;

const mobile = { globals: { viewport: { value: 'mobile', isRotated: false } } };

/** Zeffy's own address, standing in for the form's page. */
const ZEFFY_PAGE_STAND_IN = 'https://www.zeffy.com';

const meta = {
  title: 'Forms/TicketsDialog',
  component: TicketsDialog,
  args: {
    open: true,
    mode: 'embed',
    pageHref: ZEFFY_PAGE_STAND_IN,
    slots: { embed: { component: TicketsEmbedPlaceholder } },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The Gala's Get tickets buttons open this dialog around Zeffy's ticket form for the edition, in the shell the Give Dialog uses: the page hands the iframe over as a template, the dialog mounts it on first open, sizes it by Zeffy's own messages and falls back after eight seconds to the contact enquiry. Under the form a link opens Zeffy's own page for it in a new tab. The Gala page mounts the dialog only while the edition's ticket link is a Zeffy form, so it has no Pending state: any other link opens in a new tab.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The embed box, with the story's stand-in where the iframe renders on the site, and the link to Zeffy's page. */
export const Default: Story = {};

/** A Zeffy address that is not an embed address: the form without the link to its page. */
export const WithoutPageLink: Story = { args: { pageHref: null } };

/** The iframe did not load in time: the contact enquiry takes over. Served in this mode, the dialog keeps its fallback until Try again. */
export const Fallback: Story = { args: { mode: 'fallback' } };

/** Under 720px the dialog is the bottom sheet. */
export const BottomSheet: Story = { ...mobile };

/** Mounted closed, as every page mounts it. */
export const Closed: Story = { args: { open: false, slots: {} } };

/**
 * Keyboard: a Get tickets trigger opens the dialog and mounts the stand-in, Escape closes it and focus
 * returns; without an iframe the stand-in counts as loaded.
 */
export const OpensFromTrigger: Story = {
  args: { open: false, timeout: 300 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvasElement.querySelector<HTMLElement>('oy-zeffy-dialog');
    await waitFor(() => expect(root?.dataset.ready).toBe('true'), { timeout: 5000 });
    const trigger = document.createElement('a');
    trigger.href = ZEFFY_PAGE_STAND_IN;
    trigger.dataset.tickets = '';
    trigger.textContent = 'Tickets';
    canvasElement.prepend(trigger);
    await userEvent.click(trigger);
    const dialog = canvasElement.querySelector<HTMLDialogElement>('dialog#tickets');
    await expect(dialog?.open).toBe(true);
    await expect(canvas.getByRole('button', { name: 'Close' })).toHaveFocus();
    await waitFor(() => expect(root?.dataset.state).toBe('ready'));
    await expect(canvas.getByText(/Zeffy's ticket form renders in this box/)).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog?.open).toBe(false));
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/** With no template at all the timer ends in the fallback, which hands over to the contact enquiry. */
export const FallsBackWithoutEmbed: Story = {
  args: { open: false, timeout: 300, slots: {} },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvasElement.querySelector<HTMLElement>('oy-zeffy-dialog');
    await waitFor(() => expect(root?.dataset.ready).toBe('true'), { timeout: 5000 });
    const trigger = document.createElement('a');
    trigger.href = ZEFFY_PAGE_STAND_IN;
    trigger.dataset.tickets = '';
    trigger.textContent = 'Tickets';
    canvasElement.prepend(trigger);
    await userEvent.click(trigger);
    await waitFor(() => expect(root?.dataset.state).toBe('failed'), { timeout: 3000 });
    await expect(canvas.getByText('The ticket form did not load.')).toBeVisible();
    await expect(canvas.getByRole('link', { name: /Contact us/ })).toBeVisible();
  },
};
