import type { PresentationPluginOptions } from 'sanity/presentation';

// The site is the preview origin (the Studio is embedded in it). The enable route validates the
// Studio's secret and sets the perspective cookie; disable clears it (ADR 0017). Locations and
// main documents for every route arrive in ticket 08.
export const presentationOptions: PresentationPluginOptions = {
  previewUrl: {
    previewMode: {
      enable: '/api/preview/enable',
      disable: '/api/preview/disable',
    },
  },
};
