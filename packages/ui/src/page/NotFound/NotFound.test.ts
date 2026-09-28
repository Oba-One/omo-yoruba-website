import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './NotFound.stories';

const { Default, NoKicker } = composeStories(stories);

describe('NotFound', () => {
  it('draws the indigo band with one H1 labelling it, the line and three doors home', async () => {
    const band = (await renderToBody(Default)).querySelector('section.oy-not-found');
    expect(band?.classList.contains('oy-dark')).toBe(true);
    expect(band?.getAttribute('aria-labelledby')).toBe('not-found-heading');
    expect(band?.querySelectorAll('h1')).toHaveLength(1);
    expect(text(band?.querySelector('h1#not-found-heading'))).toBe('This page is not here');
    expect(text(band?.querySelector('p.oy-sec-lead'))).toBe(
      'The address may be old or mistyped. These three doors lead back into the site.',
    );
    const doors = [...(band?.querySelectorAll('.oy-button-row a.oy-btn') ?? [])];
    expect(doors.map((door) => door.getAttribute('href'))).toEqual([
      '/',
      '/get-involved',
      '/programs',
    ]);
  });

  it('gives the gold to the first door only', async () => {
    const body = await renderToBody(Default);
    expect(body.querySelectorAll('.oy-btn--primary')).toHaveLength(1);
    expect(body.querySelector('.oy-button-row a.oy-btn')?.className).toContain('oy-btn--primary');
    expect(body.querySelectorAll('.oy-btn--secondary')).toHaveLength(2);
  });

  it('shows the kicker only when it is given', async () => {
    expect(text((await renderToBody(Default)).querySelector('.oy-kicker'))).toContain(
      'Page not found',
    );
    expect((await renderToBody(NoKicker)).querySelector('.oy-kicker')).toBeNull();
  });
});
