import type { ComponentProps } from 'astro/types';
import { expect, userEvent, within } from 'storybook/test';
import { KIDS_STEM } from '../../fixtures/program-pages';
import SectionHead from '../../page/SectionHead/SectionHead.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import Prose from '../Prose/Prose.astro';
import Disclosure from './Disclosure.astro';

type Args = StoryArgs<ComponentProps<typeof Disclosure>>;

const head = {
  component: SectionHead,
  props: {
    kicker: { yo: 'Àwọn ọmọ', en: 'The children' },
    title: 'Kids & STEM',
    id: 'kids-heading',
  },
};
const body = { component: Prose, props: { text: KIDS_STEM.blurb } };

const mobile = { globals: { viewport: { value: 'mobile', isRotated: false } } };
const desktop = { globals: { viewport: { value: 'desktop', isRotated: false } } };

const meta = {
  title: 'Content/Disclosure',
  component: Disclosure,
  args: { open: true, label: 'Kids & STEM', slots: { head, default: body } },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "A section's details behind a quiet toggle, as the Programs hub holds Kids & STEM and Cultural Exchange: a native disclosure that opens and closes without JavaScript, starting open or closed by the page's `inline` option. The head stays in view; the toggle sits on its first line at the right, and under 720px on its own line under the heading. The toggle's name carries the section's name for a screen reader.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Expanded, as the `inline` option's default opens it. */
export const Default: Story = { ...desktop };

/** Collapsed: only the head and "Show details" until the reader opens it. */
export const Closed: Story = { ...desktop, args: { open: false } };

/** At 375 the toggle drops under the heading on the right. */
export const Mobile: Story = { ...mobile };

/**
 * Tab reaches the toggle and a click opens and closes the details, the toggle's words following. Enter
 * and Space on a native summary need real key input, so Playwright proves those
 * (docs/research/phase-6-faq-accordion.md, section G).
 */
export const Toggles: Story = {
  ...desktop,
  args: { open: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const details = canvasElement.querySelector('details') as HTMLDetailsElement;
    const toggle = canvasElement.querySelector('summary') as HTMLElement;
    await expect(details.open).toBe(false);
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.click(toggle);
    await expect(details.open).toBe(true);
    await expect(canvas.getByText('Hide details')).toBeVisible();
    await userEvent.click(toggle);
    await expect(details.open).toBe(false);
    await expect(canvas.getByText('Show details')).toBeVisible();
  },
};
