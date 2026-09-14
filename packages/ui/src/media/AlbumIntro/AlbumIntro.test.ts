import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './AlbumIntro.stories';

const { Default, WithoutEdition, ConfirmedWithNote, Pending } = composeStories(stories);

describe('AlbumIntro', () => {
  it("offers the way back to the gallery and to the edition's page, without a back arrow glyph", async () => {
    const body = await renderToBody(Default);
    // Two quiet links, not a landmark of their own.
    expect(body.querySelector('nav')).toBeNull();
    const links = [...body.querySelectorAll('.oy-album-intro-links a')];
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/gallery', '/gala']);
    expect(text(links[0])).toBe('All albums');
    expect(text(links[1])).toContain('End-of-Year Gala');
    expect(body.innerHTML).not.toContain('←');
  });

  it('names the credit with its chip until confirmed, then the consent note', async () => {
    const owed = await renderToBody(Default);
    expect(text(owed.querySelector('.oy-credit-line'))).toBe(
      'Photographs: Members and volunteers Pending: photographer credit to confirm',
    );
    expect(owed.querySelector('.oy-album-intro-note')).toBeNull();
    const noted = await renderToBody(ConfirmedWithNote);
    expect(text(noted.querySelector('.oy-credit-line'))).toBe(
      'Photographs: Members and volunteers.',
    );
    expect(text(noted.querySelector('.oy-album-intro-note'))).toBe(
      '[ What this album says about faces and permission ]',
    );
  });

  it('keeps the gallery link alone without an edition, and no credit line without an album', async () => {
    expect(
      (await renderToBody(WithoutEdition)).querySelectorAll('.oy-album-intro-links a'),
    ).toHaveLength(1);
    expect((await renderToBody(Pending)).querySelector('.oy-credit-line')).toBeNull();
  });
});
