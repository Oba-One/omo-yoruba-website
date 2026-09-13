import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { civic, how, outcomes } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Impact/Outcomes',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `outcomes` option: what each program produced as four cards across or one row each. While the Studio holds no outcome, the four slots name the prototype's subjects with the registry's chip; an outcome headed by its subject takes a slot's place (bracketed here). The links under the grid name each subject's page.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** As the development dataset stands: the four slots. */
export const Cards: Story = {
  args: { options: { outcomes: 'cards' }, slots: { default: [how, outcomes('cards'), civic] } },
};

export const Rows: Story = {
  args: { options: { outcomes: 'rows' }, slots: { default: [outcomes('rows')] } },
};

/** An outcome with its figure in the first place, the slots after it. */
export const WithOutcome: Story = {
  args: {
    options: { outcomes: 'cards' },
    slots: { default: [outcomes('cards', { placeholder: true })] },
  },
};
