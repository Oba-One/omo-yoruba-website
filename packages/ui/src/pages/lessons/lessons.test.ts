import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as lesson from './Lesson.stories';
import * as portraits from './Portraits.stories';

const Portraits = composeStories(portraits);
const Lesson = composeStories(lesson);

describe('the Lessons page-section stories', () => {
  it('portraits: the teacher owed, then shown with her portrait or the woven tick', async () => {
    const pending = (await renderToBody(Portraits.Pending)).querySelector('.oy-home');
    expect(pending?.querySelectorAll('h1')).toHaveLength(1);
    expect(pending?.querySelectorAll('#glance .oy-glance > div')).toHaveLength(4);
    const card = pending?.querySelector('#teacher .oy-person');
    expect(card?.classList.contains('oy-person--nophoto')).toBe(true);
    expect(text(card?.querySelector('.oy-person-role'))).toBe('Teacher');
    expect(text(card?.querySelector('h3'))).toBe("Pending: the teacher's name and bio");
    expect(text(pending?.querySelector('#teacher .oy-enquiry-card-email'))).toBe(
      "Or email Pending: the teacher's email",
    );
    expect(pending?.querySelector('#teacher .oy-enquiry-card .oy-btn--secondary')).not.toBeNull();

    const shown = (await renderToBody(Portraits.Shown)).querySelector('.oy-home');
    expect(shown?.getAttribute('data-portraits')).toBe('shown');
    expect(shown?.querySelector('#teacher .oy-person-media img')).not.toBeNull();
    const hidden = (await renderToBody(Portraits.Hidden)).querySelector('.oy-home');
    expect(hidden?.getAttribute('data-portraits')).toBe('hidden');
    expect(hidden?.querySelector('#teacher .oy-person-media')).toBeNull();
    expect(hidden?.querySelector('#teacher .oy-person--nophoto')).not.toBeNull();
    // Never the old name of the program in display text.
    expect(text(shown)).not.toMatch(/School/);
  });

  it('lesson: the day-led steps after what you learn, their Pending line, or the section hidden', async () => {
    const shown = (await renderToBody(Lesson.Shown)).querySelector('.oy-home');
    expect(shown?.getAttribute('data-lesson')).toBe('shown');
    expect(text(shown?.querySelector('#learn .oy-split-main .oy-pend'))).toBe(
      'Pending: what the lessons teach, in her words',
    );
    expect(text(shown?.querySelector('#learn .oy-split-aside .oy-pend-line'))).toContain(
      'what each level covers',
    );
    expect(shown?.querySelectorAll('#lesson ol.oy-sched--day li')).toHaveLength(3);
    const pending = (await renderToBody(Lesson.Pending)).querySelector('#lesson');
    expect(text(pending?.querySelector('.oy-pend-line'))).toContain('the shape of a lesson');
    const hidden = (await renderToBody(Lesson.Hidden)).querySelector('.oy-home');
    expect(hidden?.querySelector('#lesson')).toBeNull();
    expect(hidden?.querySelector('#learn')).not.toBeNull();
  });
});
