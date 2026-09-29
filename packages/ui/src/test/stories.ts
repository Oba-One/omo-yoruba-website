import { renderStory } from '@storybook-astro/framework/testing';

type ComposedStory = Parameters<typeof renderStory>[0];

/** Renders a composed story into `document.body` and returns the body for querying. */
export async function renderToBody(story: ComposedStory): Promise<HTMLElement> {
  await renderStory(story);
  return document.body;
}

/**
 * Renders a composed story and runs its inline scripts, as a page does: the container render never runs them
 * (ADR 0018), so a test that needs an element's behaviour renders through this. The scripts run first and the
 * markup goes back in through a fragment, so the element upgrades with its children in place. Each element
 * script's `customElements.get` guard keeps its definition, and the window and document listeners it
 * registers, to one per test file, as on a page. Only inline classic scripts run here: a bundled or module
 * script throws rather than leave its element unwired unnoticed.
 */
export async function renderLive(story: ComposedStory): Promise<HTMLElement> {
  const body = await renderToBody(story);
  const scripts = [...body.querySelectorAll('script')].map((script) => {
    if (script.src || !['', 'text/javascript'].includes(script.type)) {
      throw new Error(`renderLive runs inline classic scripts only, not ${script.outerHTML}`);
    }
    script.remove();
    return script.textContent ?? '';
  });
  const markup = body.innerHTML;
  body.replaceChildren();
  // The story's own script, exactly as the page ships it.
  for (const source of scripts) new Function(source)();
  body.append(document.createRange().createContextualFragment(markup));
  return body;
}

/** The text of an element with the whitespace the Astro compiler leaves collapsed. */
export const text = (el: Element | null | undefined) =>
  el?.textContent?.replace(/\s+/g, ' ').trim();
