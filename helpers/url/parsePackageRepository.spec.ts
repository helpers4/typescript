/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parsePackageRepository } from './parsePackageRepository';

const KNOWN_HOSTS = ['github', 'gitlab', 'bitbucket'] as const;

const arbitrarySlug = fc.tuple(
  fc.stringMatching(/^[\w][\w.-]{0,19}$/),
  fc.stringMatching(/^[\w][\w.-]{0,19}$/),
).map(([owner, repo]) => `${owner}/${repo}`);

describe('parsePackageRepository — property-based', () => {
  it('null / undefined always returns undefined', () => {
    fc.assert(
      fc.property(fc.constantFrom(null, undefined), (value) => {
        expect(parsePackageRepository(value)).toBeUndefined();
      }),
    );
  });

  it('arrays always return undefined', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), (arr) => {
        expect(parsePackageRepository(arr)).toBeUndefined();
      }),
    );
  });

  it('"github/gitlab/bitbucket:owner/repo" shorthand always resolves to the correct host', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...KNOWN_HOSTS),
        arbitrarySlug,
        (platform, slug) => {
          const result = parsePackageRepository(`${platform}:${slug}`);
          expect(result?.host).toBe(platform);
          expect(result?.slug).toBe(slug);
        },
      ),
    );
  });

  it('"gist:<id>" shorthand always returns host=gist with gistId set', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[\w-]{4,20}$/),
        (id) => {
          const result = parsePackageRepository(`gist:${id}`);
          expect(result?.host).toBe('gist');
          expect(result?.gistId).toBe(id);
          expect(result?.slug).toBeUndefined();
        },
      ),
    );
  });

  it('bare "owner/repo" shorthand always returns host=github', () => {
    fc.assert(
      fc.property(arbitrarySlug, (slug) => {
        const result = parsePackageRepository(slug);
        expect(result?.host).toBe('github');
        expect(result?.slug).toBe(slug);
      }),
    );
  });

  it('when slug is defined, it equals owner + "/" + repo', () => {
    fc.assert(
      fc.property(arbitrarySlug, (slug) => {
        const result = parsePackageRepository(slug);
        if (result?.slug !== undefined) {
          expect(result.slug).toBe(`${result.owner}/${result.repo}`);
        }
      }),
    );
  });

  it('gist results always have gistId and no slug/owner/repo', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[\w-]{4,20}$/),
        (id) => {
          const result = parsePackageRepository(`gist:${id}`);
          expect(result?.gistId).toBeDefined();
          expect(result?.slug).toBeUndefined();
          expect(result?.owner).toBeUndefined();
          expect(result?.repo).toBeUndefined();
        },
      ),
    );
  });

  it('object form with type preserves the type field', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('git', 'svn', 'hg'),
        arbitrarySlug,
        (type, slug) => {
          const [owner, repo] = slug.split('/');
          const result = parsePackageRepository({
            type,
            url: `https://github.com/${owner}/${repo}`,
          });
          expect(result?.type).toBe(type);
        },
      ),
    );
  });

  it('object form with directory preserves the directory field', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[\w/-]{1,40}$/),
        (dir) => {
          const result = parsePackageRepository({
            url: 'https://github.com/owner/repo',
            directory: dir,
          });
          expect(result?.directory).toBe(dir);
        },
      ),
    );
  });
});

describe('parsePackageRepository — contract', () => {
  it('npm canonical object form', () => {
    const result = parsePackageRepository({
      type: 'git',
      url: 'git+https://github.com/npm/cli.git',
    });
    expect(result).toMatchObject({ host: 'github', owner: 'npm', repo: 'cli' });
  });

  it('bare slug → github host', () =>
    expect(parsePackageRepository('npm/example')?.host).toBe('github'));

  it('gist shorthand → host=gist, slug=undefined', () => {
    const r = parsePackageRepository('gist:abc123');
    expect(r?.host).toBe('gist');
    expect(r?.slug).toBeUndefined();
  });

  it('SCP SSH URL → correct slug', () => {
    const r = parsePackageRepository({ url: 'git@github.com:helpers4/typescript.git' });
    expect(r?.slug).toBe('helpers4/typescript');
  });

  it('codeberg.org URL → host is codeberg.org (unknown domain)', () => {
    const r = parsePackageRepository({ url: 'https://codeberg.org/myorg/myrepo' });
    expect(r?.host).toBe('codeberg.org');
  });
});
