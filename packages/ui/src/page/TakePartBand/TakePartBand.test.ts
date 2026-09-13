import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './TakePartBand.stories';

const { Default, SponsorFirst, Gala, NoLabels, Kicker, RowPending, Pending } =
  composeStories(stories);

const rowsOf = (body: HTMLElement) => [...body.querySelectorAll('.oy-takepart > .oy-path')];

describe('TakePartBand', () => {
  it("draws Odunde's rows in order, each chip, accent and form following its way in", async () => {
    const body = await renderToBody(Default);
    expect(body.querySelector('.oy-takepart')?.getAttribute('data-labels')).toBe('column');
    const rows = rowsOf(body);
    expect(rows.map((row) => row.getAttribute('data-way'))).toEqual([
      'vendor',
      'sponsor',
      'performer',
      'volunteer',
    ]);
    expect(rows.map((row) => text(row.querySelector('.oy-path-chip')))).toEqual([
      'Vendors',
      'Sponsors',
      'Performers',
      'Volunteers',
    ]);
    expect(rows.map((row) => row.querySelector('a.oy-btn')?.getAttribute('data-enquiry'))).toEqual([
      'vendor',
      'sponsor',
      'performer',
      'volunteer',
    ]);
    expect(rows.map((row) => text(row.querySelector('a.oy-btn'))?.replace('→', ''))).toEqual([
      'Apply for a booth',
      'Sponsor Odunde',
      'Ask about performing',
      'Volunteer',
    ]);
  });

  it('gives the first row the one gold action and the rest the outline', async () => {
    const body = await renderToBody(Default);
    expect(body.querySelectorAll('.oy-btn--primary')).toHaveLength(1);
    expect(rowsOf(body)[0]?.querySelector('.oy-btn--primary')).not.toBeNull();
    expect(body.querySelectorAll('.oy-btn--secondary')).toHaveLength(3);
  });

  it("adds the vendor terms' registry chip to the vendor row's line, and nothing to the others", async () => {
    const [vendor, sponsor] = rowsOf(await renderToBody(Default));
    const line = vendor?.querySelector('.oy-path-body p');
    expect(text(line)).toBe(
      'A booth is held once the fee is paid. Pending: fees, deadline and permit rules',
    );
    expect(sponsor?.querySelector('.oy-pend')).toBeNull();
  });

  it('moves the lead way in to the top of the markup, and the gold with it', async () => {
    const rows = rowsOf(await renderToBody(SponsorFirst));
    expect(rows.map((row) => row.getAttribute('data-way'))).toEqual([
      'sponsor',
      'vendor',
      'performer',
      'volunteer',
    ]);
    expect(rows[0]?.querySelector('.oy-btn--primary')).not.toBeNull();
    expect(rows[1]?.querySelector('.oy-btn--secondary')).not.toBeNull();
  });

  it('draws the Gala rows with the table form and the quiet give row, and no vendor terms', async () => {
    const body = await renderToBody(Gala);
    const rows = rowsOf(body);
    expect(rows.map((row) => row.getAttribute('data-way'))).toEqual([
      'sponsor',
      'table',
      'volunteer',
      'give',
    ]);
    expect(rows[1]?.querySelector('a.oy-btn')?.getAttribute('data-enquiry')).toBe('table');
    const give = rows[3]?.querySelector('a.oy-btn');
    expect(give?.className).toContain('oy-btn--quiet');
    expect(give?.hasAttribute('data-give')).toBe(true);
    expect(body.querySelectorAll('.oy-btn--primary')).toHaveLength(1);
    expect(body.querySelector('.oy-pend')).toBeNull();
  });

  it('carries the label style on the column', async () => {
    for (const [story, labels] of [
      [NoLabels, 'none'],
      [Kicker, 'kicker'],
    ] as const) {
      const body = await renderToBody(story);
      expect(body.querySelector('.oy-takepart')?.getAttribute('data-labels')).toBe(labels);
    }
  });

  it('names what an unfinished row owes and passes the gold to the next row that works', async () => {
    const rows = rowsOf(await renderToBody(RowPending));
    const chip = 'Pending: a way in, its title or its button label';
    expect(text(rows[0]?.querySelector('h3'))).toBe(chip);
    expect(rows[0]?.querySelector('a.oy-btn')).toBeNull();
    expect(rows[1]?.querySelector('.oy-btn--primary')).not.toBeNull();
  });

  it('shows the Pending line when the Studio holds no rows', async () => {
    const body = await renderToBody(Pending);
    expect(body.querySelector('.oy-path')).toBeNull();
    const line = body.querySelector('.oy-takepart .oy-pend-line');
    expect(text(line?.querySelector('b'))).toBe('Pending from you');
    expect(text(line)).toContain('the ways in');
  });
});
