import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as emphasis from './Emphasis.stories';
import * as labels from './Labels.stories';
import * as schedule from './Schedule.stories';
import * as tiers from './Tiers.stories';
import * as treatment from './Treatment.stories';

const Treatment = composeStories(treatment);
const Schedule = composeStories(schedule);
const Labels = composeStories(labels);
const Tiers = composeStories(tiers);
const Emphasis = composeStories(emphasis);

describe('the Gala page-section stories', () => {
  it('treatment: the option on the root over the photo header, the glance, the evening and the seam', async () => {
    for (const [story, value] of [
      [Treatment.Formal, 'formal'],
      [Treatment.Warm, 'warm'],
    ] as const) {
      const root = (await renderToBody(story)).querySelector('.oy-home');
      expect(root?.getAttribute('data-treatment')).toBe(value);
      expect(root?.querySelector('header.oy-phead--photo h1')?.textContent).toBe(
        'End-of-Year Gala',
      );
      expect(root?.querySelectorAll('#glance .oy-glance > div')).toHaveLength(5);
      expect(text(root?.querySelector('#evening h2'))).toBe('The evening');
      expect(root?.querySelector('#evening + .oy-seam[aria-hidden="true"]')).not.toBeNull();
    }
  });

  it('schedule: the running order beside the intro, or no column', async () => {
    const shown = (await renderToBody(Schedule.Shown)).querySelector('.oy-home');
    expect(shown?.getAttribute('data-schedule')).toBe('shown');
    expect(shown?.querySelectorAll('#evening .oy-split-aside .oy-sched > li')).toHaveLength(3);
    expect(shown?.querySelector('#evening details')).toBeNull();
    const hidden = (await renderToBody(Schedule.Hidden)).querySelector('.oy-home');
    expect(hidden?.querySelector('#evening .oy-sched')).toBeNull();
    expect(text(hidden?.querySelector('#evening .oy-prose p'))).toMatch(
      /^The Gala closes our year/,
    );
  });

  it('labels: the option on the root and the column, the give row quiet', async () => {
    for (const [story, style] of [
      [Labels.Column, 'column'],
      [Labels.None, 'none'],
      [Labels.Kicker, 'kicker'],
    ] as const) {
      const root = (await renderToBody(story)).querySelector('.oy-home');
      expect(root?.getAttribute('data-labels')).toBe(style);
      const band = root?.querySelector('#take-part .oy-takepart');
      expect(band?.getAttribute('data-labels')).toBe(style);
      expect(band?.querySelectorAll('.oy-btn--primary')).toHaveLength(1);
      expect(band?.querySelector('.oy-path[data-way="give"] .oy-btn--quiet')).not.toBeNull();
    }
  });

  it('tiers: columns or rows on the root and the block', async () => {
    for (const [story, layout] of [
      [Tiers.Columns, 'columns'],
      [Tiers.Rows, 'rows'],
    ] as const) {
      const root = (await renderToBody(story)).querySelector('.oy-home');
      expect(root?.getAttribute('data-tiers')).toBe(layout);
      expect(root?.querySelector('#seats .oy-tiers')?.getAttribute('data-layout')).toBe(layout);
      expect(root?.querySelectorAll('#seats article.oy-tier')).toHaveLength(3);
      expect(text(root?.querySelector('#seats h2'))).toBe('Seats and tables');
    }
  });

  it('emphasis: the table tier leads in the markup only when tables are emphasised', async () => {
    const first = async (story: typeof Emphasis.Seats) =>
      (await renderToBody(story))
        .querySelector('#seats .oy-tiers > article')
        ?.getAttribute('data-variant');
    expect(await first(Emphasis.Seats)).toBe('buyNow');
    expect(await first(Emphasis.Tables)).toBe('enquiry');
  });
});
