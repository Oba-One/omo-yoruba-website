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

  it('registers the twelve singletons, galleryPage among them and no News page (ADR 0048)', () => {
    expect(SINGLETON_NAMES).toHaveLength(12);
    expect(SINGLETON_NAMES).not.toContain('newsPage');
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
      'person',
      'testimonial',
      'album',
      'photographer',
      'partner',
      'stat',
      'door',
      'hometownAssociation',
      'governanceDoc',
      'enquiry',
      'subscriber',
      'lintReport',
    ]) {
      expect(names).toContain(name);
    }
    expect(names).not.toContain('faq');
    // The items of a page's own list are objects the page holds (ADR 0042).
    for (const name of ['initiative', 'outcome', 'timelineEntry', 'givingLevel']) {
      expect(names).not.toContain(name);
      expect(objectTypes.map((type) => type.name)).toContain(name);
    }
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

describe("an album's videos (ADR 0051)", () => {
  interface Def {
    name: string;
    type?: string;
    title?: string;
    of?: { type: string }[];
    fields?: Def[];
  }
  const type = (name: string) => schemaTypes.find((t) => t.name === name) as unknown as Def;

  it('registers the video object once, with a title, the address, a still and who made it', () => {
    expect(objectTypes.filter((t) => t.name === 'video')).toHaveLength(1);
    expect(type('video').fields?.map((f) => [f.name, f.type, f.title])).toEqual([
      ['title', 'string', 'Title'],
      ['url', 'url', 'YouTube address'],
      ['still', 'image', 'Still'],
      ['credit', 'reference', 'Made by'],
    ]);
  });

  // The tile draws the still as decoration, its alt empty beside the play link's name, and shows no caption, so the
  // Studio asks for neither: a plain hotspot image, never the shared `oyImage` with its required alt text.
  it('keeps the still a plain hotspot image, asking for no alt text and no caption', () => {
    const still = type('video').fields?.find((f) => f.name === 'still') as Def & {
      options?: { hotspot?: boolean };
    };
    expect(still).toMatchObject({ type: 'image', options: { hotspot: true } });
    expect(still.fields).toBeUndefined();
  });

  it('gives an album a list of videos right after its photographs', () => {
    const fields = type('album').fields ?? [];
    const names = fields.map((f) => f.name);
    expect(names.indexOf('videos')).toBe(names.indexOf('photos') + 1);
    const videos = fields.find((f) => f.name === 'videos');
    expect(videos).toMatchObject({ type: 'array', title: 'Videos' });
    expect(videos?.of?.map((member) => member.type)).toEqual(['video']);
  });
});
