/** Stable presentation and action defaults approved on 11 October 2026 (ADR 0053). */
export const FIXED_LAYOUTS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  homepage: {
    gallery: '7',
    involved: 'doors',
    newsletter: 'footer',
    pattern: 'rich',
    motion: 'on',
  },
  festivalPage: {
    phead: 'photo',
    zones: 'mosaic',
    labels: 'column',
  },
  galaPage: {
    treatment: 'formal',
    tiers: 'columns',
    labels: 'column',
  },
  programsPage: {
    // Three across since ADR 0055: three programs run, and the Programs page leaves out the fourth.
    cards: 'three',
    inline: 'expanded',
  },
  lessonsPage: {
    faq: 'closed',
  },
  collectivePage: {
    initiatives: 'side',
    green: 'signal',
  },
  getInvolvedPage: {
    doors: 'cards',
  },
  impactPage: {
    stats: 'four',
    outcomes: 'cards',
  },
  storyPage: {
    bios: 'short',
  },
  galleryPage: {
    open: 'viewer',
    captions: 'always',
  },
};

export const fixedLayoutValue = (type: string, field: string) => FIXED_LAYOUTS[type]?.[field];

export interface PageAction {
  label: string;
  kind: 'enquiry' | 'give' | 'join' | 'url' | 'anchor';
  enquiryKind?: string;
  href?: string;
  newTab?: boolean;
}

/** The page supplies its ordinary actions; only the homepage chooses campaign buttons. */
export const PAGE_ACTIONS: Readonly<Record<string, readonly PageAction[]>> = {
  collectivePage: [
    {
      enquiryKind: 'sponsor',
      kind: 'enquiry',
      label: 'Partner with the Collective',
    },
    {
      href: '#events',
      kind: 'anchor',
      label: 'See what is on',
    },
  ],
  donatePage: [
    {
      kind: 'give',
      label: 'Give now',
    },
    {
      enquiryKind: 'sponsor',
      kind: 'enquiry',
      label: 'Partner or sponsor',
    },
  ],
  festivalPage: [
    {
      href: '#plan',
      kind: 'anchor',
      label: 'Plan your day',
    },
    {
      enquiryKind: 'vendor',
      kind: 'enquiry',
      label: 'Apply as a vendor',
    },
  ],
  galaPage: [
    {
      href: '#seats',
      kind: 'anchor',
      label: 'Get tickets',
    },
    {
      enquiryKind: 'sponsor',
      kind: 'enquiry',
      label: 'Sponsor the evening',
    },
  ],
  galleryPage: [],
  getInvolvedPage: [],
  impactPage: [
    {
      enquiryKind: 'sponsor',
      kind: 'enquiry',
      label: 'Sponsor or partner',
    },
    {
      enquiryKind: 'contact',
      kind: 'enquiry',
      label: 'Talk to us',
    },
  ],
  lessonsPage: [
    {
      enquiryKind: 'enrol',
      kind: 'enquiry',
      label: 'Write to the teacher',
    },
  ],
  programsPage: [
    {
      enquiryKind: 'enrol',
      kind: 'enquiry',
      label: 'Enroll a learner',
    },
  ],
  storyPage: [],
};

export interface RowWords {
  title: string;
  label: string;
  chip?: string;
}
/** Existing page-specific wording, without dates, prices, promises or duplicated factual lines. */
export const TAKE_PART_WORDS: Readonly<Record<string, Readonly<Record<string, RowWords>>>> = {
  collectivePage: {
    sponsor: {
      title: 'Partner or fund a project',
      label: 'Talk to us',
      chip: 'Partner',
    },
    volunteer: {
      title: 'Bring a skill',
      label: 'Volunteer a skill',
      chip: 'Skills',
    },
    updates: {
      title: 'Follow the Collective',
      label: 'Subscribe',
    },
  },
  festivalPage: {
    vendor: {
      title: 'Sell at Ọjà Balógun',
      label: 'Apply for a booth',
    },
    sponsor: {
      title: 'Keep the day open',
      label: 'Sponsor Odunde',
    },
    performer: {
      title: 'Drummers, dancers, cultural groups',
      label: 'Ask about performing',
    },
    volunteer: {
      title: 'Festival day needs hands',
      label: 'Volunteer',
    },
  },
  galaPage: {
    sponsor: {
      title: 'Sponsor the evening',
      label: 'Sponsor the Gala',
    },
    volunteer: {
      title: 'The night needs hands',
      label: 'Volunteer',
    },
    give: {
      title: 'Cannot come this year?',
      label: 'Donate',
    },
  },
  lessonsPage: {
    volunteer: {
      title: 'Volunteer with us',
      label: 'Raise your hand',
      chip: 'Volunteer',
    },
    member: {
      title: 'Become a member',
      label: 'Become a member',
    },
    give: {
      title: 'Give toward the lessons',
      label: 'Donate',
    },
  },
  programsPage: {
    enrol: {
      title: 'Start Yoruba lessons',
      label: 'Enroll a learner',
    },
    volunteer: {
      title: 'Help with a program',
      label: 'Volunteer',
      chip: 'Volunteer',
    },
    give: {
      title: 'Give toward the programs',
      label: 'Donate',
    },
  },
  storyPage: {
    member: {
      title: 'Become a member',
      label: 'Become a member',
    },
    volunteer: {
      title: 'Raise your hand',
      label: 'Volunteer',
      chip: 'Volunteer',
    },
  },
};

const WAY_WORDS: Readonly<Record<string, RowWords>> = {
  vendor: { title: 'Apply as a vendor', label: 'Apply for a booth' },
  sponsor: { title: 'Sponsor or partner', label: 'Sponsor or partner' },
  performer: { title: 'Ask about performing', label: 'Ask about performing' },
  volunteer: { title: 'Volunteer with us', label: 'Volunteer' },
  table: { title: 'Arrange a table', label: 'Ask about a table' },
  give: { title: 'Give toward the programs', label: 'Donate' },
  enrol: { title: 'Enroll a learner', label: 'Enroll a learner' },
  member: { title: 'Become a member', label: 'Become a member' },
  updates: { title: 'Stay in touch', label: 'Get updates' },
};
export function takePartWords(type: string, way: string | null | undefined): RowWords | undefined {
  return way ? (TAKE_PART_WORDS[type]?.[way] ?? WAY_WORDS[way]) : undefined;
}

export const GALA_INTROS = {
  tiers: 'Choose your tickets and pay through the ticket form on this page.',
  sponsor: 'One enquiry covers this evening, Odunde, or both: just tick which.',
  honorees: 'Who we are honoring this year, and who has been honored before.',
} as const;
