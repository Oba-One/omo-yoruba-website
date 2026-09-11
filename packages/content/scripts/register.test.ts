import { readFileSync } from 'node:fs';
import { loadTerms } from '@oy/lint';
import { findBareTerms } from '@oy/lint/yoruba';
import { describe, expect, it } from 'vitest';

const terms = loadTerms();

import { markCaption, parseRegister, REGISTER_PATH, registerPhotos, SET_ALBUMS } from './register';

const snippet = `
<div class="cr-row"><span class="cr-where">Odunde 2026</span><span class="cr-what"><code style="font-size:13px">odunde-2026-ayo-game.jpg</code><br>A wooden ayo board with stones beside the Ayo Olopon rules card</span><span class="cr-mock">Red Carpet Media (assumed, per gallery credit line)</span></div>
<div class="cr-row"><span class="cr-where">Gala 2025</span><span class="cr-what"><code style="font-size:13px">gala-2025-attendees-getting-food.jpg</code><br>Guests seated at round tables in the hall, chandeliers above</span><span class="cr-mock">Members and volunteers (phone photographs) (assumed)</span></div>
<div class="cr-row"><span class="cr-where">Everywhere</span><span class="cr-what">EIN</span><span class="cr-mock">95-4612387</span></div>
`;

describe('parseRegister', () => {
  it('reads the photograph rows, decoding entities and skipping the non-photo rows', () => {
    const rows = parseRegister(snippet);
    expect(rows).toEqual([
      {
        set: 'Odunde 2026',
        file: 'odunde-2026-ayo-game.jpg',
        caption: 'A wooden ayo board with stones beside the Ayo Olopon rules card',
        credit: 'Red Carpet Media (assumed, per gallery credit line)',
      },
      {
        set: 'Gala 2025',
        file: 'gala-2025-attendees-getting-food.jpg',
        caption: 'Guests seated at round tables in the hall, chandeliers above',
        credit: 'Members and volunteers (phone photographs) (assumed)',
      },
    ]);
  });
});

describe('registerPhotos', () => {
  const photos = registerPhotos(readFileSync(REGISTER_PATH, 'utf8'));

  it('finds every file of the web-sized set, each once, in the register', () => {
    expect(photos).toHaveLength(68);
    expect(new Set(photos.map((p) => p.file)).size).toBe(68);
  });

  it('groups the four register sets into the three albums of CONTENT-MODEL section 6', () => {
    const counts: Record<string, number> = {};
    for (const photo of photos) counts[photo.album] = (counts[photo.album] ?? 0) + 1;
    expect(counts).toEqual({ 'odunde-2026': 43, 'gala-2025': 6, 'summer-camp': 19 });
    expect(SET_ALBUMS['Summer camp (earlier set)']).toBe('summer-camp');
  });

  it('maps every credit line to one of the three photographers', () => {
    const photographers = new Set(photos.map((p) => p.photographer));
    expect(photographers).toEqual(
      new Set(['red-carpet-media', 'members-and-volunteers', 'omo-yoruba-archive']),
    );
  });
});

describe('markCaption', () => {
  it('writes the marks the register left off, from the shared word list', () => {
    expect(markCaption('Women in white with green and white sashes dance')).toBe(
      'Women in white with green and white sashes dance',
    );
    expect(markCaption('A woman ties a green and white head wrap on a seated guest')).toBe(
      'A woman ties a green and white head wrap on a seated guest',
    );
  });

  it('leaves every seeded caption free of bare glossary terms', () => {
    const photos = registerPhotos(readFileSync(REGISTER_PATH, 'utf8'));
    for (const photo of photos)
      expect(findBareTerms(photo.caption, terms, { markdown: false }), photo.file).toEqual([]);
  });
});
