import { defineField, defineType } from 'sanity';
import { voice } from '../../validation/rules';
import { youtubeId } from '../../videos';

/** What the Studio says when the address names no video: what to do, not what went wrong. */
const NOT_A_VIDEO =
  "Paste the address the video's Share button on YouTube gives. It starts with https://.";

/**
 * One video of an album (ADR 0050): a title, the YouTube address and, optionally, a still and who made it. The
 * site plays it from YouTube only once a visitor presses play, keeping nothing of the address but the video's id
 * (`videos.ts`). Optional like the rest of an album's extras: there is no Pending row for a video.
 *
 * The still is a plain hotspot image, not `oyImage`: the tile draws it as decoration with an empty alt, since the
 * play link carries the video's name, and shows no caption or credit of its own, so the Studio asks for none.
 */
export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: voice.requiredHeading,
    }),
    defineField({
      name: 'url',
      title: 'YouTube address',
      type: 'url',
      description:
        "Paste the address the video's Share button on YouTube gives. The site shows the still and plays the video from YouTube once a visitor presses play.",
      validation: (rule) => [
        rule.required(),
        rule.uri({ scheme: ['https'] }),
        rule.custom((value) => (!value || youtubeId(value) ? true : NOT_A_VIDEO)),
      ],
    }),
    defineField({
      name: 'still',
      title: 'Still',
      type: 'image',
      options: { hotspot: true },
      description:
        "The photograph shown before the video plays. Empty takes the album's cover, else its first photograph.",
    }),
    defineField({
      name: 'credit',
      title: 'Made by',
      type: 'reference',
      to: [{ type: 'photographer' }],
      description: 'Shown under the video, linked to their page when they have one.',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'url', media: 'still' } },
});
