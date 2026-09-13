import type { ComponentProps } from 'astro/types';
import { KIDS_STEM } from '../../fixtures/program-pages';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import SubprogramCard from './SubprogramCard.astro';

type Args = StoryArgs<ComponentProps<typeof SubprogramCard>>;

const [agbala, stem] = KIDS_STEM.subprograms;

const meta = {
  title: 'Cards/SubprogramCard',
  component: SubprogramCard,
  args: { subprogram: agbala as Args['subprogram'] },
  decorators: [wrap('sb-oy-narrow')],
  parameters: {
    docs: {
      description: {
        component:
          "One half of Kids & STEM on the Programs hub (`10 Programs.dc.html`): the photograph, the name, the blurb, the facts in one column with the registry's chip where the Studio holds no value, and the outline action. The seed holds the labels of the facts and none of their values, which the prototype invents.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Àgbàlá Ọmọde as the seed writes it: the ayo photograph, its ages owed. */
export const Default: Story = {};

/** The STEM Hub: two facts owed, and the action that opens the contact form. */
export const TwoFacts: Story = { args: { subprogram: stem as Args['subprogram'] } };

/** A fact the Studio holds reads as text beside its label. */
export const Filled: Story = {
  args: {
    subprogram: {
      ...stem,
      facts: [{ _key: 'fact-1', label: '[ Label ]', value: '[ Value ]' }],
    } as Args['subprogram'],
  },
};

/** No photograph in the Studio: the placeholder names the one the card waits for. */
export const NoPhoto: Story = {
  args: { subprogram: { ...agbala, image: null } as Args['subprogram'] },
};

/** The most the card can owe: no photograph and every fact's value, each named where it goes. */
export const Pending: Story = {
  args: { subprogram: { ...stem, image: null } as Args['subprogram'] },
};

/** No facts and no action: the card keeps its photograph, name and blurb, and no empty list. */
export const Bare: Story = {
  args: { subprogram: { ...agbala, facts: [], action: null } as Args['subprogram'] },
};
