import type { ComponentProps } from 'astro/types';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { GALA_ALBUM, GALA_ALBUM_PHOTOS, OWN_CREDIT_PHOTO } from '../../fixtures/gallery';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import Lightbox from './Lightbox.astro';

type Args = StoryArgs<ComponentProps<typeof Lightbox>>;

const mobile = { globals: { viewport: { value: 'mobile', isRotated: false } } };
const desktop = { globals: { viewport: { value: 'desktop', isRotated: false } } };

const first = GALA_ALBUM_PHOTOS[0]?.key;

const meta = {
  title: 'Media/Lightbox',
  component: Lightbox,
  args: {
    id: 'album-lightbox',
    label: GALA_ALBUM.title,
    albumHref: '/gallery/gala-2025',
    album: 'gala-2025',
    photos: GALA_ALBUM_PHOTOS,
    openKey: first,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "One photograph of an album at a time over the dark overlay, whole and never cropped: × at the top right, previous and next either side, and under it the caption, the photo credit with its chip while unconfirmed, and the count. Under 720px previous, next and the count sit in a row under the caption. A photo address serves it open, with links that work without JavaScript; with it, a photograph link opens it in place and writes the address, Left and Right, the buttons and a swipe move it, and ×, Escape, the dark background and Back close it, returning focus to the photograph's tile.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Served open on the first photograph of End-of-Year Gala 2025, as its photo address serves it. */
export const Default: Story = { ...desktop };

/** At 375 the photograph takes the width, and previous, next and the count sit under the caption. */
export const Mobile: Story = { ...mobile };

/** Opened on a later photograph: the count and the links follow it. */
export const LaterPhotograph: Story = {
  ...desktop,
  args: { openKey: GALA_ALBUM_PHOTOS[4]?.key },
};

/** A photograph with a credit of its own, unconfirmed: its own chip. */
export const OwnCredit: Story = {
  ...desktop,
  args: { photos: [OWN_CREDIT_PHOTO], openKey: OWN_CREDIT_PHOTO.key },
};

/** A credit confirmed with no photographer named: the caption alone, no dot before an empty credit. */
export const ConfirmedUnnamed: Story = {
  ...desktop,
  args: {
    photos: GALA_ALBUM_PHOTOS.slice(0, 2).map((photo) => ({
      ...photo,
      credit: undefined,
      confirmed: true,
    })),
  },
};

/** One photograph: no previous or next. */
export const OnePhoto: Story = {
  ...desktop,
  args: { photos: GALA_ALBUM_PHOTOS.slice(0, 1) },
};

/** A photograph the Studio holds no image for yet: the placeholder naming it, the caption and credit below. */
export const Pending: Story = {
  ...desktop,
  args: {
    photos: [
      { ...(GALA_ALBUM_PHOTOS[0] as (typeof GALA_ALBUM_PHOTOS)[number]), image: undefined },
      ...GALA_ALBUM_PHOTOS.slice(1),
    ],
  },
};

/** A photograph that fails to load shows its caption in the frame. */
export const ImageFails: Story = {
  ...desktop,
  args: {
    photos: [
      {
        ...(GALA_ALBUM_PHOTOS[0] as (typeof GALA_ALBUM_PHOTOS)[number]),
        image: '/missing-photograph.jpg',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector<HTMLElement>('.oy-lb-frame');
    await waitFor(() => expect(frame?.dataset.failed).toBe('true'), { timeout: 5000 });
    await expect(canvasElement.querySelector('.oy-lb-failed')).toBeVisible();
  },
};

/** Mounted closed, as every album page mounts it. */
export const Closed: Story = { args: { openKey: undefined } };

const ready = async (canvasElement: HTMLElement) => {
  const host = canvasElement.querySelector<HTMLElement>('oy-lightbox');
  await waitFor(() => expect(host?.dataset.ready).toBe('true'), { timeout: 5000 });
  return host as HTMLElement;
};

/** The album page's photograph links, as the play functions need them: one per photograph. */
const addTiles = (canvasElement: HTMLElement) =>
  GALA_ALBUM_PHOTOS.map((photo) => {
    const tile = document.createElement('a');
    tile.href = `?photo=${photo.key}`;
    tile.dataset.lightbox = 'album-lightbox';
    tile.dataset.photo = photo.key;
    tile.textContent = photo.caption;
    canvasElement.prepend(tile);
    return tile;
  });

const dialogOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLDialogElement>('dialog.oy-lightbox');

const countOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('.oy-lb-count')?.textContent?.trim();

/** A tile opens it on its photograph with focus on ×; Right moves on; Escape closes onto that photograph's tile. */
export const OpensFromTile: Story = {
  ...desktop,
  args: { openKey: undefined },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    const tiles = addTiles(canvasElement);
    const dialog = dialogOf(canvasElement);
    await userEvent.click(tiles[2] as HTMLElement);
    await waitFor(() => expect(dialog?.open).toBe(true));
    await expect(within(dialog as HTMLElement).getByRole('link', { name: 'Close' })).toHaveFocus();
    await expect(countOf(canvasElement)).toBe('3 of 6');
    await userEvent.keyboard('{ArrowRight}');
    await expect(countOf(canvasElement)).toBe('4 of 6');
    await expect(
      canvasElement.querySelector('.oy-lb-cap > p[data-active="true"]'),
    ).toHaveTextContent(GALA_ALBUM_PHOTOS[3]?.caption ?? '');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog?.open).toBe(false));
    await waitFor(() => expect(tiles[3]).toHaveFocus());
  },
};

/** Previous from the first photograph wraps to the last, next wraps back; the links follow the photograph. */
export const ButtonsWrap: Story = {
  ...desktop,
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    const dialog = dialogOf(canvasElement) as HTMLDialogElement;
    await waitFor(() => expect(dialog.open).toBe(true));
    const canvas = within(dialog);
    const previous = canvas.getByRole('link', { name: 'Previous photo' });
    await userEvent.click(previous);
    await expect(countOf(canvasElement)).toBe('6 of 6');
    await expect(previous.getAttribute('href')).toContain(`photo=${GALA_ALBUM_PHOTOS[4]?.key}`);
    await userEvent.click(canvas.getByRole('link', { name: 'Next photo' }));
    await expect(countOf(canvasElement)).toBe('1 of 6');
    await expect(dialog.open).toBe(true);
  },
};

/** A key held with a modifier belongs to the browser: Shift and Right changes nothing. */
export const ModifiersIgnored: Story = {
  ...desktop,
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    const dialog = dialogOf(canvasElement) as HTMLDialogElement;
    await waitFor(() => expect(dialog.open).toBe(true));
    await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}');
    await expect(countOf(canvasElement)).toBe('1 of 6');
  },
};

/** A click on the dark background closes it; a click on the photograph does not. */
export const BackgroundCloses: Story = {
  ...desktop,
  args: { openKey: undefined },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    const tiles = addTiles(canvasElement);
    const dialog = dialogOf(canvasElement) as HTMLDialogElement;
    await userEvent.click(tiles[0] as HTMLElement);
    await waitFor(() => expect(dialog.open).toBe(true));
    const image = canvasElement.querySelector<HTMLElement>('.oy-lb-frame:not([hidden]) img');
    await userEvent.click(image as HTMLElement);
    await expect(dialog.open).toBe(true);
    // The stage's own box around the photograph: a pointer there lands on no photograph and no control.
    const stage = canvasElement.querySelector('.oy-lb-stage') as HTMLElement;
    stage.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
    await waitFor(() => expect(dialog.open).toBe(false));
    await waitFor(() => expect(tiles[0]).toHaveFocus());
  },
};
