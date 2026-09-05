import { create } from 'storybook/theming/create';

// The manager wears the design system: exactly the values at the bottom of
// docs/design/COMPONENT-MAP.md, nothing more (Storybook's light defaults fill the rest). This is
// the one place in @oy/ui where colour literals may appear: the manager UI runs outside the
// preview iframe and cannot read @oy/tokens; .lintignore lists the file.
export default create({
  base: 'light',
  brandTitle: 'Omo Yorùbá components',
  colorPrimary: '#1E2A5A',
  colorSecondary: '#E8A13A',
  appBg: '#FAF5EC',
  appContentBg: '#FFFFFF',
  barBg: '#1E2A5A',
  barTextColor: '#C8CDE8',
  barSelectedColor: '#F4C66D',
  fontBase: '"Source Sans 3", "Noto Sans", system-ui',
  fontCode: 'ui-monospace',
  appBorderRadius: 6,
  inputBorderRadius: 999,
});
