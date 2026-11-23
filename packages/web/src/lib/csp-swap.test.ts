import { describe, expect, it } from 'vitest';
import { buildCsp, cspDirectives, cspFingerprint } from './csp';
import { CSP_META, policyChanged } from './csp-swap';

// A page as far as policyChanged reads it: the content of its policy meta tag, or no tag.
const page = (fingerprint?: string) =>
  ({
    querySelector: (selector: string) =>
      selector === `meta[name="${CSP_META}"]` && fingerprint !== undefined
        ? { getAttribute: (name: string) => (name === 'content' ? fingerprint : null) }
        : null,
  }) as unknown as Document;

describe('policyChanged (ADR 0062)', () => {
  it('lets the router swap between pages under the same policy', () => {
    expect(policyChanged(page('a1b2c3d4'), page('a1b2c3d4'))).toBe(false);
  });

  it('asks for a full load when the next page answers under another policy, or names none', () => {
    expect(policyChanged(page('a1b2c3d4'), page('ffffffff'))).toBe(true);
    expect(policyChanged(page('a1b2c3d4'), page())).toBe(true);
  });
});

describe('cspFingerprint', () => {
  it('names the policy and whether it is enforced, so switching enforcement off also loads pages in full', () => {
    expect(cspFingerprint()).toMatch(/^[0-9a-f]{8}$/);
    expect(cspFingerprint()).toBe(cspFingerprint(`enforce ${buildCsp()}`));
    expect(cspFingerprint()).not.toBe(cspFingerprint(`report ${buildCsp()}`));
  });

  it('changes with any change to the policy', () => {
    const oneMoreHash = buildCsp({
      ...cspDirectives,
      'script-src': [...(cspDirectives['script-src'] ?? []), "'sha256-another='"],
    });
    expect(cspFingerprint(oneMoreHash)).not.toBe(cspFingerprint(buildCsp()));
  });
});
