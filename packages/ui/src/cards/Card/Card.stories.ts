import type { ComponentProps } from 'astro/types';
import { PHOTOS } from '../../fixtures/photos';
import { type Meta, onDark, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import Card from './Card.astro';

type Args = StoryArgs<ComponentProps<typeof Card>>;

const body =
  '<p>Photo, title, two lines, one quiet action.</p><a class="oy-btn oy-btn--quiet" href="#x">Enrol a learner<span class="oy-btn-arrow" aria-hidden="true">→</span></a>';

const meta = {
  title: 'Cards/Card',
  component: Card,
  args: { title: 'Program card', slots: { default: body } },
  decorators: [wrap('sb-oy-narrow')],
  parameters: {
    docs: {
      description: {
        component:
          'The base every card is built on: paper ground, indigo hairline, the 8px aṣọ òkè edge on top and the faint àdìrẹ dot field. On hover the border deepens, the title warms, the arrow slides and the woven rule draws under the action. Nothing lifts, no photo zooms.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const WithPhoto: Story = {
  args: { image: PHOTOS.learningYoruba.src, alt: PHOTOS.learningYoruba.alt },
};

export const WithKicker: Story = {
  args: {
    kicker: { yo: 'Ẹ̀kọ́ èdè', en: 'Lessons' },
    image: PHOTOS.kidsCrafts.src,
    alt: PHOTOS.kidsCrafts.alt,
  },
};

/** The rule draws, the title warms, the arrow slides. */
export const Hover: Story = {
  args: { image: PHOTOS.learningYoruba.src, alt: PHOTOS.learningYoruba.alt },
  parameters: { pseudo: { hover: '.oy-card' } },
};

export const AsFigure: Story = {
  args: {
    as: 'figure',
    title: undefined,
    slots: {
      default: '<blockquote>A quote card.</blockquote><figcaption>Name • Relation</figcaption>',
    },
  },
};

export const NoRule: Story = { args: { rule: false } };

export const OnDark: Story = { ...onDark };
