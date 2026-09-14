import { describe, expect, it } from 'vitest';
import { ENQUIRY_KINDS } from '../enquiry-kinds';
import { enquiryFieldsType } from './documents';
import { documentTypes, objectTypes, SINGLETON_NAMES, schemaTypes } from './index';

describe('schemaTypes', () => {
  it('registers every shared object from CONTENT-MODEL section 2 once', () => {
    const names = objectTypes.map((type) => type.name);
    for (const name of [
      'bilingual',
      'cta',
      'oyImage',
      'seo',
      'fact',
      'sourcedFigure',
      'scheduleItem',
      'faqItem',
      'contactRole',
      'blockContent',
    ]) {
      expect(names).toContain(name);
    }
  });

  it('has no duplicate type names', () => {
    const names = schemaTypes.map((type) => type.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('enquiry', () => {
  it('carries one object per kind, each generated from the spec', () => {
    const names = schemaTypes.map((type) => type.name);
    const enquiry = schemaTypes.find((type) => type.name === 'enquiry') as {
      fields: { name: string; type: string }[];
    };
    for (const kind of ENQUIRY_KINDS) {
      expect(names).toContain(enquiryFieldsType(kind));
      const field = enquiry.fields.find((f) => f.name === kind);
      expect(field?.type).toBe(enquiryFieldsType(kind));
    }
    expect(enquiry.fields.map((f) => f.name)).toEqual(
      expect.arrayContaining([
        'kind',
        'submittedAt',
        'source',
        'notifiedAt',
        'notifyError',
        'handled',
        'notes',
      ]),
    );
  });
});

describe('singletons and documents', () => {
  const names = documentTypes.map((type) => type.name);

  it('registers the thirteen singletons, galleryPage among them', () => {
    expect(SINGLETON_NAMES).toHaveLength(13);
    expect(SINGLETON_NAMES).toContain('galleryPage');
    expect(SINGLETON_NAMES).not.toContain('gallerySettings');
    for (const name of SINGLETON_NAMES) expect(names).toContain(name);
  });

  it('registers every document type from CONTENT-MODEL section 4 as amended', () => {
    for (const name of [
      'event',
      'zone',
      'ticketTier',
      'sponsorLevel',
      'honoree',
      'program',
      'initiative',
      'person',
      'timelineEntry',
      'testimonial',
      'newsPost',
      'album',
      'photographer',
      'partner',
      'outcome',
      'stat',
      'door',
      'hometownAssociation',
      'givingLevel',
      'governanceDoc',
      'enquiry',
      'subscriber',
      'lintReport',
    ]) {
      expect(names).toContain(name);
    }
    expect(names).not.toContain('faq');
  });

  it('stores no derived field', () => {
    const fieldNames = (type: string) =>
      (schemaTypes.find((t) => t.name === type) as { fields: { name: string }[] }).fields.map(
        (f) => f.name,
      );
    expect(fieldNames('program')).not.toContain('hasPage');
    expect(fieldNames('event')).not.toContain('status');
    expect(fieldNames('person')).not.toContain('contactVia');
    expect(fieldNames('event')).toEqual(
      expect.arrayContaining(['schedule', 'vendorTerms', 'ticketsUrl']),
    );
  });

  it("keeps the gallery's policy as plain text in the owner's words, and no intro beside the header line", () => {
    const gallery = schemaTypes.find((t) => t.name === 'galleryPage') as {
      fields: { name: string; type: string }[];
    };
    const names = gallery.fields.map((f) => f.name);
    expect(names).not.toContain('intro');
    expect(gallery.fields.find((f) => f.name === 'creditsAndConsent')?.type).toBe('text');
  });

  it('gives every page singleton a layout object whose options start with the prototype default', () => {
    for (const name of SINGLETON_NAMES) {
      if (name === 'siteSettings') continue;
      const type = schemaTypes.find((t) => t.name === name) as {
        fields: {
          name: string;
          fields?: { initialValue?: string; options?: { list: { value: string }[] } }[];
        }[];
      };
      const layout = type.fields.find((f) => f.name === 'layout');
      expect(layout, name).toBeDefined();
      for (const option of layout?.fields ?? []) {
        expect(option.initialValue).toBe(option.options?.list[0]?.value);
      }
    }
  });
});
