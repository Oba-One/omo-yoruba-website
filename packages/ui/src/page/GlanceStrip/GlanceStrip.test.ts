import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './GlanceStrip.stories';

const { Five, Four, WithCaption, Pending, InColumn, TwoInColumn, OneInColumn, Empty, NoteLink } =
  composeStories(stories);

describe('GlanceStrip', () => {
  it('sets five facts with a label, the value or its chip, and the note', async () => {
    const strip = (await renderToBody(Five)).querySelector('#glance .oy-glance');
    expect(strip?.hasAttribute('data-cols')).toBe(false);
    const cells = Array.from(strip?.children ?? []);
    expect(cells.map((cell) => text(cell.querySelector('b')))).toEqual([
      'Date',
      'Time',
      'Where',
      'Cost',
      'Family',
    ]);
    expect(text(cells[0]?.querySelector('.oy-pend'))).toBe('Pending: the date');
    expect(text(cells[2]?.querySelector('span'))).toBe('Leimert Park');
    expect(text(cells[2]?.querySelector('small .oy-pend'))).toBe('Pending: the exact venue line');
    expect(text(cells[4]?.querySelector('small'))).toBe("Children's compound on site");
  });

  it('tells the tokens how many columns a shorter strip has', async () => {
    const strip = (await renderToBody(Four)).querySelector('.oy-glance');
    expect(strip?.getAttribute('data-cols')).toBe('4');
    // A strip that leaves a parked fact out (ADR 0058) can hold two cells, or one.
    const two = (await renderToBody(TwoInColumn)).querySelector('.oy-glance');
    expect(two?.getAttribute('data-cols')).toBe('2');
    expect(two?.children).toHaveLength(2);
    const one = (await renderToBody(OneInColumn)).querySelector('.oy-glance');
    expect(one?.getAttribute('data-cols')).toBe('1');
    expect(one?.children).toHaveLength(1);
  });

  it('gives every count it can hold a column rule in the tokens, so no strip falls back to five', () => {
    const css = readFileSync(
      resolve(import.meta.dirname, '../../../../tokens/src/oy-components.css'),
      'utf8',
    );
    for (const count of ['1', '2', '3', '4']) {
      expect(css, `data-cols="${count}"`).toContain(`.oy-glance[data-cols="${count}"] {`);
    }
  });

  it('adds the line under the strip and chips every missing value', async () => {
    const band = (await renderToBody(WithCaption)).querySelector('.oy-glance-band');
    expect(text(band?.querySelector('.oy-glance-caption'))).toMatch(
      /^Everything you need to say yes/,
    );
    const pending = (await renderToBody(Pending)).querySelectorAll('.oy-glance .oy-pend');
    expect(pending).toHaveLength(5);
  });

  it('sits inside a column without its band or its wrap', async () => {
    const body = await renderToBody(InColumn);
    expect(body.querySelector('.oy-glance-band')).toBeNull();
    expect(body.querySelector('.oy-wrap')).toBeNull();
    const strip = body.querySelector('.oy-glance');
    expect(strip?.classList.contains('oy-glance--inline')).toBe(true);
    expect(strip?.hasAttribute('id')).toBe(false);
    expect(strip?.getAttribute('data-cols')).toBe('4');
    expect(strip?.querySelectorAll('.oy-pend')).toHaveLength(4);
  });

  it('keeps the band with the Pending line when there are no facts', async () => {
    const band = (await renderToBody(Empty)).querySelector('.oy-glance-band');
    expect(band?.querySelector('.oy-glance')).toBeNull();
    expect(text(band?.querySelector('.oy-pend-line'))).toContain('the facts at a glance');
  });

  it("makes a cell's note a link when it has a safe href", async () => {
    const cells = (await renderToBody(NoteLink)).querySelectorAll('.oy-glance > div');
    expect(cells[0]?.querySelector('small a')).toBeNull();
    const link = cells[1]?.querySelector('small a.oy-glance-link');
    expect(link?.getAttribute('href')).toBe('/our-story#board');
    expect(text(link)).toBe('Our Story');
  });
});
