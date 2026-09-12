import type { ComponentProps } from 'astro/types';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, onDark, type StoryArgs, type StoryObj } from '../../storybook';
import NewsletterForm from './NewsletterForm.astro';

type Args = StoryArgs<ComponentProps<typeof NewsletterForm>>;

const meta = {
  title: 'Forms/NewsletterForm',
  component: NewsletterForm,
  args: { state: 'idle', source: '/' },
  parameters: {
    docs: {
      description: {
        component:
          'The footer signup. Nothing sends until a provider is named (wayfinder ticket 01): the address becomes a subscriber document and the button reads "Ẹ ṣé! ✓" in place. Without JavaScript the form posts to the newsletter action; with it the inline element pre-validates and hands the form to the site.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Busy: Story = { args: { state: 'busy', value: 'ade@example.org' } };

/** The button flips to the thanks in place; the on-the-list line appears under it. */
export const Success: Story = { args: { state: 'success', value: 'ade@example.org' } };

/** The sentence names the problem and the typed value stays. */
export const WithError: Story = { args: { state: 'error', value: 'ade@example' } };

export const Band: Story = { args: { variant: 'band' } };

/** As the footer shows it, inside the dark scope. */
export const OnDark: Story = { ...onDark };

/** Empty and malformed submits are caught before any request, with the spec's sentences. */
export const Validates: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvasElement.querySelector<HTMLElement>('oy-newsletter');
    await waitFor(() => expect(root?.dataset.ready).toBe('true'), { timeout: 5000 });
    const input = canvas.getByLabelText('Email address');
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }));
    await expect(canvas.getByRole('alert')).toHaveTextContent('We still need an email address.');
    await expect(input).toHaveFocus();
    await userEvent.type(input, 'ade@example');
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }));
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'That email address does not look right. Check it and send again.',
    );
    await expect(input).toHaveValue('ade@example');
  },
};
