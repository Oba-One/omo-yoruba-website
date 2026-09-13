import { createImageSet } from '@oy/content/images';
import { GENERAL_CONTACT_PENDING, GENERAL_RESPONDS_PENDING } from '@oy/content/pending';
import { describe, expect, it } from 'vitest';
import { buildGetInvolvedPage, type GetInvolvedPageData } from './get-involved-page';

const imageSet = createImageSet({ projectId: 'abc123', dataset: 'development' });
const options = { imageSet, draft: false, studioUrl: '/admin' };
const image = (alt: string) => ({
  _type: 'oyImage' as const,
  alt,
  caption: null,
  hotspot: null,
  crop: null,
  asset: { _ref: 'image-0a1b2c3d-1024x683-jpg', _type: 'reference' as const },
});
const enquiry = (label: string, enquiryKind: string) => ({
  label,
  kind: 'enquiry',
  enquiryKind,
  href: null,
  newTab: null,
});
const door = (key: string, title: string, extra: Record<string, unknown> = {}) => ({
  _id: `door-${key}`,
  key,
  title,
  blurb: null,
  bullets: null,
  action: null,
  image: null,
  ...extra,
});

// The development dataset once the Phase 7 seed has run: no header action, the five doors, no names.
const seeded = {
  header: {
    kicker: { yo: 'Ẹ dara pọ̀ mọ́ wa', en: 'Join us' },
    title: 'Raise your hand',
    line: 'Àgbájọ ọwọ́ la fi ń sọ̀yà. Many hands make the load light.',
  },
  primaryAction: null,
  secondaryActions: null,
  doors: [
    door('member', 'Become a member', {
      blurb: 'Members carry the lessons, the festival, and each other.',
      action: enquiry('Become a member', 'member'),
      image: image('A mother, daughter and son in matching festival dress smile together'),
    }),
    door('volunteer', 'Volunteer', { action: enquiry('Raise your hand', 'volunteer') }),
    door('vendor', 'Sell at Odunde', {
      action: enquiry('Apply for a booth', 'vendor'),
      image: image('A vendor in indigo àdìrẹ serves suya to a guest in white'),
    }),
    door('partner', 'Partner or sponsor', {
      bullets: ['One enquiry covers Odunde, the Gala, or both'],
      action: enquiry('Partner with us', 'sponsor'),
    }),
    door('give', 'Give', {
      blurb: 'Would rather give than join? That takes about a minute.',
      action: { label: 'Donate', kind: 'give', enquiryKind: null, href: null, newTab: null },
    }),
  ],
  hometownAssociations: {
    title: 'Hometown associations',
    prose: [
      {
        _type: 'block',
        _key: 'block-1',
        style: 'normal',
        markDefs: [],
        children: [
          { _type: 'span', _key: 'span-1', text: 'Nine hometown associations.', marks: [] },
        ],
      },
    ],
    stat: { _id: 'stat-associations', value: '9', label: 'hometown associations' },
  },
  associations: [],
  fallback: {
    title: 'Or just talk to someone',
    blurb: 'A phone call or an email works just as well as any form on this page.',
  },
  settings: { generalEmail: null, phone: null, general: { name: null, responds: null } },
  layout: { doors: 'cards', hta: 'shown' },
  seo: null,
} as unknown as GetInvolvedPageData;

