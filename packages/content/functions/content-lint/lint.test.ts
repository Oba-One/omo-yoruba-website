import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildReport, documentTitle, LINT_TYPES, lintDocument } from './lint';

const dash = String.fromCharCode(0x2014);

describe('lintDocument', () => {
  it('walks nested objects, arrays and Portable Text spans, reporting each finding with its path', () => {
    const doc = {
      _id: 'festivalPage',
      _type: 'festivalPage',
      header: { title: `Odunde ${dash} the festival`, kicker: { yo: 'Ọdúndé', en: 'Welcome' } },
      planYourVisit: [{ _key: 'fact-1', label: 'Parking', value: 'Near Oja Balogun' }],
      whatItIs: [
        {
          _type: 'block',
          _key: 'b1',
          children: [{ _type: 'span', _key: 's1', text: 'Visit Agbala Omode' }],
        },
        { _type: 'pullQuote', _key: 'b2', quote: 'Fine' },
      ],
    };
    expect(lintDocument(doc)).toEqual([
      {
        path: 'header.title',
        kind: 'em-dash',
        message: 'Replace the em dash with a comma, a colon or a new sentence.',
        excerpt: `Odunde ${dash} the festival`,
      },
      {
        path: 'planYourVisit[fact-1].value',
        kind: 'marks',
        message: 'Add the marks: Oja Balogun should be Ọjà Balógun.',
        excerpt: 'Near Oja Balogun',
      },
      {
        path: 'whatItIs[b1]',
        kind: 'marks',
        message: 'Add the marks: Agbala Omode should be Àgbàlá Ọmọde.',
        excerpt: 'Visit Agbala Omode',
      },
    ]);
  });

  it('skips system keys, references and non strings, and returns nothing for a clean document', () => {
    const doc = {
      _id: 'zone-oja-balogun',
      _type: 'zone',
      _rev: 'abc',
      name: { yo: 'Ọjà Balógun', en: 'The market' },
      image: { asset: { _type: 'reference', _ref: 'image-abc' }, alt: 'Elders in aṣọ òkè' },
      order: 1,
      active: true,
    };
    expect(lintDocument(doc)).toEqual([]);
  });

  it('shortens a long excerpt around the finding', () => {
    const long = `${'Words '.repeat(30)}${dash}${' words'.repeat(30)}`;
    const [finding] = lintDocument({ _id: 'x', _type: 'newsPost', summary: long });
    expect(finding?.excerpt.length).toBeLessThan(120);
    expect(finding?.excerpt).toContain(dash);
  });
});

describe('buildReport and documentTitle', () => {
  it('writes one report per document with a period free id, empty when clean', () => {
    const doc = { _id: 'drafts-free-id', _type: 'newsPost', _rev: 'r1', title: 'Fall term' };
    const report = buildReport(doc, lintDocument(doc), '2026-09-11T12:00:00Z');
    expect(report).toEqual({
      _id: 'lint-drafts-free-id',
      _type: 'lintReport',
      documentId: 'drafts-free-id',
      documentType: 'newsPost',
      title: 'Fall term',
      checkedRev: 'r1',
      checkedAt: '2026-09-11T12:00:00Z',
      findings: [],
    });
    const withFinding = buildReport(
      { _id: 'a', _type: 'zone', _rev: 'r', name: { yo: 'Oja Balogun', en: 'x' } },
      lintDocument({ _id: 'a', _type: 'zone', name: { yo: 'Oja Balogun', en: 'x' } }),
      'now',
    );
    expect(withFinding.findings[0]).toMatchObject({
      _key: 'finding-1',
      _type: 'lintFinding',
      kind: 'marks',
      path: 'name.yo',
    });
    expect(withFinding.title).toBe('Oja Balogun');
  });

  it('names a document by its title, name, heading, quote or id', () => {
    expect(documentTitle({ _id: 'p', _type: 'person', name: 'A. Person' })).toBe('A. Person');
    expect(
      documentTitle({ _id: 'h', _type: 'festivalPage', header: { title: 'Ọdúndé Festival' } }),
    ).toBe('Ọdúndé Festival');
    expect(documentTitle({ _id: 't', _type: 'testimonial', quote: 'Many hands' })).toBe(
      'Many hands',
    );
    expect(
      documentTitle({
        _id: 'siteSettings',
        _type: 'siteSettings',
        orgName: 'Omo Yorùbá of Southern California',
      }),
    ).toBe('Omo Yorùbá of Southern California');
    expect(documentTitle({ _id: 'z', _type: 'zone' })).toBe('z');
  });
});

describe('LINT_TYPES and the Blueprint manifest', () => {
  it('lists every content type and never the enquiry, subscriber or lint report types', () => {
    expect(LINT_TYPES).toContain('siteSettings');
    expect(LINT_TYPES).toContain('newsPost');
    for (const type of ['enquiry', 'subscriber', 'lintReport'])
      expect(LINT_TYPES).not.toContain(type);
  });

  it('matches the filter in sanity.blueprint.ts at the repo root', () => {
    const manifest = readFileSync(
      fileURLToPath(new URL('../../../../sanity.blueprint.ts', import.meta.url)),
      'utf8',
    );
    const filter = /name: 'content-lint'[\s\S]*?filter:\s*'([^']+)'/.exec(manifest)?.[1];
    expect(filter).toBeDefined();
    for (const type of LINT_TYPES) expect(filter, type).toContain(`"${type}"`);
    expect(filter).not.toContain('"enquiry"');
  });
});
