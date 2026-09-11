import { describe, expect, it } from 'vitest';
import { PUBLIC_ROUTES } from '../routes';
import { documentTypes } from '../schema';
import { presentationOptions } from './presentation';

describe('presentationOptions', () => {
  it('resolves a location for every document type', () => {
    const locations = presentationOptions.resolve?.locations as Record<string, unknown> | undefined;
    expect(locations).toBeDefined();
    for (const type of documentTypes) expect(locations, type.name).toHaveProperty(type.name);
  });

  it('names a main document for every public route', () => {
    const main = (presentationOptions.resolve?.mainDocuments ?? []) as {
      route: string | string[];
    }[];
    const routes = main.flatMap((entry) =>
      Array.isArray(entry.route) ? entry.route : [entry.route],
    );
    for (const route of PUBLIC_ROUTES) {
      const expected = route.replace('[album]', ':slug').replace('[slug]', ':slug');
      expect(routes, route).toContain(expected);
    }
  });

  it('points the preview routes at the site', () => {
    expect(presentationOptions.previewUrl).toMatchObject({
      previewMode: { enable: '/api/preview/enable', disable: '/api/preview/disable' },
    });
  });
});
