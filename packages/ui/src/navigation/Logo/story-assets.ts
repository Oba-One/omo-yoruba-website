// The static Storybook build rewrites the Logo's image paths to emitted assets only for files that
// reach the client bundle, and .astro imports never do (framework limitation,
// docs/plans/handoff-phase-1.md). Every story that renders the Logo passes these as
// `parameters.staticBuildAssets`, so the prerendered component resolves its images.
import lockupLight2xUrl from './logo-lockup-light-2x.webp?url';
import lockupLight3xUrl from './logo-lockup-light-3x.webp?url';
import mark2xUrl from './logo-mark-2x.webp?url';
import mark3xUrl from './logo-mark-3x.webp?url';

export const logoAssets = [mark2xUrl, mark3xUrl, lockupLight2xUrl, lockupLight3xUrl];
