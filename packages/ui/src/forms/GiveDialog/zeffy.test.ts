import { describe, expect, it } from 'vitest';
import { ZEFFY_EMBED_ID, ZEFFY_ORIGIN, zeffyFrameSrc, zeffyPageHref } from './zeffy';

// Zeffy's public sample form, whose embed and page addresses were both checked on 27 September 2026
// (docs/research/online-giving-options.md, source 33), and the slug in Zeffy's own embed code (source 3).
const SAMPLE = 'fd612afb-2973-43d9-90c4-d9be3049fa8a';
const HELP = 'donner-pour-soutenir-la-cause-431';

describe('the contract', () => {
  it("names Zeffy's origin and the dialog's own form", () => {
    expect(ZEFFY_ORIGIN).toBe('https://www.zeffy.com');
    expect(ZEFFY_EMBED_ID).toBe('give');
  });
});

describe('zeffyFrameSrc', () => {
  it('adds the two parameters that make Zeffy post its messages', () => {
    expect(zeffyFrameSrc(`https://www.zeffy.com/en-US/embed/donation-form/${SAMPLE}`)).toBe(
      `https://www.zeffy.com/en-US/embed/donation-form/${SAMPLE}?embed-version=v2&embedId=give`,
    );
  });

  it("keeps the address's own parameters and fragment", () => {
    expect(
      zeffyFrameSrc(`https://www.zeffy.com/embed/donation-form/${HELP}?utm_source=site#top`),
    ).toBe(
      `https://www.zeffy.com/embed/donation-form/${HELP}?utm_source=site&embed-version=v2&embedId=give#top`,
    );
  });

  it('replaces a version or an id already in the address, so the messages name this form', () => {
    expect(
      zeffyFrameSrc(
        `https://www.zeffy.com/embed/donation-form/${HELP}?embedId=other&embed-version=v1`,
      ),
    ).toBe(`https://www.zeffy.com/embed/donation-form/${HELP}?embedId=give&embed-version=v2`);
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

  it("keeps the address's own parameters", () => {
    expect(
      zeffyPageHref(`https://www.zeffy.com/en-US/embed/donation-form/${SAMPLE}?utm_source=site`),
    ).toBe(`https://www.zeffy.com/en-US/donation-form/${SAMPLE}?utm_source=site`);
  });

  it('answers nothing for any other address, so the dialog draws no link', () => {
    for (const value of [
      `https://www.zeffy.com/en-US/donation-form/${SAMPLE}`,
      `https://www.zeffy.com/en-US/embed/ticketing/${SAMPLE}`,
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
