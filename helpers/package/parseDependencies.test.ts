/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, expectTypeOf, it } from 'vitest';
import { parseDependencies } from './parseDependencies';
import type { AlpineDependency, ArchDependency, DebianDependency, DependencyFormat, Pep508Dependency, RpmDependency } from './types';

describe('parseDependencies', () => {
  it('needs a format', () => {
    // @ts-expect-error the format has no default
    expect(() => parseDependencies('a')).toThrow(RangeError);
  });

  it('throws a RangeError for a format that is not supported', () => {
    expect(() => parseDependencies('a', 'npm' as DependencyFormat)).toThrow(RangeError);
    expect(() => parseDependencies('a', 'npm' as DependencyFormat)).toThrow(/unsupported format "npm"/);
  });

  it('reads the Debian format', () => {
    expect(parseDependencies('a (>= 1) | b', 'debian')).toEqual([[{ name: 'a', version: { operator: '>=', version: '1' } }, { name: 'b' }]]);
  });

  it('reads the RPM format', () => {
    expect(parseDependencies('glibc >= 2.28, (nginx or httpd)', 'rpm')).toEqual([
      [{ name: 'glibc', version: { operator: '>=', version: '2.28' } }],
      [{ name: 'nginx' }, { name: 'httpd' }],
    ]);
  });

  it('reads the Arch format', () => {
    expect(parseDependencies("('glibc>=2.38' bash)", 'arch')).toEqual([[{ name: 'glibc', version: { operator: '>=', version: '2.38' } }], [{ name: 'bash' }]]);
  });

  it('reads the Alpine format', () => {
    expect(parseDependencies('musl>=1.2 !openrc', 'alpine')).toEqual([[{ name: 'musl', version: { operator: '>=', version: '1.2' } }], [{ name: 'openrc', conflict: true }]]);
  });

  it('reads the PEP 508 format', () => {
    expect(parseDependencies('requests[security]>=2.8,<3 ; python_version < "3.12"', 'pep508')).toEqual([
      [
        {
          name: 'requests',
          extras: ['security'],
          specifiers: [
            { operator: '>=', version: '2.8' },
            { operator: '<', version: '3' },
          ],
          marker: 'python_version < "3.12"',
        },
      ],
    ]);
  });

  it('gives each format its own dependency type', () => {
    expectTypeOf(parseDependencies('a', 'debian')).toEqualTypeOf<DebianDependency[][]>();
    expectTypeOf(parseDependencies('a', 'rpm')).toEqualTypeOf<RpmDependency[][]>();
    expectTypeOf(parseDependencies('a', 'arch')).toEqualTypeOf<ArchDependency[][]>();
    expectTypeOf(parseDependencies('a', 'alpine')).toEqualTypeOf<AlpineDependency[][]>();
    expectTypeOf(parseDependencies('a', 'pep508')).toEqualTypeOf<Pep508Dependency[][]>();
    expectTypeOf(parseDependencies('a', 'debian')[0]![0]!.architectures).toEqualTypeOf<string[] | undefined>();
    expectTypeOf(parseDependencies('a', 'alpine')[0]![0]!.conflict).toEqualTypeOf<true | undefined>();
  });

  it('only accepts the options of the format that has some', () => {
    expect(parseDependencies('a (< 1)', 'debian', { compat: true })).toHaveLength(1);
    // The calls below only need to compile (or not): they are never run.
    void (() => {
      // @ts-expect-error only the Debian format has options
      parseDependencies('a', 'rpm', { compat: true });
      // @ts-expect-error only the Debian format has options
      parseDependencies('a', 'pep508', {});
      // @ts-expect-error `compat` is the only option of the Debian format
      parseDependencies('a', 'debian', { strict: true });
    });
  });
});
