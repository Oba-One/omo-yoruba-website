import type { ComponentProps } from 'astro/types';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ODUNDE_VIDEOS } from '../../fixtures/videos';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import VideoGrid from './VideoGrid.astro';

type Args = StoryArgs<ComponentProps<typeof VideoGrid>>;

const mobile = { globals: { viewport: { value: 'mobile', isRotated: false } } };
const desktop = { globals: { viewport: { value: 'desktop', isRotated: false } } };

const meta = {
  title: 'Media/VideoGrid',
  component: VideoGrid,
  decorators: [wrap('oy-wrap')],
  args: { videos: ODUNDE_VIDEOS },
  parameters: {
    docs: {
      description: {
        component:
          "An album's videos: our own still under a round play mark, two across from 720px and one under it, a single video in one column no wider than 720px. The title is a paragraph under the tile, with a muted line naming who made it and that it plays from YouTube. Nothing is requested from YouTube before the press: pressing play (a click, or Enter on the link) swaps YouTube's no-cookie player in and gives it focus. Without JavaScript, or with a modifier key held, the link opens the video on YouTube. The gold edge draws inside the tile on hover; nothing lifts or zooms.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const ready = async (canvasElement: HTMLElement) => {
  const hosts = [...canvasElement.querySelectorAll<HTMLElement>('oy-video')];
  await waitFor(() => expect(hosts.every((host) => host.dataset.ready === 'true')).toBe(true), {
    timeout: 5000,
  });
  return within(canvasElement);
};

/**
 * Two videos of Odunde 2026, the credit linked to the photographer's page. The keyboard presses play: Enter on the
 * focused first link swaps the player in and focuses it, and the second tile waits for its own press. The player's
 * frame is cross-origin and a story has no video behind it, so Chromatic leaves the frame out of the comparison.
 */
export const Default: Story = {
  ...desktop,
  parameters: { chromatic: { ignoreSelectors: ['oy-video iframe'] } },
  play: async ({ canvasElement }) => {
    const canvas = await ready(canvasElement);
    await expect(canvasElement.querySelector('iframe')).toBeNull();
    const [first] = ODUNDE_VIDEOS;
    const link = canvas.getByRole('link', { name: 'Play video: Odunde 2026 highlights' });
    link.focus();
    await expect(link).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const frame = await waitFor(() => {
      const found = canvasElement.querySelector('oy-video iframe');
      expect(found).not.toBeNull();
      return found as HTMLIFrameElement;
    });
    await expect(frame).toHaveAttribute('src', first?.embedSrc ?? '');
    await expect(frame).toHaveAttribute('title', 'Odunde 2026 highlights');
    await expect(frame).toHaveFocus();
    await expect(
      canvas.queryByRole('link', { name: 'Play video: Odunde 2026 highlights' }),
    ).toBeNull();
    await expect(canvasElement.querySelectorAll('iframe')).toHaveLength(1);
    await expect(
      canvas.getByRole('link', { name: 'Play video: Odunde 2026 teaser' }),
    ).toBeInTheDocument();
  },
};

/** One video sits in one column, 720px at most. */
export const OneVideo: Story = { ...desktop, args: { videos: ODUNDE_VIDEOS.slice(0, 1) } };

/** At 375 the tiles stack in one column. */
export const Mobile: Story = { ...mobile };

/** The gold edge drawn inside the tile on hover, and the focus ring a keyboard reader sees, on both tiles. */
export const HoverAndFocus: Story = {
  ...desktop,
  parameters: { pseudo: { hover: '.oy-video-play', focusVisible: '.oy-video-play' } },
};

/** A video with no still of its own and none to fall back on: the placeholder names what is missing. */
export const WithoutStill: Story = {
  ...desktop,
  args: { videos: ODUNDE_VIDEOS.slice(0, 1).map((video) => ({ ...video, still: undefined })) },
};

/** No maker named: the line says only that it plays from YouTube. */
export const WithoutCredit: Story = {
  ...desktop,
  args: {
    videos: ODUNDE_VIDEOS.map((video) => ({ ...video, credit: undefined, creditHref: undefined })),
  },
};

/** A maker named with no page to link to: the name stays plain text. */
export const UnlinkedCredit: Story = {
  ...desktop,
  args: { videos: ODUNDE_VIDEOS.map((video) => ({ ...video, creditHref: undefined })) },
};

/** An address the Studio's rule refuses but the API accepts: the name shows, with no link. */
export const UnsafeLink: Story = {
  ...desktop,
  args: {
    videos: ODUNDE_VIDEOS.map((video) => ({ ...video, creditHref: 'javascript:alert(1)' })),
  },
};

/** In draft mode each video carries its edit attribute for click-to-edit. */
export const WithEdit: Story = {
  ...desktop,
  args: {
    videos: ODUNDE_VIDEOS.map((video) => ({
      ...video,
      edit: `id=album-odunde-2026;type=album;path=videos:${video.key};base=%2Fadmin`,
    })),
  },
};

/** The page's largest paint: the first still is fetched at once and first. */
export const Priority: Story = { ...desktop, args: { priority: true } };

/** An album with no videos renders nothing. */
export const Pending: Story = { args: { videos: [] } };
