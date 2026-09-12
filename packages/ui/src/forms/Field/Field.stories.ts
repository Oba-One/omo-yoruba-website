import { ENQUIRY_SPECS, type FieldSpec } from '@oy/content/enquiry-kinds';
import type { ComponentProps } from 'astro/types';
import { type Meta, onDark, type StoryArgs, type StoryObj } from '../../storybook';
import Field from './Field.astro';

type Args = StoryArgs<ComponentProps<typeof Field>>;

// Real specs from the enquiry kinds, never invented fields.
const find = (kind: keyof typeof ENQUIRY_SPECS, id: string): FieldSpec => {
  const field = ENQUIRY_SPECS[kind].fields.find((f) => f.id === id);
  if (!field) throw new Error(`No field ${id} on ${kind}`);
  return field;
};

const meta = {
  title: 'Forms/Field',
  component: Field,
  args: { spec: find('member', 'name'), id: 'field-name' },
  parameters: {
    docs: {
      description: {
        component:
          'Every control of every owned form comes from a spec in enquiry-kinds.ts: the label is visible, the hint and the error sentence are read out with the control, and a required field says what it needs in words rather than with a browser bubble.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** A required text field: aria-required, no native `required` attribute. */
export const Default: Story = {};

export const Email: Story = { args: { spec: find('member', 'mail'), id: 'field-mail' } };

export const Tel: Story = { args: { spec: find('member', 'phone'), id: 'field-phone' } };

/** The first option is selected until the visitor changes it, as the prototype does. */
export const Select: Story = { args: { spec: find('sponsor', 'interest'), id: 'field-interest' } };

/** Areas span both columns. */
export const Area: Story = { args: { spec: find('contact', 'message'), id: 'field-message' } };

export const WithHint: Story = { args: { spec: find('enrol', 'notes'), id: 'field-notes' } };

/** A kept value with the error sentence beneath, tied to the control. */
export const WithError: Story = {
  args: {
    spec: find('member', 'mail'),
    id: 'field-mail-error',
    value: 'ade@example',
    error: 'That email address does not look right. Check it and send again.',
  },
};

export const Filled: Story = {
  args: { spec: find('vendor', 'biz'), id: 'field-biz', value: 'Ọjà Balógun Textiles' },
};

/** In a dark band the label turns white and the error sentence gold-300. */
export const OnDark: Story = {
  ...onDark,
  args: {
    spec: find('member', 'mail'),
    id: 'field-mail-dark',
    error: 'We still need an email address we can reach you at.',
  },
};
