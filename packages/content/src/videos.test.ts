import { describe, expect, it } from 'vitest';
import { YOUTUBE_EMBED_ORIGIN, youtubeEmbedSrc, youtubeId, youtubeWatchHref } from './videos';

// A well-formed id, made up and never a real video's: eleven characters of letters, digits, "_" and "-".
const ID = 'AbC_dEf-123';

describe('youtubeId', () => {
  it('reads the id from every address YouTube gives out, keeping its case', () => {
    for (const address of [
      `https://youtu.be/${ID}`,
      `https://youtu.be/${ID}?si=abcdef`,
      `https://youtu.be/${ID}/`,
      `https://www.youtube.com/watch?v=${ID}`,
      `https://youtube.com/watch?v=${ID}`,
      `https://m.youtube.com/watch?v=${ID}`,
      `https://www.youtube.com/watch?v=${ID}&t=42s&list=PLabcdef`,
      `https://www.youtube.com/watch?list=PLabcdef&v=${ID}`,
      `https://www.youtube.com/shorts/${ID}`,
      `https://youtube.com/shorts/${ID}`,
      `https://www.youtube.com/embed/${ID}`,
      `https://www.youtube.com/live/${ID}?feature=share`,
      `https://m.youtube.com/live/${ID}`,
      `https://www.youtube-nocookie.com/embed/${ID}`,
      `https://www.youtube-nocookie.com/embed/${ID}?autoplay=1&rel=0`,
      `HTTPS://WWW.YOUTUBE.COM/watch?v=${ID}`,
      `https://www.youtube.com:443/watch?v=${ID}`,
    ]) {
      expect(youtubeId(address), address).toBe(ID);
    }
  });

  it('reads an address pasted with a space or a line break around it', () => {
    expect(youtubeId(`  https://youtu.be/${ID}\n`)).toBe(ID);
  });

  it('answers nothing for a value that is not a string', () => {
    for (const value of [undefined, null, 42, true, {}, [`https://youtu.be/${ID}`]]) {
      expect(youtubeId(value), String(value)).toBeUndefined();
    }
  });

  it('answers nothing for plain http, another host or another port', () => {
    for (const address of [
      `http://youtu.be/${ID}`,
      `http://www.youtube.com/watch?v=${ID}`,
      `ftp://youtu.be/${ID}`,
      `https://example.org/watch?v=${ID}`,
      `https://youtube.com.example.org/watch?v=${ID}`,
      `https://notyoutube.com/watch?v=${ID}`,
      `https://www.youtube.com@example.org/watch?v=${ID}`,
      `https://example.org/https://youtu.be/${ID}`,
      `https://example.org/?v=${ID}`,
      `https://music.youtube.com/watch?v=${ID}`,
      `https://youtube-nocookie.com/embed/${ID}`,
      `https://www.youtube.com:8443/watch?v=${ID}`,
      `https://vimeo.com/123456789`,
      `javascript:alert(1)//youtu.be/${ID}`,
      `data:text/html,https://youtu.be/${ID}`,
    ]) {
      expect(youtubeId(address), address).toBeUndefined();
    }
  });

  it('answers nothing for a YouTube address that names no video', () => {
    for (const address of [
      '',
      '   ',
      'not an address',
      `youtu.be/${ID}`,
      'https://youtu.be/',
      'https://www.youtube.com/',
      'https://www.youtube.com/watch',
      'https://www.youtube.com/watch?v=',
      'https://www.youtube.com/watch?list=PLabcdef',
      'https://www.youtube.com/@redcarpetfilmshollywood',
      'https://www.youtube.com/channel/UCabcdefghijklmnopqrstuv',
      'https://www.youtube.com/playlist?list=PLabcdef',
      'https://www.youtube.com/results?search_query=odunde',
      `https://www.youtube.com/watch/${ID}`,
      `https://www.youtube-nocookie.com/watch?v=${ID}`,
      `https://youtu.be/watch?v=${ID}`,
      `https://youtu.be/shorts/${ID}`,
    ]) {
      expect(youtubeId(address), address).toBeUndefined();
    }
  });

  it('answers nothing for an id of any other length or with a character an id never holds', () => {
    for (const id of [
      'AbC_dEf-12',
      'AbC_dEf-1234',
      'AbC_dEf-12!',
      'AbC dEf-123',
      'AbC.dEf-123',
      'AbC%64Ef-123',
      'AbC/dEf-123',
    ]) {
      expect(youtubeId(`https://youtu.be/${id}`), id).toBeUndefined();
      expect(youtubeId(`https://www.youtube.com/watch?v=${id}`), id).toBeUndefined();
      expect(youtubeId(`https://www.youtube.com/shorts/${id}`), id).toBeUndefined();
    }
    expect(youtubeId(`https://www.youtube.com/embed/${ID}/extra`)).toBeUndefined();
    expect(youtubeId(`https://www.youtube.com/watch?v=${ID}extra`)).toBeUndefined();
  });

  // YouTube's embed path takes a playlist as `videoseries` and a channel's live stream as `live_stream`: each is
  // eleven characters, so the shape of an id alone would call it a video.
  it('answers nothing for the embed paths of a playlist or a live stream, which are eleven characters but no video', () => {
    for (const address of [
      'https://www.youtube.com/embed/videoseries?list=PLabcdef',
      'https://www.youtube-nocookie.com/embed/videoseries?list=PLabcdef',
      'https://www.youtube.com/embed/live_stream?channel=UCabcdefghijklmnopqrstuv',
      'https://www.youtube-nocookie.com/embed/live_stream?channel=UCabcdefghijklmnopqrstuv',
      'https://youtu.be/videoseries',
      'https://www.youtube.com/watch?v=live_stream',
    ]) {
      expect(youtubeId(address), address).toBeUndefined();
    }
  });

  it('leaves stega to the caller: an address with its characters still around it reads nothing', () => {
    const tail = '\u200B\u200C\u200D\uFEFF';
    for (const address of [`https://youtu.be/${ID}${tail}`, `${tail}https://youtu.be/${ID}`]) {
      expect(youtubeId(address)).toBeUndefined();
    }
    expect(youtubeId(`https://www.youtube.com/watch?v=${ID}${tail}`)).toBeUndefined();
  });
});

