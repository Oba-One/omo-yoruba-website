import { describe, expect, it } from 'vitest';
import { checkCommitMessage } from './commit-msg';

const EM = String.fromCharCode(0x2014);

describe('checkCommitMessage', () => {
  it('accepts a conventional subject', () => {
    expect(checkCommitMessage('feat(lint): add the em dash check\n\nBody text.\n')).toEqual([]);
    expect(checkCommitMessage('chore: bootstrap the workspace')).toEqual([]);
    expect(checkCommitMessage('fix!: drop the broken hook')).toEqual([]);
  });

  it('accepts autosquash prefixes on a conventional subject', () => {
    expect(checkCommitMessage('fixup! feat(lint): add the em dash check')).toEqual([]);
    expect(checkCommitMessage('squash! chore: bootstrap the workspace')).toEqual([]);
  });

  it('rejects a subject without a conventional type', () => {
    expect(checkCommitMessage('Add stuff')).toHaveLength(1);
  });

  it('rejects an em dash anywhere in the message', () => {
    expect(checkCommitMessage(`feat: add ${EM} thing`)).toHaveLength(1);
    expect(checkCommitMessage(`feat: add thing\n\nbody ${EM} here`)).toHaveLength(1);
  });

  it('ignores comment lines, the verbose diff below the scissors line, merges and reverts', () => {
    expect(checkCommitMessage('# Please enter the commit message\nfeat: ok')).toEqual([]);
    const verbose = `feat: ok\n# ------------------------ >8 ------------------------\n+Sunlight ${EM} the courtyard.\n`;
    expect(checkCommitMessage(verbose)).toEqual([]);
    expect(checkCommitMessage("Merge branch 'main' into phase-0")).toEqual([]);
    expect(checkCommitMessage('Revert "feat: thing"')).toEqual([]);
  });
});
