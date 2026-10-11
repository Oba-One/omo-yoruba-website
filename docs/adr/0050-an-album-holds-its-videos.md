# An album holds its videos, and YouTube loads only on the visitor's press

Decided on 10 October 2026, at the owner's request of that day: "we need to pull in some video content from odunde
2026, from youtube". The two videos named are the photographer's teaser and highlights of Odunde 2026, public on Red
Carpet Films' channel. The design handoff draws no video anywhere, and `docs/design/AGENT-DOCS.md` section 8 lists a
third party beyond Sanity, Zeffy, Eventbrite, PostHog and the fonts as a thing to ask before adding: the owner's
request is that answer for YouTube. Where the videos show and how they play was left to the build, and is the owner's
to change.

Amends ADR 0045 (what the policy frames: YouTube's player as well as Zeffy's form) and ADR 0043 (what the hold
withholds: an album's videos as well as its photographs), each noted there.

- An album holds its videos (`album.videos`, the shared `video` object: a title, the YouTube address, an optional
  still, who made it), as it holds its photographs. The album page shows them above the photographs. An event page
  shows the first video of the past edition's album under past years, where it already shows that album's
  photographs.
- A page that shows a video asks YouTube for nothing until the visitor presses play. The tile is our own photograph
  (the video's still, else the album's cover, else its first photograph) with a play mark, and it is a plain link to the video on YouTube, so
  it works without JavaScript. On the press the link gives way to YouTube's player from `www.youtube-nocookie.com`,
  whose address is built from the video's id alone, never from the stored text.
- The policy gains one frame origin, `https://www.youtube-nocookie.com`. YouTube is a frame and never a script, as
  Zeffy is (ADR 0045). What the Give Dialog may frame stays Zeffy's origin alone.
- While the gallery holds the albums (ADR 0043), their videos are held with their photographs.

## Considered options

- **Host the files ourselves** (Sanity file assets or a video service): no third party on play, but a twelve-minute
  video is hundreds of megabytes against the plan's asset and bandwidth allowance, the photographer's upload is the
  published original, and a streaming service is a new dependency.
- **YouTube's own embed code, loaded with the page:** the least markup, but every visit to the page then calls
  YouTube, the player's scripts weigh on the budgets in `docs/design/QUALITY.md` section 3, and a player that loads
  unasked sits badly with "nothing opens on load".
- **A link only:** no player and no policy change, but the visitor leaves the site, and the owner asked for the
  videos on it.
- **Videos on the edition (`event`) instead of the album:** ADR 0013 puts what changes per edition on `event`, but an
  album with no edition (the summer camp) could then hold none, and the event pages already reach an edition's
  photographs through its album (ADR 0042).

## Consequences

- The handoff has no video treatment, so `VideoGrid` follows the photo tile's rules: 6px corners, the gold edge on
  hover, no lift, no zoom, and a play mark that is not gold, since gold is the page's one primary action.
- Once a visitor presses play, YouTube's player, its suggestions and its data practices apply inside the frame. The
  line "Plays from YouTube." under each video says so before the press, and `rel=0` keeps the suggestions to the
  same channel.
- A video is optional: no Pending chip and no To do row asks for one.
- The still is a plain hotspot image, not the shared `oyImage`: the tile draws it as decoration with an empty alt,
  since the play link carries the video's name, and shows no caption or credit of its own, so the Studio asks the
  owner for none of them.
- The owner adds a video in the Studio by pasting its address. Captions, transcripts and quotes from a video are not
  part of this decision.
