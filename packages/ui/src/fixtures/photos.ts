/**
 * The register's photographs for the stories, imported as URL assets from the design handoff
 * (docs/design/design/images/w2, the same files the seed uploads) so nothing is duplicated in the
 * repo. Alt text is the register's caption with its marks written, as the seed stores it. Only the
 * photographs the homepage prototype uses are listed; add a line when a story needs another.
 */
import communityDance from '../../../../docs/design/design/images/w2/community-dance.jpg?url';
import galaSelfie from '../../../../docs/design/design/images/w2/gala-2025-three-friends-selfie.jpg?url';
import attendeeSmiling from '../../../../docs/design/design/images/w2/odunde-2026-attendee-smiling-2.jpg?url';
import learningYoruba from '../../../../docs/design/design/images/w2/odunde-2026-attendees-learning-yoruba.jpg?url';
import atMarket from '../../../../docs/design/design/images/w2/odunde-2026-attendees-sitting-at-market.jpg?url';
import guestsSmiling from '../../../../docs/design/design/images/w2/odunde-2026-group-guests-smiling.jpg?url';
import kidsCrafts from '../../../../docs/design/design/images/w2/odunde-2026-kids-doing-crafts.jpg?url';
import momGames from '../../../../docs/design/design/images/w2/odunde-2026-mom-playing-games-with-kids.jpg?url';
import receivingGift from '../../../../docs/design/design/images/w2/odunde-2026-president-receiving-gift.jpg?url';
import processionZoomed from '../../../../docs/design/design/images/w2/odunde-2026-procession-zoomed.jpg?url';
import vendorNecklaces from '../../../../docs/design/design/images/w2/odunde-2026-vendor-necklaces.jpg?url';
import vendorSuya from '../../../../docs/design/design/images/w2/odunde-2026-vendor-selling-suya.jpg?url';
import teachingSession from '../../../../docs/design/design/images/w2/odunde-2026-yoruba-language-teaching-session.jpg?url';

export interface FixturePhoto {
  src: string;
  alt: string;
}

export const PHOTOS = {
  communityDance: {
    src: communityDance,
    alt: 'A woman in green print and gèlè laughs with her arms out as the room sings',
  },
  attendeeSmiling: {
    src: attendeeSmiling,
    alt: 'A man in a purple and teal print shirt and cap smiles on Degnan Boulevard',
  },
  learningYoruba: {
    src: learningYoruba,
    alt: 'Two women in gèlè listen to the Yoruba lesson beside the market stalls',
  },
  kidsCrafts: {
    src: kidsCrafts,
    alt: 'Children at the craft tables in Àgbàlá Ọmọde with a Ludo board and paper crafts',
  },
  guestsSmiling: {
    src: guestsSmiling,
    alt: 'A mother, daughter and son in matching festival dress smile together',
  },
  receivingGift: {
    src: receivingGift,
    alt: "A gift is presented to the association's leaders at the opening",
  },
  processionZoomed: {
    src: processionZoomed,
    alt: 'Women in white with green and white sashes dance in the procession',
  },
  vendorSuya: {
    src: vendorSuya,
    alt: 'A vendor in indigo àdìrẹ serves suya to a guest in white',
  },
  momGames: {
    src: momGames,
    alt: 'A mother and her two children play ayo and Ludo at the Àgbàlá Ọmọde table',
  },
  atMarket: {
    src: atMarket,
    alt: 'Elders in aṣọ òkè and lace rest at a round table under the Ọjà Balógun sign',
  },
  galaSelfie: {
    src: galaSelfie,
    alt: 'Three women take a selfie in front of the red, silver and green balloon arch',
  },
  teachingSession: {
    src: teachingSession,
    alt: 'A whiteboard from the Yoruba class: the alphabet, vowels, consonants and the three tones',
  },
  vendorNecklaces: {
    src: vendorNecklaces,
    alt: 'A vendor shows cowrie necklaces to an elder in white agbada',
  },
} as const satisfies Record<string, FixturePhoto>;
