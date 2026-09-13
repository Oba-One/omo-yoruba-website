import type { ComponentProps } from 'astro/types';
import { HONOREE_PLACEHOLDERS } from '../../fixtures/event-pages';
import { PHOTOS } from '../../fixtures/photos';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import PersonCard from './PersonCard.astro';

type Args = StoryArgs<ComponentProps<typeof PersonCard>>;

const [honoree, earlier] = HONOREE_PLACEHOLDERS;

const meta = {
  title: 'Cards/PersonCard',
  component: PersonCard,
  args: { person: honoree as Args['person'] },
  decorators: [wrap('oy-g3')],
  parameters: {
    docs: {
      description: {
        component:
          'A person: role, name and a short bio. With a portrait the photograph sits above; without one the woven tick takes its place, a design of its own. The names and bios here are placeholders, and the portrait story frames a crowd photograph from the register so no one reads as named.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** No portrait: the woven tick. How the Gala shows an honoree without a photograph. */
export const NoPortrait: Story = {};

export const Portrait: Story = {
  args: {
    person: {
      ...honoree,
      image: { src: PHOTOS.processionBegins.src, alt: PHOTOS.processionBegins.alt },
    } as Args['person'],
  },
};

export const Compact: Story = {
  args: { person: earlier as Args['person'], variant: 'compact' },
};

export const Pending: Story = { args: { person: { role: 'This year' } } };
