import { describe, expect, it } from 'vitest';
import { PENDING } from '../pending';
import { ADMIN_ONLY_TYPES } from '../studio/roles';
import { schemaTypes } from './index';

// The Studio in the site's words (ADR 0042): every choice has a title, no help text sends a
// member to the codebase, and every date reads the US way. Enquiry field types are generated
// from the enquiry spec, whose options are already the form's own words.

interface Field {
  name: string;
  title?: string;
  type?: string;
  description?: unknown;
  hidden?: unknown;
  options?: {
    list?: unknown[];
    dateFormat?: string;
    displayTimeZone?: string;
    filter?: string;
    filterParams?: object;
  };
  fields?: Field[];
  of?: Field[];
}

/** Every field by its path ("event.venue.line", "galaPage.extraFacts[]"), walked once. */
const FIELDS = new Map<string, Field>();
{
  const step = (field: Field, path: string) => {
    FIELDS.set(path, field);
    for (const child of field.fields ?? []) step(child, `${path}.${child.name}`);
    for (const member of field.of ?? [])
      step(member, `${path}[]${member.name ? `.${member.name}` : ''}`);
  };
  for (const type of schemaTypes as unknown as Field[]) {
    if (/^enquiry\w+Fields$/.test(type.name)) continue;
    step(type, type.name);
  }
}

const matching = (test: (field: Field) => boolean) =>
  [...FIELDS].filter(([, field]) => test(field)).map(([path]) => path);

const TYPES = new Map((schemaTypes as unknown as Field[]).map((type) => [type.name, type]));
const ADMINISTRATOR = { id: 'a', roles: [{ name: 'administrator', title: 'Administrator' }] };

/**
 * Whether the form hides any step of a to-do row's path ("header.image", "otherWays[]") on a page
 * of that type, for whoever sees the row: named types and list items are walked into, and each
 * step's `hidden` runs as the Studio runs it.
 */
function hiddenAlong(type: string, path: string): boolean {
  const currentUser = ADMIN_ONLY_TYPES.has(type) ? ADMINISTRATOR : null;
  let fields = TYPES.get(type)?.fields;
  const walked: string[] = [];
  for (const step of path.split('.')) {
    const list = step.endsWith('[]');
    const name = list ? step.slice(0, -2) : step;
    const field = fields?.find((candidate) => candidate.name === name);
    if (!field) return false;
    walked.push(name);
    const { hidden } = field;
    const context = {
      document: { _type: type },
      parent: {},
      value: undefined,
      currentUser,
      path: walked,
    };
    if (hidden === true || (typeof hidden === 'function' && hidden(context) === true)) return true;
    const next = list ? field.of?.[0] : field;
    fields = next?.fields ?? (next?.type ? TYPES.get(next.type)?.fields : undefined);
  }
  return false;
}

describe("the Studio in the site's words", () => {
  it('gives every choice a title, never a raw stored value', () => {
    expect(
      matching((field) => field.options?.list?.some((item) => typeof item === 'string') ?? false),
    ).toEqual([]);
  });

  it('keeps ADR and ticket numbers and developer words out of the help text and the labels', () => {
    const codebase =
      /\bADR\b|docs\/adr|wayfinder|\bticket \d|PostHog|data-theme|\bPhase \d|GROQ|stega|Lightbox|Give Dialog|trust block|the register/;
    const words = (field: Field) => [
      field.description,
      field.title,
      ...(field.options?.list ?? []).map((item) => (item as { title?: unknown }).title),
    ];
    expect(
      matching((field) =>
        words(field).some((text) => typeof text === 'string' && codebase.test(text)),
      ),
    ).toEqual([]);
  });

  it('reads every date and time the US way', () => {
    expect(
      matching(
        (field) =>
          (field.type === 'date' || field.type === 'datetime') && !field.options?.dateFormat,
      ),
    ).toEqual([]);
  });

  it('shows every time in Los Angeles, whoever opens the Studio', () => {
    expect(
      matching(
        (field) =>
          field.type === 'datetime' && field.options?.displayTimeZone !== 'America/Los_Angeles',
      ),
    ).toEqual([]);
  });
});

describe('inputs that change nothing are hidden (ADR 0042)', () => {
  const find = (path: string) => FIELDS.get(path);

  it.each([
    'event.heroImage',
    'seo.ogImage',
    'collectivePage.keepsOwnList',
    'initiative.proceedsReturn',
    'initiative.order',
    'timelineEntry.order',
    'outcome.order',
    'door.order',
    'givingLevel.order',
    'galaPage.extraFacts',
    'siteSettings.logo',
    'siteSettings.wordmarkLine2',
    'siteSettings.footerBlurb',
    'newsPost.body',
    'newsPost.author',
    'photographer.url',
    'stat.asOf',
    'sourcedFigure.asOf',
  ])('%s is hidden from everyone', (path) => {
    expect(find(path)?.hidden, path).toBe(true);
  });

  it('reads a path as the form shows it on each page', () => {
    expect(hiddenAlong('festivalPage', 'header.image')).toBe(false);
    expect(hiddenAlong('impactPage', 'header.image')).toBe(true);
    expect(hiddenAlong('homepage', 'seo.ogImage')).toBe(true);
    expect(hiddenAlong('galaPage', 'extraFacts[].label')).toBe(true);
    expect(hiddenAlong('album', 'photos[].credit')).toBe(false);
  });

  // Rows with a GROQ condition name no field; pending.test.ts checks each of those. An event's
  // inputs by kind are checked there too.
  it('asks for nothing in the to-do list that the form hides on that page', () => {
    const asked = PENDING.flatMap((row) =>
      (row.fields ?? []).map((field) => ({ type: row.type, field })),
    );
    expect(asked.length).toBeGreaterThan(100);
    expect(
      asked
        .filter(({ type, field }) => hiddenAlong(type, field))
        .map(({ type, field }) => `${type}.${field}`),
    ).toEqual([]);
  });

  it('shows the photo band input only on the two event pages, and credits only on album photographs', () => {
    const band = find('pageHeader.image')?.hidden as (context: object) => boolean;
    expect(band({ document: { _type: 'festivalPage' } })).toBe(false);
    expect(band({ document: { _type: 'galaPage' } })).toBe(false);
    expect(band({ document: { _type: 'impactPage' } })).toBe(true);
    const credit = find('oyImage.credit')?.hidden as (context: object) => boolean;
    expect(credit({ document: { _type: 'album' }, path: ['photos', { _key: 'a' }] })).toBe(false);
    expect(credit({ document: { _type: 'album' }, path: ['cover'] })).toBe(true);
    expect(credit({ document: { _type: 'homepage' }, path: ['hero', 'image'] })).toBe(true);
  });
});

describe('honorees, tiers and levels name their Gala edition', () => {
  it.each(['honoree', 'ticketTier', 'sponsorLevel'])('%s picks only Gala editions', (type) => {
    expect(FIELDS.get(`${type}.event`)?.options).toMatchObject({
      filter: 'kind == $kind',
      filterParams: { kind: 'gala' },
      disableNew: true,
    });
  });
});
