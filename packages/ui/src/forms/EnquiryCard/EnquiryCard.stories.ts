import type { ComponentProps } from 'astro/types';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import EnquiryCard from './EnquiryCard.astro';

type Args = StoryArgs<ComponentProps<typeof EnquiryCard>>;

const meta = {
  title: 'Forms/EnquiryCard',
  component: EnquiryCard,
  args: { kind: 'vendor' },
  decorators: [wrap('sb-oy-narrow')],
  parameters: {
    docs: {
      description: {
        component:
          'A form never opens cold: the card says what it asks and how many questions, then the trigger opens the Enquiry Modal for that kind. Without JavaScript the trigger is a link to the same page with the modal open.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** The eight kinds side by side, as the doors and take-part bands will use them. */
export const Sponsor: Story = { args: { kind: 'sponsor' } };
export const Performer: Story = { args: { kind: 'performer' } };
export const Table: Story = { args: { kind: 'table' } };
export const Member: Story = { args: { kind: 'member' } };
export const Volunteer: Story = { args: { kind: 'volunteer' } };
export const Enrol: Story = { args: { kind: 'enrol' } };
export const Contact: Story = { args: { kind: 'contact' } };

/** The outline trigger, for every card on a view after the one gold action. */
export const Secondary: Story = { args: { kind: 'volunteer', variant: 'secondary' } };

/** A page adds what happens next from its own content; the card invents nothing. */
export const WithNext: Story = {
  args: { kind: 'member', next: 'Dues are agreed with our membership lead' },
};
