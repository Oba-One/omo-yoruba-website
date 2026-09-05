import type { AstroRenderer, ProjectAnnotations } from '@storybook-astro/framework';
import '@oy/tokens';
import './preview.css';
import theme from './theme';

// Backgrounds: the two light grounds of the site and the dark band. The indigo choice also wraps
// the story in `.oy-dark`, which is how every dark band on the site scopes its children.
// Values repeat the tokens as literals because the toolbar swatches are painted by the manager,
// outside the preview iframe where the tokens live; .lintignore exempts this file for that reason.
const backgrounds = {
  white: { name: 'White', value: '#FFFFFF' },
  paper: { name: 'Paper', value: '#FAF5EC' },
  indigo: { name: 'Indigo 900 (dark scope)', value: '#141D40' },
} as const;

// Plain project annotations (the framework's `Preview` type is the CSF factories flavour).
const preview: ProjectAnnotations<AstroRenderer> = {
  tags: ['autodocs'],
  parameters: {
    backgrounds: { options: backgrounds },
    viewport: {
      options: {
        mobile: { name: 'Mobile 375', styles: { width: '375px', height: '812px' }, type: 'mobile' },
        desktop: {
          name: 'Desktop 1440',
          styles: { width: '1440px', height: '900px' },
          type: 'desktop',
        },
      },
    },
    // Chromatic snapshots every story at both widths (docs/design/QUALITY.md section 2).
    chromatic: { modes: { mobile: { viewport: 375 }, desktop: { viewport: 1440 } } },
    // axe runs in the panel; CI enforcement needs the Vitest addon, which waits for Phase 3.
    a11y: { test: 'todo' },
    docs: { theme },
  },
  initialGlobals: { backgrounds: { value: 'white' } },
  decorators: [
    (story, context) => {
      const chosen = context.globals.backgrounds;
      const name = typeof chosen === 'string' ? chosen : chosen?.value;
      return name === 'indigo' ? `<div class="oy-dark">${story()}</div>` : story();
    },
  ],
};

export default preview;
