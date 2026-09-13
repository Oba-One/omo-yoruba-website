import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './GlanceStrip.stories';

const { Five, Four, WithCaption, Pending, InColumn } = composeStories(stories);

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
});
