import { describe, expect, it } from 'vitest';
import { currentHref, isEventsPage, NAV_LINKS, pageKeyFor } from './nav';

describe('nav', () => {
  it('maps every route to the page key the ported CSS marks as current', () => {
    expect(pageKeyFor('/')).toBe('');
    expect(pageKeyFor('/odunde')).toBe('odunde');
    expect(pageKeyFor('/gala')).toBe('gala');
    expect(pageKeyFor('/programs')).toBe('programs');
    expect(pageKeyFor('/programs/yoruba-lessons')).toBe('school');
    expect(pageKeyFor('/programs/cultural-collective')).toBe('collective');
    expect(pageKeyFor('/get-involved')).toBe('involved');
    expect(pageKeyFor('/impact')).toBe('impact');
    expect(pageKeyFor('/our-story')).toBe('about');
    expect(pageKeyFor('/news/a-post')).toBe('news');
    expect(pageKeyFor('/gallery/odunde-2026')).toBe('gallery');
    expect(pageKeyFor('/donate')).toBe('');
    expect(pageKeyFor('/odunde?enquiry=vendor#enquiry')).toBe('odunde');
  });

  it('marks Events current on both event pages and nowhere else', () => {
    expect(isEventsPage(pageKeyFor('/odunde'))).toBe(true);
    expect(isEventsPage(pageKeyFor('/gala'))).toBe(true);
    expect(isEventsPage(pageKeyFor('/programs'))).toBe(false);
  });

  it('finds the exact link for aria-current and none for a child path', () => {
    expect(currentHref('/programs')).toBe('/programs');
    expect(currentHref('/programs/yoruba-lessons')).toBeUndefined();
    expect(currentHref('/gala')).toBe('/gala');
    expect(NAV_LINKS.map((l) => l.label)).toEqual([
      'Programs',
      'Get Involved',
      'Impact',
      'Our Story',
    ]);
  });
});
