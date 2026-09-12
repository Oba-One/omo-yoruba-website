import type { ComponentProps } from 'astro/types';
import HomeRoot from '../../page/HomeRoot/HomeRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { gallery } from './sections';

type Args = StoryArgs<ComponentProps<typeof HomeRoot>>;

const meta = {
  title: 'Pages/Homepage/Gallery',
  component: HomeRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `gallery` option: how many tiles A year in the life shows, seven, five or three.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Seven: Story = { args: { gallery: '7', slots: { default: gallery('7') } } };

export const Five: Story = { args: { gallery: '5', slots: { default: gallery('5') } } };

export const Three: Story = { args: { gallery: '3', slots: { default: gallery('3') } } };
