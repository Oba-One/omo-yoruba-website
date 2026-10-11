import { describe, expect, it } from 'vitest';
import { ZEFFY_FORMS, ZEFFY_ORIGIN, zeffyFrameSrc, zeffyPageHref } from './zeffy';

// Zeffy's public sample form, whose embed and page addresses were both checked on 27 September 2026
// (docs/research/online-giving-options.md, source 33), and the slug in Zeffy's own embed code (source 3).
const SAMPLE = 'fd612afb-2973-43d9-90c4-d9be3049fa8a';
const HELP = 'donner-pour-soutenir-la-cause-431';
// A ticketing form's slug, the shape of a membership form's: its embed and page addresses were both checked
// on 10 October 2026 with the organization's own form (ADR 0050).
const MEMBERSHIPS = 'an-organization-memberships';

describe('the contract', () => {
  it("names Zeffy's origin and the site's forms, each the id of its own frame", () => {
    expect(ZEFFY_ORIGIN).toBe('https://www.zeffy.com');
    expect(ZEFFY_FORMS).toEqual(['give', 'join']);
  });
});

describe('zeffyFrameSrc', () => {
  it('adds the two parameters that make Zeffy post its messages', () => {
    expect(zeffyFrameSrc(`https://www.zeffy.com/en-US/embed/donation-form/${SAMPLE}`, 'give')).toBe(
      `https://www.zeffy.com/en-US/embed/donation-form/${SAMPLE}?embed-version=v2&embedId=give`,
    );
  });

  it("names the form the frame belongs to, so each dialog hears only its own form's messages", () => {
    expect(zeffyFrameSrc(`https://www.zeffy.com/embed/ticketing/${MEMBERSHIPS}`, 'join')).toBe(
      `https://www.zeffy.com/embed/ticketing/${MEMBERSHIPS}?embed-version=v2&embedId=join`,
    );
  });

  it("keeps the address's own parameters and fragment", () => {
    expect(
      zeffyFrameSrc(
        `https://www.zeffy.com/embed/donation-form/${HELP}?utm_source=site#top`,
        'give',
      ),
    ).toBe(
      `https://www.zeffy.com/embed/donation-form/${HELP}?utm_source=site&embed-version=v2&embedId=give#top`,
    );
  });

  it('replaces a version or an id already in the address, so the messages name this form', () => {
    expect(
      zeffyFrameSrc(
        `https://www.zeffy.com/embed/donation-form/${HELP}?embedId=other&embed-version=v1`,
        'give',
      ),
    ).toBe(`https://www.zeffy.com/embed/donation-form/${HELP}?embedId=give&embed-version=v2`);
  });

  // Zeffy's pop-up button code hands out the embed address this way (`zeffy-form-link="...?modal=true"`), and
  // with it the form draws its own close button in a frame as narrow as the dialog's.
  it("drops the pop-up code's modal parameter, whatever else the address carries", () => {
    expect(
      zeffyFrameSrc(`https://www.zeffy.com/embed/donation-form/${HELP}?modal=true`, 'give'),
    ).toBe(`https://www.zeffy.com/embed/donation-form/${HELP}?embed-version=v2&embedId=give`);
    expect(
      zeffyFrameSrc(
        `https://www.zeffy.com/en-US/embed/donation-form/${SAMPLE}?utm_source=site&modal=true`,
        'give',
      ),
    ).toBe(
      `https://www.zeffy.com/en-US/embed/donation-form/${SAMPLE}?utm_source=site&embed-version=v2&embedId=give`,
    );
  });
});

describe('zeffyPageHref', () => {
  it('drops the embed segment from an embed address, with its locale or without', () => {
    expect(zeffyPageHref(`https://www.zeffy.com/en-US/embed/donation-form/${SAMPLE}`)).toBe(
      `https://www.zeffy.com/en-US/donation-form/${SAMPLE}`,
    );
    expect(zeffyPageHref(`https://www.zeffy.com/fr-ca/embed/donation-form/${HELP}`)).toBe(
      `https://www.zeffy.com/fr-ca/donation-form/${HELP}`,
    );
    expect(zeffyPageHref(`https://www.zeffy.com/embed/donation-form/${HELP}`)).toBe(
      `https://www.zeffy.com/donation-form/${HELP}`,
    );
  });

  it("finds a ticketing form's page the same way, a membership form's among them", () => {
    expect(zeffyPageHref(`https://www.zeffy.com/embed/ticketing/${MEMBERSHIPS}`)).toBe(
      `https://www.zeffy.com/ticketing/${MEMBERSHIPS}`,
    );
    expect(zeffyPageHref(`https://www.zeffy.com/en-US/embed/ticketing/${MEMBERSHIPS}`)).toBe(
      `https://www.zeffy.com/en-US/ticketing/${MEMBERSHIPS}`,
    );
  });

  it("keeps the address's own parameters and fragment, as they were typed", () => {
    expect(
      zeffyPageHref(`https://www.zeffy.com/en-US/embed/donation-form/${SAMPLE}?utm_source=site`),
    ).toBe(`https://www.zeffy.com/en-US/donation-form/${SAMPLE}?utm_source=site`);
    expect(
      zeffyPageHref(`https://www.zeffy.com/embed/donation-form/${HELP}?note=a%20b&mark=~#top`),
    ).toBe(`https://www.zeffy.com/donation-form/${HELP}?note=a%20b&mark=~#top`);
  });

  it("drops the pop-up code's modal parameter from the page link too, and nothing else", () => {
    expect(zeffyPageHref(`https://www.zeffy.com/embed/donation-form/${HELP}?modal=true`)).toBe(
      `https://www.zeffy.com/donation-form/${HELP}`,
    );
    expect(
      zeffyPageHref(
        `https://www.zeffy.com/en-US/embed/donation-form/${SAMPLE}?modal=true&utm_source=site#top`,
      ),
    ).toBe(`https://www.zeffy.com/en-US/donation-form/${SAMPLE}?utm_source=site#top`);
  });

  it('answers nothing for any other address, so the dialog draws no link', () => {
    for (const value of [
      `https://www.zeffy.com/en-US/donation-form/${SAMPLE}`,
      `https://www.zeffy.com/ticketing/${MEMBERSHIPS}`,
      `https://www.zeffy.com/en-US/embed/peer-to-peer/${SAMPLE}`,
      'https://www.zeffy.com/embed/v2/zeffy-embed.js',
      `https://www.zeffy.com/en-US/embed/donation-form/${SAMPLE}/extra`,
      `https://www.zeffy.com/en-US/embed/donation-form/${SAMPLE}/`,
      'https://www.zeffy.com/en-US/embed/donation-form/',
      `https://www.zeffy.com/english/embed/donation-form/${SAMPLE}`,
      `https://www.zeffy.com/en-US/EMBED/donation-form/${SAMPLE}`,
      `http://www.zeffy.com/en-US/embed/donation-form/${SAMPLE}`,
      `https://zeffy.com/en-US/embed/donation-form/${SAMPLE}`,
      `https://www.zeffy.com.example.org/en-US/embed/donation-form/${SAMPLE}`,
      'javascript:alert(1)',
      'not an address',
      '',
      null,
      undefined,
    ]) {
      expect(zeffyPageHref(value), String(value)).toBeUndefined();
    }
  });
});
