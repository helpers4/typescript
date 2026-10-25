/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, expectTypeOf, it } from 'vitest';
import { stringifyDependencies } from './stringifyDependencies';
import type { DependencyFormat } from './types';

describe('stringifyDependencies', () => {
  it('needs a format', () => {
    // @ts-expect-error the format has no default
    expect(() => stringifyDependencies([])).toThrow(RangeError);
  });

  it('throws a RangeError for a format that is not supported', () => {
    expect(() => stringifyDependencies([], 'npm' as DependencyFormat)).toThrow(/unsupported format "npm"/);
  });

  it('writes the Debian format', () => {
    expect(stringifyDependencies([[{ name: 'a', version: { operator: '>=', version: '1' } }, { name: 'b' }]], 'debian')).toBe('a (>= 1) | b');
  });

  it('writes the RPM format', () => {
    expect(stringifyDependencies([[{ name: 'glibc', version: { operator: '>=', version: '2.28' } }], [{ name: 'nginx' }, { name: 'httpd' }]], 'rpm')).toBe(
      'glibc >= 2.28, (nginx or httpd)',
    );
  });

  it('writes the Arch format', () => {
    expect(stringifyDependencies([[{ name: 'glibc', version: { operator: '>=', version: '2.38' } }], [{ name: 'bash' }]], 'arch')).toBe('glibc>=2.38 bash');
  });

  it('writes the Alpine format', () => {
    expect(stringifyDependencies([[{ name: 'musl', version: { operator: '>=', version: '1.2' } }], [{ name: 'openrc', conflict: true }]], 'alpine')).toBe(
      'musl>=1.2 !openrc',
    );
  });

  it('writes the PEP 508 format', () => {
    expect(
      stringifyDependencies(
        [[{ name: 'requests', extras: ['security'], specifiers: [{ operator: '>=', version: '2.8' }], marker: 'python_version < "3.12"' }]],
        'pep508',
      ),
    ).toBe('requests[security]>=2.8; python_version < "3.12"');
  });

  it('types the groups after the format', () => {
    expectTypeOf(stringifyDependencies).returns.toEqualTypeOf<string>();
    // Only needs to compile (or not): never run.
    void (() => {
      // @ts-expect-error `~=` is not a Debian operator
      stringifyDependencies([[{ name: 'a', version: { operator: '~=', version: '1' } }]], 'debian');
      // @ts-expect-error `conflict` belongs to the Alpine format
      stringifyDependencies([[{ name: 'a', conflict: true }]], 'debian');
      // @ts-expect-error a Debian dependency is not an RPM one
      stringifyDependencies([[{ name: 'a', version: { operator: '<<', version: '1' } }]], 'rpm');
    });
  });
});
