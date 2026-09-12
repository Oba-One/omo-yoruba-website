import type { ComponentProps } from 'astro/types';
import HomeRoot from '../../page/HomeRoot/HomeRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { eventBand } from './sections';

type Args = StoryArgs<ComponentProps<typeof HomeRoot>>;

const meta = {
  title: 'Pages/Homepage/Season',
  component: HomeRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `season` option: which edition leads the event band. `auto` picks by date (the nearest dated festival or gala, else the festival from January to June and the Gala from July to December); `gala` and `odunde` pick that kind. The seeded editions carry no date, so the band shows its Pending chips.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** `auto` on 12 September 2026: the Gala leads. */
export const Auto: Story = { args: { season: 'auto', slots: { default: eventBand('gala') } } };

export const Gala: Story = { args: { season: 'gala', slots: { default: eventBand('gala') } } };

export const Odunde: Story = {
  args: { season: 'odunde', slots: { default: eventBand('odunde') } },
};
