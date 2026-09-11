import { describe, expect, it } from 'vitest';
import { emDashMessage, marksMessage, sentenceCaseMessage, voiceMessages } from './checks';

describe('emDashMessage', () => {
  it('names the replacement when a string holds an em dash', () => {
    const dash = String.fromCharCode(0x2014);
    expect(emDashMessage(`Odunde ${dash} the festival`)).toBe(
      'Replace the em dash with a comma, a colon or a new sentence.',
    );
  });

  it('passes clean strings, empty values and non strings', () => {
    expect(emDashMessage('Odunde, the festival')).toBe(true);
    expect(emDashMessage(undefined)).toBe(true);
    expect(emDashMessage(12)).toBe(true);
  });

  it('allows an en dash between digits and nowhere else', () => {
    const en = String.fromCharCode(0x2013);
    expect(emDashMessage(`11${en}7`)).toBe(true);
    expect(emDashMessage(`market ${en} plaza`)).not.toBe(true);
  });
});

describe('marksMessage', () => {
  it('names every bare term with its marked form', () => {
    expect(marksMessage('Visit Oja Balogun and Agbala Omode')).toBe(
      'Add the marks: Oja Balogun should be Ọjà Balógun, Agbala Omode should be Àgbàlá Ọmọde.',
    );
  });

  it('passes marked forms and code-like identifiers', () => {
    expect(marksMessage('Visit Ọjà Balógun')).toBe(true);
    expect(marksMessage('oja-balogun')).toBe(true);
  });
});

describe('sentenceCaseMessage', () => {
  it('asks for sentence case and lists the words that counted', () => {
    expect(sentenceCaseMessage('Become A Member Today')).toBe(
      'Use sentence case: only the first word and names take a capital (Become, A, Member, Today).',
    );
  });

  it('passes sentence case, proper nouns and two word labels', () => {
    expect(sentenceCaseMessage('Sponsor the End-of-Year Gala at Leimert Park')).toBe(true);
    expect(sentenceCaseMessage('Our Story')).toBe(true);
    expect(sentenceCaseMessage(undefined)).toBe(true);
  });
});

describe('voiceMessages', () => {
  it('collects every finding for a block of Portable Text spans', () => {
    const dash = String.fromCharCode(0x2014);
    const blocks = [
      {
        _type: 'block',
        children: [
          { _type: 'span', text: `Ẹ káàbọ̀ ${dash} welcome` },
          { _type: 'span', text: 'to Oja Balogun' },
        ],
      },
      { _type: 'pullQuote', quote: 'Fine as it is' },
    ];
    expect(voiceMessages(blocks)).toEqual([
      'Replace the em dash with a comma, a colon or a new sentence.',
      'Add the marks: Oja Balogun should be Ọjà Balógun.',
    ]);
  });
});
