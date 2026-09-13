import type { ComponentProps } from 'astro/types';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import EntryList from './EntryList.astro';

type Args = StoryArgs<ComponentProps<typeof EntryList>>;

const LEVELS = [1, 2, 3].map((n) => ({
  _key: `level-${n}`,
  title: `[ Level ${n} ]`,
  line: '[ What the level covers ]',
}));

const meta = {
  title: 'Content/EntryList',
  component: EntryList,
  args: {
    entries: LEVELS,
    pending: 'what each level covers',
    linePending: 'what the level covers',
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "A list of entry rows: the Lessons levels, each a title and its line. The Studio holds no levels yet (the register marks the prototype's three invented), so the rows here are bracketed placeholders, and with none the list shows the registry's Pending line.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Three levels in the bracketed placeholder form. */
export const Default: Story = {};

/** A level written without what it covers. */
export const LinePending: Story = {
  args: { entries: [{ _key: 'level-1', title: '[ Level 1 ]' }, ...LEVELS.slice(1)] },
};

/** No levels in the Studio: the Pending line, as the development dataset stands. */
export const Pending: Story = { args: { entries: [] } };

/** Donate's other ways to give: each way's line and its detail, the EIN still owed on the fund row. */
export const WithDetail: Story = {
  args: {
    entries: [
      {
        _key: 'way-1',
        title: '[ By check ]',
        line: '[ Who the check is made out to ]',
        detail: '[ The mailing address ]',
      },
      {
        _key: 'way-2',
        title: '[ Donor-advised fund ]',
        line: '[ What a fund sponsor asks for ]',
        detail: 'Our legal name is Omo Yorùbá of Southern California.',
        detailPending: 'EIN',
      },
    ],
  },
};
