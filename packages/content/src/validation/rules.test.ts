import { createSchema, type SanityDocument, validateDocument } from 'sanity';
import { describe, expect, it } from 'vitest';
import { authoredSchemaTypes, schemaTypes } from '../schema';
import { createStudioConfig } from '../studio/config';
import { skipValidationWhenHidden } from './rules';

// A hidden input blocks nothing (ADR 0042): nobody can fix what the form does not show. Checked
// with Sanity's own validator on the compiled schema, as the Studio's Publish button runs it.

const client = { withConfig: () => client, fetch: async () => null };
// The part of a workspace validation reads; built-in messages come back as their keys.
const workspace = {
  schema: createSchema({ name: 'test', types: schemaTypes }),
  i18n: { t: (key: string) => key, loadNamespaces: async () => undefined },
  getClient: () => client,
};

/** The errors Publish would show, as "path: message", with the named documents not yet published. */
async function problems(
  document: Record<string, unknown>,
  unpublished: string[] = [],
): Promise<string[]> {
  const markers = await validateDocument({
    document: {
      _id: 'drafts.test',
      _rev: '',
      _createdAt: '',
      _updatedAt: '',
      ...document,
    } as SanityDocument,
    workspace: workspace as never,
    getDocumentExists: async ({ id }) => !unpublished.includes(id),
  });
  return markers
    .filter((marker) => marker.level === 'error')
    .map(
      (marker) =>
        `${marker.path.map((part) => (typeof part === 'object' ? '[]' : part)).join('.')}: ${marker.message}`,
    );
}

const dash = String.fromCharCode(0x2014);
const scheduleRow = { _key: 'a', _type: 'scheduleItem', detail: `Drumming ${dash} then dance` };
const reference = (id: string) => ({ _type: 'reference', _ref: id });
const UNPUBLISHED = ['album-unpublished', 'photographer-unpublished'];
const picture = { _type: 'reference', _ref: 'image-abc-10x10-jpg' };

describe('a hidden input blocks nothing', () => {
  const edition = (kind: string) => ({
    _type: 'event',
    kind,
    title: 'An edition',
    schedule: [scheduleRow],
    // Sanity's own check on a link input: it must be a URL. Only the Gala's form shows it.
    ticketsUrl: 'not a link',
  });

  it('checks a Collective event for nothing its form hides, built-in checks included', async () => {
    const found = await problems(edition('collective'), UNPUBLISHED);
    expect(found.filter((line) => /^(edition|schedule|ticketsUrl)/.test(line))).toEqual([]);
  });

  it('still checks those inputs where the form shows them', async () => {
    const found = await problems(edition('festival'), UNPUBLISHED);
    expect(found.some((line) => line.startsWith('edition:'))).toBe(true);
    expect(found.some((line) => line.startsWith('schedule.[].title'))).toBe(true);
    expect(found.some((line) => line.startsWith('schedule.[].detail'))).toBe(true);
    expect(found.some((line) => line.startsWith('ticketsUrl'))).toBe(false);
    const gala = await problems(edition('gala'), UNPUBLISHED);
    expect(gala.some((line) => line.startsWith('ticketsUrl'))).toBe(true);
  });

  it('checks a photo credit only on an album photograph, where it shows', async () => {
    const credited = {
      _type: 'oyImage',
      asset: picture,
      alt: 'Drummers at the gate',
      credit: reference('photographer-unpublished'),
    };
    const person = await problems(
      { _type: 'person', name: 'A board member', group: 'board', portrait: credited },
      UNPUBLISHED,
    );
    expect(person.filter((line) => line.startsWith('portrait'))).toEqual([]);
    const album = await problems(
      { _type: 'album', title: 'Odunde 2025', photos: [{ _key: 'p', ...credited }] },
      UNPUBLISHED,
    );
    expect(album).toContain('photos.[].credit: validation:object.reference-not-published');
  });

  it('asks an image for alt text only once it has a picture', async () => {
    const person = { _type: 'person', name: 'Adé Bámidélé', group: 'board' };
    expect(await problems({ ...person, portrait: { _type: 'oyImage' } })).toEqual([]);
    const withPicture = await problems({
      ...person,
      portrait: { _type: 'oyImage', asset: picture },
    });
    expect(withPicture).toEqual(['portrait.alt: Add the alt text: who, doing what, where.']);
  });

  it('gives every definition a rule that declares the context, so each one gets the hidden flag', () => {
    interface Definition {
      name?: string;
      type?: string;
      validation?: unknown;
      fields?: Definition[];
      of?: Definition[];
    }
    const named = new Set((schemaTypes as unknown as Definition[]).map((type) => type.name));
    const without: string[] = [];
    const walk = (definition: Definition, path: string) => {
      const { validation, type } = definition;
      // A field of one of the schema's own types, with no rule of its own, inherits that type's.
      const inherits = validation === undefined && type !== undefined && named.has(type);
      if (!inherits && !(typeof validation === 'function' && validation.length >= 2))
        without.push(path);
      for (const field of definition.fields ?? []) walk(field, `${path}.${field.name}`);
      for (const member of definition.of ?? []) walk(member, `${path}[]`);
    };
    for (const type of schemaTypes as unknown as Definition[]) walk(type, type.name ?? '');
    expect(without).toEqual([]);
  });

  it('runs the rule, or the built-in check, where the input shows', () => {
    const [own, none] = skipValidationWhenHidden([
      { validation: (rule: unknown, context?: { hidden?: boolean }) => [rule, context] },
      { type: 'string' },
    ]);
    const call = (definition: unknown, context?: object) =>
      (definition as { validation: (rule: unknown, context?: object) => unknown }).validation(
        'rule',
        context,
      );
    expect(call(own, { hidden: true })).toEqual([]);
    expect(call(own, { hidden: false })).toEqual(['rule', { hidden: false }]);
    expect(call(own)).toEqual(['rule', undefined]);
    expect(call(none, { hidden: true })).toEqual([]);
    expect(call(none, { hidden: false })).toBe('rule');
  });
});

describe("the Sanity CLI's schema", () => {
  it('registers the rules as written, so a deployed schema tells agents what each field requires', () => {
    const types = (cli?: boolean) =>
      createStudioConfig({ projectId: 'p', dataset: 'd', cli }).schema?.types;
    expect(types(true)).toBe(authoredSchemaTypes);
    expect(types()).toBe(schemaTypes);
  });
});