describe('buildGetInvolvedPage', () => {
  it('fills the layout defaults and the slim header, with no action while the Studio holds none', () => {
    const view = buildGetInvolvedPage(seeded, options);
    expect(view.layout).toEqual({ doors: 'cards', hta: 'shown' });
    expect(view.root).toEqual(view.layout);
    expect(view.header).toMatchObject({ variant: 'slim', title: 'Raise your hand' });
    expect(view.header.actions).toEqual([]);
    expect(buildGetInvolvedPage(null, options).title).toBe('Get Involved');
  });

  it('draws the four doors as cards in order, anchored by key, with the give door closing the page', () => {
    const view = buildGetInvolvedPage(seeded, options);
    expect(view.doors.items.map((item) => [item.id, item.door.title])).toEqual([
      ['member', 'Become a member'],
      ['volunteer', 'Volunteer'],
      ['vendor', 'Sell at Odunde'],
      ['partner', 'Partner or sponsor'],
    ]);
    expect(view.doors.layout).toBe('card');
    expect(view.doors.items[0]?.door.image?.alt).toBe(
      'A mother, daughter and son in matching festival dress smile together',
    );
    expect(view.give).toMatchObject({
      text: 'Would rather give than join? That takes about a minute.',
      textPending: 'the blurb',
      action: { label: 'Donate', kind: 'give' },
    });
    const rows = buildGetInvolvedPage(
      { ...seeded, layout: { doors: 'rows', hta: 'shown' } } as GetInvolvedPageData,
      options,
    );
    expect(rows.doors.layout).toBe('row');
  });

  it('gilds the first door only while the header holds no action', () => {
    const plain = buildGetInvolvedPage(seeded, options).doors.items;
    expect(plain.map((item) => item.primary)).toEqual([true, false, false, false]);
    const withAction = buildGetInvolvedPage(
      { ...seeded, primaryAction: enquiry('Become a member', 'member') } as GetInvolvedPageData,
      options,
    );
    expect(withAction.header.actions).toHaveLength(1);
    expect(withAction.doors.items.every((item) => !item.primary)).toBe(true);
  });

  it('names an empty page of doors and leaves the give box out without a give door', () => {
    const empty = buildGetInvolvedPage({ ...seeded, doors: [] } as GetInvolvedPageData, options);
    expect(empty.doors.items).toEqual([]);
    expect(empty.doors.pending).toBe('the ways in');
    expect(empty.give).toBeUndefined();
  });

  it('carries the associations: the prose, the count from its stat and "Not yet" while none is listed', () => {
    const view = buildGetInvolvedPage(seeded, options).associations;
    expect(view.shown).toBe(true);
    expect(view.title).toBe('Hometown associations');
    expect(view.prose).toHaveLength(1);
    expect(view.cells).toEqual([
      { label: 'Associations', value: '9', pending: 'the number of associations' },
      { label: 'Listed publicly', value: 'Not yet' },
      { label: 'To connect', value: 'Ask when you join' },
    ]);
    expect(view.list).toEqual([]);
    const listed = buildGetInvolvedPage(
      {
        ...seeded,
        associations: [
          { _id: 'hta-1', name: '[ Association name ]', url: null },
          { _id: 'hta-2', name: '[ Another association ]', url: 'https://example.org' },
        ],
      } as GetInvolvedPageData,
      options,
    ).associations;
    expect(listed.cells.map((cell) => cell.label)).toEqual(['Associations', 'To connect']);
    expect(listed.list).toEqual([
      { _id: 'hta-1', name: '[ Association name ]', url: null },
      { _id: 'hta-2', name: '[ Another association ]', url: 'https://example.org' },
    ]);
    const hidden = buildGetInvolvedPage(
      { ...seeded, layout: { hta: 'hidden' } } as GetInvolvedPageData,
      options,
    );
    expect(hidden.associations.shown).toBe(false);
    const bare = buildGetInvolvedPage(
      { ...seeded, hometownAssociations: null } as GetInvolvedPageData,
      options,
    ).associations;
    expect(bare.prose).toBeUndefined();
    expect(bare.pending).toBe('what the associations are, in your words');
    expect(bare.cells[0]).toEqual({
      label: 'Associations',
      value: undefined,
      pending: 'the number of associations',
    });
  });

  it('carries the fallback: its words, the settings and the general contact, each owed one as its chip', () => {
    const view = buildGetInvolvedPage(seeded, options).talk;
    expect(view).toMatchObject({
      title: 'Or just talk to someone',
      intro: 'A phone call or an email works just as well as any form on this page.',
      settings: { generalEmail: undefined, phone: undefined },
      contact: { name: undefined, responds: undefined },
      namePending: GENERAL_CONTACT_PENDING,
      respondsPending: GENERAL_RESPONDS_PENDING,
    });
    const filled = buildGetInvolvedPage(
      {
        ...seeded,
        settings: {
          generalEmail: 'hello@example.org',
          phone: '[ Phone ]',
          general: { name: '[ Name ]', responds: 'within [ days ]' },
        },
      } as GetInvolvedPageData,
      options,
    ).talk;
    expect(filled.settings).toEqual({ generalEmail: 'hello@example.org', phone: '[ Phone ]' });
    expect(filled.contact).toEqual({ name: '[ Name ]', responds: 'within [ days ]' });
  });

  it('puts the edit attributes on the options and the photographs in draft mode only', () => {
    const view = buildGetInvolvedPage(seeded, options);
    expect(view.edit.doors).toBeUndefined();
    const draft = buildGetInvolvedPage(seeded, { ...options, draft: true });
    expect(draft.edit.doors).toContain('path=layout.doors');
    expect(draft.edit.hta).toContain('path=layout.hta');
    expect(draft.doors.items[0]?.imageEdit).toContain('id=door-member;type=door;path=image');
  });
});
