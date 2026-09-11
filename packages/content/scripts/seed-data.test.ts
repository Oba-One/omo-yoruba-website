import { describe, expect, it } from 'vitest';
import { CONTACT_ROLES } from '../src/enquiry-kinds';
import { documentTypes, SINGLETON_NAMES } from '../src/schema';
import { buildSeed, type SeedAssets } from './seed-data';

const assets: SeedAssets = new Map(
  ['community-dance.jpg', 'odunde-2026-ayo-game.jpg', 'gala-2025-group-photo.jpg'].map((file) => [
    file,
    {
      assetId: `image-${file.replace(/\W/g, '')}-10x10-jpg`,
      caption: `Caption for ${file}`,
      album: file.startsWith('gala')
        ? 'gala-2025'
        : file.startsWith('odunde')
          ? 'odunde-2026'
          : 'summer-camp',
      photographer: 'red-carpet-media',
    },
  ]),
);
const docs = buildSeed(assets);
const byId = new Map(docs.map((doc) => [doc._id, doc]));
const text = JSON.stringify(docs);

describe('buildSeed', () => {
  it('uses deterministic ids without periods, each once, and only registered types', () => {
    const types = new Set(documentTypes.map((type) => type.name));
    for (const doc of docs) {
      expect(doc._id, doc._id).toMatch(/^[a-zA-Z0-9-]+$/);
      expect(types, doc._type).toContain(doc._type);
    }
    expect(new Set(docs.map((d) => d._id)).size).toBe(docs.length);
  });

  it('creates every singleton under its type name and nothing the register says not to create', () => {
    for (const name of SINGLETON_NAMES) expect(byId.get(name)?._type).toBe(name);
    for (const type of [
      'person',
      'partner',
      'testimonial',
      'timelineEntry',
      'ticketTier',
      'sponsorLevel',
      'honoree',
      'givingLevel',
      'hometownAssociation',
      'outcome',
      'governanceDoc',
      'enquiry',
      'subscriber',
    ]) {
      expect(
        docs.filter((d) => d._type === type),
        type,
      ).toHaveLength(0);
    }
  });

  it('seeds the confirmed facts and leaves the pending ones empty', () => {
    const settings = byId.get('siteSettings') as Record<string, unknown>;
    expect(settings.orgName).toBe('Omo Yorùbá of Southern California');
    expect(settings.ein).toBeUndefined();
    expect(settings.address).toBeUndefined();
    expect(settings.phone).toBeUndefined();
    const contacts = settings.contacts as { role: string; name?: string; email?: string }[];
    expect(contacts.map((c) => c.role).sort()).toEqual([...CONTACT_ROLES].sort());
    for (const contact of contacts) {
      expect(contact.name).toBeUndefined();
      expect(contact.email).toBeUndefined();
    }
    const stats = docs.filter((d) => d._type === 'stat') as unknown as {
      value: string;
      source?: string;
    }[];
    expect(stats.map((s) => s.value).sort()).toEqual(['29', '3,000+', '4', '9']);
    for (const stat of stats) expect(stat.source).toBeUndefined();
    const zones = docs.filter((d) => d._type === 'zone') as unknown as {
      name: { yo: string; en: string };
      line?: string;
    }[];
    expect(zones.map((z) => z.name.yo).sort()).toEqual(['Àgbàlá Ọmọde', 'Ọjà Balógun']);
    for (const zone of zones) expect(zone.line).toBeUndefined();
    const events = docs.filter((d) => d._type === 'event') as unknown as {
      _id: string;
      kind: string;
      edition: number;
      start?: string;
    }[];
    expect(events.map((e) => e._id).sort()).toEqual([
      'event-gala-2025',
      'event-gala-2026',
      'event-odunde-2026',
      'event-odunde-2027',
    ]);
    for (const event of events) expect(event.start).toBeUndefined();
    expect(docs.filter((d) => d._type === 'program')).toHaveLength(4);
    expect(docs.filter((d) => d._type === 'initiative')).toHaveLength(2);
    expect(docs.filter((d) => d._type === 'newsPost')).toHaveLength(3);
    expect(docs.filter((d) => d._type === 'photographer')).toHaveLength(3);
    expect(docs.filter((d) => d._type === 'door')).toHaveLength(4);
  });

  it('invents nothing: no mock figures, addresses, phone numbers, names or the mock EIN', () => {
    expect(text).not.toMatch(/95-4612387|Leimert Boulevard|555-0148|4,200|\$\d/);
    expect(text).not.toMatch(/Adeyemi|Bakare|Ogunlesi|Yetunde|Balogun,|Sofolahan/);
    expect(text).not.toMatch(/12 June 2027|5 December 2026|The Ebell/);
  });

  it('builds three albums whose photos carry alt, caption, a key and the album-level unconfirmed credit', () => {
    const albums = docs.filter((d) => d._type === 'album') as unknown as {
      _id: string;
      creditConfirmed: boolean;
      credit: { _ref: string };
      photos: { _key: string; alt: string; caption: string; asset: { _ref: string } }[];
      cover?: unknown;
      date?: string;
    }[];
    expect(albums.map((a) => a._id).sort()).toEqual([
      'album-gala-2025',
      'album-odunde-2026',
      'album-summer-camp',
    ]);
    for (const album of albums) {
      expect(album.creditConfirmed).toBe(false);
      expect(album.credit._ref).toMatch(/^photographer-/);
      for (const photo of album.photos) {
        expect(photo._key).toBeTruthy();
        expect(photo.alt).toBe(photo.caption);
        expect(photo.asset._ref).toMatch(/^image-/);
      }
      expect(album.cover).toBeDefined();
    }
    expect(byId.get('album-summer-camp')).not.toHaveProperty('date');
  });

  it('stores the three real news posts on the first of their month', () => {
    const posts = docs.filter((d) => d._type === 'newsPost') as unknown as {
      date: string;
      slug: { current: string };
    }[];
    expect(posts.map((p) => p.date).sort()).toEqual(['2026-07-01', '2026-08-01', '2026-11-01']);
    expect(posts.map((p) => p.slug.current).sort()).toEqual([
      'end-of-year-gala-2026',
      'language-lessons-fall-term',
      'odunde-2026-recap',
    ]);
  });
});
