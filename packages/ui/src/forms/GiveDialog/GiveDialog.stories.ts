import type { ComponentProps } from 'astro/types';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import GiveDialog from './GiveDialog.astro';
import GiveEmbedPlaceholder from './GiveEmbedPlaceholder.astro';

type Args = StoryArgs<ComponentProps<typeof GiveDialog>>;

const mobile = { globals: { viewport: { value: 'mobile', isRotated: false } } };

const meta = {
  title: 'Forms/GiveDialog',
  component: GiveDialog,
  args: { open: true, mode: 'embed', slots: { embed: { component: GiveEmbedPlaceholder } } },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Every Donate trigger opens this dialog around the Zeffy embed. The site hands the iframe over as a template from a server island; the dialog mounts it on first open and falls back after four seconds to the mailing address and the contact enquiry. While the settings hold no Zeffy URL the island answers Pending.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The embed box, with the story's stand-in where the iframe renders on the site. */
export const Default: Story = {};

/** The iframe did not load in time: the check line and the contact enquiry, address Pending. */
export const Fallback: Story = { args: { mode: 'fallback' } };

/** The fallback once the settings hold the address (the shape, not a fact). */
export const FallbackWithAddress: Story = {
  args: {
    mode: 'fallback',
    orgName: 'Omo Yorùbá of Southern California',
    address: 'PO Box 000\nLos Angeles, CA 90000',
    ein: '12-3456789',
  },
};

/** The island's answer while the Zeffy URL is empty: no Try again, the Pending chip in the check line. */
export const Pending: Story = { args: { mode: 'pending', slots: {} } };

/** Under 720px the dialog is the bottom sheet. */
export const BottomSheet: Story = { ...mobile };

/** Mounted closed, as every page mounts it. */
export const Closed: Story = { args: { open: false, slots: {} } };

/**
 * Keyboard: a Donate trigger opens the dialog and mounts the stand-in, Escape closes it and
 * focus returns; without an iframe the stand-in counts as loaded.
 */
export const OpensFromTrigger: Story = {
  args: { open: false, timeout: 300 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvasElement.querySelector<HTMLElement>('oy-give-dialog');
    await waitFor(() => expect(root?.dataset.ready).toBe('true'), { timeout: 5000 });
    const trigger = document.createElement('a');
    trigger.href = '/donate#give';
    trigger.dataset.give = '';
    trigger.textContent = 'Donate';
    canvasElement.prepend(trigger);
    await userEvent.click(trigger);
    const dialog = canvasElement.querySelector<HTMLDialogElement>('dialog#give');
    await expect(dialog?.open).toBe(true);
    await expect(canvas.getByRole('button', { name: 'Close' })).toHaveFocus();
    await waitFor(() => expect(root?.dataset.state).toBe('ready'));
    await expect(canvas.getByText(/Zeffy's embedded form renders in this box/)).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog?.open).toBe(false));
    await expect(trigger).toHaveFocus();
  },
};

/** With no template at all the timer ends in the fallback and announces the failure. */
export const FallsBackWithoutEmbed: Story = {
  args: { open: false, timeout: 300, slots: {} },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvasElement.querySelector<HTMLElement>('oy-give-dialog');
    await waitFor(() => expect(root?.dataset.ready).toBe('true'), { timeout: 5000 });
    const trigger = document.createElement('a');
    trigger.href = '/donate#give';
    trigger.dataset.give = '';
    trigger.textContent = 'Donate';
    canvasElement.prepend(trigger);
    await userEvent.click(trigger);
    await waitFor(() => expect(root?.dataset.state).toBe('failed'), { timeout: 3000 });
    await expect(canvas.getByText('The giving form did not load.')).toBeVisible();
    await expect(canvas.getByRole('link', { name: /Contact us/ })).toBeVisible();
  },
};
