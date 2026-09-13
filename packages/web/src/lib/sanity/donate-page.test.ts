import { createImageSet } from '@oy/content/images';
import { describe, expect, it } from 'vitest';
import { buildDonatePage, type DonatePageData } from './donate-page';

const imageSet = createImageSet({ projectId: 'abc123', dataset: 'development' });
const options = { imageSet, draft: false, studioUrl: '/admin' };
const door = (id: string, title: string) => ({
  _id: id,
  key: 'partner',
  title,
  blurb: null,
  action: {
    label: 'Partner with us',
    kind: 'enquiry',
    enquiryKind: 'sponsor',
    href: null,
    newTab: null,
  },
  image: null,
});

// The development dataset as the Phase 7 seed leaves it: the partner door, the give-now facts with the
// Zeffy ones owed, the tax line, no giving level or other way, and no EIN or address in the settings.
const seeded = {
  header: {
    kicker: { yo: 'Ẹ ṣe àánú', en: 'Give' },
    title: 'Give to Omo Yorùbá',
    line: "Gifts hold up the language lessons, the festival at Leimert Park, and the children's programs.",
  },
  primaryAction: { label: 'Give now', kind: 'give', enquiryKind: null, href: null, newTab: null },
  secondaryActions: [
    {
      _key: 'action-1',
      label: 'Partner or sponsor',
      kind: 'enquiry',
      enquiryKind: 'sponsor',
      href: null,
      newTab: null,
    },
  ],
  giveNow: {
    title: 'Give now',
    blurb: 'Choose an amount, one time or monthly, and pay securely through Zeffy.',
    facts: [
      { _key: 'fact-1', label: 'Fees', value: null, note: null },
      { _key: 'fact-2', label: 'Receipt', value: null, note: null },
      { _key: 'fact-3', label: 'Monthly', value: null, note: null },
      {
        _key: 'fact-4',
        label: 'If the form fails',
        value: 'The dialog offers contact and a mailing address instead.',
        note: null,
      },
    ],
  },
  largerScale: {
    title: 'Giving at a larger scale',
    blurb: 'Organizations, funders, and civic partners.',
    doors: [door('door-partner', 'Partner or sponsor')],
  },
  levels: null,
  otherWays: null,
  taxLine: 'To the extent allowed by law',
  settings: { orgName: 'Omo Yorùbá of Southern California', ein: null, address: null },
  layout: { impact: 'shown' },
  seo: null,
} as unknown as DonatePageData;

const withData = (patch: Record<string, unknown>) => ({ ...seeded, ...patch }) as DonatePageData;

