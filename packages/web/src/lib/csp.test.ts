import { ZEFFY_ORIGIN } from '@oy/ui/forms/ZeffyDialog/zeffy.ts';
import { describe, expect, it } from 'vitest';
import { buildCsp, cspDirectives, cspExempt, framableSrc, reportingEndpointsHeader } from './csp';

describe('buildCsp', () => {
  it('serialises every directive in order and ends with the report directives', () => {
    const header = buildCsp();
    for (const [name, values] of Object.entries(cspDirectives)) {
      expect(header).toContain(`${name} ${values.join(' ')}`);
    }
    expect(header.endsWith('report-to csp-endpoint; report-uri /api/csp-report')).toBe(true);
  });

  it('frames the origin the Give Dialog hears Zeffy from, and loads no Zeffy script (ADR 0045)', () => {
    expect(cspDirectives['frame-src']).toContain(ZEFFY_ORIGIN);
    expect(cspDirectives['script-src']?.join(' ')).not.toContain('zeffy');
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

describe('framableSrc', () => {
  it('frames an https address on an origin the policy frames', () => {
    const form = 'https://www.zeffy.com/en-US/embed/donation-form/example';
    expect(framableSrc(form)).toBe(form);
    expect(framableSrc(`  ${form}  `)).toBe(form);
    // The parsed address, never the raw text a browser would resolve against the page.
    expect(framableSrc('https:www.zeffy.com/en-US/embed/donation-form/example')).toBe(form);
    expect(framableSrc('https:/www.zeffy.com/en-US/embed/donation-form/example')).toBe(form);
  });

  it('frames nothing else: a script URL, plain http, another host, a path or nothing', () => {
    for (const value of [
      'javascript:alert(document.domain)',
      'JAVASCRIPT:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'http://www.zeffy.com/en-US/embed/donation-form/example',
      'https://www.zeffy.com.example.org/embed',
      'https://zeffy.com/embed/donation-form/example',
      'www.zeffy.com/embed/donation-form/example',
      '/donate',
      '',
      null,
      undefined,
    ]) {
      expect(framableSrc(value), String(value)).toBeUndefined();
    }
  });
});
