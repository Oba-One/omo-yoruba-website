import type { ComponentProps } from 'astro/types';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { GALA_PAST_SLIDES, ODUNDE_PAST_SLIDES } from '../../fixtures/event-pages';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import PhotoCarousel from './PhotoCarousel.astro';

type Args = StoryArgs<ComponentProps<typeof PhotoCarousel>>;

const mobile = { globals: { viewport: { value: 'mobile', isRotated: false } } };
const desktop = { globals: { viewport: { value: 'desktop', isRotated: false } } };

const meta = {
  title: 'Media/PhotoCarousel',
  component: PhotoCarousel,
  args: { id: 'carousel', label: 'Odunde in past years', slides: ODUNDE_PAST_SLIDES },
  parameters: {
    docs: {
      description: {
        component:
          "The framed carousel of an event page's past years: one photograph at a time with its caption, previous and next, the dots as tabs and the count. Left and Right move on the tabs and the buttons, Home and End on the tabs; nothing rotates and nothing opens on load. Without JavaScript the first photograph shows and the controls wait invisible, so nothing moves when they arrive. One photograph is a framed figure; none names what the Studio owes.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The first eight photographs of the Odunde 2026 album, as the page shows them. */
export const Default: Story = { ...desktop, args: { id: 'carousel-default' } };

/** The Gala 2025 album's six photographs. */
export const Gala: Story = {
  ...desktop,
  args: { id: 'carousel-gala', label: 'Past galas', slides: GALA_PAST_SLIDES },
};

/** At 375 the stage turns 4:3, the buttons 44px, and eight dots wrap to a second row. */
export const Mobile: Story = { ...mobile, args: { id: 'carousel-mobile' } };

/** One photograph: the framed figure and its caption, no controls. */
export const OnePhoto: Story = {
  args: { id: 'carousel-one', slides: ODUNDE_PAST_SLIDES.slice(0, 1) },
};

/** No photographs in the Studio: the stage names what is owed. */
export const Pending: Story = {
  args: { id: 'carousel-pending', slides: [], pending: 'the albums of past editions' },
};

const ready = async (canvasElement: HTMLElement) => {
  const host = canvasElement.querySelector<HTMLElement>('oy-photo-carousel');
  await waitFor(() => expect(host?.dataset.ready).toBe('true'), { timeout: 5000 });
  return within(canvasElement);
};

/** Next and previous change the photograph, the dot and the count, wrap at both ends and keep focus. */
export const ButtonsWrap: Story = {
  ...desktop,
  args: { id: 'carousel-buttons' },
  play: async ({ canvasElement }) => {
    const canvas = await ready(canvasElement);
    const next = canvas.getByRole('button', { name: 'Next photo' });
    await userEvent.click(next);
    await expect(canvas.getByRole('tab', { name: 'Photo 2' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await waitFor(() => expect(canvas.getAllByRole('tabpanel')).toHaveLength(1));
    await expect(canvasElement.querySelector('.oy-carousel-count')).toHaveTextContent('2 of 8');
    await expect(next).toHaveFocus();
    const previous = canvas.getByRole('button', { name: 'Previous photo' });
    await userEvent.click(previous);
    await userEvent.click(previous);
    await expect(canvas.getByRole('tab', { name: 'Photo 8' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(canvasElement.querySelector('.oy-carousel-count')).toHaveTextContent('8 of 8');
  },
};

/** Tab reaches the selected dot; Right, End and Home move focus and selection together, wrapping. */
export const TabsKeyboard: Story = {
  ...desktop,
  args: { id: 'carousel-tabs' },
  play: async ({ canvasElement }) => {
    const canvas = await ready(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Next photo' }));
    await userEvent.tab();
    const second = canvas.getByRole('tab', { name: 'Photo 2' });
    await expect(second).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    const third = canvas.getByRole('tab', { name: 'Photo 3' });
    await expect(third).toHaveFocus();
    await expect(third).toHaveAttribute('aria-selected', 'true');
    await expect(third).not.toHaveAttribute('tabindex');
    await expect(second).toHaveAttribute('tabindex', '-1');
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('tab', { name: 'Photo 8' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    const first = canvas.getByRole('tab', { name: 'Photo 1' });
    await expect(first).toHaveFocus();
    await expect(first).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Home}');
    await expect(first).toHaveFocus();
  },
};

/** Right on the Next button changes the photograph and leaves focus on the button. */
export const ArrowsOnButtons: Story = {
  ...desktop,
  args: { id: 'carousel-arrows' },
  play: async ({ canvasElement }) => {
    const canvas = await ready(canvasElement);
    const next = canvas.getByRole('button', { name: 'Next photo' });
    next.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Photo 2' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(next).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(canvas.getByRole('tab', { name: 'Photo 1' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

/** A key held with a modifier belongs to the browser: Shift and Right on a dot changes nothing. */
export const ModifiersIgnored: Story = {
  ...desktop,
  args: { id: 'carousel-modifiers' },
  play: async ({ canvasElement }) => {
    const canvas = await ready(canvasElement);
    const first = canvas.getByRole('tab', { name: 'Photo 1' });
    first.focus();
    await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}');
    await expect(first).toHaveAttribute('aria-selected', 'true');
    await expect(first).toHaveFocus();
    await expect(canvasElement.querySelector('.oy-carousel-count')).toHaveTextContent('1 of 8');
  },
};
