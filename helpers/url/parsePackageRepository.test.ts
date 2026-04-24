/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parsePackageRepository } from './parsePackageRepository';

describe('parsePackageRepository — null / undefined / invalid', () => {
  it('null → undefined', () => expect(parsePackageRepository(null)).toBeUndefined());
  it('undefined → undefined', () => expect(parsePackageRepository(undefined)).toBeUndefined());
  it('number → undefined', () => expect(parsePackageRepository(42)).toBeUndefined());
  it('boolean → undefined', () => expect(parsePackageRepository(true)).toBeUndefined());
  it('array → undefined', () => expect(parsePackageRepository(['github:a/b'])).toBeUndefined());
  it('empty string → undefined', () => expect(parsePackageRepository('')).toBeUndefined());
  it('unrecognised string → undefined', () =>
    expect(parsePackageRepository('not-a-repo-field')).toBeUndefined());
  it('object without url → undefined', () =>
    expect(parsePackageRepository({ type: 'git' })).toBeUndefined());
  it('object with non-string url → undefined', () =>
    expect(parsePackageRepository({ type: 'git', url: 42 })).toBeUndefined());
});

describe('parsePackageRepository — shorthand string forms', () => {
  it('bare "owner/repo" → github', () => {
    const result = parsePackageRepository('helpers4/typescript');
    expect(result).toEqual({
      type: 'git',
      host: 'github',
      slug: 'helpers4/typescript',
      owner: 'helpers4',
      repo: 'typescript',
      gistId: undefined,
      directory: undefined,
    });
  });

  it('"github:owner/repo"', () => {
    const result = parsePackageRepository('github:helpers4/typescript');
    expect(result).toMatchObject({ host: 'github', slug: 'helpers4/typescript', owner: 'helpers4', repo: 'typescript' });
  });

  it('"gitlab:owner/repo"', () => {
    const result = parsePackageRepository('gitlab:myorg/myproject');
    expect(result).toMatchObject({ host: 'gitlab', slug: 'myorg/myproject', owner: 'myorg', repo: 'myproject' });
  });

  it('"bitbucket:owner/repo"', () => {
    const result = parsePackageRepository('bitbucket:myorg/myrepo');
    expect(result).toMatchObject({ host: 'bitbucket', slug: 'myorg/myrepo', owner: 'myorg', repo: 'myrepo' });
  });

  it('"gist:<id>"', () => {
    const result = parsePackageRepository('gist:11081aaa281');
    expect(result).toEqual({
      type: 'git',
      host: 'gist',
      slug: undefined,
      owner: undefined,
      repo: undefined,
      gistId: '11081aaa281',
      directory: undefined,
    });
  });

  it('shorthand string → directory always undefined', () => {
    expect(parsePackageRepository('helpers4/typescript')?.directory).toBeUndefined();
    expect(parsePackageRepository('github:helpers4/typescript')?.directory).toBeUndefined();
    expect(parsePackageRepository('gist:abc123')?.directory).toBeUndefined();
  });

  it('shorthand string → type always "git"', () => {
    expect(parsePackageRepository('helpers4/typescript')?.type).toBe('git');
    expect(parsePackageRepository('github:helpers4/typescript')?.type).toBe('git');
  });
});

