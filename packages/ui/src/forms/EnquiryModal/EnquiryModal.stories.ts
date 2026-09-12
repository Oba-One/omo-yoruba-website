import type { ComponentProps } from 'astro/types';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import EnquiryModal from './EnquiryModal.astro';

type Args = StoryArgs<ComponentProps<typeof EnquiryModal>>;

const mobile = { globals: { viewport: { value: 'mobile', isRotated: false } } };

const meta = {
  title: 'Forms/EnquiryModal',
  component: EnquiryModal,
  args: { open: true, kind: 'sponsor', source: '/get-involved' },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'One shell, eight field sets from enquiry-kinds.ts, five states. A native dialog on desktop, a bottom sheet under 720px. The success copy names the routing contact from the site settings and the role when the entry is empty; the human fallback names the general inbox and is Pending until the settings hold it.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Sponsor, empty. */
export const Default: Story = {};

export const Performer: Story = { args: { kind: 'performer' } };
export const Table: Story = { args: { kind: 'table' } };
export const Member: Story = { args: { kind: 'member' } };
export const Volunteer: Story = { args: { kind: 'volunteer' } };
export const Enrol: Story = { args: { kind: 'enrol' } };
export const Vendor: Story = { args: { kind: 'vendor' } };
export const Contact: Story = { args: { kind: 'contact' } };

/** Filled, ready to send. The values are the shape of a submission, not a person. */
export const Filled: Story = {
  args: {
    kind: 'vendor',
    state: 'filled',
    values: {
      biz: 'Ọjà Balógun Textiles',
      who: 'A. Example',
      mail: 'stall@example.org',
      cat: 'Cloth and clothing',
      size: 'Double booth',
      power: 'Yes',
    },
  },
};

/** Sending: the submit reads Sending... and cannot be pressed again. */
export const Submitting: Story = {
  args: {
    kind: 'contact',
    state: 'submitting',
    values: { name: 'A. Example', mail: 'a@example.org', message: 'Hello' },
  },
};

/** The success block replaces the fields; with an empty routing contact the copy names the role. */
export const Success: Story = { args: { kind: 'member', state: 'success' } };

/** The summary at the top, each field named, nothing cleared. */
export const WithErrors: Story = {
  args: {
    kind: 'member',
    state: 'error',
    values: { name: '', mail: 'ade@example', city: 'Inglewood' },
    summary:
      'We still need your full name, an email address we can reach you at. Nothing you typed has been cleared.',
    errors: {
      name: 'We still need your full name.',
      mail: 'That email address does not look right. Check it and send again.',
    },
  },
};

/** The site settings carry the general inbox: the human fallback names it, so does the vendor foot. */
export const WithSiteContact: Story = {
  args: { kind: 'vendor', site: { email: 'hello@example.org', phone: '(000) 000-0000' } },
};

/** Under 720px the dialog becomes the bottom sheet with the grab handle look. */
export const BottomSheet: Story = { ...mobile, args: { kind: 'enrol' } };

/** Mounted closed, as every page mounts it. */
export const Closed: Story = { args: { open: false, kind: undefined } };

/**
 * Keyboard: a trigger opens the modal for its kind with focus on the first field; an empty submit
 * shows the summary and the field sentences without a request and keeps a typed value; Escape
 * closes and focus returns to the trigger.
 */
export const OpensFromTrigger: Story = {
  args: { open: false, kind: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvasElement.querySelector<HTMLElement>('oy-enquiry-modal');
    await waitFor(() => expect(root?.dataset.ready).toBe('true'), { timeout: 5000 });
    const trigger = document.createElement('a');
    trigger.href = '?enquiry=vendor#enquiry';
    trigger.dataset.enquiry = 'vendor';
    trigger.textContent = 'Apply for a booth';
    canvasElement.prepend(trigger);
    await userEvent.click(trigger);
    const dialog = canvasElement.querySelector<HTMLDialogElement>('dialog#enquiry');
    await expect(dialog?.open).toBe(true);
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Apply for a booth at Ọjà Balógun',
    );
    // The other seven forms stay in the DOM hidden, so queries scope to the open section.
    const vendor = within(
      canvasElement.querySelector('section[data-kind="vendor"]') as HTMLElement,
    );
    const business = vendor.getByLabelText('Business name');
    await expect(business).toHaveFocus();
    await userEvent.type(vendor.getByLabelText('Contact name'), 'A. Example');
    await userEvent.click(vendor.getByRole('button', { name: 'Send application' }));
    await expect(vendor.getByRole('alert')).toHaveTextContent(
      'We still need a business name, an email address. Nothing you typed has been cleared.',
    );
    await expect(business).toHaveAttribute('aria-invalid', 'true');
    await expect(vendor.getByLabelText('Contact name')).toHaveValue('A. Example');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog?.open).toBe(false));
    await expect(trigger).toHaveFocus();
  },
};
