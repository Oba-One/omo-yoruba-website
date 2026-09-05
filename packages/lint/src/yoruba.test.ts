import { describe, expect, it } from 'vitest';
import { findBareTerms, loadTerms } from './yoruba';

const terms = loadTerms();

describe('loadTerms', () => {
  it('loads the shared word list with every bare form different from its correct form', () => {
    expect(terms.length).toBeGreaterThanOrEqual(11);
    for (const term of terms) {
      expect(term.bare).not.toEqual(term.correct);
    }
  });
});

describe('findBareTerms', () => {
  it('flags a bare term in prose and names the correct form', () => {
    const findings = findBareTerms('Visit Oja Balogun for suya.', terms);
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      line: 1,
      column: 7,
      bare: 'Oja Balogun',
      correct: 'Ọjà Balógun',
    });
  });

  it('matches whole words regardless of case unless the term is case sensitive', () => {
    expect(findBareTerms('The ODUN DE Festival', terms)).toHaveLength(1);
    expect(findBareTerms('The Odun De Festival', terms)).toHaveLength(1);
    expect(findBareTerms('the Ife bronze head', terms)).toHaveLength(1);
    expect(findBareTerms('a life well lived, IFE', terms)).toHaveLength(0);
  });

  it('accepts the correct forms', () => {
    const text =
      'Ẹ káàbọ̀ sí Ọjà Balógun, Àgbàlá Ọmọde àti Ẹgbẹ́ Ìbílẹ̀. Odún dé! Ẹ ṣeun. Omo Yorùbá. Odunde. aṣọ òkè, àdìrẹ, gèlè, Ifẹ̀.';
    expect(findBareTerms(text, terms)).toEqual([]);
  });

  it('ignores URLs, file paths, CSS names and code identifiers', () => {
    const text = [
      'https://omoyorubaofsocal.org/oja-balogun?ref=omo-yoruba',
      'images/odunde-2026-oja-balogun.jpg and design/Oja-Balogun.dc.html and /programs/oja-balogun',
      '.oy-adire and --adire-opacity-dark and .oy-aso-oke',
      'const adireDots = 1; const aso_oke = 2; const OmoYoruba = 3;',
    ].join('\n');
    expect(findBareTerms(text, terms)).toEqual([]);
  });

  it('ignores inline code and fenced code blocks in markdown', () => {
    const text = 'Say `Odun de` only in code.\n\n```\nOja Balogun\n```\n';
    expect(findBareTerms(text, terms)).toEqual([]);
  });

  it('masks kebab-case identifiers in code files but reads hyphens as prose in markdown', () => {
    expect(
      findBareTerms('<div class="oy-card adire-dots">', terms, { markdown: false }),
    ).toHaveLength(0);
    expect(findBareTerms('an adire-print shirt', terms)).toHaveLength(1);
    expect(findBareTerms('the Omo Yoruba-led team', terms)).toHaveLength(1);
  });

  it('does not let a masked span or a slash hide a multi-word term', () => {
    expect(findBareTerms('Oja `x` Balogun is here.', terms)).toHaveLength(0);
    expect(findBareTerms('Ẹ káàbọ̀ sí Oja Balogun/Agbala Omode', terms).map((f) => f.bare)).toEqual([
      'Oja Balogun',
      'Agbala Omode',
    ]);
  });

  it('reports a term that wraps across a line with its whitespace collapsed', () => {
    const findings = findBareTerms('the market called Oja\nBalogun opens', terms);
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ line: 1, column: 19, bare: 'Oja Balogun' });
    expect(findings[0]?.snippet).not.toContain('\n');
  });

  it('checks prose-only terms in prose, including sentence-final and inside attribute copy', () => {
    expect(findBareTerms('an adire dot field over the band', terms)).toHaveLength(1);
    expect(findBareTerms('a gele tied high', terms)).toHaveLength(1);
    expect(findBareTerms('She wore adire.', terms)).toHaveLength(1);
    expect(findBareTerms('alt="adire dot field"', terms)).toHaveLength(1);
  });

  it('exempts prose-only terms used as a whole quoted value or a key', () => {
    expect(findBareTerms('<body data-theme="adire">', terms)).toHaveLength(0);
    expect(findBareTerms("theme: 'adire'", terms)).toHaveLength(0);
    expect(findBareTerms('adire: subtle', terms)).toHaveLength(0);
    expect(findBareTerms('pattern = adire', terms)).toHaveLength(1);
  });

  it('reports every occurrence with its own column and strips carriage returns from snippets', () => {
    const findings = findBareTerms('E se, E kaabo, aso oke\r\nnext', terms);
    expect(findings.map((f) => [f.bare, f.column])).toEqual([
      ['E se', 1],
      ['E kaabo', 7],
      ['aso oke', 16],
    ]);
    expect(findings[2]?.snippet).not.toContain('\r');
  });
});
