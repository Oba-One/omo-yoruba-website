import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Initiative.stories';

const { Default, Filled, Stacked, StatusHidden } = composeStories(stories);

describe('Initiative', () => {
  it('waits for every owed fact under its own chip, inside the Collective scope', async () => {
    const root = (await renderToBody(Default)).querySelector('.cc-init');
    expect(root?.getAttribute('data-scope')).toBe('collective');
    expect(root?.getAttribute('data-layout')).toBe('side');
    const pills = root?.querySelector('.cc-init-pills');
    expect(pills?.querySelector('.cc-status')).toBeNull();
    expect(text(pills?.querySelector('.oy-pend'))).toBe('Pending: the status line');
    expect(text(pills?.querySelector('.cc-memberled'))).toBe('Member-led project');
    const heading = root?.querySelector('h2');
    expect(text(heading)).toBe('Solar Hub');
    expect(heading?.id).toBe('solar-hub-heading');
    expect(text(root?.querySelector('.oy-sec-lead .oy-pend'))).toBe(
      'Pending: what the initiative is',
    );
    const facts = root?.querySelector('.oy-glance--inline');
    expect(facts?.getAttribute('data-cols')).toBe('4');
    expect([...(facts?.querySelectorAll('.oy-pend') ?? [])].map(text)).toEqual([
      'Pending: the status',
      'Pending: who it serves',
      'Pending: when it started',
      'Pending: what comes next',
    ]);
    expect(root?.querySelector('figure img')).toBeNull();
    expect(text(root?.querySelector('figure'))).toContain('a photo of Solar Hub');
  });

  it('draws the status line in its pill with the dot, the blurb, the facts and the photograph', async () => {
    const root = (await renderToBody(Filled)).querySelector('.cc-init');
    const status = root?.querySelector('.cc-init-pills .cc-status');
    expect(text(status)).toBe('[ Status line ]');
    expect(status?.querySelector('i')?.getAttribute('aria-hidden')).toBe('true');
    expect(text(root?.querySelector('.oy-sec-lead'))).toBe(
      '[ What the project is, in two sentences ]',
    );
    expect(root?.querySelectorAll('.oy-glance--inline .oy-pend')).toHaveLength(0);
    expect(root?.querySelector('figure img')?.getAttribute('alt')).toBe(
      '[ A photograph of the project ]',
    );
  });

  it('stacks the copy above the photograph under the stacked option', async () => {
    const root = (await renderToBody(Stacked)).querySelector('.cc-init');
    expect(root?.getAttribute('data-layout')).toBe('stacked');
    expect(root?.firstElementChild?.classList.contains('cc-init-copy')).toBe(true);
  });

  it('hides the status pill and its chip, keeping the member-led pill and the status fact', async () => {
    const root = (await renderToBody(StatusHidden)).querySelector('.cc-init');
    const pills = root?.querySelector('.cc-init-pills');
    expect(pills?.querySelector('.cc-status')).toBeNull();
    expect(pills?.querySelector('.oy-pend')).toBeNull();
    expect(pills?.querySelector('.cc-memberled')).toBeInstanceOf(HTMLElement);
    expect(text(root?.querySelector('.oy-glance--inline b'))).toBe('Status');
  });
});
