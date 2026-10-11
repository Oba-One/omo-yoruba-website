import type { ConfigContext, CurrentUser, Tool } from 'sanity';
import { describe, expect, it } from 'vitest';
import { createStudioConfig } from './config';

const previous = [{ name: 'structure' }, { name: 'presentation' }, { name: 'vision' }] as Tool[];
const names = (role: string, cli = false, development = false) => {
  const config = createStudioConfig({ projectId: 'test', dataset: 'test', cli, development });
  const currentUser = { roles: [{ name: role, title: role }] } as CurrentUser;
  return config.tools(previous, { currentUser } as ConfigContext).map(({ name }) => name);
};

describe('the embedded Studio member guide', () => {
  it('hides Vision from the live CMS for every role', () => {
    expect(names('editor')).toEqual(['structure', 'presentation', 'member-guide']);
    expect(names('administrator')).toEqual(['structure', 'presentation', 'member-guide']);
  });

  it('keeps Vision available only to local administrators', () => {
    expect(names('administrator', false, true)).toContain('vision');
    expect(names('editor', false, true)).not.toContain('vision');
  });

  it('omits the Astro-hosted guide from the standalone CLI Studio', () => {
    expect(names('editor', true)).toEqual(['structure', 'presentation']);
  });
});
