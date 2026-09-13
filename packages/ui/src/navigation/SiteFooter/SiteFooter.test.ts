import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './SiteFooter.stories';

const { Default, Pending, Filled, NewsletterSuccess } = composeStories(stories);

describe('SiteFooter', () => {
  it('reads the EIN placeholder and Pending chips while the settings are empty', async () => {
    const body = await renderToBody(Pending);
    expect(text(body.querySelector('.oy-footer-trust'))).toContain(
      '501(c)(3) nonprofit since 1997 • EIN XX-XXXXXXX • Los Angeles, CA',
    );
    const chips = Array.from(body.querySelectorAll('.oy-pend')).map((chip) => text(chip));
    expect(chips).toEqual([
      'Pending: the general inbox',
      'Pending: mailing address',
      'Pending: social links',
      'Pending: the newsletter title',
    ]);
    expect(body.querySelector('a[href^="mailto:"]')).toBeNull();
  });

  it('keeps the seeded newsletter copy and still shows the owed facts as Pending', async () => {
    const body = await renderToBody(Default);
    expect(text(body.querySelector('.oy-footer-newsletter h2'))).toBe(
      'Festival news and updates, in your inbox',
    );
    expect(body.querySelectorAll('.oy-pend')).toHaveLength(3);
    expect(body.querySelector('form.oy-signup')).not.toBeNull();
  });

  it('renders the real EIN, address, email, phone and one link per social network once set', async () => {
    const body = await renderToBody(Filled);
    expect(text(body.querySelector('[data-ein]'))).toBe('12-3456789');
    expect(body.querySelector('a[href="mailto:hello@example.org"]')).not.toBeNull();
    expect(body.querySelector('a[href="tel:0000000000"]')).not.toBeNull();
    expect(body.querySelectorAll('.oy-footer-address br')).toHaveLength(2);
    const socials = Array.from(body.querySelectorAll('.oy-socials a')).map((a) => [
      a.getAttribute('aria-label'),
      a.getAttribute('href'),
    ]);
    expect(socials).toEqual([
      ['Instagram', 'https://instagram.com/example'],
      ['Facebook', 'https://facebook.com/example'],
      ['LinkedIn', 'https://linkedin.com/company/example'],
      ['YouTube', 'https://youtube.com/@example'],
    ]);
    expect(body.querySelectorAll('.oy-socials svg[aria-hidden="true"]')).toHaveLength(4);
    expect(body.querySelector('.oy-pend')).toBeNull();
  });

  it('makes Volunteer and Contact enquiry triggers and Donate a Give trigger', async () => {
    const body = await renderToBody(Default);
    const contact = body.querySelector('a[data-enquiry="contact"]');
    expect(text(contact)).toBe('Contact');
    expect(contact?.getAttribute('href')).toBe('?enquiry=contact#enquiry');
    expect(body.querySelector('a[data-enquiry="volunteer"]')?.getAttribute('href')).toBe(
      '?enquiry=volunteer#enquiry',
    );
    expect(body.querySelector('a[data-give]')?.getAttribute('href')).toBe('/donate#give');
    // h2, not the prototype's h4: the footer never skips a heading level after a page's last h2.
    expect(body.querySelector('.oy-footer h4')).toBeNull();
    const columns = Array.from(body.querySelectorAll('.oy-footer-grid > div > h2')).map((h) =>
      text(h),
    );
    expect(columns).toEqual(['Take part', 'Learn more']);
  });

  it('passes the newsletter state through', async () => {
    const body = await renderToBody(NewsletterSuccess);
    expect(text(body.querySelector('.oy-signup button[type="submit"]'))).toBe('Ẹ ṣé! ✓');
    expect(body.querySelector('footer.oy-dark')).not.toBeNull();
  });
});
