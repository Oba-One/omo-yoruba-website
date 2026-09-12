import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './ProverbLine.stories';

const { Default, YorubaOnly } = composeStories(stories);

describe('ProverbLine', () => {
  it('renders the crest, the Yoruba line and its English sense', async () => {
    const line = (await renderToBody(Default)).querySelector('.oy-proverb');
    expect(line?.querySelector('.oy-proverb-crest')?.getAttribute('aria-hidden')).toBe('true');
    expect(text(line?.querySelector('[lang="yo"]'))).toBe('Àgbájọ ọwọ́ la fi ń sọ̀yà.');
    expect(text(line?.querySelector('.oy-proverb-en'))).toContain(
      'Many hands make the load light.',
    );
  });

  it('stands with the Yoruba alone', async () => {
    const line = (await renderToBody(YorubaOnly)).querySelector('.oy-proverb');
    expect(line?.querySelector('.oy-proverb-en')).toBeNull();
    expect(text(line?.querySelector('[lang="yo"]'))).toContain('Àgbájọ');
  });
});
