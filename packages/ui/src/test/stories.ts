import { renderStory } from '@storybook-astro/framework/testing';

type ComposedStory = Parameters<typeof renderStory>[0];

/** Renders a composed story into `document.body` and returns the body for querying. */
export async function renderToBody(story: ComposedStory): Promise<HTMLElement> {
  await renderStory(story);
  return document.body;
}

/** The text of an element with the whitespace the Astro compiler leaves collapsed. */
export const text = (el: Element | null | undefined) =>
  el?.textContent?.replace(/\s+/g, ' ').trim();
