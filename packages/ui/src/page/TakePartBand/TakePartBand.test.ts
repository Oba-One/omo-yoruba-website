import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './TakePartBand.stories';

const {
  Default,
  SponsorFirst,
  Gala,
  Programs,
  Lessons,
  Collective,
  NoLabels,
  Kicker,
  RowPending,
  Pending,
} = composeStories(stories);

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

  it('draws the program ways in: enrol and member open their forms on the performer accent', async () => {
    const programs = rowsOf(await renderToBody(Programs));
    expect(programs.map((row) => row.getAttribute('data-accent'))).toEqual([
      'enrol',
      'volunteer',
      'give',
    ]);
    expect(programs.map((row) => text(row.querySelector('.oy-path-chip')))).toEqual([
      'Enrol',
      'Volunteer',
      'Give',
    ]);
    const enrol = programs[0]?.querySelector('a.oy-btn');
    expect(enrol?.getAttribute('data-enquiry')).toBe('enrol');
    expect(enrol?.className).toContain('oy-btn--primary');

    const lessons = rowsOf(await renderToBody(Lessons));
    expect(lessons.map((row) => text(row.querySelector('.oy-path-chip')))).toEqual([
      'Volunteer',
      'Membership',
      'Give',
    ]);
    expect(lessons[0]?.querySelector('.oy-btn--primary')).not.toBeNull();
    expect(lessons[1]?.querySelector('a.oy-btn')?.getAttribute('data-enquiry')).toBe('member');
    // A row without a line draws no empty paragraph and no chip for it.
    expect(lessons[2]?.querySelector('.oy-path-body p')).toBeNull();
  });

  it("puts a row's own chip in place of its way in's, and sends Updates quietly to the newsletter form", async () => {
    const body = await renderToBody(Collective);
    const rows = rowsOf(body);
    expect(rows.map((row) => row.getAttribute('data-way'))).toEqual([
      'sponsor',
      'volunteer',
      'updates',
    ]);
    expect(rows.map((row) => text(row.querySelector('.oy-path-chip')))).toEqual([
      'Partner',
      'Skills',
      'Updates',
    ]);
    expect(rows[0]?.querySelector('a.oy-btn')?.getAttribute('data-enquiry')).toBe('sponsor');
    const updates = rows[2]?.querySelector('a.oy-btn');
    expect(updates?.getAttribute('href')).toBe('#subscribe');
    expect(updates?.hasAttribute('data-enquiry')).toBe(false);
    expect(updates?.className).toContain('oy-btn--quiet');
    expect(body.querySelectorAll('.oy-btn--primary')).toHaveLength(1);
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
