import type { ComponentProps } from 'astro/types';
import { expect, userEvent } from 'storybook/test';
import { ANSWER_PENDING, LESSONS_FAQ, PLACEHOLDER_ANSWER } from '../../fixtures/program-pages';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import Accordion from './Accordion.astro';

type Args = StoryArgs<ComponentProps<typeof Accordion>>;

const desktop = { globals: { viewport: { value: 'desktop', isRotated: false } } };
const answered = LESSONS_FAQ.map((item) => ({ ...item, answer: PLACEHOLDER_ANSWER }));

const meta = {
  title: 'Content/Accordion',
  component: Accordion,
  args: {
    id: 'faq',
    items: LESSONS_FAQ,
    pending: 'the questions parents ask',
    answerPending: ANSWER_PENDING,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Questions and their answers, as the Lessons page asks them: native disclosures in one group, so one stays open at a time and opening another closes it, with no JavaScript (`docs/research/phase-6-faq-accordion.md`). Every closed row keeps its 44px target; the mark is drawn, not a glyph. `multi` lets several stay open; `defaultOpen` opens the first. An unanswered question opens onto the registry's chip. Browsers before Chrome 120, Firefox 130 and Safari 17.2 let several stay open.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The five questions as the seed writes them, all closed, every answer owed. */
export const Default: Story = { ...desktop, args: { id: 'faq-default' } };

/** The `faq` option on open: the first question starts open. */
export const DefaultOpen: Story = { ...desktop, args: { id: 'faq-open', defaultOpen: true } };

/** Answered in the bracketed placeholder form, to show an answer's layout. */
export const Answered: Story = { ...desktop, args: { id: 'faq-answered', items: answered } };

/** Several open at once, for a page where people compare answers. */
export const Multi: Story = { ...desktop, args: { id: 'faq-multi', items: answered, multi: true } };

/** No questions in the Studio: the registry's Pending line. */
export const Pending: Story = { args: { id: 'faq-pending', items: [] } };

const questionsIn = (canvasElement: HTMLElement) => [
  ...canvasElement.querySelectorAll<HTMLDetailsElement>('details.oy-faq-item'),
];

/**
 * Tab reaches the first question; a click opens the second and a click on the third closes the second,
 * one open at a time. Enter and Space on a native summary need real key input, so Playwright proves
 * those (the research note, section G).
 */
export const OneAtATime: Story = {
  ...desktop,
  args: { id: 'faq-single', items: answered },
  play: async ({ canvasElement }) => {
    const [first, second, third] = questionsIn(canvasElement);
    await userEvent.tab();
    await expect(first?.querySelector('summary')).toHaveFocus();
    await userEvent.click(second?.querySelector('summary') as HTMLElement);
    await expect(second).toHaveAttribute('open');
    await userEvent.click(third?.querySelector('summary') as HTMLElement);
    await expect(third).toHaveAttribute('open');
    await expect(second).not.toHaveAttribute('open');
  },
};

/** With `multi`, opening a second question leaves the first open. */
export const SeveralOpen: Story = {
  ...desktop,
  args: { id: 'faq-several', items: answered, multi: true },
  play: async ({ canvasElement }) => {
    const [first, second] = questionsIn(canvasElement);
    await userEvent.click(first?.querySelector('summary') as HTMLElement);
    await userEvent.click(second?.querySelector('summary') as HTMLElement);
    await expect(first).toHaveAttribute('open');
    await expect(second).toHaveAttribute('open');
  },
};
