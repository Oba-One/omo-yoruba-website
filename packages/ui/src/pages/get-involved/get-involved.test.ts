import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as doorsStories from './Doors.stories';
import * as htaStories from './Hta.stories';

const Doors = composeStories(doorsStories);
const Hta = composeStories(htaStories);

describe('the Get Involved page-section stories', () => {
  it('doors: four cards in order with their chips and anchors, the first gold, as cards or rows', async () => {
    const cards = (await renderToBody(Doors.Cards)).querySelector('.oy-home');
    expect(cards?.getAttribute('data-doors')).toBe('cards');
    expect(cards?.querySelectorAll('h1')).toHaveLength(1);
    expect(text(cards?.querySelector('#doors h2.oy-visually-hidden'))).toBe('Ways in');
    const doors = [...(cards?.querySelectorAll('#doors .oy-door-card') ?? [])];
    expect(doors.map((door) => door.id)).toEqual(['member', 'volunteer', 'vendor', 'partner']);
    expect(doors.map((door) => text(door.querySelector('.oy-door-label')))).toEqual([
      'Membership',
      'Volunteer',
      'Vendors',
      'Partnership',
    ]);
    expect(cards?.querySelector('#doors .oy-card-grid')?.getAttribute('data-columns')).toBe('2');
    expect(cards?.querySelectorAll('#doors .oy-btn--primary')).toHaveLength(1);
    expect(doors[0]?.querySelector('.oy-btn--primary')).not.toBeNull();
    // No dues, fee, date or crowd the register marks invented.
    expect(text(cards)).not.toMatch(/\$|April|four thousand|annual meeting/i);

    const rows = (await renderToBody(Doors.Rows)).querySelector('.oy-home');
    expect(rows?.querySelector('#doors .oy-card-grid')?.getAttribute('data-columns')).toBe('1');
    expect(rows?.querySelectorAll('#doors .oy-door-card--row')).toHaveLength(4);
  });

  it('hta: the prose beside its three cells, the names once listed, or the section gone', async () => {
    const shown = (await renderToBody(Hta.Shown)).querySelector('.oy-home');
    expect(text(shown?.querySelector('#associations h2'))).toBe('Hometown associations');
    const cells = [...(shown?.querySelectorAll('#associations .oy-glance > div') ?? [])];
    const words = (cell: Element) => [...cell.children].map((child) => text(child)).join(' ');
    expect(cells.map(words)).toEqual([
      'Associations 9',
      'Listed publicly Not yet',
      'To connect Ask when you join',
    ]);
    expect(shown?.querySelector('#associations .oy-partners')).toBeNull();

    const listed = (await renderToBody(Hta.Listed)).querySelector('.oy-home');
    expect(listed?.querySelectorAll('#associations .oy-partners li')).toHaveLength(2);
    expect(listed?.querySelectorAll('#associations .oy-glance > div')).toHaveLength(2);

    const hidden = (await renderToBody(Hta.Hidden)).querySelector('.oy-home');
    expect(hidden?.getAttribute('data-hta')).toBe('hidden');
    expect(hidden?.querySelector('#associations')).toBeNull();
    expect(hidden?.querySelector('#talk')).not.toBeNull();
  });

  it('talk: the contact facts owed, the message button, and the two boxes with the one gold Donate', async () => {
    const root = (await renderToBody(Hta.Hidden)).querySelector('#talk');
    expect(text(root?.querySelector('h2'))).toBe('Or just talk to someone');
    const facts = [...(root?.querySelectorAll('.oy-fact') ?? [])].map(
      (fact) => `${text(fact.querySelector('dt'))} ${text(fact.querySelector('dd'))}`,
    );
    expect(facts).toEqual([
      'Email Pending: the general inbox',
      'Phone Pending: phone number',
      'Who answers Pending: who answers the general inbox',
      'Response time Pending: how soon the general inbox replies',
    ]);
    // No phone in the settings, so no Call button; the message button opens the contact form.
    expect(root?.querySelector('a[href^="tel:"]')).toBeNull();
    expect(root?.querySelector('a[data-enquiry="contact"]')).not.toBeNull();
    const boxes = [...(root?.querySelectorAll('.oy-handoff') ?? [])];
    expect(boxes.map((box) => text(box.querySelector('.oy-handoff-say')))).toEqual([
      'Meet the people you are writing to.',
      'Would rather give than join? That takes about a minute.',
    ]);
    expect(boxes[0]?.querySelector('a[href="/our-story"]')).not.toBeNull();
    const give = boxes[1]?.querySelector('a[data-give]');
    expect(give?.classList.contains('oy-btn--primary')).toBe(true);
  });
});
