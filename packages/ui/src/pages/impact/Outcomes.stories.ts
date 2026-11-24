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
          'Program outcomes stay hidden until sourced figures are available. The complete bracketed fixture previews a card or row with its figure, meaning, source and program link.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** As the development dataset stands: no program outcome figures have been confirmed. */
export const Cards: Story = {
  args: { options: { outcomes: 'cards' }, slots: { default: [how, outcomes('cards'), civic] } },
};

export const Rows: Story = {
  args: {
    options: { outcomes: 'rows' },
    slots: { default: [outcomes('rows', { placeholder: true })] },
  },
};

/** A sourced outcome on its own, without empty cards for the other programs. */
export const WithOutcome: Story = {
  args: {
    options: { outcomes: 'cards' },
    slots: { default: [outcomes('cards', { placeholder: true })] },
  },
};