describe('youtubeEmbedSrc', () => {
  it("is the player on YouTube's no-cookie origin, playing at once, with related videos from the same channel", () => {
    expect(youtubeEmbedSrc(ID)).toBe(
      `https://www.youtube-nocookie.com/embed/${ID}?autoplay=1&rel=0`,
    );
  });

  it('sits on the one origin the policy frames, whatever the id', () => {
    expect(YOUTUBE_EMBED_ORIGIN).toBe('https://www.youtube-nocookie.com');
    expect(new URL(youtubeEmbedSrc(ID)).origin).toBe(YOUTUBE_EMBED_ORIGIN);
  });

  it('refuses what is not an id, so nothing else can reach the address', () => {
    for (const value of [
      '',
      'short',
      'AbC_dEf-1234',
      `${ID}/../x`,
      `${ID}?x=1`,
      `${ID}#x`,
      '../x',
      'videoseries',
      'live_stream',
    ]) {
      expect(() => youtubeEmbedSrc(value), value).toThrow(TypeError);
    }
  });

  it('reads back as the id it was built from', () => {
    expect(youtubeId(youtubeEmbedSrc(ID))).toBe(ID);
  });
});

describe('youtubeWatchHref', () => {
  it("is the video's own page on YouTube, the link a visitor without JavaScript follows", () => {
    expect(youtubeWatchHref(ID)).toBe(`https://www.youtube.com/watch?v=${ID}`);
  });

  it('refuses what is not an id, and reads back as the id it was built from', () => {
    expect(() => youtubeWatchHref('short')).toThrow(TypeError);
    expect(() => youtubeWatchHref(`${ID}&x=1`)).toThrow(TypeError);
    expect(() => youtubeWatchHref('videoseries')).toThrow(TypeError);
    expect(youtubeId(youtubeWatchHref(ID))).toBe(ID);
  });
});
