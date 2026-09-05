import { describe, expect, it } from 'vitest';
import { buildCsp, cspDirectives, cspExempt, reportingEndpointsHeader } from './csp';

describe('buildCsp', () => {
  it('serialises every directive in order and ends with the report directives', () => {
    const header = buildCsp();
    for (const [name, values] of Object.entries(cspDirectives)) {
      expect(header).toContain(`${name} ${values.join(' ')}`);
    }
    expect(header.endsWith('report-to csp-endpoint; report-uri /api/csp-report')).toBe(true);
  });

  it('allows only the third parties the site uses', () => {
    const header = buildCsp();
    expect(header).toContain('https://cdn.sanity.io');
    expect(header).toContain('https://www.zeffy.com');
    expect(header).toContain('https://us.i.posthog.com');
    expect(header).not.toContain('unsafe-inline');
    expect(header).not.toContain('eventbrite');
  });
});

describe('reportingEndpointsHeader', () => {
  it('names the group the policy reports to', () => {
    expect(reportingEndpointsHeader()).toBe('csp-endpoint="/api/csp-report"');
  });
});

describe('cspExempt', () => {
  it('exempts the Studio and the report endpoint only', () => {
    expect(cspExempt('/admin')).toBe(true);
    expect(cspExempt('/admin/structure')).toBe(true);
    expect(cspExempt('/api/csp-report')).toBe(true);
    expect(cspExempt('/')).toBe(false);
    expect(cspExempt('/administration')).toBe(false);
    expect(cspExempt('/api/preview/enable')).toBe(false);
  });
});
