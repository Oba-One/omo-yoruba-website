import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './ScheduleRow.stories';

const { TimeLed, DayLed, DayLedWording, WithoutZone } = composeStories(stories);

describe('ScheduleRow', () => {
  it('leads with the time or its chip, then what happens and the zone tag', async () => {
    const row = (await renderToBody(TimeLed)).querySelector('li.oy-sched-row');
    expect(text(row?.querySelector('.oy-sched-time .oy-pend'))).toBe('Pending: the time');
    expect(text(row?.querySelector('.oy-sched-what b'))).toBe('[ The opening of the day ]');
    expect(text(row?.querySelector('.oy-sched-what p'))).toMatch(/^\[ One line/);
    const tag = row?.querySelector('.oy-sched-tag');
    expect(text(tag)).toBe('Ọjà Balógun');
    expect(tag?.getAttribute('lang')).toBe('yo');
  });

  it('leads with the day for a day-led row and drops the tag without a zone', async () => {
    const day = (await renderToBody(DayLed)).querySelector('li.oy-sched-row');
    expect(text(day?.querySelector('.oy-sched-time'))).toBe('Pending: the day');
    const step = (await renderToBody(DayLedWording)).querySelector('li.oy-sched-row');
    expect(text(step?.querySelector('.oy-sched-time'))).toBe('Pending: the step');
    const bare = (await renderToBody(WithoutZone)).querySelector('li.oy-sched-row');
    expect(bare?.querySelector('.oy-sched-tag')).toBeNull();
  });
});
