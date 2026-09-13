/**
 * The register's photographs for the stories, imported as URL assets from the design handoff
 * (docs/design/design/images/w2, the same files the seed uploads) so nothing is duplicated in the
 * repo. Alt text is the register's caption with its marks written, as the seed stores it. Only the
 * photographs the homepage and event-page stories use are listed; add a line when a story needs
 * another.
 */
import communityDance from '../../../../docs/design/design/images/w2/community-dance.jpg?url';
import galaGettingFood from '../../../../docs/design/design/images/w2/gala-2025-attendees-getting-food.jpg?url';
import galaGroupPortrait from '../../../../docs/design/design/images/w2/gala-2025-attendees-group-photo.jpg?url';
import galaSitting from '../../../../docs/design/design/images/w2/gala-2025-attendees-sitting.jpg?url';
import galaSmiling from '../../../../docs/design/design/images/w2/gala-2025-attendees-smiling.jpg?url';
import galaGroup from '../../../../docs/design/design/images/w2/gala-2025-group-photo.jpg?url';
import galaSelfie from '../../../../docs/design/design/images/w2/gala-2025-three-friends-selfie.jpg?url';
import attendeeSmiling from '../../../../docs/design/design/images/w2/odunde-2026-attendee-smiling-2.jpg?url';
import learningYoruba from '../../../../docs/design/design/images/w2/odunde-2026-attendees-learning-yoruba.jpg?url';
import atMarket from '../../../../docs/design/design/images/w2/odunde-2026-attendees-sitting-at-market.jpg?url';
import guestsSmiling from '../../../../docs/design/design/images/w2/odunde-2026-group-guests-smiling.jpg?url';
import kidWithElder from '../../../../docs/design/design/images/w2/odunde-2026-kid-playing-with-elder.jpg?url';
import kidWithMasquerade from '../../../../docs/design/design/images/w2/odunde-2026-kid-playing-with-masquerade-performer.jpg?url';
import kidsCrafts from '../../../../docs/design/design/images/w2/odunde-2026-kids-doing-crafts.jpg?url';
import kidsPaintArt from '../../../../docs/design/design/images/w2/odunde-2026-kids-doing-paint-art.jpg?url';
import momGames from '../../../../docs/design/design/images/w2/odunde-2026-mom-playing-games-with-kids.jpg?url';
import geleTying from '../../../../docs/design/design/images/w2/odunde-2026-performer-doing-gele-tying.jpg?url';
import performerGeleSpeaking from '../../../../docs/design/design/images/w2/odunde-2026-performer-gele-speaking.jpg?url';
import performerSpeaking from '../../../../docs/design/design/images/w2/odunde-2026-performer-speaking-with-theater-backdrop.jpg?url';
import receivingGift from '../../../../docs/design/design/images/w2/odunde-2026-president-receiving-gift.jpg?url';
import processionBegins from '../../../../docs/design/design/images/w2/odunde-2026-procession-begins.jpg?url';
import processionDrummer from '../../../../docs/design/design/images/w2/odunde-2026-procession-with-drummer.jpg?url';
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
  kidsPaintArt: {
    src: kidsPaintArt,
    alt: 'Children build with craft sticks at a long table lined with small blue robots',
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
    alt: 'A vendor shows cowrie necklaces to an elder in white agbádá',
  },
  processionDrummer: {
    src: processionDrummer,
    alt: 'The procession moves down Degnan Boulevard led by a gángan drummer in white',
  },
  processionBegins: {
    src: processionBegins,
    alt: 'Members in white and green gather on Degnan Boulevard as the opening procession begins',
  },
  kidWithElder: {
    src: kidWithElder,
    alt: 'An elder in white with a green sash high-fives a toddler on the painted plaza',
  },
  kidWithMasquerade: {
    src: kidWithMasquerade,
    alt: 'A dancer in a raffia skirt plays with a young girl, the masquerade beside them',
  },
  performerSpeaking: {
    src: performerSpeaking,
    alt: 'A woman in white speaks into a microphone on the plaza below the Vision Theatre tower',
  },
  performerGeleSpeaking: {
    src: performerGeleSpeaking,
    alt: 'A woman in blue àdìrẹ and a blue gèlè speaks into a microphone',
  },
  geleTying: {
    src: geleTying,
    alt: 'A woman in blue àdìrẹ ties a green and white gèlè on a seated guest',
  },
  galaGroupPortrait: {
    src: galaGroupPortrait,
    alt: 'Three women in gold, green and copper gèlè and lace stand together in the hall',
  },
  galaSmiling: {
    src: galaSmiling,
    alt: 'Two women and a man in dark aṣọ òkè smile at their table, a gala programme in hand',
  },
  galaGroup: {
    src: galaGroup,
    alt: 'Six guests in agbádá, gèlè and a wide-brimmed hat stand arm in arm',
  },
  galaSitting: {
    src: galaSitting,
    alt: 'Guests in aṣọ òkè and gèlè seated at round tables under white drapes and chandeliers',
  },
  galaGettingFood: {
    src: galaGettingFood,
    alt: 'Guests seated at round tables in the hall, chandeliers above',
  },
} as const satisfies Record<string, FixturePhoto>;