describe('parsePackageRepository — object form, URL variants', () => {
  it('git+https URL (npm canonical form)', () => {
    const result = parsePackageRepository({
      type: 'git',
      url: 'git+https://github.com/helpers4/typescript.git',
    });
    expect(result).toEqual({
      type: 'git',
      host: 'github',
      slug: 'helpers4/typescript',
      owner: 'helpers4',
      repo: 'typescript',
      gistId: undefined,
      directory: undefined,
    });
  });

  it('plain https URL', () => {
    const result = parsePackageRepository({ url: 'https://github.com/helpers4/typescript' });
    expect(result).toMatchObject({ host: 'github', slug: 'helpers4/typescript' });
  });

  it('git:// URL', () => {
    const result = parsePackageRepository({ url: 'git://github.com/npm/cli.git#v1.0.27' });
    expect(result).toMatchObject({ host: 'github', slug: 'npm/cli' });
  });

  it('SCP-style SSH: git@github.com:owner/repo.git', () => {
    const result = parsePackageRepository({ url: 'git@github.com:helpers4/typescript.git' });
    expect(result).toMatchObject({ host: 'github', slug: 'helpers4/typescript' });
  });

  it('SCP-style SSH with unknown host → falls back to raw domain', () => {
    const result = parsePackageRepository({ url: 'git@codeberg.org:myorg/myrepo.git' });
    expect(result).toMatchObject({ host: 'codeberg.org', slug: 'myorg/myrepo' });
  });

  it('git+ssh URL: git+ssh://git@github.com/owner/repo.git', () => {
    const result = parsePackageRepository({
      url: 'git+ssh://git@github.com/helpers4/typescript.git',
    });
    expect(result).toMatchObject({ host: 'github', slug: 'helpers4/typescript' });
  });

  it('GitLab URL', () => {
    const result = parsePackageRepository({ url: 'https://gitlab.com/myorg/myproject.git' });
    expect(result).toMatchObject({ host: 'gitlab', slug: 'myorg/myproject' });
  });

  it('Bitbucket URL', () => {
    const result = parsePackageRepository({ url: 'https://bitbucket.org/myorg/myrepo.git' });
    expect(result).toMatchObject({ host: 'bitbucket', slug: 'myorg/myrepo' });
  });

  it('unknown host → falls back to raw domain', () => {
    const result = parsePackageRepository({ url: 'https://codeberg.org/myorg/myrepo.git' });
    expect(result).toMatchObject({ host: 'codeberg.org', slug: 'myorg/myrepo' });
  });

  it('preserves custom type', () => {
    const result = parsePackageRepository({
      type: 'svn',
      url: 'https://github.com/helpers4/typescript',
    });
    expect(result?.type).toBe('svn');
  });

  it('extracts directory field', () => {
    const result = parsePackageRepository({
      type: 'git',
      url: 'git+https://github.com/npm/cli.git',
      directory: 'workspaces/libnpmpublish',
    });
    expect(result?.directory).toBe('workspaces/libnpmpublish');
  });

  it('object without type → defaults to "git"', () => {
    const result = parsePackageRepository({ url: 'https://github.com/a/b' });
    expect(result?.type).toBe('git');
  });

  it('object without directory → undefined', () => {
    const result = parsePackageRepository({ url: 'https://github.com/a/b' });
    expect(result?.directory).toBeUndefined();
  });

  it('URL with semver fragment', () => {
    const result = parsePackageRepository({
      url: 'git+ssh://git@github.com/npm/cli.git#semver:^5.0',
    });
    expect(result).toMatchObject({ host: 'github', slug: 'npm/cli' });
  });
});

describe('parsePackageRepository — slug / owner / repo / gistId consistency', () => {
  it('when slug is set, slug === owner + "/" + repo', () => {
    const result = parsePackageRepository('helpers4/typescript');
    expect(result?.slug).toBe(`${result?.owner}/${result?.repo}`);
  });

  it('for gist shorthand, slug is undefined and gistId is set', () => {
    const result = parsePackageRepository('gist:abc123');
    expect(result?.slug).toBeUndefined();
    expect(result?.owner).toBeUndefined();
    expect(result?.repo).toBeUndefined();
    expect(result?.gistId).toBe('abc123');
  });

  it('for non-gist results, gistId is always undefined', () => {
    expect(parsePackageRepository('helpers4/typescript')?.gistId).toBeUndefined();
    expect(parsePackageRepository('github:a/b')?.gistId).toBeUndefined();
    expect(parsePackageRepository({ url: 'https://github.com/a/b' })?.gistId).toBeUndefined();
  });
});
