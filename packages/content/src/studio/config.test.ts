import type { ConfigContext, CurrentUser, Tool } from 'sanity';
import { describe, expect, it } from 'vitest';
import { createStudioConfig } from './config';

const previous = [{ name: 'structure' }, { name: 'presentation' }, { name: 'vision' }] as Tool[];
const names = (role: string, cli = false) => {
  const config = createStudioConfig({ projectId: 'test', dataset: 'test', cli });
  const currentUser = { roles: [{ name: role, title: role }] } as CurrentUser;
  return config.tools(previous, { currentUser } as ConfigContext).map(({ name }) => name);
};

describe('the embedded Studio member guide', () => {
  it('lets members and administrators open the guide while keeping Vision administrator-only', () => {
    expect(names('editor')).toEqual(['structure', 'presentation', 'member-guide']);
    expect(names('administrator')).toEqual(['structure', 'presentation', 'vision', 'member-guide']);
  });

  it('omits the Astro-hosted guide from the standalone CLI Studio', () => {
    expect(names('editor', true)).toEqual(['structure', 'presentation']);
  });
});