describe('buildDonatePage', () => {
  it("keeps the header's gold Give now as the page's one, beside the outline partner action", () => {
    const view = buildDonatePage(seeded, options);
    expect(view.layout).toEqual({ impact: 'shown' });
    expect(view.header.actions.map((action) => [action.label, action.kind])).toEqual([
      ['Give now', 'give'],
      ['Partner or sponsor', 'enquiry'],
    ]);
    expect(buildDonatePage(null, options).title).toBe('Donate');
  });

  it('carries the give-now facts, the Zeffy ones owed with one chip wording', () => {
    const view = buildDonatePage(seeded, options).give;
    expect(view.title).toBe('Give now');
    expect(view.facts.map((fact) => [fact.label, fact.value, fact.pending])).toEqual([
      ['Fees', undefined, 'how your Zeffy form handles this'],
      ['Receipt', undefined, 'how your Zeffy form handles this'],
      ['Monthly', undefined, 'how your Zeffy form handles this'],
      [
        'If the form fails',
        'The dialog offers contact and a mailing address instead.',
        'how your Zeffy form handles this',
      ],
    ]);
  });

  it('draws one door in the row form and two or more as cards', () => {
    const one = buildDonatePage(seeded, options).larger;
    expect(one).toMatchObject({ layout: 'row', title: 'Giving at a larger scale' });
    expect(one.doors.map((item) => item.door.title)).toEqual(['Partner or sponsor']);
    const two = buildDonatePage(
      withData({
        largerScale: {
          ...seeded.largerScale,
          doors: [door('door-partner', 'Partner or sponsor'), door('door-2', '[ A second door ]')],
        },
      }),
      options,
    ).larger;
    expect(two.layout).toBe('card');
    expect(buildDonatePage(withData({ largerScale: null }), options).larger).toMatchObject({
      doors: [],
      pending: 'the doors for organizations',
    });
  });

  it('draws each giving level as its amount, what it does and its source, shown by the option', () => {
    const owed = buildDonatePage(seeded, options).gifts;
    expect(owed).toMatchObject({
      shown: true,
      levels: [],
      pending: 'the preset amounts and what each buys',
      linePending: 'what the gift does',
      sourcePending: 'where the cost comes from',
    });
    const levels = [
      {
        _id: 'level-1',
        amount: '[ Amount ]',
        what: '[ What it pays for ]',
        frequency: 'once',
        source: null,
      },
      {
        _id: 'level-2',
        amount: '[ Amount ]',
        what: null,
        frequency: 'monthly',
        source: '[ Source ]',
      },
    ];
    const view = buildDonatePage(withData({ levels }), options).gifts;
    expect(view.levels.map((level) => [level.figure, level.line, level.source])).toEqual([
      ['[ Amount ]', '[ What it pays for ]', undefined],
      ['[ Amount ] a month', undefined, '[ Source ]'],
    ]);
    expect(buildDonatePage(withData({ layout: { impact: 'hidden' } }), options).gifts.shown).toBe(
      false,
    );
  });

  it('adds the address to a check and the EIN with the legal name to matching and a fund, or their chips', () => {
    const otherWays = [
      {
        _key: 'way-1',
        kind: 'check',
        title: '[ By check ]',
        blurb: '[ Made out to us ]',
        detail: null,
      },
      {
        _key: 'way-2',
        kind: 'matching',
        title: '[ Matching ]',
        blurb: null,
        detail: '[ Registered ]',
      },
      { _key: 'way-3', kind: 'daf', title: '[ A fund ]', blurb: null, detail: null },
      {
        _key: 'way-4',
        kind: 'inKind',
        title: '[ Goods ]',
        blurb: null,
        detail: '[ What we take ]',
      },
    ];
    const owed = buildDonatePage(withData({ otherWays }), options).other.ways;
    expect(owed.map((way) => [way.detail, way.detailPending])).toEqual([
      [undefined, 'mailing address'],
      ['[ Registered ] Our legal name is Omo Yorùbá of Southern California.', 'EIN'],
      ['Our legal name is Omo Yorùbá of Southern California.', 'EIN'],
      ['[ What we take ]', undefined],
    ]);
    const held = buildDonatePage(
      withData({
        otherWays,
        settings: {
          orgName: 'Omo Yorùbá of Southern California',
          ein: '[ EIN ]',
          address: '[ Street ]\n[ City ]',
        },
      }),
      options,
    ).other.ways;
    expect(held.map((way) => [way.detail, way.detailPending])).toEqual([
      ['[ Street ], [ City ]', undefined],
      [
        '[ Registered ] Our EIN is [ EIN ] and our legal name is Omo Yorùbá of Southern California.',
        undefined,
      ],
      ['Our EIN is [ EIN ] and our legal name is Omo Yorùbá of Southern California.', undefined],
      ['[ What we take ]', undefined],
    ]);
    expect(buildDonatePage(seeded, options).other).toEqual({
      ways: [],
      pending: 'which other ways to give you accept',
    });
  });

  it('builds the trust block from the settings, the tax line and the receipt fact', () => {
    expect(buildDonatePage(seeded, options).trust.cells).toEqual([
      { label: 'Tax status', value: '501(c)(3)', note: 'Since 1997' },
      { label: 'EIN', value: undefined, pending: 'EIN' },
      {
        label: 'Deductible',
        value: 'To the extent allowed by law',
        pending: 'the tax-deductible line',
      },
      { label: 'Receipt', value: undefined, pending: 'how your Zeffy form handles this' },
    ]);
    const renamed = withData({
      giveNow: {
        ...seeded.giveNow,
        facts: seeded.giveNow?.facts?.filter((fact) => fact?.label !== 'Receipt'),
      },
    });
    expect(buildDonatePage(renamed, options).trust.cells.map((cell) => cell.label)).toEqual([
      'Tax status',
      'EIN',
      'Deductible',
    ]);
  });

  it('puts the edit attributes on the option and the levels in draft mode only', () => {
    expect(buildDonatePage(seeded, options).edit.impact).toBeUndefined();
    const levels = [
      { _id: 'level-1', amount: '[ Amount ]', what: null, frequency: null, source: null },
    ];
    const draft = buildDonatePage(withData({ levels }), { ...options, draft: true });
    expect(draft.edit.impact).toContain('path=layout.impact');
    expect(draft.gifts.levels[0]?.edit).toContain('id=level-1;type=givingLevel');
  });
});
