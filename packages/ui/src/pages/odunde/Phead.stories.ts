import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { glance, header, whatItIs } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Odunde/Phead',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `phead` option: the festival page opens on the photo band (the default) or the slim header on paper. Both carry the same kicker, heading, line, two actions and the facts of the next edition, which the seed has not dated yet.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Photo: Story = {
  args: { options: { phead: 'photo' }, slots: { default: [header('photo'), glance, whatItIs] } },
};

export const Slim: Story = {
  args: { options: { phead: 'slim' }, slots: { default: [header('slim'), glance, whatItIs] } },
};
