import type { ComponentProps } from 'astro/types';
import HomeRoot from '../../page/HomeRoot/HomeRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { footer } from './sections';

type Args = StoryArgs<ComponentProps<typeof HomeRoot>>;

const meta = {
  title: 'Pages/Homepage/Newsletter',
  component: HomeRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `newsletter` option: the signup in the footer (the default) or as a band before the footer, which then leaves its own block out.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Footer: Story = {
  args: { newsletter: 'footer', slots: { default: footer('footer') } },
};

export const Band: Story = { args: { newsletter: 'band', slots: { default: footer('band') } } };
