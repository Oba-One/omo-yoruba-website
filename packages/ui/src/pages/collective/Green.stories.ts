import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { header, takePart, voice, why } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Collective/Green',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `green` option inside the Collective's scope, which the site sets on the page's `main` so the nav, the footer and the dialogs never turn green. Signal keeps green to the Collective's own pills; strong tints the slim header and the alternate grounds and turns the section swatch green and gold. The argument and the one voice are owed, so they wait under the registry's chips.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const sections = [header, why, voice, takePart];

export const Signal: Story = {
  args: { options: { green: 'signal' }, scope: 'collective', slots: { default: sections } },
};

export const Strong: Story = {
  args: { options: { green: 'strong' }, scope: 'collective', slots: { default: sections } },
};
