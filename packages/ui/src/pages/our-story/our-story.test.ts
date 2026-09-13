import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as biosStories from './Bios.stories';
import * as portraitsStories from './Portraits.stories';
import * as timelineStories from './Timeline.stories';

const Timeline = composeStories(timelineStories);
const Bios = composeStories(biosStories);
const Portraits = composeStories(portraitsStories);

describe('the Our Story page-section stories', () => {
  it('timeline: hidden by default, shown with its entries, or its Pending line', async () => {
    const hidden = (await renderToBody(Timeline.Hidden)).querySelector('.oy-home');
    expect(hidden?.getAttribute('data-timeline')).toBe('hidden');
    expect(hidden?.querySelectorAll('h1')).toHaveLength(1);
    expect(hidden?.querySelector('#timeline')).toBeNull();
    const facts = [...(hidden?.querySelectorAll('#origin .oy-fact') ?? [])].map(
      (fact) => `${text(fact.querySelector('dt'))}: ${text(fact.querySelector('dd'))}`,
    );
    expect(facts).toEqual([
      'Founded: 1997, Los Angeles',
      'Founders: Pending: a founding fact',
      'Status: 501(c)(3) nonprofit',
      'First year: Pending: a founding fact',
    ]);
    expect(hidden?.querySelector('#origin .oy-ph')).not.toBeNull();
    // No invented founders, church hall or first-year detail.
    expect(text(hidden)).not.toMatch(/Balogun|Sofolahan|Crenshaw|blackboard|before Odunde/);
    const shown = (await renderToBody(Timeline.Shown)).querySelector('#timeline');
    expect(shown?.querySelectorAll('ol.oy-timeline li')).toHaveLength(4);
    expect(shown?.querySelectorAll('.oy-timeline-major')).toHaveLength(2);
    const pending = (await renderToBody(Timeline.ShownPending)).querySelector('#timeline');
    expect(text(pending?.querySelector('.oy-pend-line'))).toContain('the dated entries');
  });

  it('bios: the short bio, or the full bio under it where written', async () => {
    const short = (await renderToBody(Bios.Short)).querySelector('#board');
    expect(short?.querySelectorAll('.oy-person')).toHaveLength(4);
    expect(short?.querySelector('.oy-person-bio--full')).toBeNull();
    const owed = short?.querySelectorAll('.oy-person')[3];
    expect(text(owed?.querySelector('.oy-person-role'))).toBe('Pending: the role');
    expect(text(owed?.querySelector('.oy-person-bio'))).toBe('Pending: a short bio');
    const full = (await renderToBody(Bios.Full)).querySelector('#board');
    expect(full?.querySelectorAll('.oy-person-bio--full')).toHaveLength(2);
  });

  it('portraits: each group owed, then the portrait or the woven tick, or none at all', async () => {
    const pending = (await renderToBody(Portraits.Pending)).querySelector('.oy-home');
    expect(text(pending?.querySelector('#board .oy-pend-line'))).toContain(
      "the board's names, roles and bios",
    );
    expect(text(pending?.querySelector('#staff .oy-pend-line'))).toContain(
      'the staff and volunteers to list',
    );
    expect(
      pending?.querySelector('#staff .oy-handoff a[href="/programs/yoruba-lessons#teacher"]'),
    ).not.toBeNull();
    expect(text(pending)).not.toMatch(/Head teacher/);
    const contact = pending?.querySelector('#contact');
    expect(
      contact?.querySelector('.oy-enquiry-card[data-kind="contact"] .oy-btn--secondary'),
    ).not.toBeNull();
    expect(pending?.querySelectorAll('.oy-btn--primary')).toHaveLength(1);
    expect(contact?.querySelector('.oy-handoff a[href="/impact#governance"]')).not.toBeNull();
    expect(pending?.querySelectorAll('#take-part .oy-path')).toHaveLength(2);

    const shown = (await renderToBody(Portraits.Shown)).querySelector('.oy-home');
    expect(shown?.querySelectorAll('#board .oy-person-media img')).toHaveLength(1);
    expect(shown?.querySelectorAll('#board .oy-person--nophoto')).toHaveLength(3);
    expect(shown?.querySelectorAll('#staff .oy-person--compact')).toHaveLength(5);
    const hidden = (await renderToBody(Portraits.Hidden)).querySelector('.oy-home');
    expect(hidden?.getAttribute('data-portraits')).toBe('hidden');
    expect(hidden?.querySelectorAll('#board .oy-person-media')).toHaveLength(0);
  });
});
