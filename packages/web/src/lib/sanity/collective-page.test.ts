import { createImageSet } from '@oy/content/images';
import { COLLECTIVE_VOICE_SLOT } from '@oy/content/pending';
import { describe, expect, it } from 'vitest';
import { buildCollectivePage, type CollectivePageData } from './collective-page';

const imageSet = createImageSet({ projectId: 'abc123', dataset: 'development' });
const options = { imageSet, draft: false, studioUrl: '/admin' };

// The development dataset as the seed leaves it on 13 September 2026: no argument, no voice.
const seeded = {
  header: {
    kicker: { yo: 'Ẹgbẹ́ àṣà', en: 'The cultural collective' },
    title: 'Yoruba Cultural Collective',
    line: 'Culture put to work. A circle of members who meet, host events through the year, and run two member-led projects, the Solar Hub and Green Goods.',
  },
  primaryAction: {
    label: 'Partner with the Collective',
    kind: 'enquiry',
    enquiryKind: 'sponsor',
    href: null,
    newTab: null,
  },
  secondaryActions: [
    {
      _key: 'action-1',
      label: 'See what is on',
      kind: 'anchor',
      enquiryKind: null,
      href: '#events',
      newTab: null,
    },
  ],
  argument: null,
  photo: {
    _id: 'program-cultural-collective',
    name: 'Yoruba Cultural Collective',
    image: {
      _type: 'oyImage',
      alt: 'A man in a purple and teal print shirt and cap smiles on Degnan Boulevard',
      caption: null,
      hotspot: { _type: 'sanity.imageHotspot', x: 0.5, y: 0.25, width: 0.4, height: 0.4 },
      crop: null,
      asset: {
        _ref: 'image-5613019ae49b4302318bb46596967095def7db3c-1024x683-jpg',
        _type: 'reference',
      },
    },
  },
  voice: null,
  takePart: [
    {
      _key: 'way-1',
      way: 'sponsor',
      chip: 'Partner',
      title: 'Partner or fund a project',
      line: 'Organizations, funders, and civic partners. Four questions and we send the deck.',
      label: 'Talk to us',
    },
    {
      _key: 'way-2',
      way: 'volunteer',
      chip: 'Skills',
      title: 'Bring a skill',
      line: 'Tell us what you can do and we will find where it fits.',
      label: 'Volunteer a skill',
    },
    {
      _key: 'way-3',
      way: 'updates',
      chip: null,
      title: 'Follow the Collective',
      line: 'Collective news goes out with our newsletter, once or twice a month.',
      label: 'Subscribe',
    },
  ],
  layout: { initiatives: 'side', green: 'signal', status: 'shown', events: 'shown' },
  seo: null,
} as unknown as CollectivePageData;

// Test values only: the Studio holds no collective testimonial yet.
const voice = {
  _id: 'testimonial-collective',
  quote: '[ Two or three sentences ]',
  name: 'Adé Bákàrè',
  relation: '[ Member ]',
  permissionToName: false,
};

describe('buildCollectivePage', () => {
  it('fills the layout defaults, the slim header and its two actions', () => {
    const view = buildCollectivePage(seeded, options);
    expect(view.layout).toEqual({
      initiatives: 'side',
      green: 'signal',
      status: 'shown',
      events: 'shown',
    });
    expect(buildCollectivePage(null, options).layout).toEqual(view.layout);
    expect(view.root).toEqual(view.layout);
    expect(view.header).toMatchObject({ variant: 'slim', title: 'Yoruba Cultural Collective' });
    expect(view.header.actions.map((action) => action.label)).toEqual([
      'Partner with the Collective',
      'See what is on',
    ]);
    expect(view.title).toBe('Yoruba Cultural Collective');
    expect(buildCollectivePage(null, options).title).toBe('Yoruba Cultural Collective');
  });

  it("sets the argument's chip beside the Collective program's photograph", () => {
    const why = buildCollectivePage(seeded, options).why;
    expect(why).toMatchObject({
      argument: undefined,
      pending: 'why culture and sustainability sit together, in your words',
      photoWhat: 'a photo of Yoruba Cultural Collective',
    });
    expect(why.photo?.alt).toBe(
      'A man in a purple and teal print shirt and cap smiles on Degnan Boulevard',
    );
    const without = buildCollectivePage(
      { ...seeded, photo: null } as CollectivePageData,
      options,
    ).why;
    expect(without.photo).toBeUndefined();
    expect(without.photoWhat).toBe('a photo of Yoruba Cultural Collective');
  });

  it('carries the argument once written', () => {
    const written = buildCollectivePage(
      {
        ...seeded,
        argument: [
          {
            _type: 'block',
            _key: 'b1',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 's1', text: '[ In your words ]', marks: [] }],
          },
        ],
      } as unknown as CollectivePageData,
      options,
    );
    expect(written.why.argument).toHaveLength(1);
  });

  it('waits for the one voice in its slot, under the chip "the quote and who said it"', () => {
    expect(buildCollectivePage(seeded, options).voice).toEqual({
      testimonial: undefined,
      placeholder: COLLECTIVE_VOICE_SLOT,
      pending: 'the quote and who said it',
      edit: undefined,
    });
  });

  it('draws a linked voice as it stands, the quote leaving the naming to permission', () => {
    const view = buildCollectivePage({ ...seeded, voice } as CollectivePageData, options).voice;
    expect(view.testimonial).toEqual({
      quote: '[ Two or three sentences ]',
      name: 'Adé Bákàrè',
      relation: '[ Member ]',
      permissionToName: false,
    });
  });

  it('counts the take-part rows in the lead the prototype words', () => {
    const view = buildCollectivePage(seeded, options).takePart;
    expect(view.rows.map((row) => row.way)).toEqual(['sponsor', 'volunteer', 'updates']);
    expect(view).toMatchObject({
      intro: 'The projects above are led by members. Three ways to join them.',
      labels: 'column',
      pending: 'the ways in',
    });
    const one = buildCollectivePage(
      { ...seeded, takePart: seeded.takePart?.slice(0, 1) } as CollectivePageData,
      options,
    );
    expect(one.takePart.intro).toBe('The projects above are led by members. One way to join them.');
    expect(buildCollectivePage(null, options).takePart.intro).toBeUndefined();
  });

  it('adds edit attributes in draft mode only', () => {
    expect(buildCollectivePage(seeded, options).edit.green).toBeUndefined();
    const draft = buildCollectivePage(seeded, { ...options, draft: true });
    expect(draft.edit.green).toContain('path=layout.green');
    expect(draft.why.edit).toContain('path=argument');
    expect(draft.why.photoEdit).toContain('id=program-cultural-collective;type=program');
    expect(draft.voice.edit).toContain('path=voice');
    const linked = buildCollectivePage({ ...seeded, voice } as CollectivePageData, {
      ...options,
      draft: true,
    });
    expect(linked.voice.edit).toContain('id=testimonial-collective;type=testimonial');
  });
});
