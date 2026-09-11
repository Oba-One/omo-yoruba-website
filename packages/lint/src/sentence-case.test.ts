import { describe, expect, it } from 'vitest';
import { findTitleCase } from './sentence-case';
import { loadProperNouns } from './terms';

const properNouns = loadProperNouns();

describe('loadProperNouns', () => {
  it('loads the shared list, every entry starting with a capital', () => {
    expect(properNouns.length).toBeGreaterThan(20);
    for (const noun of properNouns) expect(noun).toMatch(/^\p{Lu}/u);
  });
});

describe('findTitleCase', () => {
  it('flags a heading with more than two capitalised words', () => {
    const findings = findTitleCase('Become A Member Of The Community', { properNouns });
    expect(findings).toHaveLength(1);
    expect(findings[0]?.words).toEqual(['Become', 'A', 'Member', 'Of', 'The', 'Community']);
  });

  it('accepts sentence case and two word labels', () => {
    expect(findTitleCase('Become a member', { properNouns })).toEqual([]);
    expect(findTitleCase('Get Involved', { properNouns })).toEqual([]);
    expect(findTitleCase('Our Story', { properNouns })).toEqual([]);
  });

  it('ignores the proper nouns and Yoruba names, matched as phrases', () => {
    expect(findTitleCase('Sponsor the End-of-Year Gala at Leimert Park', { properNouns })).toEqual(
      [],
    );
    expect(findTitleCase('Yoruba Language Lessons fall term', { properNouns })).toEqual([]);
    expect(findTitleCase('Apply for a booth at Ọjà Balógun', { properNouns })).toEqual([]);
  });

  it('ignores acronyms and words that are all capitals', () => {
    expect(findTitleCase('Kids & STEM at Odunde', { properNouns })).toEqual([]);
    expect(findTitleCase('EIN and the IRS letter', { properNouns })).toEqual([]);
  });

  it('checks each line on its own and reports the words that counted', () => {
    const findings = findTitleCase('Give now\nWhat Your Gift Does Here', { properNouns });
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ line: 2, words: ['What', 'Your', 'Gift', 'Does', 'Here'] });
  });

  it('honours a custom threshold', () => {
    expect(findTitleCase('Sponsor Our Programs', { properNouns })).toHaveLength(1);
    expect(findTitleCase('Sponsor Our Programs', { properNouns, threshold: 3 })).toEqual([]);
  });
});
