import type { ComponentProps } from 'astro/types';
import { SPONSOR_LEVEL_PLACEHOLDERS } from '../../fixtures/event-pages';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import ListRow, { type TierRowLike } from './ListRow.astro';

type Args = StoryArgs<ComponentProps<typeof ListRow>>;

const meta = {
  title: 'Cards/ListRow',
  component: ListRow,
  args: { kind: 'tier', row: SPONSOR_LEVEL_PLACEHOLDERS[0] as TierRowLike },
  decorators: [wrap('oy-list')],
  parameters: {
    docs: {
      description: {
        component:
          "A row of a list. The sponsor tier form: the level's name and amount, then what it recognizes as a ticked list, each Pending while owed. The entry form: a title and its line, alone (the Lessons levels) or with a date block and a quiet action. The rows here are placeholders: the Studio holds none yet.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const SponsorTier: Story = {};

/** A level still owed its amount and what it recognizes. */
export const Pending: Story = { args: { row: { _id: 'level-owed', name: '[ A level ]' } } };

/** The entry form as the Lessons levels draw it: a title and its line, the row one column wide. */
export const Entry: Story = {
  args: {
    kind: 'entry',
    row: { _key: 'level-1', title: '[ The first level ]', line: '[ What the level covers ]' },
  },
};

/** An entry still owed its line. */
export const EntryPending: Story = {
  args: {
    kind: 'entry',
    row: { _key: 'level-1', title: '[ The first level ]' },
    linePending: 'what the level covers',
  },
};
